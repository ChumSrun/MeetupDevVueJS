<template>
  <v-alert dismissible outlined type="error" @input="onClose" :value="true">
    {{ message }}</v-alert
  >
</template>

<script>
export default {
  props: ["message"],

  methods: {
    onClose() {
      this.$emit("dissmissed");
    }
  }
};
</script>

<style></style>
