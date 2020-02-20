<template>
  <v-container class="text-center">
    <h1 class="mt-2">Create New Meetup</h1>
    <v-form class="mt-2">
      <v-row>
        <v-col cols="10" offset="1" md="6" lg="4" offset-lg="2">
          <v-text-field
            v-model="title"
            :rules="fillRules"
            prepend-icon="mdi-page-layout-header"
            label="Title"
            color="teal lighten-2"
          ></v-text-field>
          <!-- <v-text-field
            v-model="location"
            label="Location"
            hide-details="auto"
            :rules="fillRules"
            required
            color="teal lighten-2"
            prepend-icon="mdi-earth"
          ></v-text-field>-->

          <v-select
            v-model="location"
            color="teal lighten-2"
            prepend-icon="mdi-earth"
            :rules="fillRules"
            :items="['Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang', 'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 'Koh Kong', 'Kratié', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh', 'Preah Sihanouk', 'Preah Vihear', 'Pursat', 'Prey Veng', 'Ratanakiri', 'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takéo', 'Tboung Khmom']"
            label="Location"
            required
          ></v-select>
        </v-col>
        <v-col cols="10" offset="1" md="4" offset-md="0">
          <v-textarea
            v-model="description"
            outlined
            label="Description"
            append-icon="mdi-comment-text-outline"
            color="teal lighten-2"
          ></v-textarea>
        </v-col>
        <v-col cols="10" offset="1" md="6" lg="4" offset-lg="2" class="mt-n12">
          <v-file-input
            v-model="imageInput"
            color="deep-purple accent-4"
            show-size
            class="mt-3"
            label="Image Input"
            prepend-icon="mdi-camera"
            dense
            placeholder="Select your image"
          ></v-file-input>

          <v-menu
            ref="menu"
            v-model="timePicker.menu"
            :close-on-content-click="false"
            :return-value.sync="timePicker.timePicked"
            transition="scale-transition"
            offset-y
            max-width="350px"
            min-width="350px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="timePicker.timePicked"
                label="Arrange The Time"
                prepend-icon="mdi-timeline-clock-outline"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              ampm-in-title
              color="teal accent-4"
              v-if="timePicker.menu"
              v-model="timePicker.timePicked"
              scrollable
              full-width
              :landscape="$vuetify.breakpoint.smAndUp"
              @click:minute="$refs.menu.save(timePicker.timePicked)"
            ></v-time-picker>
          </v-menu>
          <!-- timerPicker -->

          <v-date-picker
            color="green lighten-1"
            full-width
            year-icon="mdi-star-outline"
            :first-day-of-week="1"
            v-model="datePicker.value"
            locale="km"
          ></v-date-picker>
        </v-col>
        <v-col cols="10" offset="1" md="4" offset-md="0" class="mt-n4">
          <v-img :src="imageUrl" contain max-height="300"></v-img>
        </v-col>
      </v-row>
      <v-btn outlined x-large color="green" :disabled="validationForm" @click="submitMeetup">
        <v-icon left>mdi-cloud-upload-outline</v-icon>Sumbit Meetup
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      location: "",
      description: "",
      imageUrl: "",
      timePicker: {
        timePicked: "",
        menu: false
      },
      datePicker: {
        value: ""
      },
      imageInput: null,
      fillRules: [value => !!value || "Please Fill The Input Form"]
    };
  },
  watch: {
    imageInput(value) {
      console.log(value);
      if (value) {
        const fileName = value.name;
        if (fileName.lastIndexOf(".") <= 0) {
          return alert("Somthing went wrong!");
        }
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
          this.imageUrl = fileReader.result;
        });
        fileReader.readAsDataURL(value);
      } else {
        this.imageUrl = "";
      }
    }
  },
  computed: {
    validationForm() {
      return (
        this.title == "" ||
        this.location == "" ||
        this.sumbitableDateTime == "" ||
        this.description == "" ||
        this.imageUrl == ""
      );
    },
    sumbitableDateTime() {
      const datePicked = this.datePicker.value;
      let dateTime = new Date(datePicked);

      const [getHour, getMinute] = this.timePicker.timePicked.split(":");

      dateTime = dateTime.setHours(getHour);
      dateTime = new Date(dateTime).setMinutes(getMinute);
      return dateTime;
    }
  },
  methods: {
    submitMeetup() {
      const meetupInput = {
        title: this.title.trim(),
        location: this.location,
        eventDate: this.sumbitableDateTime,
        description: this.description,
        imageUrl: this.imageInput,
        createdDate: new Date().getTime()
      };
      this.$store.dispatch("createNewMeetup", meetupInput);
      console.log("hi");
      this.$router.push("/meetups");
    },
    onImagePicked(event) {
      console.log(event.target.file);
      // const file = event.target.file[0];
    }
  }
};
</script>

<style></style>
