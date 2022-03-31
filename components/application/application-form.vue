<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card id="top">
      <DialogHeader title="Application" @close="hide()"></DialogHeader>

      <v-card-text class="mt-8">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="application.name"
              label="Name"
              hint="name of the application"
              persistent-hint
              outlined
              :error-messages="nameErrors"
              @input="$v.application.name.$touch()"
              @blur="$v.application.name.$touch()"
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
              :error-messages="clientErrors"
              @input="$v.application.client.$touch()"
              @blur="$v.application.client.$touch()"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              counter
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
            <ApplicationTags
              hint="List of tags associated with this application"
              v-model="application.tags"
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
            <ApplicationNotes v-model="application.notes" />
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
        <v-btn color="blue darken-1" text @click="save(false)">
          Save and continue</v-btn
        >
      </v-card-actions>

      <!--
      <v-card class="pa-4">
        <v-card-title>Application object</v-card-title>
        <v-card-text>
          <pre>{{ application }}</pre>
        </v-card-text>
      </v-card>
      -->
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { required, maxLength } from "vuelidate/lib/validators";

const createApplication = ({
  id = uuidv4(),
  name = "",
  description = "",
  tags = [],
  links = [],
  notes = [],
  teamMembers = [],
  assets = [],
  client = null,
} = {}) => ({
  id,
  name,
  description,
  tags,
  links,
  notes,
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
  validations: {
    application: {
      name: { required },
      client: { required },
      description: { maxLength: maxLength(500) },
    },
  },
  data: function () {
    return {
      isNewApplication: true,
      application: this.app,
      showDialog: this.show,
      clients: [],
      filesToUpload: [],
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.application.name.$dirty) return errors;
      !this.$v.application.name.required && errors.push("Name is required.");
      return errors;
    },
    clientErrors() {
      const errors = [];
      if (!this.$v.application.client.$dirty) return errors;
      !this.$v.application.client.required &&
        errors.push("Client is required.");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.application.description.$dirty) return errors;
      !this.$v.application.description.maxLength &&
        errors.push("Description is too long (max 500).");
      return errors;
    },
  },
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        // reset state
        this.$v.$reset();
        this.application = createApplication();
        this.isNewApplication = true;
        this.filesToUpload = [];

        if (this.app.id) {
          this.isNewApplication = false;
          this.application = val;
          this.loadApplication();
        }

        this.$nextTick(() => {
          setTimeout(() => {
            this.$uiHelper.scrollTo("dialog-header");
          });
        });
      }
    },
  },
  created() {
    this.loadClients();
  },
  methods: {
    hide() {
      this.$emit("hide-form");
    },
    save(closeModal = true) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$uiHelper.scrollTo("dialog-header");
        return;
      }
      this.saveApplication({
        application: this.application,
        newFiles: this.filesToUpload,
        isNewApplication: this.isNewApplication,
        closeModal,
      });
    },
    async saveApplication({
      application,
      newFiles,
      filesToDelete,
      isNewApplication,
      closeModal,
    }) {
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
          const app = await this.$axios.post("/api/v1/applications", {
            ...application,
            filesToAdd,
          });
        } else {
          const app = await this.$axios.put(
            `/api/v1/applications/${application.id}`,
            {
              ...application,
              filesToAdd,
              filesToDelete,
            }
          );
        }
        this.$emit("application-saved", application);
        this.$root.notification.show({ message: "Application saved" });
      } catch (e) {
        this.$root.notification.show({
          message: "An error occurred",
          color: "red",
        });
      }
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
    loadClients() {
      return this.$axios.$get("/api/v1/clients/for-select").then((r) => {
        this.clients = r.items;
      });
    },
  },
};
</script>
