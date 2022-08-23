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
      <DialogHeader :title="application.name" @close="$emit('hide')" />
      <v-card-text class="mt-8">
        <ApplicationLinks v-model="links">
          <template v-slot:extra-title>
            <v-btn class="primary" @click="save()">save</v-btn>
          </template>
        </ApplicationLinks>
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
        this.links = this.application.links;
      } else {
        this.links = [];
      }
    },
  },
  data: function () {
    return {
      links: [],
    };
  },
  methods: {
    async save() {
      try {
        const results = await this.$axios.put(
          `/api/v1/applications/${this.application.id}/links`,
          {
            links: this.links,
          }
        );
        this.$root.notification.show({
          message: "Saved",
          color: "success",
        });
        this.$emit("saved");
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
