<template>
  <div>
    <v-card>
      <PageHeader title="Applications">
        <v-btn
          class="ml-auto blue lighten-1"
          outlined
          @click="showApplicationForm = true"
        >
          Add
        </v-btn>
      </PageHeader>

      <v-card-text>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          outlined
        />
      </v-card-text>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          :search="search"
        >
          <template #item.createdAt="{ item }">
            {{ item.createdAt | dateParse() | dateFormat("DD/MM/YYYY") }}
          </template>

          <template #item.actions="{ item }">
            <v-icon small class="mr-2" z @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
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
      search: "",
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
    search: {
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
        console.error("update application error: ", e);
        this.$root.notification.show({
          message: "An error occurred",
          color: "red",
        });
      }
    },
    async loadData() {
      const params = {
        ...this.options,
        search: this.search,
      };
      console.log(params);
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
