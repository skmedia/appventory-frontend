<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list-item class="blue" style="height: 64px">
        <v-list-item-content>
          <v-list-item-title>
            <v-layout align-center justify-center>
              <v-subheader class="text-h3 text--white text-overline">
                AppVentory
              </v-subheader>
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
    </v-navigation-drawer>
    <v-app-bar app flat class="blue">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <div v-if="!drawer">
        <v-layout align-center justify-center>
          <v-subheader class="text-h3 text-overline">AppVentory</v-subheader>
          <v-icon>mdi-domain</v-icon>
        </v-layout>
      </div>

      <v-spacer></v-spacer>

      <v-menu offset-y v-if="$auth.loggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar size="36" class="blue darken-2">
              {{ $auth.user.initials }}
            </v-avatar>
          </v-btn>
          <div class="mx-2">
            {{ $auth.user.activeAccount.name }}
          </div>
        </template>
        <v-list>
          <v-list-item
            :key="account.id"
            v-for="account in $auth.user.accounts"
            @click="switchAccount(account)"
          >
            <v-list-item-action>
              <v-icon>mdi-account-box-multiple</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="account.name" />
            </v-list-item-content>
          </v-list-item>

          <v-divider />

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

      <div class="mr-2" v-if="showSearch">
        <v-text-field
          class="white"
          hide-details
          outlined
          dense
          single-line
        ></v-text-field>
      </div>

      <v-btn icon @click="showSearch = !showSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="pb-4">
      <v-container fluid class="pa-8">
        <Nuxt />
        <Notification ref="notification" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      showSearch: false,
      clipped: false,
      drawer: null,
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
    async switchAccount(account) {
      try {
        const r = await this.$axios.post("/api/auth/switch-account", {
          account: account.id,
        });
        await this.$auth.setUserToken(r.data.access_token);

        this.$root.notification.show({
          message: `Account ${account.name} is now active`,
          color: "success",
        });

        this.$router.push(`/`);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
