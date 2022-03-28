<template>
  <v-autocomplete
    v-model="applicationTags"
    outlined
    :items="tags"
    item-value="id"
    item-text="label"
    chips
    deletable-chips
    :hint="hint"
    :placeholder="placeholder"
    :label="label"
    persistent-hint
    return-object
    multiple
    solo
  />
</template>

<script>
import { sortBy } from "lodash";
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    hint: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Tags",
    },
  },
  data: function () {
    return {
      tags: [],
    };
  },
  computed: {
    applicationTags: {
      get() {
        return sortBy(this.value, ["label"]);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    value: function () {},
  },
  created() {
    this.loadTags();
  },
  methods: {
    loadTags() {
      return this.$axios
        .$get("/api/v1/tags/for-select/application-tags")
        .then((r) => {
          this.tags = r.items;
        });
    },
  },
};
</script>
