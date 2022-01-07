<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card>
      <v-toolbar color="secondary">
        <v-toolbar-title>User</v-toolbar-title>
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
              v-model="user.firstName"
              label="Firstname"
              hint="firstname of the user"
              persistent-hint
              outlined
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="user.lastName"
              label="Lastname"
              hint="lastname of the user"
              persistent-hint
              outlined
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="user.email"
              label="Email"
              hint="Email of the user"
              persistent-hint
              outlined
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
        <v-card-title>User object</v-card-title>
        <v-card-text>
          <pre>{{ user }}</pre>
        </v-card-text>
      </v-card>
      -->
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

const createUser = ({
  id = uuidv4(),
  firstName = "",
  lastName = "",
  email = "",
} = {}) => ({
  id,
  firstName,
  lastName,
  email,
});

export default {
  props: {
    incomingUser: {
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
      isNewUser: true,
      user: this.incomingUser,
      showDialog: this.show,
    };
  },
  computed: {},
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        // reset state
        this.user = createUser();
        this.isNewUser = true;
      }
    },
    incomingUser: function (val) {
      if (val.id) {
        this.isNewUser = false;
        this.user = val;
        this.loadUser();
      }
    },
  },
  created() {},
  methods: {
    hide() {
      this.$emit("hide-form");
    },
    save() {
      this.$emit("save-user", {
        user: this.user,
        isNewUser: this.isNewUser,
      });
    },
    loadUser() {
      return this.$axios
        .get(`/api/v1/users/${this.incomingUser.id}`)
        .then((r) => {
          this.user = r.data;
        });
    },
  },
};
</script>