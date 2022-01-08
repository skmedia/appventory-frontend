<template>
  <v-card max-width="600px" class="mx-auto">
    <PageHeader title="Login"> </PageHeader>
    <v-card-text>
      <v-form>
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
        <v-btn @click="userLogin">Login</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
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
        console.log(response);
        console.log(this.$auth);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
