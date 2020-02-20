import Vue from 'vue'
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import "firebase/database";
import App from './App.vue'
import router from './router'
import store from './store'
import textTruncate from "@/filters/TextTruncate.js";
import dateFilter from "@/filters/dateFilter.js"
import vuetify from './plugins/vuetify';
import Alert from "@/components/Shared/Alert.vue";
import EditBtn from "@/components/Meetup/Edit/EditMeetup.vue";



Vue.config.productionTip = false

Vue.filter('dateFilter', dateFilter)
Vue.filter('textTruncate', textTruncate);

Vue.component('Alert', Alert);
Vue.component('EditBtn', EditBtn);



new Vue({
  router,
  store,
  vuetify,
  created() {
    firebase.initializeApp({
      apiKey: process.env.VUE_APP_APIKEYFB,
      authDomain: process.env.VUE_APP_authDomain,
      databaseURL: process.env.VUE_APP_databaseURL,
      projectId: process.env.VUE_APP_projectId,
      storageBucket: process.env.VUE_APP_storageBucket,
    });
    store.dispatch("loadMeetups");
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        store.dispatch("autoSignIn", user);
        store.dispatch('fetchUserData');
      }
    })
    // store.dispatch('fetchMeetupRegister');
  },
  render: h => h(App),
}).$mount('#app')

router.beforeEach((to, from, next) => {
  store.commit('setLoadingRouter', true);
  next();

});
router.afterEach(() => {
  store.commit('setLoadingRouter', false);
})