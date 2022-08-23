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

      <v-card outlined class="pa-0 ma-4">
        <v-container fluid class="pa-4 ma-0">
          <v-row no-gutters>
            <v-col cols="9">
              <ApplicationTags
                label="Application tags"
                v-model="filter.tags"
                :show-type="true"
              ></ApplicationTags>
            </v-col>
            <v-col class="ml-auto pl-4">
              <v-checkbox
                v-model="filter.allTags"
                label="App must have all tags"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="9">
              <v-text-field
                v-model="filter.search"
                append-icon="mdi-magnify"
                hide-details
                label="Search application or client"
                outlined
              />
            </v-col>
            <v-col class="ml-auto pl-4">
              <v-checkbox
                v-model="filter.activeOnly"
                hide-details
                label="Active projects only"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
        >
          <template #item.tags="{ item }">
            <span v-if="item.tags">
              {{ item.tags.map((t) => t.label).join(", ") }}
            </span>
          </template>

          <template #item.createdAt="{ item }">
            {{ item.createdAt | dateParse() | dateFormat("DD/MM/YYYY") }}
          </template>

          <template #item.actions="{ item }">
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

            <v-tooltip top v-if="!item.active">
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" color="red" small>
                  mdi-sync-off
                </v-icon>
              </template>
              <span>Application is not active</span>
            </v-tooltip>
          </template>
          <template #no-data>
            <v-btn color="primary"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ApplicationAddApplicationForm
      :show="showApplicationForm"
      @application-created="onApplicationCreated"
      @hide-form="hideApplicationForm"
    />

    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import Vue from "vue";
import { debounce, get, isArray } from "lodash";
import * as qs from "qs";

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
        allTags: false,
        activeOnly: true,
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
          text: "Tags",
          align: "start",
          sortable: false,
          value: "tags",
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
    $route: {
      handler() {
        function dataTableOptionsDecoder(str) {
          if (str === "true") return true;
          if (str === "false") return false;

          // if str looks like a numeric string, return an int
          // e.g. itemsPerPage, page
          if (!isNaN(Number(str))) {
            return parseInt(str);
          }
          return str;
        }
        this.options = qs.parse(this.$route.query?.options, {
          decoder: dataTableOptionsDecoder,
        });

        let filterFromQuery = qs.parse(this.$route.query?.filter, {
          decoder: function (str) {
            if (str === "true") return true;
            if (str === "false") return false;
            return str;
          },
        });
        let tags = get(filterFromQuery, "tags", []);
        this.filter = {
          tags: tags,
          search: filterFromQuery.search,
          allTags: filterFromQuery.allTags,
          activeOnly: filterFromQuery.activeOnly,
        };

        this.apiSearch();
      },
      immediate: true,
    },
    filter: {
      handler(value) {
        const query = Object.assign({}, this.$route.query);
        query.filter = qs.stringify(value, {
          encodeValuesOnly: true,
        });
        this.$router.push({ query });
      },
      deep: true,
    },
    options: {
      handler(value) {
        const query = Object.assign({}, this.$route.query);
        query.options = qs.stringify(value, {
          encodeValuesOnly: true,
        });
        this.$router.push({ query });
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    apiSearch: debounce(function () {
      this.getDataFromApi();
    }, 250),
    getDataFromApi() {
      this.loading = true;
      this.loadData().then((data) => {
        this.items = data.items;
        this.total = data.total;
        this.pageCount = Math.floor(data.total);
        this.loading = false;
      });
    },
    onApplicationCreated() {
      this.$root.notification.show({
        message: "Application created",
        color: "success",
      });
      this.showApplicationForm = false;
      this.getDataFromApi();
    },
    hideApplicationForm() {
      this.showApplicationForm = false;
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
            this.$root.notification.show({
              message: "Application deleted",
              color: "success",
            });
            this.getDataFromApi();
          });
      }
    },
    async loadData() {
      const params = {
        ...this.options,
        activeOnly: this.filter.activeOnly,
        allTags: this.filter.allTags,
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
