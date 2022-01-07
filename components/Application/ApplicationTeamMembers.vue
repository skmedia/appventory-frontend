<template>
  <v-card outlined>
    <v-card-title>Team members</v-card-title>
    <div class="px-4">
      <v-row>
        <v-col>
          <v-combobox
            v-model="teamMember.Tag"
            return-object
            label="Role"
            dense
            hint="Select a role"
            persistent-hint
            outlined
            :items="teamMemberRoles"
            :error-messages="memberTagErrors"
            @input="$v.teamMember.Tag.$touch()"
            @blur="$v.teamMember.Tag.$touch()"
          ></v-combobox>
        </v-col>
        <v-col>
          <v-combobox
            v-model="teamMember.User"
            return-object
            label="Team member"
            dense
            outlined
            :items="users"
            :error-messages="memberUserErrors"
            @input="$v.teamMember.User.$touch()"
            @blur="$v.teamMember.User.$touch()"
          ></v-combobox>
        </v-col>
        <v-col cols="2">
          <v-btn @click="addTeamMember" outlined>Add</v-btn>
        </v-col>
      </v-row>
    </div>

    <v-card outlined class="ma-4" v-if="teamMembers.length">
      <v-list dense>
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
                {{ teamMember.Tag.name }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-btn @click="removeTeamMember(teamMember.id)" x-small icon>
                <v-icon>mdi-delete-outline</v-icon>
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

const createTeamMember = ({ Tag = null, User = null } = {}) => ({
  Tag,
  User,
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
      Tag: {
        required,
      },
      User: {
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
      if (!this.$v.teamMember.Tag.$dirty) return errors;
      !this.$v.teamMember.Tag.required && errors.push("Role is required.");
      return errors;
    },
    memberUserErrors() {
      const errors = [];
      if (!this.$v.teamMember.User.$dirty) return errors;
      !this.$v.teamMember.User.required && errors.push("User is required.");
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
        tagId: this.teamMember.Tag.value,
        userId: this.teamMember.User.value,
        Tag: {
          id: this.teamMember.Tag.value,
          name: this.teamMember.Tag.text,
        },
        userFullName: this.teamMember.User.text,
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
        .get("/api/v1/tags/for-select/project_role_tags")
        .then((r) => {
          this.teamMemberRoles = r.data.items.map((i) => {
            return {
              id: null,
              value: i.id,
              text: i.name,
            };
          });
        });
    },
    loadUsers() {
      return this.$axios.get("/api/v1/users/for-select").then((r) => {
        this.users = r.data.items.map((i) => {
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
