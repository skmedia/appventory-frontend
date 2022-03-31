<template>
  <ApplicationDetail :application="application" v-if="!$fetchState.pending" />
</template>
<script>
export default {
  props: {},
  data() {
    return {
      application: {},
    };
  },
  async fetch() {
    const id = this.$nuxt.context.route.params.id;
    this.application = await this.$applicationApi.single(id);
  },
};
</script>
