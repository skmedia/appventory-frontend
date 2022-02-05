<template>
  <div class="d-flex px-8 py-4 secondary">
    <slot name="title">
      <span class="text-h5 align-self-center">{{ title }}</span>
    </slot>
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
