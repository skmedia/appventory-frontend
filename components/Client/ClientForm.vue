<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card>
      <v-toolbar color="secondary">
        <v-toolbar-title>Client</v-toolbar-title>
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
              v-model="client.name"
              label="Name"
              hint="name of the client"
              persistent-hint
              outlined
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

      <!--
      <v-card class="pa-4">
        <v-card-title>Client object</v-card-title>
        <v-card-text>
          <pre>{{ client }}</pre>
        </v-card-text>
      </v-card>
      -->
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

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
  data: function () {
    return {
      isNewClient: true,
      client: this.incomingClient,
      showDialog: this.show,
    };
  },
  computed: {},
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
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