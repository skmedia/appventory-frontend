<template>
  <v-row no-gutters class="d-flex px-8 py-4 secondary">
    <slot name="title">
      <v-col cols="12" md="8" class="align-self-center text-h5">{{
        title
      }}</v-col>
    </slot>
    <v-col class="mt-2 mt-md-0 text-md-right text-left">
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
