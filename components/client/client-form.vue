<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card>
      <DialogHeader title="Client" @close="hide()"></DialogHeader>
      <v-card-text class="mt-8">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="client.name"
              label="Name"
              hint="name of the client"
              persistent-hint
              outlined
              :error-messages="nameErrors"
              @input="$v.client.name.$touch()"
              @blur="$v.client.name.$touch()"
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
import { required } from "vuelidate/lib/validators";

const createClient = ({ id = uuidv4(), name = "" } = {}) => ({
  id,
  name,
});

export default {
  props: {
    incomingClient: {
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
    client: {
      name: { required },
    },
  },
  data: function () {
    return {
      isNewClient: true,
      client: this.incomingClient,
      showDialog: this.show,
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.client.name.$dirty) return errors;
      !this.$v.client.name.required && errors.push("Name is required.");
      return errors;
    },
  },
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        this.$v.$reset();
        // reset state
        this.client = createClient();
        this.isNewClient = true;
      }
    },
    incomingClient: function (val) {
      if (val.id) {
        this.isNewClient = false;
        this.client = val;
        this.loadClient();
      }
    },
  },
  created() {},
  methods: {
    hide() {
      this.$emit("hide-form");
    },
    save() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit("save-client", {
        client: this.client,
        isNewClient: this.isNewClient,
      });
    },
    loadClient() {
      return this.$axios
        .get(`/api/v1/clients/${this.incomingClient.id}`)
        .then((r) => {
          this.client = r.data;
        });
    },
  },
};
</script>
