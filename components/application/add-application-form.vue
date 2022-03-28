<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card id="top">
      <DialogHeader title="Add application" @close="hide()"></DialogHeader>

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
            <small>* indicates required field</small>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="hide()"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
      </v-card-actions>
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
  client = null,
} = {}) => ({
  id,
  name,
  description,
  client,
});

export default {
  props: {
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
      application: createApplication(),
      showDialog: this.show,
      clients: [],
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
        this.$v.$reset();
        this.application = createApplication();
        this.isNewApplication = true;
        this.filesToUpload = [];
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
    async save(closeModal = true) {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$uiHelper.scrollTo("dialog-header");
        return;
      }

      try {
        await this.$axios.post("/api/v1/applications", {
          ...this.application,
        });
        this.$emit("application-created");
      } catch (e) {
        this.$emit("application-create-error");
      }
    },
    loadClients() {
      return this.$axios.$get("/api/v1/clients/for-select").then((r) => {
        this.clients = r.items;
      });
    },
  },
};
</script>
