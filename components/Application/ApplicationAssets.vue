<template>
  <v-card outlined>
    <v-card-title>Assets</v-card-title>
    <div class="px-4">
      <v-file-input
        v-model="selectedFiles"
        multiple
        label="Select files to upload"
        prepend-icon=""
        outlined
        hint="Select files, it's possible to select multiple files"
        persistent-hint
        chips
        deletable-chips
        @change="addFileToUpload"
        @click:clear="filesToUpload = []"
      >
      </v-file-input>
    </div>

    <v-card outlined class="ma-4" v-if="filesToUpload.length">
      <v-card-subtitle>New files</v-card-subtitle>
      <v-divider></v-divider>
      <v-list dense>
        <template v-for="(f, index) in filesToUpload">
          <v-list-item class="my-0 py-0">
            <v-list-item-icon>
              <v-icon color="grey"> mdi-attachment </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-html="f.file.name"></v-list-item-title>
              <v-list-item-subtitle>
                <v-text-field
                  v-model="f.description"
                  class="mt-2"
                  dense
                  label="Description"
                  hide-details=""
                  outlined
                  hint="Info"
                >
                </v-text-field>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn @click="removeFileToUpload(f)" x-small icon>
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
          <v-divider class="my-1" v-if="index !== filesToUpload.length - 1">
          </v-divider>
        </template>
      </v-list>
    </v-card>

    <v-card
      outlined
      class="ma-4"
      v-if="applicationAssets && applicationAssets.length"
    >
      <v-card-subtitle>Files</v-card-subtitle>
      <v-divider></v-divider>
      <v-list dense>
        <template v-for="(f, index) in applicationAssets">
          <v-list-item class="my-0 py-0">
            <v-list-item-icon>
              <v-icon color="grey"> mdi-attachment </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <a :href="'/api/v1/assets/download/' + f.id">
                  {{ f.filename }}
                </a>
              </v-list-item-title>
              <v-list-item-subtitle v-if="f.description">
                {{ f.description }}
                <v-text-field
                  v-model="f.description"
                  class="mt-2"
                  dense
                  hide-details
                  outlined
                >
                </v-text-field>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-btn @click="editAsset(f.id)" x-small icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="removeAsset(f.id)" x-small icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
          <v-divider class="my-1" v-if="index !== applicationAssets.length - 1">
          </v-divider>
        </template>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
import { sortBy } from "lodash";

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      selectedFiles: [],
      filesToUpload: [],
    };
  },
  computed: {
    applicationAssets: {
      get() {
        return sortBy(this.value, ["filename"]);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    value: function () {
      this.selectedFiles = [];
      this.filesToUpload = [];
    },
  },
  created() {
    this.selectedFiles = [];
    this.filesToUpload = [];
  },
  methods: {
    addFileToUpload(files) {
      this.$nextTick(() => {
        this.selectedFiles = [];
      });
      if (!files.length) {
        return;
      }
      this.filesToUpload = [];
      files.forEach((f) => {
        this.filesToUpload.push({
          description: "",
          file: f,
        });
      });
      this.$emit("files-to-upload-changed", this.filesToUpload);
    },
    removeFileToUpload(fileToUpload) {
      this.filesToUpload = this.filesToUpload.filter(
        (i) => i.file !== fileToUpload.file
      );
      this.$emit("files-to-upload-changed", this.filesToUpload);
    },
    removeAsset(id) {
      this.applicationAssets = this.applicationAssets.filter(
        (i) => i.id !== id
      );
    },
  },
};
</script>
