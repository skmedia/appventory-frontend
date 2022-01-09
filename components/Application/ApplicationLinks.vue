<template>
  <v-card outlined>
    <v-card-title>Links</v-card-title>
    <div class="px-4">
      <v-row>
        <v-col>
          <v-combobox
            v-model="link.tag"
            return-object
            label="Link type"
            hint="Select link type"
            persistent-hint
            dense
            outlined
            :items="linkTypes"
            :error-messages="linkTagErrors"
            @input="$v.link.tag.$touch()"
            @blur="$v.link.tag.$touch()"
          ></v-combobox>
        </v-col>
        <v-col>
          <v-text-field
            v-model="link.url"
            outlined
            label="Url"
            dense
            :error-messages="urlErrors"
            @input="$v.link.url.$touch()"
            @blur="$v.link.url.$touch()"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="addLink" outlined>Add</v-btn>
        </v-col>
      </v-row>
    </div>

    <v-card outlined class="ma-4" v-if="applicationLinks.length">
      <v-list dense>
        <template v-for="(link, index) in applicationLinks">
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey"> mdi-link </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ link.tag.label }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <a target="_blank" :href="link.url">{{ link.url }}</a>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon>
              <v-btn @click="removeLink(link.id)" x-small icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-icon>
          </v-list-item>
          <v-divider class="my-1" v-if="index !== applicationLinks.length - 1">
          </v-divider>
        </template>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { sortBy } from "lodash";
import { required, url } from "vuelidate/lib/validators";

const createLink = ({ tag = null, url = "" } = {}) => ({
  tag,
  url,
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
      linkTypes: [],
      link: createLink(),
    };
  },
  validations: {
    link: {
      tag: {
        required,
      },
      url: {
        url,
        required,
      },
    },
  },
  computed: {
    applicationLinks: {
      get() {
        return sortBy(this.value, ["type"]);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    linkTagErrors() {
      const errors = [];
      if (!this.$v.link.tag.$dirty) return errors;
      !this.$v.link.tag.required && errors.push("Type is required.");
      return errors;
    },
    urlErrors() {
      const errors = [];
      if (!this.$v.link.url.$dirty) return errors;
      !this.$v.link.url.required && errors.push("Url is required.");
      !this.$v.link.url.url && errors.push("Url is not valid.");
      return errors;
    },
  },
  watch: {
    value: function () {
      this.link = createLink();
      this.$v.$reset();
    },
  },
  created() {
    this.loadLinkTypes();
  },
  methods: {
    addLink() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }

      const link = {
        id: uuidv4(),
        tag: {
          id: this.link.tag.value,
          name: this.link.tag.text,
        },
        url: this.link.url,
      };

      this.$v.$reset();
      this.applicationLinks.push(link);
      this.applicationLinks = this.applicationLinks;
      this.link = createLink();
    },
    removeLink(id) {
      this.applicationLinks = this.applicationLinks.filter((i) => i.id !== id);
    },
    loadLinkTypes() {
      return this.$axios
        .get("/api/v1/tags/for-select/link-type-tags")
        .then((r) => {
          this.linkTypes = r.data.items.map((i) => {
            return {
              id: null,
              value: i.id,
              text: i.label,
            };
          });
        });
    },
  },
};
</script>
