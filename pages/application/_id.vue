<template>
  <v-card v-if="!$fetchState.pending">
    <PageHeader :title="app.name">
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Excel</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>PDF</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </PageHeader>

    <div class="pa-5">
      <v-card-text class="px-0" v-if="app.client">
        {{ app.client.name }}
      </v-card-text>

      <v-card-text class="px-0" v-if="app.description">
        {{ app.description }}
      </v-card-text>

      <v-card flat class="mt-4" v-if="app.tags">
        <v-card-text class="pa-0">
          <v-chip class="mr-2 mb-2" :key="item.id" v-for="item in app.tags">
            {{ item.tag.label }}
          </v-chip>
        </v-card-text>
      </v-card>

      <v-card outlined class="mt-6 pa-2" v-if="app.assets && app.assets.length">
        <div class="d-flex">
          <div :key="item.id" v-for="item in app.assets">
            <v-btn
              class="auto-height ma-2"
              :loading="downloadingFile === item.id"
              :disabled="downloadingFile === item.id"
              @click.prevent="download(item)"
            >
              <span v-if="item.description">{{ item.description }}</span>
              <span v-else>{{ item.filename }}</span>
              <v-icon right> mdi-cloud-download </v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>

      <v-card
        outlined
        class="mt-6"
        v-if="app.teamMembers && app.teamMembers.length"
      >
        <v-list>
          <v-list-item :key="item.id" v-for="item in app.teamMembers">
            <v-list-item-icon>
              <v-icon color="grey"> mdi-badge-account </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.userFullName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.tag.label }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card outlined class="mt-4" v-if="app.links && app.links.length">
        <v-list>
          <v-list-item :key="item.id" v-for="item in app.links">
            <v-list-item-icon>
              <v-icon color="grey"> mdi-link </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.tag.label }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <a target="_blank" :href="item.url"> {{ item.url }}</a>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>

      <v-card outlined class="mt-4" v-if="app.notes && app.notes.length">
        <v-card-text>
          <v-timeline align-top dense>
            <v-timeline-item
              icon="mdi-note"
              fill-dot
              v-for="note in app.notes"
              :key="note.id"
            >
              <div>
                <div class="font-weight-normal">
                  <strong>{{ note.tag.label }}</strong> @{{
                    note.createdAt
                      | dateParse()
                      | dateFormat("DD/MM/YYYY HH:mm:ss")
                  }}
                </div>
                <div style="white-space: pre-wrap">{{ note.text }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </div>
  </v-card>
</template>
<script>
import { dateFormat } from "@vuejs-community/vue-filter-date-format";
export default {
  props: {},
  data() {
    return {
      downloadingFile: false,
      app: {},
    };
  },
  methods: {
    download(f) {
      this.downloadingFile = f.id;
      this.$axios
        .$get(`/api/v1/assets/download/${f.id}`, { responseType: "blob" })
        .then((response) => {
          saveAs(response, f.filename);
        })
        .finally(() => {
          this.downloadingFile = null;
        });
    },
  },
  async fetch() {
    const id = this.$nuxt.context.route.params.id;
    this.app = await this.$axios.$get(`/api/v1/applications/${id}`);
  },
};
</script>
