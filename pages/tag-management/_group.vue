<template>
  <div>
    <div class="d-flex pa-4 pb-0 pt-0 pl-0">
      <v-subheader class="mr-auto">{{
        tagGroup.name && tagGroup.name.toUpperCase()
      }}</v-subheader>
      <div class="align-self-center">
        <v-btn small @click="showTagForm = true">Add Tag</v-btn>
        <v-btn small @click="showTagTypeManagement = true">
          Manage types
        </v-btn>
      </div>
    </div>

    <v-container class="mb-6 rounded-0">
      <v-row>
        <v-col class="">
          <v-card class="pa-0 d-flex" flat dense>
            <v-text-field
              class="d-inline-block mr-2"
              v-model="search"
              outlined
              dense
              label="Search"
              append-icon="mdi-magnify"
              hide-details
            ></v-text-field>
            <div class="ml-auto align-self-center">
              <v-btn small icon @click="getDataFromApi">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="items"
            :options.sync="options"
            :server-items-length="total"
            :loading="loading"
            :search="search"
            class="elevation-1"
          >
            <template #item.actions="{ item }">
              <v-icon small class="mr-2" @click="editTag(item)">
                mdi-pencil
              </v-icon>
              <v-icon
                :disabled="item.hasLinkedItems"
                small
                @click="deleteTag(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template #no-data>
              <v-btn color="primary"> Reset </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <TagForm
      :incoming-tag="selectedTag"
      :show="showTagForm"
      :tag-group-id="tagGroupId"
      @hide-form="hideTagForm"
      @save-tag="saveTag"
    />
    <TagManagementManageTagTypes
      :show="showTagTypeManagement"
      :tag-group="tagGroup"
      @hide="hideTagTypeManagement"
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
      selectedTag: {},
      showTagForm: false,
      showTagTypeManagement: false,
      tagGroup: {},
      total: 0,
      search: "",
      items: [],
      loading: true,
      pageCount: 0,
      options: {},
      headers: [
        {
          text: "Label",
          align: "start",
          sortable: true,
          value: "label",
        },
        {
          text: "Type",
          align: "start",
          sortable: false,
          value: "tagType.label",
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
  computed: {
    tagGroupId: function () {
      return this.$route.params.group;
    },
  },
  watch: {
    $route: {
      handler: function (val) {
        this.loadTagGroup();
        this.getDataFromApi();
      },
      immediate: true,
    },
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
    async loadTagGroup() {
      this.$axios.get(`/api/v1/tag-groups/${this.tagGroupId}`).then((r) => {
        this.tagGroup = r.data;
      });
    },
    async loadData() {
      const params = {
        ...this.options,
        search: this.search,
        filter: {
          tagGroup: this.tagGroupId,
        },
      };
      return this.$axios
        .get("/api/v1/tags", {
          params: params,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((r) => {
          return {
            items: r.data.items,
            total: r.data.meta.count,
          };
        });
    },
    hideTagTypeManagement() {
      this.showTagTypeManagement = false;
    },
    hideTagForm() {
      this.showTagForm = false;
      this.selectedTag = Object.assign({});
    },
    editTag(item) {
      this.showTagForm = true;
      this.selectedTag = Object.assign({}, item);
    },
    saveTag({ tag, isNewTag }) {
      if (isNewTag) {
        return this.$axios
          .post("/api/v1/tags", {
            ...tag,
          })
          .then((r) => {
            this.getDataFromApi();
            this.hideTagForm();
            return {};
          })
          .catch((e) => {
            console.error("save tag error: ", e);
          });
      } else {
        return this.$axios
          .put(`/api/v1/tags/${tag.id}`, {
            ...tag,
          })
          .then((r) => {
            this.getDataFromApi();
            this.hideTagForm();
            return {};
          })
          .catch((e) => {
            console.error("update tag error: ", e);
          });
      }
    },
    async deleteTag(item) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          `Are you sure you want to delete the tag ${item.label}?`
        )
      ) {
        await this.$axios.delete(`/api/v1/tags/${item.id}`).then((r) => {
          this.getDataFromApi();
        });
      }
    },
  },
};
</script>
