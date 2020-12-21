<template>
  <div v-if="display" class="error-box">
    <div class="error-message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    display: Boolean
  },
  setup() {}
}
</script>
