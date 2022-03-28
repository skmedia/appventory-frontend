<template>
  <ApplicationDetail :app="app" v-if="!$fetchState.pending" />
</template>
<script>
export default {
  props: {},
  data() {
    return {
      app: {},
    };
  },
  async fetch() {
    const id = this.$nuxt.context.route.params.id;
    this.app = await this.$axios.$get(`/api/v1/applications/${id}`);
  },
};
</script>
