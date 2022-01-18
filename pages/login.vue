<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md4>
        <v-layout align-center justify-center class="ma-10">
          <v-subheader class="text-h3 text-overline">AppVentory</v-subheader>
          <v-icon x-large>mdi-domain</v-icon>
        </v-layout>
        <v-card tile class="elevation-12">
          <PageHeader class="mb-4" title="Login"> </PageHeader>
          <v-card-text>
            <v-text-field
              type="email"
              v-model="login.email"
              label="Email"
              outlined
              :error-messages="emailErrors"
              @input="$v.login.email.$touch()"
              @blur="$v.login.email.$touch()"
            />

            <v-text-field
              type="password"
              v-model="login.password"
              label="Password"
              outlined
              :error-messages="passwordErrors"
              @input="$v.login.password.$touch()"
              @blur="$v.login.password.$touch()"
            />

            <v-btn class="grey darken-2" block @click="userLogin">Login</v-btn>
          </v-card-text>

          <v-card-text class="d-flex">
            <a href="/signup" class="grey--text">Forgot password</a>
            <a class="grey--text ml-auto" href="/signup">
              No account yet? Sign up!
            </a>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email } from "vuelidate/lib/validators";

export default {
  layout: "minimal",
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.login.email.$dirty) return errors;
      !this.$v.login.email.required && errors.push("Email is required.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.login.password.$dirty) return errors;
      !this.$v.login.password.required && errors.push("Password is required.");
      return errors;
    },
  },
  validations: {
    login: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  created() {},
  methods: {
    async userLogin() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        let response = await this.$auth.loginWith("local", {
          data: this.login,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
