<template>
  <v-btn
    :class="{ 'float-right ma-2': float }"
    small
    class="pa-4"
    @click="clickHandler"
  >
    <v-icon small class="mr-1">{{ icon }}</v-icon> {{ label }}
  </v-btn>
</template>

<script>
export default {
  props: {
    clickHandler: {
      required: true,
    },
    label: {
      type: String,
      default: "manage",
    },
    float: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: "mdi-pencil-box",
    },
  },
};
</script>
