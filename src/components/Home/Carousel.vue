<template>
  <v-carousel
    interval="6000"
    show-arrows-on-hover
    hide-delimiter-background
    delimiter-icon="mdi-minus"
    light
    cycle
  >
    <v-carousel-item
      v-for="(item, index) in featureMeetups"
      :key="index"
      :src="item.imageUrl"
      :to="'/meetups/' + item.title"
    >
      <p id="titleMeetups" class="headline font-weight-bold">{{ item.title }}</p>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["featureMeetups"])
  }
};
</script>

<style scoped>
#titleMeetups {
  position: absolute;
  left: 1em;
  top: 1em;
  background-color: rgba(126, 123, 123, 0.5);
  border-radius: 5px;
  padding: 0.4em;
  color: rgb(255, 255, 255);
  text-shadow: rgb(64, 116, 181) 2px 2px 0px, rgb(64, 116, 181) 2px -2px 0px,
    rgb(64, 116, 181) -2px 2px 0px, rgb(64, 116, 181) -2px -2px 0px,
    rgb(64, 116, 181) 2px 0px 0px, rgb(64, 116, 181) 0px 2px 0px,
    rgb(64, 116, 181) -2px 0px 0px, rgb(64, 116, 181) 0px -2px 0px;
  --darkreader-inline-color: #eae7e1;
  --darkreader-inline-bgimage: initial;
  --darkreader-inline-bgcolor: #eae7e1;
}
</style>
