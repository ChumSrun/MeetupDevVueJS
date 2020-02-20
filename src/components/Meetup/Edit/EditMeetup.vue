<template>
  <v-dialog v-model="dialogEditForm" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn color="indigo accent-2" x-large class="mx-3" dark v-on="on">Edit</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Edit The Meetup</span>
      </v-card-title>
      <v-card-text class="mb-n12">
        <v-container>
          <v-row>
            <v-col cols="12" md="6" class="mb-n5">
              <v-text-field
                v-model="dataUpdate.title"
                label="Title"
                :rules="[rulesInput.required]"
                required
                outlined
                prepend-inner-icon="mdi-page-layout-header"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="mb-n5">
              <v-select
                v-model="dataUpdate.location"
                prepend-inner-icon="mdi-earth"
                :rules="[rulesInput.required]"
                outlined
                :items="['Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang', 'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 'Koh Kong', 'Kratié', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh', 'Preah Sihanouk', 'Preah Vihear', 'Pursat', 'Prey Veng', 'Ratanakiri', 'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takéo', 'Tboung Khmom']"
                label="Location"
                required
              ></v-select>
            </v-col>
            <!-- dateInput -->
            <v-col cols="12" md="6" class="mb-n5">
              <v-menu
                v-model="menuDate"
                :close-on-content-click="false"
                nudge-top="100"
                nudge-left="18"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateInput"
                    outlined
                    label="Date"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateInput"
                  locale="km"
                  color="green"
                  no-title
                  @input="menuDate = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <!-- time input -->
            <v-col cols="12" md="6" class="mb-n5">
              <v-menu
                ref="menuTime"
                v-model="menuTime"
                :close-on-content-click="false"
                :nudge-right="40"
                :nudge-top="200"
                :return-value.sync="timeInput"
                transition="scale-transition"
                max-width="350px"
                min-width="350px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    outlined
                    v-model="timeInput"
                    label="Time"
                    readonly
                    v-on="on"
                    prepend-inner-icon="mdi-timeline-clock-outline"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menuTime"
                  scrollable
                  v-model="timeInput"
                  full-width
                  @click:minute="$refs.menuTime.save(timeInput)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <!-- description Input -->
            <v-col cols="12">
              <v-textarea
                outlined
                v-model="dataUpdate.description"
                append-icon="mdi-email-outline"
                name="input-7-4"
                :rules="[rulesInput.required]"
                label="Description"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <!-- delete -->
        <v-dialog v-model="dialogDeleteBtn" persistent max-width="290">
          <template v-slot:activator="{ on }">
            <v-btn color="red darken-1" text v-on="on">Delete Meetup</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline red--text">Are you sure ?</v-card-title>
            <v-card-text
              class="font-weight-bold mb-n5"
            >Do you really want to delete these records? This process cannot be undone.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey darken-4 darken-1" text @click="dialogDeleteBtn = false">Cancel</v-btn>
              <v-btn color="red darken-1" text @click="deteleMeetup">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- delete -->
        <v-spacer></v-spacer>

        <v-btn color="blue darken-1" text @click="dialogEditForm = false">Close</v-btn>
        <v-btn color="blue darken-1" text v-on:click="submitEditData">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    meetupData: Object
  },
  data() {
    return {
      dialogDeleteBtn: "",
      menuDate: "",
      dateInput: "",
      menuTime: "",
      timeInput: "",
      dialogEditForm: "",
      rulesInput: {
        required: value => !!value || "Required."
      },
      dataUpdate: {
        title: this.meetupData.title,
        location: this.meetupData.location,
        description: this.meetupData.description
      }
    };
  },
  computed: {
    sumbitableDateTime() {
      const datePicked = this.dateInput;
      let dateTime = new Date(datePicked);

      const [getHour, getMinute] = this.timeInput.split(":");

      dateTime = dateTime.setHours(getHour);
      dateTime = new Date(dateTime).setMinutes(getMinute);
      console.log(dateTime);
      return dateTime;
    }
  },
  created() {
    //  getDateTimeMeetup() {
    let date = this.meetupData.eventDate;
    date = new Date(date);
    let [month, day, year] = date.toLocaleDateString().split("/");
    day = day <= 9 ? `0${day}` : day;
    month = month <= 9 ? `0${month}` : month;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours <= 9 ? `0${hours}` : hours;
    minutes = minutes <= 9 ? `0${minutes}` : minutes;
    this.timeInput = `${hours}:${minutes}`;
    this.dateInput = `${year}-${month}-${day}`;

    // },
  },
  methods: {
    deteleMeetup() {
      const idDeletePost = this.meetupData.id;
      this.$store.dispatch("deleteMeetupPost", idDeletePost);
      this.$router.push("/meetups");
    },
    submitEditData() {
      console.log(this.meetupData);
      const oldTitle = this.meetupData.title;
      if (
        this.dataUpdate.title &&
        this.dataUpdate.location &&
        this.dataUpdate.description &&
        this.sumbitableDateTime
      ) {
        this.$store.dispatch("updateMeetupData", {
          ...this.dataUpdate,
          id: this.meetupData.id,
          eventDate: this.sumbitableDateTime
        });
        this.dialogEditForm = false;
        if (oldTitle != this.dataUpdate.title) this.$router.push("/meetups");
      } else {
        return false;
      }
    }
  }
};
</script>

<style>
</style>