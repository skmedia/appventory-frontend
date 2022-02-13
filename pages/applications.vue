<template>
  <div>
    <v-card>
      <PageHeader title="Applications">
        <v-btn
          class="ml-auto secondary darken-1"
          outlined
          @click="showApplicationForm = true"
        >
          Add
        </v-btn>
      </PageHeader>

      <v-container fluid>
        <v-row>
          <v-col>
            <v-text-field
              v-model="filter.search"
              append-icon="mdi-magnify"
              label="Search application or client"
              outlined
            />
          </v-col>
          <v-col cols="6">
            <div class="d-flex">
              <ApplicationTags
                label="Application tags"
                class="ml-4"
                v-model="filter.tags"
              ></ApplicationTags>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-checkbox
                    v-bind="attrs"
                    v-on="on"
                    v-model="filter.allTags"
                    class="ml-2"
                    label="All"
                  ></v-checkbox>
                </template>
                <span>Tooltip</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
        >
          <template #item.description="{ item }">
            <span v-if="item.description">
              {{
                item.description.length > 50
                  ? item.description.substr(0, 47) + "..."
                  : item.description
              }}
            </span>
          </template>

          <template #item.createdAt="{ item }">
            {{ item.createdAt | dateParse() | dateFormat("DD/MM/YYYY") }}
          </template>

          <template #item.actions="{ item }">
            <v-btn small icon @click="editItem(item)">
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>

            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  icon
                  :to="'application/' + item.id"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon small> mdi-card-text </v-icon>
                </v-btn>
              </template>
              <span>Application detail page</span>
            </v-tooltip>

            <v-btn small icon @click="deleteItem(item)">
              <v-icon small> mdi-delete </v-icon>
            </v-btn>
          </template>
          <template #no-data>
            <v-btn color="primary"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!--
    <div class="d-flex pa-4">
      <h2 class="float-left">Applications</h2>
      <v-btn class="ml-auto" elevation="2" @click="showApplicationForm = true">
        Add
      </v-btn>
    </div>
    -->

    <ApplicationForm
      :show="showApplicationForm"
      :app="activeApplication"
      @hide-form="hideApplicationForm"
      @save-application="saveApplication"
    />
    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import { debounce } from "lodash";

let apiSearch;

export default {
  data() {
    return {
      notificationMessage: "",
      showNotification: false,
      activeApplication: {},
      showApplicationForm: false,
      total: 0,
      filter: {
        search: "",
        tags: null,
      },
      items: [],
      loading: true,
      pageCount: 0,
      options: {},
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "name",
        },
        {
          text: "Client",
          align: "start",
          sortable: true,
          value: "client.name",
        },
        {
          text: "Description",
          align: "start",
          sortable: false,
          value: "description",
        },
        {
          text: "Created",
          align: "start",
          sortable: true,
          value: "createdAt",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          align: "end",
        },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        apiSearch();
      },
      deep: true,
    },
    filter: {
      handler() {
        apiSearch();
      },
      deep: true,
    },
  },
  created() {
    apiSearch = debounce(this.getDataFromApi, 250);
  },
  methods: {
    getDataFromApi() {
      this.loading = true;
      this.loadData().then((data) => {
        this.items = data.items;
        this.total = data.total;
        this.pageCount = Math.floor(data.total);
        this.loading = false;
      });
    },
    hideApplicationForm() {
      this.showApplicationForm = false;
      this.activeApplication = Object.assign({});
    },
    editItem(item) {
      this.showApplicationForm = true;
      this.activeApplication = Object.assign({}, item);
    },
    async deleteItem(item) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          `Are you sure you want to delete the application ${item.name}?`
        )
      ) {
        await this.$axios
          .delete(`/api/v1/applications/${item.id}`)
          .then((r) => {
            this.getDataFromApi();
          });
      }
    },
    async saveApplication({
      application,
      newFiles,
      filesToDelete,
      isNewApplication,
      closeModal,
    }) {
      const params = application;
      let filesToAdd = [];
      if (newFiles.length) {
        let formData = new FormData();
        formData.append("id", application.id);
        newFiles.forEach((f) => {
          formData.append("files", f.file);
          formData.append("fileDescriptions[]", f.description);
        });
        const fileUploadResponse = await this.$axios.post(
          "/api/v1/assets/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        filesToAdd = fileUploadResponse.data.fileList;
      }

      try {
        if (isNewApplication) {
          await this.$axios.post("/api/v1/applications", {
            ...application,
            filesToAdd,
          });
        } else {
          await this.$axios.put(`/api/v1/applications/${application.id}`, {
            ...application,
            filesToAdd,
            filesToDelete,
          });
        }

        this.getDataFromApi();
        if (closeModal) {
          this.hideApplicationForm();
        }
        this.$root.notification.show({ message: "Application saved" });
      } catch (e) {
        this.$root.notification.show({
          message: "An error occurred",
          color: "red",
        });
      }
    },
    async loadData() {
      const params = {
        ...this.options,
        search: this.filter.search,
        tags: this.filter.tags?.map(({ id }) => id),
      };
      return this.$axios
        .$get("/api/v1/applications", { params: params })
        .then((r) => {
          return {
            items: r.items,
            total: r.meta.count,
          };
        });
    },
  },
};
</script>
