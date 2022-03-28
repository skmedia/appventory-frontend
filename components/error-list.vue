<template>
  <v-alert type="error">
    <span v-for="e in errors">{{ e }}</span>
  </v-alert>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
