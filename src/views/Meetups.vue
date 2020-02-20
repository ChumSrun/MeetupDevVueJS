<template>
  <div>
    <router-view></router-view>
    <h1 class="text-center mt-2">{{ homeTitle }}</h1>

    <v-sheet v-if="loading" class="mt-3" :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`">
      <v-container>
        <v-row>
          <v-col cols="6" md="3">
            <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
          </v-col>
          <v-col cols="6" md="3">
            <v-skeleton-loader class="mx-auto" type="sentences,text,paragraph,chip"></v-skeleton-loader>
          </v-col>
          <v-col cols="6" md="3">
            <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
          </v-col>
          <v-col cols="6" md="3">
            <v-skeleton-loader class="mx-auto" type="sentences,text,paragraph,chip"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <v-container v-else>
      <v-row>
        <v-col lg="12" xl="10" offset-xl="1">
          <v-row>
            <v-col lg="6" cols="12" v-for="(item, index) in loadedMeetupForPagination" :key="index">
              <v-card style="height: 100% !important">
                <div class="d-flex" style=" height: 100%">
                  <v-avatar tile size="180" class="my-auto" style="max-height:230px">
                    <v-img
                      :src="item.imageUrl"
                      lazy-src="https://res.cloudinary.com/responsivebreakpoints/image/upload/c_scale,w_70/v1582000976/efd24145fc0f291c4e69447c8e3cfb33_m3z9rk.jpg"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-avatar>
                  <div style="width:100%" class="d-flex justify-space-between flex-column mt-n4">
                    <v-card-title style="line-height: 1.3em;">{{ item.title }}</v-card-title>
                    <v-card-subtitle style="line-height: 1.3em;">
                      <span class="font-weight-black">{{ item.location }}</span>
                      - {{ item.eventDate | dateFilter1 }}
                    </v-card-subtitle>
                    <v-card-text class="mt-n2 d-block d-sm-none">
                      {{
                      item.description | textTruncate
                      }}
                    </v-card-text>
                    <v-card-text class="mt-n2 d-none d-sm-block">
                      {{
                      item.description
                      }}
                    </v-card-text>

                    <v-card-actions class="align-self-end pt-0">
                      <v-btn outlined color="blue" :to="'/meetups/' + item.title">View Meetup</v-btn>
                    </v-card-actions>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="text-center mb-3">
        <v-pagination v-model="pageNumber" color="success" :length="getPaginationLength"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  inject: ["theme"],
  data() {
    return {
      homeTitle: "View All Meetups",
      pageNumber: 1
    };
  },
  computed: {
    ...mapGetters({
      loadedAllMeetups: "loadedAllMeetups"
    }),
    loading() {
      return this.$store.getters.getLoading;
    },
    getPaginationLength() {
      return Math.ceil(this.loadedAllMeetups.length / 6);
    },
    loadedMeetupForPagination() {
      const start = (this.pageNumber - 1) * 6;
      const end = this.pageNumber * 6;
      return this.loadedAllMeetups.slice(start, end);
    }
  },
  filters: {
    dateFilter1(value) {
      let date = new Date(value).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      return date;
    }
  }
};
</script>

<style style="scss" scoped>
@mixin phoneSize {
  @media (max-width: 380px) {
    @content;
  }
}
.v-btn--active {
  color: white !important;
  background-color: lightskyblue;
}
</style>
