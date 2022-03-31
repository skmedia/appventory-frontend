<template>
  <v-dialog
    :value="show"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    overlay-opacity=".7"
  >
    <v-card id="top">
      <DialogHeader :title="application.name" @close="$emit('hide')" />
      <v-card-text class="mt-8">
        <ApplicationAssets
          @files-to-upload-changed="setFilesToUpload"
          v-model="assets"
        >
          <template v-slot:extra-title>
            <v-btn class="primary" @click="save()">save</v-btn>
          </template>
        </ApplicationAssets>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    application: {
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    show: function (value) {
      if (value) {
        this.assets = this.application.assets;
        this.filesToUpload = [];
      } else {
        this.assets = [];
      }
    },
  },
  data: function () {
    return {
      assets: [],
      filesToUpload: [],
    };
  },
  methods: {
    setFilesToUpload(filesToUpload) {
      this.filesToUpload = filesToUpload;
    },
    async save() {
      try {
        let filesToAdd = [];
        let newFiles = this.filesToUpload;
        if (newFiles.length) {
          let formData = new FormData();
          formData.append("id", this.application.id);
          newFiles.forEach((f) => {
            formData.append("files", f.file);
            formData.append("fileDescriptions[]", f.description);
          });
          const fileUploadResponse = await this.$axios.post(
            "/api/v1/assets/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          filesToAdd = fileUploadResponse.data.fileList;
        }

        const results = await this.$axios.put(
          `/api/v1/applications/${this.application.id}/assets`,
          {
            assets: this.assets,
            newFiles: this.filesToUpload,
            filesToAdd: filesToAdd,
          }
        );
        this.$root.notification.show({
          message: "Saved",
          color: "success",
        });
        this.$emit("saved");
      } catch (e) {
        this.$root.notification.show({
          message: "Error: " + e,
          color: "error",
        });
      }
    },
  },
};
</script>
