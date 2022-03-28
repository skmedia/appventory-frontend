<template>
  <v-dialog
    :value="show"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    overlay-opacity=".7"
  >
    <v-card id="top">
      <DialogHeader title="Manage team members" @close="$emit('hide')" />
      <v-card-text class="mt-8">
        <ApplicationTeamMembers v-model="teamMembers">
          <template v-slot:extra-title>
            <v-btn class="primary" @click="save()">save</v-btn>
          </template>
        </ApplicationTeamMembers>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    application: {
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: function (value) {
      if (value) {
        this.teamMembers = this.application.teamMembers;
      } else {
        this.teamMembers = [];
      }
    },
  },
  data: function () {
    return {
      teamMembers: [],
    };
  },
  methods: {
    async save() {
      try {
        const results = await this.$axios.put(
          `/api/v1/applications/${this.application.id}/team-members`,
          {
            teamMembers: this.teamMembers,
          }
        );
        this.$root.notification.show({
          message: "Saved",
          color: "success",
        });
      } catch (e) {
        this.$root.notification.show({
          message: "Error: " + e,
          color: "error",
        });
      }
    },
  },
};
</script>
