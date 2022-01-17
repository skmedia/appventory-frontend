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
            <v-list-item-content>
              <v-list-item-title>
                <v-btn
                  class="auto-height"
                  :loading="downloadingFile === f.id"
                  :disabled="downloadingFile === f.id"
                  @click.prevent="download(f)"
                >
                  <v-icon left> mdi-cloud-download </v-icon>
                  {{ f.filename }}
                  <template v-slot:loader>
                    <span class="custom-loader">
                      <v-icon dark> mdi-cached </v-icon>
                    </span>
                  </template>
                </v-btn>
              </v-list-item-title>
              <v-list-item-subtitle class="mt-2" v-show="f.description">
                {{ f.description }}
              </v-list-item-subtitle>
              <div>
                <v-text-field
                  v-show="f.id === asset.id"
                  v-model="asset.description"
                  :ref="'desc_' + f.id"
                  class="mt-2"
                  dense
                  outlined
                  counter
                  :error-messages="descriptionErrors"
                  @input="$v.asset.description.$touch()"
                  @blur="$v.asset.description.$touch()"
                  @keydown.enter="update()"
                >
                </v-text-field>
              </div>
            </v-list-item-content>

            <v-list-item-icon v-if="f.id == asset.id">
              <v-btn small @click="update()" x-small icon>
                <v-icon small>mdi-content-save</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-icon v-if="f.id == asset.id">
              <v-btn small @click="reset()" x-small icon>
                <v-icon small>mdi-reload</v-icon>
              </v-btn>
            </v-list-item-icon>

            <v-list-item-icon v-if="f.id !== asset.id">
              <v-btn small @click="load(f)" x-small icon>
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-icon v-if="f.id !== asset.id">
              <v-btn small @click="removeAsset(f.id)" x-small icon>
                <v-icon small>mdi-delete</v-icon>
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
import { saveAs } from "file-saver";
import { maxLength } from "vuelidate/lib/validators";

const create = ({ id = null, description = "" } = {}) => ({
  id,
  description,
});

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      asset: create(),
      downloadingFile: null,
      selectedFiles: [],
      filesToUpload: [],
    };
  },
  validations: {
    asset: {
      description: {
        maxLength: maxLength(200),
      },
    },
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
    descriptionErrors() {
      const errors = [];
      if (!this.$v.asset.description.$dirty) return errors;
      !this.$v.asset.description.maxLength &&
        errors.push("Description is too long (max 200).");
      return errors;
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
    load(item) {
      Object.assign(this.asset, item);
      this.$nextTick(() => {
        setTimeout(() => {
          const ref = this.$refs["desc_" + item.id];
          ref && ref[0].$refs.input.focus();
        });
      });
    },
    reset() {
      this.asset = create();
      this.$v.$reset();
    },
    update() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const idx = this.applicationAssets.findIndex(
        ({ id }) => id === this.asset.id
      );

      if (idx !== -1) {
        this.applicationAssets[idx] = this.asset;
        this.applicationAssets = this.applicationAssets;
        this.asset = create();
      }
    },
  },
};
</script>
