<template>
  <v-row no-gutters class="d-flex px-4 py-2">
    <v-col cols="12" md="8" class="align-self-center text-h6">
      <slot name="title">
        {{ title }}
      </slot>
    </v-col>
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
    },
  },
};
</script>
