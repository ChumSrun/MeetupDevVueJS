<template>
  <header>
    <v-progress-linear
      :active="statusLoadingRoute"
      :indeterminate="statusLoadingRoute"
      absolute
      color="teal accent-4"
    ></v-progress-linear>
    <v-app-bar class="pb-12 transparent" absolute flat>
      <v-app-bar-nav-icon @click="navDraw = !navDraw"></v-app-bar-nav-icon>

      <v-toolbar-title id="titlePadding0" class="mx-auto">
        <router-link to="/" tag="span" style="cursor:pointer">🐱‍💻MeetDevApp🐱‍💻</router-link>
      </v-toolbar-title>
      <template v-slot:extension>
        <v-tabs centered color="teal accent-4">
          <template v-for="(item, index) in menuItems">
            <v-tab :key="index" v-if="item.icon !== 'mdi-sticker-plus-outline'" :to="item.link">
              <v-icon left>{{ item.icon }}</v-icon>
              {{ item.text }}
            </v-tab>
          </template>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-navigation-drawer absolute temporary v-model="navDraw">
      <template v-if="getUserInfo" v-slot:prepend>
        <router-link to="./profile" tag="span" style="cursor: pointer">
          <v-list-item two-line>
            <v-list-item-avatar>
              <img :src="imageComputed" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{"Something"&&getUserInfo.info.firstName}} {{getUserInfo.info.lastName||"Wrong"}}</v-list-item-title>
              <v-list-item-subtitle>Logged In</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </template>

      <v-divider></v-divider>
      <v-list>
        <v-subheader>Menu</v-subheader>

        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in menuItems" :key="i" :to="item.link" exact>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="getUserInfo" @click="logoutUser">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-switch v-model="$vuetify.theme.dark" hide-details inset label="Dark Mode" class="ml-6"></v-switch>
      </v-list>
    </v-navigation-drawer>
  </header>
</template>

<script>
export default {
  mounted() {
    document
      .querySelector(
        "#app > div > header > header > div.v-toolbar__extension > div > div > div.v-slide-group__prev.v-slide-group__prev--disabled"
      )
      .remove();
  },
  data() {
    return {
      navDraw: false
    };
  },
  watch: {
    $route(to) {
      const sliderTabs = document.querySelector(".v-tabs-slider");
      if (to.path == "/") {
        sliderTabs.style.color = "white";
      } else {
        sliderTabs.style.color = "teal";
      }
    }
  },
  computed: {
    imageComputed() {
      return (
        this.$store.state.imagePreUpload ||
        this.$store.state.user.info.imageProfileInput
      );
    },
    statusLoadingRoute() {
      return this.$store.getters.getLoadingRouter;
    },
    getUserInfo() {
      return this.$store.getters.getUser;
    },
    menuItems() {
      let allMenu = [
        {
          text: "View Meetups",
          icon: "mdi-account-group-outline",
          link: "/meetups"
        },
        { text: "Sign In", icon: "mdi-account-key-outline", link: "/signin" }
      ];
      if (this.getUserInfo) {
        allMenu = [
          {
            text: "View Meetups",
            icon: "mdi-account-group-outline",
            link: "/meetups"
          },
          {
            text: "Organizate Meetup",
            icon: "mdi-sticker-plus-outline",
            link: "/createmeetup"
          },
          { text: "Profiles", icon: "mdi-face", link: "/profile" }
        ];
      }
      return allMenu;
    }
  },
  methods: {
    logoutUser() {
      this.$store.dispatch("logout");
      this.$router.push("/meetups");
    }
  }
};
</script>

<style scoped>
#titlePadding0 {
  padding-left: 0 !important;
}
</style>
