<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6>
        <v-layout align-center justify-center class="ma-10">
          <v-subheader class="text-h3 text-overline">AppVento</v-subheader>
          <v-icon x-large>mdi-domain</v-icon>
        </v-layout>
        <v-card tile class="elevation-12">
          <PageHeader class="mb-4" title="Login"> </PageHeader>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="mdi-account"
                type="email"
                v-model="login.email"
                label="Email"
                outlined
                :error-messages="emailErrors"
                @input="$v.login.email.$touch()"
                @blur="$v.login.email.$touch()"
              />

              <v-text-field
                prepend-icon="mdi-lock"
                type="password"
                v-model="login.password"
                label="Password"
                outlined
                :error-messages="passwordErrors"
                @input="$v.login.password.$touch()"
                @blur="$v.login.password.$touch()"
              />
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="userLogin">Login</v-btn>
              </v-card-actions>
            </v-form>
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
        email: "john.doe@example.com",
        password: "john.doe@example.com",
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
  created() {
    console.log(this.$auth);
  },
  methods: {
    async userLogin() {
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
