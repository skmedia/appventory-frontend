<template>
  <v-dialog
    v-model="showDialog"
    max-width="650"
    persistent
    overlay-opacity=".7"
    draggable
  >
    <v-card>
      <DialogHeader
        :title="tagGroup && tagGroup.name + ' / manage types'"
        @close="hide()"
      ></DialogHeader>
      <v-card-text class="mt-8">
        <v-form ref="form">
          <v-card class="d-flex pa-4" outlined>
            <v-text-field
              class="d-inline-block mr-2"
              dense
              v-model="tagType.name"
              label="Name"
              outlined
              :error-messages="nameErrors"
              @input="$v.tagType.name.$touch()"
              @blur="$v.tagType.name.$touch()"
            />
            <div class="ml-auto">
              <v-btn icon @click="saveTagType">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </div>
          </v-card>
        </v-form>

        <v-card class="mt-8">
          <v-list outlined class="py-0">
            <v-list-item-group>
              <template v-for="(item, i) in tagTypes">
                <v-list-item>
                  <v-list-item-content>{{ item.name }}</v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon x-small @click="loadTagType(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-btn
                      icon
                      x-small
                      @click="deleteTagType(item)"
                      :disabled="item.cannotBeDeleted"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider v-if="i !== tagTypes.length - 1"></v-divider>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-card-text>
    </v-card>
    <ConfirmDialog ref="confirm" />
  </v-dialog>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

import { required, maxLength, email } from "vuelidate/lib/validators";

const createTagType = ({ id = null, name = "" } = {}) => ({
  id,
  name,
});
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    tagGroup: {
      type: Object,
      required: true,
    },
  },
  validations: {
    tagType: {
      name: { required },
    },
  },
  data: function () {
    return {
      showDialog: this.show,
      tagType: createTagType(),
      tagTypes: [],
    };
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.tagType.name.$dirty) return errors;
      !this.$v.tagType.name.required && errors.push("Name is required.");
      return errors;
    },
  },
  watch: {
    show: function (val) {
      this.showDialog = val;
      if (val) {
        this.loadTagTypes();
        this.tagType = createTagType();
        this.$v.$reset();
      }
    },
  },
  created() {},
  methods: {
    hide() {
      this.$emit("hide");
    },
    loadTagType(item) {
      Object.assign(this.tagType, item);
    },
    saveTagType() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      let req;
      if (this.tagType.id) {
        const payload = {
          ...this.tagType,
        };
        req = this.$axios.put(`/api/v1/tag-types/${this.tagType.id}`, payload);
      } else {
        const payload = {
          id: uuidv4(),
          name: this.tagType.name,
          tagGroupId: this.tagGroup.id,
        };
        req = this.$axios.post(`/api/v1/tag-types`, payload);
      }
      req.then((r) => {
        this.$v.$reset();
        this.tagType = createTagType();
        this.loadTagTypes();
      });
    },
    loadTagTypes() {
      const tagCanBeDeleted = (tag) => {
        const relationCount = [
          "ApplicationLink",
          "ApplicationTeamMember",
          "ApplicationTag",
        ]
          .map((relation) => tag[relation].length)
          .reduce((count, initValue) => count + initValue, 0);
        return relationCount === 0;
      };
      return this.$axios
        .$get(`/api/v1/tag-types/for-select/${this.tagGroup.id}`)
        .then((r) => {
          this.tagTypes = r.items.map((tagType) => ({
            ...tagType,
            cannotBeDeleted: tagType.tags.some((t) => !tagCanBeDeleted(t)),
          }));
        });
    },
    async deleteTagType(item) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          `Are you sure you want to delete the tag type ${item.name}?`
        )
      ) {
        await this.$axios.delete(`/api/v1/tag-types/${item.id}`).then((r) => {
          this.loadTagTypes();
        });
      }
    },
  },
};
</script>
