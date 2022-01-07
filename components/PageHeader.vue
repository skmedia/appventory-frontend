<template>
  <div class="d-flex px-8 py-4 blue">
    <span class="text-h5 align-self-center">{{ title }}</span>
    <div class="ml-auto">
      <slot></slot>
    </div>
  </div>
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
