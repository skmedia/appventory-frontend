<template>
  <v-dialog
    v-model="showDialog"
    max-width="450"
    persistent
    overlay-opacity=".7"
    draggable
  >
    <v-card>
      <v-toolbar color="secondary" class="pr-0">
        <v-toolbar-title>Tag</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn absolute right icon @click="hide()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="tag.name"
                label="Name"
                hint="name of the tag"
                persistent-hint
                outlined
              />
            </v-col>
            <v-col>
              <v-combobox
                v-model="tag.TagType"
                label="Tag type"
                return-object
                outlined
                :items="tagTypes"
              ></v-combobox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="hide()"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Vue } from "vue";
import { sortBy, get } from "lodash";
import { v4 as uuidv4 } from "uuid";

const createTag = ({ id = uuidv4(), name = "" } = {}) => ({
  id,
  name,
});
export default {
  props: {
    incomingTag: {
      type: Object,
      default: function () {
        return {};
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
    tagGroupId: {
      type: String,
      required: true,
    },
  },
  data: function () {
    return {
      isNewTag: true,
      tag: this.incomingTag,
      showDialog: this.show,
      tagTypes: [],
    };
  },
  computed: {},
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        // reset state
        this.tag = createTag();
        this.isNewTag = true;

        // load types
        this.loadTagTypes();
      }
    },
    incomingTag: function (val) {
      if (val.id) {
        this.isNewTag = false;
        this.tag = val;
        this.loadTag();
      }
    },
  },
  created() {},
  methods: {
    hide() {
      this.$emit("hide-form");
    },
    save() {
      this.$emit("save-tag", {
        tag: this.tag,
        isNewTag: this.isNewTag,
      });
    },
    loadTag() {
      return this.$axios.get(`/api/v1/tags/${this.tag.id}`).then((r) => {
        this.tag = {
          id: r.data.id,
          name: r.data.name,
          tagTypeId: r.data.tagTypeId,
          TagType: {
            id: null,
            value: r.data.TagType.id,
            text: r.data.TagType.name,
          },
        };
      });
    },
    loadTagTypes() {
      return this.$axios
        .get(`/api/v1/tag-types/for-select/${this.tagGroupId}`)
        .then((r) => {
          this.tagTypes = r.data.items.map((i) => {
            return {
              id: null,
              value: i.id,
              text: i.name + " (" + i.TagGroup.name + ")",
            };
          });
        });
    },
  },
};
</script>