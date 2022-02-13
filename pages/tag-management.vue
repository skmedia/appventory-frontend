<template>
  <div>
    <v-card>
      <PageHeader title="Configuration"></PageHeader>

      <v-container>
        <v-row>
          <v-col cols="3">
            <v-subheader> TAG GROUPS </v-subheader>

            <v-list flat>
              <v-list-item-group v-model="selectedTagGroup" color="primary">
                <v-list-item
                  v-for="(item, i) in tagGroups"
                  :key="i"
                  @click="$router.push(`/tag-management/${item.id}`)"
                >
                  <v-list-item-action>
                    <v-icon>mdi-tag</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.label" />
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
          <v-col class>
            <v-card flat v-if="isHome" class="mt-12">
              <v-alert type="info"> Select tag group </v-alert>
            </v-card>
            <NuxtChild v-else />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTagGroup: null,
      tagGroups: [],
    };
  },
  computed: {
    isHome: function () {
      return !!this.$route.params.tagGroup === false;
    },
  },
  watch: {},
  created() {
    this.loadTagGroups();
  },
  methods: {
    async loadTagGroups() {
      return this.$axios.get("/api/v1/tag-groups", {}).then((r) => {
        this.tagGroups = r.data;
      });
    },
  },
};
</script>
