<template>
  <v-card outlined>
    <v-card-title>Team members</v-card-title>
    <v-card outlined class="mx-4 pa-4">
      <v-row>
        <v-col cols="12" md="5">
          <v-combobox
            v-model="teamMember.tag"
            return-object
            label="Role"
            hint="Select a role"
            persistent-hint
            outlined
            :items="teamMemberRoles"
            :error-messages="memberTagErrors"
            @input="$v.teamMember.tag.$touch()"
            @blur="$v.teamMember.tag.$touch()"
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="5">
          <v-combobox
            v-model="teamMember.user"
            return-object
            label="Team member"
            outlined
            :items="users"
            :error-messages="memberUserErrors"
            @input="$v.teamMember.user.$touch()"
            @blur="$v.teamMember.user.$touch()"
          ></v-combobox>
        </v-col>
        <v-col>
          <v-btn @click="addTeamMember" outlined>Add</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card outlined class="ma-4" v-if="teamMembers.length">
      <v-list>
        <template v-for="(teamMember, index) in teamMembers">
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey"> mdi-badge-account </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ teamMember.userFullName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ teamMember.tag.label }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-btn @click="removeTeamMember(teamMember.id)" x-small icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
          <v-divider class="my-1" v-if="index !== teamMembers.length - 1">
          </v-divider>
        </template>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { sortBy } from "lodash";
import { required } from "vuelidate/lib/validators";

const createTeamMember = ({ tag = null, user = null } = {}) => ({
  tag,
  user,
});
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  validations: {
    teamMember: {
      tag: {
        required,
      },
      user: {
        required,
      },
    },
  },
  data: function () {
    return {
      teamMemberRoles: [],
      users: [],
      teamMember: createTeamMember(),
    };
  },
  computed: {
    teamMembers: {
      get() {
        return sortBy(this.value, ["userFullName"]);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    memberTagErrors() {
      const errors = [];
      if (!this.$v.teamMember.tag.$dirty) return errors;
      !this.$v.teamMember.tag.required && errors.push("Role is required.");
      return errors;
    },
    memberUserErrors() {
      const errors = [];
      if (!this.$v.teamMember.user.$dirty) return errors;
      !this.$v.teamMember.user.required && errors.push("User is required.");
      return errors;
    },
  },
  watch: {
    value: function () {
      this.teamMember = createTeamMember();
      this.$v.$reset();
    },
  },
  created() {
    this.loadUsers();
    this.loadTeamMemberRoles();
  },
  methods: {
    addTeamMember() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const teamMember = {
        id: uuidv4(),
        tagId: this.teamMember.tag.value,
        userId: this.teamMember.user.value,
        tag: {
          id: this.teamMember.tag.value,
          label: this.teamMember.tag.text,
        },
        userFullName: this.teamMember.user.text,
      };
      this.teamMembers.push(teamMember);
      this.teamMembers = this.teamMembers;
      this.teamMember = createTeamMember();
      this.$v.$reset();
    },
    removeTeamMember(id) {
      this.teamMembers = this.teamMembers.filter((i) => i.id !== id);
    },
    loadTeamMemberRoles() {
      return this.$axios
        .$get("/api/v1/tags/for-select/project-role-tags")
        .then((r) => {
          this.teamMemberRoles = r.items.map((i) => {
            return {
              id: null,
              value: i.id,
              text: i.label,
            };
          });
        });
    },
    loadUsers() {
      return this.$axios.$get("/api/v1/users/for-select").then((r) => {
        this.users = r.items.map((i) => {
          return {
            id: null,
            value: i.id,
            text: `${i.firstName} ${i.lastName}`,
          };
        });
      });
    },
  },
};
</script>
