<template>
  <v-container fluid fill-height>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6>
        <v-layout align-center justify-center class="ma-10">
          <v-subheader class="text-h3 text-overline">AppVentory</v-subheader>
          <v-icon x-large>mdi-domain</v-icon>
        </v-layout>

        <v-card class="elevation-12" v-if="msg">
          <v-card-text>
            <v-alert type="success">
              {{ msg }}
            </v-alert>
          </v-card-text>
          <v-card-text class="d-flex">
            <a class="grey--text" href="/login">
              Already have an account? Login!
            </a>
          </v-card-text>
        </v-card>

        <v-card tile class="elevation-12 rounded-lg pa-6" v-else>
          <v-card-title class="text-h5">Signup</v-card-title>
          <template>
            <v-card-text v-if="errors.length">
              <ErrorList :errors="errors" />
            </v-card-text>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="pt-2">
                  <v-text-field
                    v-model="account.name"
                    label="Account name"
                    hint="Choose an account name"
                    persistent-hint
                    outlined
                    :error-messages="nameErrors"
                    @input="$v.account.name.$touch()"
                    @blur="$v.account.name.$touch()"
                  />
                </v-col>
                <v-col cols="6" class="pt-2">
                  <v-text-field
                    v-model="account.firstName"
                    label="First name"
                    hint="Your first name"
                    persistent-hint
                    outlined
                    :error-messages="firstNameErrors"
                    @input="$v.account.firstName.$touch()"
                    @blur="$v.account.firstName.$touch()"
                  />
                </v-col>
                <v-col cols="6" class="pt-2">
                  <v-text-field
                    v-model="account.lastName"
                    label="Last name"
                    hint="Your last name"
                    persistent-hint
                    outlined
                    :error-messages="lastNameErrors"
                    @input="$v.account.lastName.$touch()"
                    @blur="$v.account.lastName.$touch()"
                /></v-col>
                <v-col cols="12" class="pt-2">
                  <v-text-field
                    type="email"
                    v-model="account.email"
                    label="Email"
                    outlined
                    hint="This is your username"
                    persistent-hint
                    :error-messages="emailErrors"
                    @input="$v.account.email.$touch()"
                    @blur="$v.account.email.$touch()"
                  />
                </v-col>
                <v-col cols="6" class="pt-2">
                  <v-text-field
                    type="password"
                    v-model="account.password"
                    label="Password"
                    outlined
                    hint="at least 6 chars, uppercase and lowercase, and a number"
                    persistent-hint
                    :error-messages="passwordErrors"
                    @input="$v.account.password.$touch()"
                    @blur="$v.account.password.$touch()"
                  />
                </v-col>
                <v-col cols="6" class="pt-2">
                  <v-text-field
                    type="password"
                    v-model="account.passwordConfirm"
                    label="Confirm your password"
                    hint="Confirm your password"
                    persistent-hint
                    outlined
                    :error-messages="passwordConfirmErrors"
                    @input="$v.account.passwordConfirm.$touch()"
                    @blur="$v.account.passwordConfirm.$touch()"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="py-0">
              <v-btn class="primary" block @click="signup"
                >Create account</v-btn
              >
            </v-card-text>
          </template>
          <v-card-text class="d-flex">
            <a class="grey--text ml-auto" href="/login">
              Already have an account? Login!
            </a>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  required,
  email,
  helpers,
  minLength,
  sameAs,
} from "vuelidate/lib/validators";
import { v4 as uuidv4 } from "uuid";

const passwordRegex = helpers.regex(
  "password",
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
);

const create = ({
  id = uuidv4(),
  name = "",
  firstName = "",
  lastName = "",
  email = "",
  password = "",
  passwordConfirm = "",
} = {}) => ({
  id,
  name,
  firstName,
  lastName,
  email,
  password,
  passwordConfirm,
});

export default {
  layout: "minimal",
  auth: false,
  data() {
    return {
      msg: "",
      errors: [],
      account:
        create(/*{
        name: "test account",
        firstName: "first",
        lastName: "last",
        email: "first@last.com",
        password: "1234_xA",
        passwordConfirm: "1234_xA",
      }*/),
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.account.name.$dirty) return errors;
      !this.$v.account.name.required &&
        errors.push("Account name is required.");
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.account.firstName.$dirty) return errors;
      !this.$v.account.firstName.required &&
        errors.push("First name is required.");
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.account.lastName.$dirty) return errors;
      !this.$v.account.lastName.required &&
        errors.push("Last name is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.account.email.$dirty) return errors;
      !this.$v.account.email.required && errors.push("Email is required.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.account.password.$dirty) return errors;
      !this.$v.account.password.required && errors.push("You need a password.");
      !this.$v.account.password.minLength &&
        errors.push("Password is too short, at least 6 chars please.");
      !this.$v.account.password.strongPassword &&
        errors.push("Password is too weak.");
      return errors;
    },
    passwordConfirmErrors() {
      const errors = [];
      if (!this.$v.account.passwordConfirm.$dirty) return errors;
      !this.$v.account.passwordConfirm.required &&
        errors.push("Please confirm your password.");
      !this.$v.account.passwordConfirm.sameAsPassword &&
        errors.push("Please confirm your password");
      return errors;
    },
  },
  validations: {
    account: {
      name: {
        required,
      },
      firstName: {
        required,
      },
      lastName: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        minLength: minLength(6),
        strongPassword: passwordRegex,
        required,
      },
      passwordConfirm: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  created() {
    this.msg = "";
  },
  methods: {
    async signup() {
      this.errors = [];
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      try {
        let response = await this.$accountApi.create({
          ...this.account,
        });
        if (response.id) {
          this.account = create();
          this.$v.$reset();
          this.msg = "Thanks for signing up! An email is on its way.";
        }
      } catch (err) {
        this.errors = err.response?.data?.message;
        console.log(err);
      }
    },
  },
};
</script>
