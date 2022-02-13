<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <v-layout align-center justify-center class="ma-10">
          <v-subheader class="text-overline">AppVentory</v-subheader>
          <v-icon x-large>mdi-domain</v-icon>
        </v-layout>
        <v-card tile class="elevation-12 rounded-lg pa-6">
          <v-card-title class="text-h5">Login</v-card-title>
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

            <v-select
              v-model="login.account"
              v-if="this.accounts.length"
              :items="accounts"
              item-text="name"
              item-value="id"
              outlined
              label="Select an account"
            ></v-select>

            <v-btn class="primary" block @click="userLogin">Login</v-btn>
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
      accounts: [],
      login: {
        email: "",
        password: "",
        account: "",
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
        if (this.login.account) {
          let response = await this.$auth.loginWith("local", {
            data: this.login,
          });
          return;
        }

        const userAccounts = await this.$axios.post(
          "/api/auth/account",
          this.login
        );
        const accounts = userAccounts.data.map(({ account }) => account);
        if (accounts.length === 0) {
          return;
        }
        if (accounts.length === 1) {
          this.login.account = accounts[0].id;
          let response = await this.$auth.loginWith("local", {
            data: this.login,
          });
        } else {
          this.accounts = accounts;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
