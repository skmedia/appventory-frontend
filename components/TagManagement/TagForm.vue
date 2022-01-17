<template>
  <v-dialog
    v-model="showDialog"
    max-width="450"
    persistent
    overlay-opacity=".7"
    draggable
  >
    <v-card>
      <DialogHeader title="Tag" @close="hide()"></DialogHeader>
      <v-card-text class="mt-8">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="tag.label"
                label="Label"
                hint="Label of the tag"
                persistent-hint
                outlined
                :error-messages="labelErrors"
                @input="$v.tag.label.$touch()"
                @blur="$v.tag.label.$touch()"
              />
            </v-col>
            <v-col>
              <v-combobox
                v-model="tag.tagType"
                label="Tag type"
                return-object
                outlined
                :items="tagTypes"
                :error-messages="tagTypeErrors"
                @input="$v.tag.tagType.$touch()"
                @blur="$v.tag.tagType.$touch()"
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
import { v4 as uuidv4 } from "uuid";
import { required } from "vuelidate/lib/validators";

const createTag = ({ id = uuidv4(), label = "", tagType = null } = {}) => ({
  id,
  label,
  tagType,
});
export default {
  name: "TagForm",
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
  validations: {
    tag: {
      label: { required },
      tagType: { required },
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
  computed: {
    labelErrors() {
      const errors = [];
      if (!this.$v.tag.label.$dirty) return errors;
      !this.$v.tag.label.required && errors.push("Label is required.");
      return errors;
    },
    tagTypeErrors() {
      const errors = [];
      if (!this.$v.tag.tagType.$dirty) return errors;
      !this.$v.tag.tagType.required && errors.push("Type is required.");
      return errors;
    },
  },
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        this.$v.$reset();
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
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit("save-tag", {
        tag: this.tag,
        isNewTag: this.isNewTag,
      });
    },
    loadTag() {
      return this.$axios.get(`/api/v1/tags/${this.tag.id}`).then((r) => {
        this.tag = {
          id: r.data.id,
          label: r.data.label,
          tagTypeId: r.data.tagTypeId,
          tagType: {
            id: null,
            value: r.data.tagType.id,
            text: r.data.tagType.label,
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
              text: i.label + " (" + i.tagGroup.label + ")",
            };
          });
        });
    },
  },
};
</script>
