<template>
  <div>
    <v-card>
      <PageHeader title="Clients">
        <v-btn
          class="ml-auto secondary darken-1"
          elevation="2"
          @click="showClientForm = true"
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
        />
      </v-card-text>

      <v-card-text>
        <v-data-table
          flat
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          :search="search"
        >
          <template #item.actions="{ item }">
            <v-icon small class="mr-2" z @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon
              :disabled="!!item.applications.length"
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template #no-data>
            <v-alert> No data found </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <ClientForm
      :show="showClientForm"
      :incoming-client="activeClient"
      @hide-form="hideClientForm"
      @save-client="saveClient"
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
      activeClient: {},
      showClientForm: false,
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
          text: "Applications",
          align: "start",
          sortable: true,
          value: "applications.length",
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
    hideClientForm() {
      this.showClientForm = false;
      this.activeClient = Object.assign({});
    },
    editItem(item) {
      this.showClientForm = true;
      this.activeClient = Object.assign({}, item);
    },
    async deleteItem(item) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          `Are you sure you want to delete the client ${item.name}?`
        )
      ) {
        await this.$axios.delete(`/api/v1/clients/${item.id}`).then((r) => {
          this.getDataFromApi();
        });
      }
    },
    async saveClient({ client, isNewClient }) {
      const params = client;

      if (isNewClient) {
        return this.$axios
          .post("/api/v1/clients", {
            ...client,
          })
          .then((r) => {
            this.getDataFromApi();
            this.hideClientForm();
            return {};
          })
          .catch((e) => {
            console.error("save client error: ", e);
          });
      } else {
        return this.$axios
          .put(`/api/v1/clients/${client.id}`, {
            ...client,
          })
          .then((r) => {
            this.getDataFromApi();
            this.hideClientForm();
            return {};
          })
          .catch((e) => {
            console.error("update client error: ", e);
          });
      }
    },
    async loadData() {
      const params = {
        ...this.options,
        search: this.search,
      };
      return this.$axios
        .get("/api/v1/clients/list", { params: params })
        .then((r) => {
          return {
            items: r.data.items,
            total: r.data.meta.count,
          };
        });
    },
  },
};
</script>
