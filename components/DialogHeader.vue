<template>
  <div class="d-flex px-4 py-2 blue" id="dialog-header">
    <span class="text-overline align-self-center">{{ title }}</span>
    <div class="ml-auto">
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
