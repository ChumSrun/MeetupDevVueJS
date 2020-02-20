<template>
  <v-container class="mb-12, px-7">
    <h2 class="text-center mb-2 mx-n12">This Is What You Looking For?</h2>
    <v-sheet
      v-if="loading"
      :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
      class="px-3 pt-3 pb-3"
    >
      <v-skeleton-loader class="mx-auto" type="image,article,actions"></v-skeleton-loader>
    </v-sheet>

    <v-row v-else>
      <v-col cols="12" xl="8" offset-xl="2">
        <v-card>
          <v-row>
            <v-col cols="12" md="6" class="my-n3">
              <v-img
                :aspect-ratio="16/11"
                :src="meetup.imageUrl"
                lazy-src="https://res.cloudinary.com/responsivebreakpoints/image/upload/c_scale,w_170/v1582001418/456593559_gm70jg.jpg"
                max-height="350"
                style="background-color: red;"
                class="grey lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
            <v-col cols="12" md="6" class="mt-n5">
              <v-row align="center" style="height:100%">
                <v-card-title
                  class="display-1 mx-auto teal--text text-center d-block"
                  style="font-size: 30px !important; width: 100%"
                >{{ meetup.title }}</v-card-title>
                <v-card-subtitle class="subtitle-2 ml-4 grey--text">
                  <span class="font-weight-black">{{ meetup.location }}</span>
                  - {{ meetup.eventDate | dateFilter }}
                </v-card-subtitle>

                <v-card-text class="title mx-1" style="min-height: 100px">
                  {{
                  meetup.description
                  }}
                </v-card-text>

                <div class="pr-4 mb-n2 ml-auto">
                  <v-card-actions>
                    <EditBtn v-if="meetup.userId == getUserId" :meetupData="meetup"></EditBtn>

                    <v-btn
                      :loading="registerLoading"
                      :disabled="registerLoading"
                      @click="RegisterAndUnregister"
                      outlined
                      x-large
                      color="green accent-4"
                    >
                      <v-icon left>{{(userIsRegistered)?"mdi-heart-outline": "mdi-heart-off"}}</v-icon>
                      {{(userIsRegistered)?"Register": "Unregister"}}
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon light>mdi-cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                  </v-card-actions>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  inject: ["theme"],
  props: ["title"],
  computed: {
    ...mapGetters([
      "loadedMeetup",
      "getLoading",
      "getUser",
      "getRegisterLoadingState"
    ]),
    loading() {
      return this.getLoading;
    },
    meetup() {
      return this.loadedMeetup(this.title);
    },
    getUserId() {
      return this.getUser.id;
    },
    userIsRegistered() {
      let checkRegis = true;
      if (this.getUserId) {
        checkRegis =
          this.getUser.regisMeetups.findIndex(
            value => value.id == this.meetup.id
          ) <= -1;
      }
      return checkRegis;
    },
    registerLoading() {
      return this.getRegisterLoadingState;
    }
  },
  methods: {
    RegisterAndUnregister() {
      if (this.userIsRegistered) {
        if (this.getUserId) {
          this.$store.dispatch("registerMeetup", this.meetup.id);
        } else {
          this.$router.push("/signin");
        }
      } else {
        const fbKeyDeteleMeetup = this.getUser.regisMeetups.find(
          value => value.id == this.meetup.id
        ).fbKey;
        console.log(fbKeyDeteleMeetup);
        this.$store.dispatch("unRegisterMeetup", fbKeyDeteleMeetup);
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
