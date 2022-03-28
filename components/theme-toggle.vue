<template>
  <v-list-item>
    <v-list-item-action>
      <v-checkbox v-model="darkmode"></v-checkbox>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>Dark Mode</v-list-item-title>
      <v-list-item-subtitle>Toggle dark/light mode</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  data() {
    return {
      darkmode: false,
    };
  },
  watch: {
    darkmode(oldval, newval) {
      this.handledarkmode();
    },
  },
  created() {
    if (process.browser) {
      if (localStorage.getItem("DarkMode")) {
        const cookieValue = localStorage.getItem("DarkMode") === "true";
        this.darkmode = cookieValue;
      } else {
        this.handledarkmode();
      }
    }
  },
  methods: {
    handledarkmode() {
      if (process.browser) {
        if (this.darkmode) {
          this.$vuetify.theme.dark = true;
          localStorage.setItem("DarkMode", true);
        } else {
          this.$vuetify.theme.dark = false;
          localStorage.setItem("DarkMode", false);
        }
      }
    },
  },
};
</script>