<template>
  <v-card outlined>
    <v-card-title>
      <v-row no-gutters class="d-flex">
        <v-col cols="12" md="8" class="align-self-center">
          Application details
        </v-col>
        <v-col class="mt-2 mt-md-0 text-md-right text-left">
          <slot name="extra-title"></slot>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
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
    </v-card-text>
  </v-card>
</template>

<script>
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  props: {
    value: {
      type: Object,
    },
  },
  data: function () {
    return {
      clients: [],
    };
  },
  validations: {
    application: {
      name: { required },
      client: { required },
      description: { maxLength: maxLength(500) },
    },
  },
  computed: {
    application: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
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
  watch: {},
  created() {
    this.loadClients();
  },
  methods: {
    loadClients() {
      return this.$axios.$get("/api/v1/clients/for-select").then((r) => {
        this.clients = r.items;
      });
    },
  },
};
</script>
