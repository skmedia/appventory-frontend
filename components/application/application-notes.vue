<template>
  <v-card outlined>
    <v-card-title>
      <v-row no-gutters class="d-flex">
        <v-col cols="12" md="8" class="align-self-center">Notes</v-col>
        <v-col class="mt-2 mt-md-0 text-md-right text-left">
          <slot name="extra-title"></slot>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card outlined class="mx-4 pa-4">
      <v-row>
        <v-col>
          <v-combobox
            v-model="note.tag"
            return-object
            label="Note type"
            hint="Select note type"
            persistent-hint
            item-text="label"
            item-key="id"
            outlined
            :items="noteTypes"
            :error-messages="tagErrors"
            @input="$v.note.tag.$touch()"
            @blur="$v.note.tag.$touch()"
          ></v-combobox>
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            counter
            v-model="note.text"
            outlined
            label="Text"
            :error-messages="textErrors"
            @input="$v.note.text.$touch()"
            @blur="$v.note.text.$touch()"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn v-if="note.id" @click="update" outlined> Save </v-btn>
          <v-btn v-if="!note.id" @click="add" outlined>Add</v-btn>
          <v-btn v-if="note.id" small secondary @click="reset()" icon>
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-card outlined class="ma-4" v-if="applicationNotes.length">
      <v-list>
        <template v-for="(note, index) in applicationNotes">
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey"> mdi-note </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ note.tag.label }}
                {{ note.createdAt | dateParse() | dateFormat("DD/MM/YYYY") }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ note.text }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-btn @click="load(note)" x-small icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-list-item-icon>
            <v-list-item-icon>
              <v-btn @click="remove(note.id)" x-small icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
          <v-divider class="my-1" v-if="index !== applicationNotes.length - 1">
          </v-divider>
        </template>
      </v-list>
    </v-card>
    <v-card v-else>
      <v-card-text>no notes yet</v-card-text>
    </v-card>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { sortBy } from "lodash";
import { required, maxLength } from "vuelidate/lib/validators";
import { dateFormat } from "@vuejs-community/vue-filter-date-format";

const create = ({ id = null, isNew = true, tag = null, text = "" } = {}) => ({
  id,
  isNew,
  tag,
  text,
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
      noteTypes: [],
      note: create(),
    };
  },
  validations: {
    note: {
      tag: {
        required,
      },
      text: {
        required,
        maxLength: maxLength(500),
      },
    },
  },
  computed: {
    applicationNotes: {
      get() {
        return sortBy(this.value, ["type"]);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    tagErrors() {
      const errors = [];
      if (!this.$v.note.tag.$dirty) return errors;
      !this.$v.note.tag.required && errors.push("Type is required.");
      return errors;
    },
    textErrors() {
      const errors = [];
      if (!this.$v.note.text.$dirty) return errors;
      !this.$v.note.text.required && errors.push("Text is required.");
      !this.$v.note.text.maxLength &&
        errors.push(`Text is too long (max 500).`);
      return errors;
    },
  },
  watch: {
    value: function () {
      this.note = create();
      this.$v.$reset();
    },
  },
  created() {
    this.loadNoteTypes();
  },
  methods: {
    update() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const idx = this.applicationNotes.findIndex(
        ({ id }) => id === this.note.id
      );

      if (idx !== -1) {
        this.applicationNotes[idx] = this.note;
        this.applicationNotes = this.applicationNotes;
        this.note = create();
      }
    },
    add() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const note = {
        id: uuidv4(),
        isNew: this.note.isNew,
        createdAt: dateFormat(new Date(), "YYYY-MM-DDT00:00:00Z"),
        tag: {
          id: this.note.tag.id,
          label: this.note.tag.label,
        },
        text: this.note.text,
      };

      this.$v.$reset();
      this.applicationNotes.push(note);
      this.applicationNotes = this.applicationNotes;
      this.note = create();
    },
    load(item) {
      Object.assign(this.note, item);
    },
    reset() {
      this.note = create();
      this.$v.$reset();
    },
    remove(id) {
      this.applicationNotes = this.applicationNotes.filter((i) => i.id !== id);
    },
    loadNoteTypes() {
      return this.$axios
        .get("/api/v1/tags/for-select/note-type-tags")
        .then((r) => {
          this.noteTypes = r.data.items.map((i) => {
            return {
              id: i.id,
              label: i.label,
            };
          });
        });
    },
  },
};
</script>
