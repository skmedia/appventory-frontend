<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card>
      <v-toolbar color="secondary">
        <v-toolbar-title>Application</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="hide()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="application.name"
              label="Name"
              hint="name of the application"
              persistent-hint
              outlined
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox
              v-model="application.client"
              return-object
              label="Client"
              hint="Select client"
              item-text="name"
              item-value="id"
              persistent-hint
              outlined
              :items="clients"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="application.description"
              label="Description"
              hint="Application description, what does it do?"
              outlined
              persistent-hint
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="application.tags"
              outlined
              :items="tags"
              item-value="id"
              item-text="name"
              chips
              label="Tags"
              persistent-placeholder
              deletable-chips
              hint="List of tags associated with this application"
              persistent-hint
              return-object
              multiple
              solo
              flat
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <ApplicationAssets
              @files-to-upload-changed="setFilesToUpload"
              v-model="application.assets"
            ></ApplicationAssets>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <ApplicationLinks v-model="application.links" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <ApplicationTeamMembers v-model="application.teamMembers" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <small>* indicates required field</small>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="hide()"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
      </v-card-actions>

      <v-card class="pa-4">
        <v-card-title>Application object</v-card-title>
        <v-card-text>
          <pre>{{ application }}</pre>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import ApplicationLinks from "./ApplicationLinks.vue";
import ApplicationAssets from "./ApplicationAssets.vue";

const createApplication = ({
  id = uuidv4(),
  name = "",
  description = "",
  tags = [],
  links = [],
  teamMembers = [],
  assets = [],
  client = null,
} = {}) => ({
  id,
  name,
  description,
  tags,
  links,
  teamMembers,
  assets,
  client,
});

export default {
  props: {
    app: {
      type: Object,
      default: function () {
        return {};
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      isNewApplication: true,
      application: this.app,
      showDialog: this.show,
      tags: [],
      clients: [],
      filesToUpload: [],
    };
  },
  computed: {},
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        // reset state
        this.application = createApplication();
        this.isNewApplication = true;
        this.selectedFiles = [];
        this.filesToUpload = [];
        this.filesToDelete = [];
      }
    },
    app: function (val) {
      if (val.id) {
        this.isNewApplication = false;
        this.application = val;
        this.loadApplication();
      }
    },
  },
  created() {
    this.loadTags();
    this.loadClients();
  },
  methods: {
    hide() {
      this.$emit("hide-form");
    },
    save() {
      this.$emit("save-application", {
        application: this.application,
        newFiles: this.filesToUpload,
        isNewApplication: this.isNewApplication,
      });
    },
    loadApplication() {
      return this.$applicationApi.single(this.app.id).then((application) => {
        this.application = application;
      });
    },
    setFilesToUpload(filesToUpload) {
      this.filesToUpload = filesToUpload;
    },
    removeTag(item) {
      this.application.tags = this.application.tags.filter(
        (i) => i.value !== item.value
      );
    },
    loadTags() {
      return this.$axios
        .get("/api/v1/tags/for-select/application_tags")
        .then((r) => {
          this.tags = r.data.items;
        });
    },
    loadClients() {
      return this.$axios.get("/api/v1/clients/for-select").then((r) => {
        this.clients = r.data.items;
      });
    },
  },
  components: { ApplicationLinks, ApplicationAssets },
};
</script>
