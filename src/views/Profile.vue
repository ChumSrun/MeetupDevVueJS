<template>
  <div>
    <v-container class="mb-4">
      <v-row>
        <v-col cols="12" md="10" offset-md="1">
          <v-row>
            <v-col cols="12" xl="5" class="text-center" v-if="$store.state.profileLoading">
              <v-sheet class="mt-3" :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`">
                <v-container>
                  <v-skeleton-loader class="mx-auto" type="image, paragraph"></v-skeleton-loader>
                </v-container>
              </v-sheet>
            </v-col>
            <v-col cols="12" xl="5" class="text-center" v-else>
              <h1 class="mb-7 mt-n7">User Profile</h1>
              <v-img
                src="https://firebasestorage.googleapis.com/v0/b/meetupdevvuejs.appspot.com/o/meetups%2Fastronomy-1867616__340.jpg?alt=media&token=640bac09-03a5-4430-9930-36ba630be96e"
                class="white--text py-10 d-flex justify-center align-center"
                max-height="500px"
              >
                <v-btn
                  absolute
                  fab
                  dark
                  color="cyan"
                  @click="dialogEdit = true"
                  style="margin-left: 50px; margin-top: 145px"
                >
                  <v-icon dark>mdi-pencil-outline</v-icon>
                </v-btn>

                <v-dialog v-model="dialogEdit" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">User Profiles</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="6" class="mb-n5">
                            <v-text-field
                              outlined
                              label="First Name"
                              v-model="firstName"
                              :rules="ruleInput"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6" class="mb-n5">
                            <v-text-field
                              label="Last Name"
                              outlined
                              :rules="ruleInput"
                              v-model="lastName"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              label="Occupation"
                              outlined
                              :rules="ruleInput"
                              v-model="occupation"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-file-input
                            v-model="imageProfileInput"
                            color="deep-purple accent-4"
                            show-size
                            prepend-icon="mdi-camera"
                            outlined
                            label="Update Your Profile Image?"
                            placeholder="Select your image"
                          ></v-file-input>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions class="mt-n12">
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="dialogEdit = false">Cancel</v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        :disabled="!validationInputInfo"
                        @click="updateUserName"
                      >Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <!-- form edit dialog -->

                <v-avatar size="208" class="mx-auto d-block">
                  <v-img :src="getAllDataUser.info.imageProfileInput"></v-img>
                </v-avatar>
                <h1
                  class="display-2 mt-5 mb-1"
                >{{getAllDataUser.info.firstName}} {{getAllDataUser.info.lastName}}</h1>
                <p class="title mb-0">{{getAllDataUser.info.occupation||"Computer Science"}}</p>
              </v-img>
            </v-col>

            <v-col cols="12" xl="7">
              <v-row>
                <v-col cols="12" class="ml-5">
                  <h2>Registered Meetups</h2>
                </v-col>
                <template v-if="getAllDataUser.regisMeetups.length>0">
                  <v-col
                    id="RegistedMeetup"
                    lg="6"
                    cols="12"
                    v-for="(item) in meetupRegistered"
                    :key="item.id"
                  >
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
                        <div
                          style="width:100%"
                          class="d-flex justify-space-between flex-column mt-n4"
                        >
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
                  <v-col
                    v-if="getAllDataUser.regisMeetups.length>2"
                    class="text-right mt-n3 mb-n8 mr-3"
                  >
                    <v-btn
                      color="blue"
                      @click="expendAllMeetupRegisterd"
                      text
                      dark
                      large
                    >{{(minRegisteredMeetupLenght==2)?"View All": "Show Less"}}</v-btn>
                  </v-col>
                </template>

                <h1 v-else class="subtitle-1 mx-auto">
                  Feel free to join one! 😁
                  <v-btn text to="/meetups" color="green">Click Here</v-btn>
                </h1>

                <!-- crated -->
                <v-col cols="12" class="ml-5">
                  <h2>Created Meetups</h2>
                </v-col>
                <template v-if="createdMeetup.lengthCreated>0">
                  <v-col
                    lg="6"
                    id="createdMeetup"
                    cols="12"
                    v-for="(item, index) in createdMeetup.createdMeetupHighligth"
                    :key="index"
                  >
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
                        <div
                          style="width:100%"
                          class="d-flex justify-space-between flex-column mt-n4"
                        >
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
                </template>
                <h1 v-else class="subtitle-1 mx-auto mb-10">
                  Want to orangize the meetup? 🤗
                  <v-btn text to="/createmeetup" color="green">Click Me</v-btn>
                </h1>
                <v-col v-if="createdMeetup.lengthCreated>2" class="text-right mt-n4 mr-3">
                  <v-btn
                    color="blue"
                    text
                    dark
                    large
                    @click="expendAllCreatedMeetup"
                  >{{(minCreatedMeetupLength===2)?"View All": "Show Less"}}</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-bottom-navigation :value="0" fixed color="orange accent-4">
      <v-btn to="#RegistedMeetup">
        <v-badge
          color="green"
          offset-y="-22"
          offset-x="-8"
          bordered
          overlap
          v-if="getAllDataUser.regisMeetups.length>0"
          :content="getAllDataUser.regisMeetups.length"
        ></v-badge>

        <span>Registed</span>

        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn to="#createdMeetup">
        <v-badge
          color="indigo"
          offset-y="-22"
          offset-x="-8"
          bordered
          overlap
          v-if="createdMeetup.lengthCreated>0"
          :content="createdMeetup.lengthCreated"
        ></v-badge>
        <span>Created</span>
        <v-icon>mdi-post-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
export default {
  name: "Profile",
  inject: ["theme"],
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
  },
  data() {
    return {
      firstName: this.$store.state.user.info.firstName,
      lastName: this.$store.state.user.info.lastName,
      dialogEdit: false,
      allMeetup: false,
      minRegisteredMeetupLenght: 2,
      minCreatedMeetupLength: 2,
      occupation: this.$store.state.user.info.occupation || "Computer Science",
      imageProfileInput: null,

      ruleInput: [value => !!value || "Required."]
    };
  },
  computed: {
    getAllDataUser() {
      return this.$store.getters.getUser;
    },
    loadedAllMeetups() {
      return this.$store.getters.loadedAllMeetups;
    },
    createdMeetup() {
      const createdMeetup = this.loadedAllMeetups.filter(meetup => {
        return meetup.userId === this.getAllDataUser.id;
      });
      return {
        createdMeetupHighligth: createdMeetup.slice(
          0,
          this.minCreatedMeetupLength
        ),
        lengthCreated: createdMeetup.length
      };
    },
    meetupRegistered() {
      const meetupRegist = this.loadedAllMeetups.filter(meetup => {
        let check = false;
        this.getAllDataUser.regisMeetups.forEach(registMeetup => {
          if (registMeetup.id == meetup.id) check = true;
        });
        return check;
      });
      return meetupRegist.slice(0, this.minRegisteredMeetupLenght);
    },
    validationInputInfo() {
      return this.lastName.trim() != "" && this.firstName.trim() != "";
    }
  },
  methods: {
    updateUserName() {
      this.$store.commit("setProfileLoading", true);
      if (this.imageProfileInput) {
        const fileName = this.imageProfileInput.name;
        if (fileName.lastIndexOf(".") <= 0) {
          return alert("Somthing went wrong!");
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.imageProfileInput = fileReader.result;
        });
        fileReader.readAsDataURL(this.imageProfileInput);
      }

      this.$store.dispatch("updateUserNameToDatabase", {
        firstName: this.firstName,
        lastName: this.lastName,
        imageProfileInput: this.imageProfileInput,
        occupation: this.occupation
      });
      this.dialogEdit = false;
    },
    expendAllMeetupRegisterd() {
      if (
        this.minRegisteredMeetupLenght ===
        this.getAllDataUser.regisMeetups.length
      ) {
        this.minRegisteredMeetupLenght = 2;
      } else {
        this.minRegisteredMeetupLenght = this.getAllDataUser.regisMeetups.length;
      }
    },
    expendAllCreatedMeetup() {
      if (this.minCreatedMeetupLength === this.createdMeetup.lengthCreated) {
        this.minCreatedMeetupLength = 2;
      } else {
        this.minCreatedMeetupLength = this.createdMeetup.lengthCreated;
      }
    }
  }
};
</script>

<style >
html {
  scroll-behavior: smooth;
}
</style>