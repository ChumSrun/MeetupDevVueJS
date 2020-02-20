<template>
  <v-app style="overflow-x:hidden;">
    <Header />
    <v-content style="margin-top:120px">
      <keep-alive :include="['Meetups', 'Home', 'CreateMeetup']">
        <router-view></router-view>
      </keep-alive>
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

