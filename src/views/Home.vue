<template>
  <div>
    <v-row v-if="loading">
      <v-col cols="12" md="8" offset-md="2">
        <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="px-3 pt-3 pb-3">
          <v-skeleton-loader class="mx-auto" type="card, image"></v-skeleton-loader>
        </v-sheet>
      </v-col>
    </v-row>

    <v-container fluid v-else>
      <v-row>
        <v-col cols="12" md="8" class="pa-0" offset-md="2">
          <Carousel />
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row justify="center">
        <v-btn
          outlined
          x-large
          class="teal--text ma-3"
          to="/meetups"
          style="margin-bottom: 0 !important;"
        >
          <v-icon left>mdi-compass-rose</v-icon>Explore meetups
        </v-btn>
        <v-btn
          outlined
          x-large
          class="light-blue--text ma-3"
          to="/createmeetup"
          style="margin-bottom: 0 !important;"
        >
          <v-icon left>mdi-sticker-plus-outline</v-icon>organize meetup
        </v-btn>
      </v-row>
    </v-container>
    <p class="display-1 text-center">Join our awesome meetups!</p>
    <p class="subtitle text-center">Imagine what you could do with the right people by your side.</p>
  </div>
</template>

<script>
import Carousel from "@/components/Home/Carousel";
export default {
  inject: ["theme"],
  components: {
    Carousel
  },
  computed: {
    loading() {
      return this.$store.getters.getLoading;
    }
  }
};
</script>

<style></style>
