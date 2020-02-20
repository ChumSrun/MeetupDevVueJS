<template>
  <v-app style="overflow-x:hidden;">
    <Header />
    <v-content style="margin-top:120px">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Header from "@/components/Shared/Header";
export default {
  name: "App",

  components: {
    Header
  },

  data: () => ({
    //
  })
};
</script>

<style lang="scss" >
</style>

