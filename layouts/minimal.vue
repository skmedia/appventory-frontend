<template>
  <v-app>
    <v-main>
      <Nuxt />
      <Notification ref="notification" />
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  mounted() {
    this.$root.notification = this.$refs.notification;
  },
};
</script>
