<template>
  <div>
    <v-card>
      <v-card-title class="secondary">
        Users
        <v-btn class="ml-auto" elevation="2" @click="showUserForm = true">
          Add
        </v-btn>
      </v-card-title>

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
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template #no-data>
            <v-btn color="primary"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <UserForm
      :show="showUserForm"
      :incoming-user="activeUser"
      @hide-form="hideUserForm"
      @save-user="saveUser"
    />
    <ConfirmDialog ref="confirm" />
  </div>
</template>

<script>
import { debounce } from "lodash";
import UserForm from "../components/User/UserForm.vue";
import ConfirmDialog from "../components/ConfirmDialog.vue";

let apiSearch;

export default {
  components: { UserForm, ConfirmDialog },
  data() {
    return {
      activeUser: {},
      showUserForm: false,
      total: 0,
      search: "",
      items: [],
      loading: true,
      pageCount: 0,
      options: {},
      headers: [
        {
          text: "Email",
          align: "start",
          sortable: true,
          value: "email",
        },
        {
          text: "Firstname",
          align: "start",
          sortable: true,
          value: "firstName",
        },
        {
          text: "Lastname",
          align: "start",
          sortable: false,
          value: "lastName",
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
    hideUserForm() {
      this.showUserForm = false;
      this.activeUser = Object.assign({});
    },
    editItem(item) {
      this.showUserForm = true;
      this.activeUser = Object.assign({}, item);
    },
    async deleteItem(item) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          `Are you sure you want to delete the user ${item.firstName}?`
        )
      ) {
        await this.$axios.delete(`/api/v1/users/${item.id}`).then((r) => {
          this.getDataFromApi();
        });
      }
    },
    async saveUser({ user, isNewUser }) {
      const params = user;

      if (isNewUser) {
        return this.$axios
          .post("/api/v1/users", {
            ...user,
          })
          .then((r) => {
            this.getDataFromApi();
            this.hideUserForm();
            return {};
          })
          .catch((e) => {
            console.error("save user error: ", e);
          });
      } else {
        return this.$axios
          .put(`/api/v1/users/${user.id}`, {
            ...user,
          })
          .then((r) => {
            this.getDataFromApi();
            this.hideUserForm();
            return {};
          })
          .catch((e) => {
            console.error("update user error: ", e);
          });
      }
    },
    async loadData() {
      const params = {
        ...this.options,
        search: this.search,
      };
      return this.$axios
        .get("/api/v1/users/list", { params: params })
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
