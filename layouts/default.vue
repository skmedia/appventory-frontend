<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list-item class="blue">
        <v-list-item-content>
          <v-list-item-title>
            <v-layout align-center justify-center>
              <v-subheader class="text-h3 text-overline">AppVento</v-subheader>
              <v-icon>mdi-domain</v-icon>
            </v-layout>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />

      <!--
      <template #append>
        <v-divider />
        <v-list-item>
          <v-list-item-avatar size="36">
            <v-avatar>{{ $auth.user.firstName }}</v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="'auth.user.firstName'" />
            <v-list-item-subtitle class="mt-1">
              <v-btn x-small @click="toggleSettings()">
                <v-icon x-small class="mr-1"> mdi-cogs </v-icon>Settings
              </v-btn>
              <v-btn x-small @click.prevent="logout()">
                <v-icon x-small class="mr-1"> mdi-logout </v-icon>Logout
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      -->
    </v-navigation-drawer>
    <v-app-bar app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <div v-if="!drawer">
        <v-layout align-center justify-center>
          <v-subheader class="text-h3 text-overline">AppVento</v-subheader>
          <v-icon>mdi-domain</v-icon>
        </v-layout>
      </div>

      <!--
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      -->
      <v-spacer></v-spacer>

      <div class="mr-2" v-if="showSearch">
        <v-text-field hide-details outlined dense single-line></v-text-field>
      </div>

      <v-btn icon @click="showSearch = !showSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar size="36" class="primary">
              {{ $auth.user.initials }}
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <!--
          <v-list-item @click="toggleSettings()">
            <v-list-item-action>
              <v-icon>mdi-cogs</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Settings'" />
            </v-list-item-content>
          </v-list-item>
          -->

          <v-list-item @click="$auth.logout()">
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Logout'" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="pb-4">
      <v-container>
        <Nuxt />
        <Settings />
        <Notification ref="notification" />
      </v-container>
    </v-main>

    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      showSearch: false,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Dashboard",
          to: "/",
        },
        {
          icon: "mdi-application",
          title: "Applications",
          to: "/applications",
        },
        {
          icon: "mdi-tag",
          title: "Tag management",
          to: "/tag-management",
        },
        {
          icon: "mdi-account-box-multiple",
          title: "Clients",
          to: "/clients",
        },
        {
          icon: "mdi-account-group",
          title: "Users",
          to: "/users",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Application Repository",
    };
  },
  mounted() {
    this.$root.notification = this.$refs.notification;
  },
  methods: {
    ...mapMutations({
      toggleSettings: "settings/toggleSettings",
    }),
    async logout() {
      await $auth.logout();
    },
  },
};
</script>
