<template>
  <v-dialog
    v-model="showDialog"
    max-width="950"
    persistent
    overlay-opacity=".7"
  >
    <v-card>
      <DialogHeader title="User" @close="hide()"></DialogHeader>

      <v-card-text class="mt-8">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="user.firstName"
              label="Firstname"
              hint="firstname of the user"
              persistent-hint
              outlined
              :error-messages="firstNameErrors"
              @input="$v.user.firstName.$touch()"
              @blur="$v.user.firstName.$touch()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="user.lastName"
              label="Lastname"
              hint="lastname of the user"
              persistent-hint
              outlined
              :error-messages="lastNameErrors"
              @input="$v.user.lastName.$touch()"
              @blur="$v.user.lastName.$touch()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="user.email"
              label="Email"
              hint="Email of the user"
              persistent-hint
              outlined
              :error-messages="emailErrors"
              @input="$v.user.email.$touch()"
              @blur="$v.user.email.$touch()"
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
import { required, email } from "vuelidate/lib/validators";

const createUser = ({
  id = uuidv4(),
  firstName = "",
  lastName = "",
  email = "",
  role = "user",
} = {}) => ({
  id,
  firstName,
  lastName,
  email,
  role,
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
  validations: {
    user: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
    },
  },
  data: function () {
    return {
      isNewUser: true,
      user: this.incomingUser,
      showDialog: this.show,
    };
  },
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.user.firstName.$dirty) return errors;
      !this.$v.user.firstName.required && errors.push("Firstname is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.user.lastName.$dirty) return errors;
      !this.$v.user.lastName.required && errors.push("Lastname is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.user.email.$dirty) return errors;
      !this.$v.user.email.required && errors.push("Email is required.");
      !this.$v.user.email.email && errors.push("Email is not valid.");
      return errors;
    },
  },
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        this.$v.$reset();
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
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      this.$emit("save-user", {
        user: this.user,
        isNewUser: this.isNewUser,
      });
    },
    loadUser() {
      return this.$axios
        .$get(`/api/v1/users/${this.incomingUser.id}`)
        .then((user) => {
          this.user = user;
        });
    },
  },
};
</script>
