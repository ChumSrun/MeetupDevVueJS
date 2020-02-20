import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import "firebase/database";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    meetups: [],
    user: "",
    error: "",
    loading: false,
    loadingRouter: false,
    registerLoading: false,
  },
  getters: {
    getRegisterLoadingState(state) {
      return state.registerLoading;
    },
    getLoadingRouter(state) {
      return state.loadingRouter;
    },
    loadedAllMeetups(state) {
      return state.meetups.sort((mB, mA) => {
        return mA.createdDate - mB.createdDate;
      });
    },
    featureMeetups(state, getter) {
      return getter.loadedAllMeetups.slice(0, 4);
    },
    loadedMeetup(state) {
      return meetupTitle => {
        return state.meetups.find(value => {
          return value.title === meetupTitle;
        });
      };
    },
    getUser(state) {
      return state.user;
    },
    getLoading(state) {
      return state.loading;
    },
    getAlertMessage(state) {
      return state.error;
    }
  },
  mutations: {
    setRegisterLoadingState(state, payload) {
      state.registerLoading = payload;
    },
    setLoadingRouter(state, payload) {
      state.loadingRouter = payload;
    },
    setLoadMeetup(state, payload) {
      state.meetups = payload;
    },
    createNewMeetup(state, payload) {
      state.meetups.push(payload);
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setError(state, {
      message
    }) {
      state.error = message;
    },
    clearError(state) {
      state.error = "";
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setUpdatedMeetupData(
      state, {
        id,
        title,
        description,
        location,
        eventDate
      }
    ) {
      state.meetups.find(meetup => {
        if (meetup.id === id) {
          (meetup.title = title),
          (meetup.description = description),
          (meetup.location = location),
          (meetup.eventDate = eventDate);
        }
      });
    },
    deleteMeetupPostFromState(state, id) {
      state.meetups = state.meetups.filter(meetup => meetup.id !== id);
    },
    registerMeetup(state, payload) {
      state.user.regisMeetups.push(payload);
    },
    unRegisterMeetup(state, payload) {
      state.user.regisMeetups = state.user.regisMeetups.filter(
        value => value.fbKey !== payload
      );
    },
    setInfoUserName(state, {
      firstName,
      lastName
    }) {
      state.user.info.firstName = firstName;
      state.user.info.lastName = lastName;
    }
  },
  actions: {
    async updateUserNameToDatabase(context, {
      firstName,
      lastName
    }) {
      await firebase.database().ref('users/' + context.getters.getUser.id + "/info/").child(context.getters.getUser.keyInfo).update({
        firstName,
        lastName
      });
      context.commit("setInfoUserName", {
        firstName,
        lastName
      })
    },
    async registerMeetup(context, payload) {
      context.commit("setRegisterLoadingState", true);
      const res = await firebase
        .database()
        .ref("users/" + context.getters.getUser.id)
        .child("/register")
        .push(payload);
      context.commit("registerMeetup", {
        id: payload,
        fbKey: res.key
      });
      context.commit("setRegisterLoadingState", false);
    },
    async unRegisterMeetup(context, payload) {
      context.commit("setRegisterLoadingState", true);

      await firebase
        .database()
        .ref("users/" + context.getters.getUser.id + "/register/")
        .child(payload)
        .remove();
      context.commit("unRegisterMeetup", payload);
      context.commit("setRegisterLoadingState", false);
    },
    async deleteMeetupPost(context, id) {
      await firebase
        .database()
        .ref("meetups")
        .child(id)
        .remove();
      context.commit("deleteMeetupPostFromState", id);
    },
    autoSignIn(context, payload) {
      context.commit("setUser", {
        id: payload.uid,
        regisMeetups: []
      });
    },
    logout(context) {
      firebase.auth().signOut();
      context.commit("setUser", "");
    },
    async loadMeetups(context) {
      try {
        context.commit("setLoading", true);
        const data = await firebase
          .database()
          .ref("meetups")
          .once("value");
        const meetups = [];
        const dataObj = data.val();
        for (let key in dataObj) {
          meetups.push({
            id: key,
            title: dataObj[key].title,
            imageUrl: dataObj[key].imageUrl,
            location: dataObj[key].location,
            eventDate: dataObj[key].eventDate,
            createdDate: dataObj[key].createdDate,
            description: dataObj[key].description,
            userId: dataObj[key].userId
          });
        }
        context.commit("setLoading", false);
        context.commit("setLoadMeetup", meetups);
      } catch (error) {
        console.log(error);
      }
    },
    updateMeetupData(context, {
      id,
      title,
      location,
      description,
      eventDate
    }) {
      context.commit("setLoading", true);
      firebase
        .database()
        .ref("meetups")
        .child(id)
        .update({
          title,
          location,
          description,
          eventDate
        })
        .then(() => {
          context.commit("setUpdatedMeetupData", {
            id,
            title,
            location,
            description,
            eventDate
          });
          context.commit("setLoading", false);
        });
    },
    createNewMeetup(context, payload) {
      let imageUrl, key;
      firebase
        .database()
        .ref("meetups")
        .push({
          ...payload,
          userId: context.getters.getUser.id
        })
        .then(data => {
          key = data.key;
          // context.commit('createNewMeetup', {
          //   ...payload,
          //   userId: context.getters.getUser.id,
          //   id: data.key
          // });
          return key;
        })
        .then(key => {
          const imageName = payload.imageUrl.name;
          const extensionFile = imageName.slice(imageName.lastIndexOf("."));
          return firebase
            .storage()
            .ref("meetups/" + key + "." + extensionFile)
            .put(payload.imageUrl);
        })
        .then(fileData => {
          let fullPath = fileData.metadata.fullPath;
          return firebase
            .storage()
            .ref(fullPath)
            .getDownloadURL();
        })
        .then(url => {
          imageUrl = url;
          return firebase
            .database()
            .ref("meetups")
            .child(key)
            .update({
              imageUrl: imageUrl
            });
        })
        .then(() => {
          context.commit("createNewMeetup", {
            ...payload,
            imageUrl: imageUrl,
            userId: context.getters.getUser.id,
            id: key
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    signUpNewUser(context, {
      email,
      password,
      firstName,
      lastName
    }) {
      context.commit("setLoading", true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          // get user name
          firebase
            .database()
            .ref("users/" + user.user.uid + "/info")
            .push({
              firstName,
              lastName
            })
            .then((data) => {
              let keyInfo = data.key;
              const newUser = {
                id: user.user.uid,
                regisMeetups: [],
                keyInfo,
                info: {
                  firstName,
                  lastName,
                  keyInfo: data.key
                }
              };
              context.commit("setLoading", false);
              context.commit("setUser", newUser);
            });
        })
        .catch(error => {
          context.commit("setLoading", false);
          context.commit("setError", error);
          console.log(error);
        });
    },
    async fetchUserData(context) {
      const res = await firebase
        .database()
        .ref("users/" + context.getters.getUser.id + "/register/")
        .once("value");
      const data = res.val();
      const registeredMeetups = [];
      for (let key in data) {
        let meetupRegisted = {
          id: data[key],
          fbKey: key
        };
        registeredMeetups.push(meetupRegisted);
      }
      const resUserInfo = await firebase.database().ref('users/' + context.getters.getUser.id + '/info').once("value");
      const dataInfo = resUserInfo.val();
      let userInfo = [];
      let userInfoKey;
      for (const key in dataInfo) {
        userInfoKey = key;
        userInfo.push(dataInfo[key]);
      }
      const user = userInfo[0];
      context.commit("setUser", {
        id: context.getters.getUser.id,
        regisMeetups: registeredMeetups,
        keyInfo: userInfoKey,
        info: user
      });
    },
    signIn(context, {
      email,
      password
    }) {
      context.commit("setLoading", true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          context.commit("setLoading", false);
          const idUser = user.user.uid;
          const newUser = {
            id: idUser,
            regisMeetups: []
          };
          context.commit("setUser", newUser);
        })
        .catch(error => {
          context.commit("setError", error);
          context.commit("setLoading", false);
        });
    }
  },
  modules: {}
});