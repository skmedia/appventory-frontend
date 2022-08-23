<template>
  <v-card>
    <PageHeader :title="app.name">
      <application-menu
        :application="app"
        @on-delete-application="onDeleteApplication"
      />
    </PageHeader>

    <div class="pa-5">
      <v-alert type="warning" :value="!app.active">
        Project is not active
      </v-alert>

      <v-card outlined class="pa-4 pt-2">
        <ApplicationApplicationDetailBtnManage
          :click-handler="
            () => {
              manageApplicationIsVisible = true;
            }
          "
        />

        <v-card-text class="px-0" v-if="app.client">
          {{ app.client.name }}
        </v-card-text>

        <v-card-text class="px-0" v-if="app.description">
          {{ app.description }}
        </v-card-text>

        <v-card-text class="pa-0 mt-4" v-if="app.tags && app.tags.length">
          <v-chip class="mr-2 mb-2" :key="item.id" v-for="item in app.tags">
            {{ item.label }}
          </v-chip>
        </v-card-text>
      </v-card>

      <!--
      <v-card outlined class="mt-6">
        <SectionHeader>
          <template v-slot:title>
            <template v-if="app.assets && app.assets.length">Assets</template>
            <template v-else><small>No assets added yet</small></template>
          </template>
          <ApplicationApplicationDetailBtnManage
            :click-handler="
              () => {
                manageAssetsIsVisible = true;
              }
            "
          />
        </SectionHeader>
        <div
          class="d-flex flex-wrap pa-2"
          v-if="app.assets && app.assets.length"
        >
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
      -->

      <v-card outlined class="mt-6">
        <SectionHeader>
          <template v-slot:title>
            <template v-if="app.teamMembers && app.teamMembers.length"
              >Team members</template
            >
            <template v-else><small>No team members added yet</small></template>
          </template>
          <ApplicationApplicationDetailBtnManage
            :click-handler="
              () => {
                manageTeamMembersIsVisible = true;
              }
            "
          />
        </SectionHeader>

        <v-list v-if="app.teamMembers && app.teamMembers.length">
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

      <v-card outlined class="mt-6">
        <SectionHeader>
          <template v-slot:title>
            <template v-if="app.links && app.links.length">Links</template>
            <template v-else><small>No links added yet</small></template>
          </template>
          <ApplicationApplicationDetailBtnManage
            :click-handler="
              () => {
                manageLinksIsVisible = true;
              }
            "
          />
        </SectionHeader>

        <v-list v-if="app.links && app.links.length">
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

      <v-card outlined class="mt-6">
        <SectionHeader>
          <template v-slot:title>
            <template v-if="app.notes && app.notes.length">Notes</template>
            <template v-else><small>No notes added yet</small></template>
          </template>
          <ApplicationApplicationDetailBtnManage
            :click-handler="
              () => {
                manageNotesIsVisible = true;
              }
            "
          />
        </SectionHeader>

        <v-card-text v-if="app.notes && app.notes.length">
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

    <ApplicationApplicationDetailManageApplication
      :show="manageApplicationIsVisible"
      @hide="manageApplicationIsVisible = false"
      @saved="loadApp()"
      :application="app"
    />

    <ApplicationApplicationDetailManageAssets
      :show="manageAssetsIsVisible"
      @hide="manageAssetsIsVisible = false"
      @saved="loadApp()"
      :application="app"
    />

    <ApplicationApplicationDetailManageTeamMembers
      :show="manageTeamMembersIsVisible"
      @hide="manageTeamMembersIsVisible = false"
      @saved="loadApp()"
      :application="app"
    />

    <ApplicationApplicationDetailManageLinks
      :show="manageLinksIsVisible"
      @hide="manageLinksIsVisible = false"
      @saved="loadApp()"
      :application="app"
    />

    <ApplicationApplicationDetailManageNotes
      :show="manageNotesIsVisible"
      @hide="manageNotesIsVisible = false"
      @saved="loadApp()"
      :application="app"
    />

    <ConfirmDialog ref="confirm" />
  </v-card>
</template>
<script>
export default {
  props: {
    application: {
      required: true,
    },
  },
  data() {
    return {
      app: null,
      manageApplicationIsVisible: false,
      manageTeamMembersIsVisible: false,
      manageLinksIsVisible: false,
      manageNotesIsVisible: false,
      manageAssetsIsVisible: false,
      downloadingFile: false,
    };
  },
  created() {
    this.app = this.application;
  },
  methods: {
    async loadApp() {
      this.app = await this.$applicationApi.single(this.app.id);
    },
    async onDeleteApplication(item) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          `Are you sure you want to delete the application ${item.name}?`
        )
      ) {
        await this.$axios
          .delete(`/api/v1/applications/${item.id}`)
          .then((r) => {
            this.$root.notification.show({
              message: "Application deleted",
              color: "success",
            });
            this.$router.push(`/applications`);
          });
      }
    },
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
};
</script>
