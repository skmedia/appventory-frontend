<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> AppVento </v-list-item-title>
          <v-list-item-subtitle>Application Repository</v-list-item-subtitle>
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

      <template #append>
        <v-divider />
        <v-list-item>
          <v-list-item-avatar size="36">
            <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="'Kris Geens'" />
            <v-list-item-subtitle class="mt-1">
              <v-btn x-small @click="toggleSettings()">
                <v-icon x-small class="mr-1"> mdi-cogs </v-icon>Settings
              </v-btn>
              <v-btn x-small>
                <v-icon x-small class="mr-1"> mdi-logout </v-icon>Logout
              </v-btn>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
    <v-app-bar app flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <div v-if="!drawer">
        <v-subheader> AppVento application inventory </v-subheader>
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

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="pb-4">
      <v-container>
        <Nuxt />
        <Settings />
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
import Settings from "../components/Settings.vue";

export default {
  components: { Settings },
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
  methods: {
    ...mapMutations({
      toggleSettings: "settings/toggleSettings",
    }),
  },
};
</script>
