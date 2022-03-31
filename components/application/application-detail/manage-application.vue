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
      <DialogHeader title="Manage application" @close="$emit('hide')" />
      <v-card-text class="mt-8">
        <ApplicationGeneral v-model="app">
          <template v-slot:extra-title>
            <v-btn class="primary" @click="save()">save</v-btn>
          </template>
        </ApplicationGeneral>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { cloneDeep } from "lodash";
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
        this.app = cloneDeep(this.application);
      } else {
        this.app = {};
      }
    },
  },
  data: function () {
    return {
      app: {},
    };
  },
  methods: {
    async save() {
      try {
        const results = await this.$axios.put(
          `/api/v1/applications/${this.application.id}`,
          {
            ...this.app,
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
