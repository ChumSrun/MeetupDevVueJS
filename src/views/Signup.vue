<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" xl="4" offset-xl="4" class="text-center">
        <h1 class="mb-6">Sign Up Forms</h1>
        <Alert v-if="error" @dissmissed="onDismissed" :message="error"></Alert>
        <v-row class="mb-n3">
          <v-col cols="6">
            <v-text-field
              v-model="firstName"
              label="First Name"
              :rules="[ruleInput.required]"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="lastName"
              label="Last Name"
              :rules="[ruleInput.required]"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          v-model="email"
          label="Email"
          :rules="emailRules"
          outlined
          hide-details="auto"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field>

        <v-text-field
          v-model="passwordInputValue"
          label="Password"
          loading
          :append-icon="
            passwordInputData.show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          counter
          :rules="[ruleInput.required, ruleInput.min]"
          :type="passwordInputData.show ? 'text' : 'password'"
          @click:append="passwordInputData.show = !passwordInputData.show"
        >
          <template v-slot:progress>
            <v-progress-linear :value="progressComputed" :color="color" absolute height="4"></v-progress-linear>
          </template>
        </v-text-field>

        <v-text-field
          v-model="passwordConfirm"
          label="Confirm Password"
          :append-icon="
            passwordInputData.show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :rules="[ruleInput.required, ruleInput.min, matchedPassword]"
          :type="passwordInputData.show ? 'text' : 'password'"
          @click:append="passwordInputData.show = !passwordInputData.show"
        ></v-text-field>

        <v-dialog v-model="getLoading" persistent width="400">
          <v-card color="success" dark>
            <v-card-text class="text-center">
              Please stand by for me!
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>

        <div class="d-flex mx-auto" style=" width: 90%">
          <v-btn to="/signin" text class="ml-n8 mt-3 blue--text">Sign In instead</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            style="width:130px"
            :disabled="!validationSignupForm"
            x-large
            outlined
            color="green accent-4"
            @click.prevent="signUpUser"
          >Sign up</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      passwordInputData: {
        show: false
      },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      ruleInput: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters"
      },
      passwordInputValue: "",
      passwordConfirm: "",
      submitablePassword: "",
      email: "",
      lastName: "",
      firstName: ""
    };
  },
  watch: {
    passwordConfirm(value) {
      if (value === this.passwordInputValue) {
        this.submitablePassword = value;
      } else {
        this.submitablePassword = "";
      }
    },
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    getLoading() {
      return this.$store.getters.getLoading;
    },
    error() {
      return this.$store.getters.getAlertMessage;
    },
    progressComputed() {
      return Math.min(100, this.passwordInputValue.length * 10);
    },
    color() {
      return ["error", "warning", "success"][
        Math.floor(this.progressComputed / 40)
      ];
    },
    matchedPassword() {
      return this.passwordInputValue === this.passwordConfirm
        ? true
        : "Password Do Not Match";
    },
    validationSignupForm() {
      return (
        this.submitablePassword != "" &&
        /.+@.+\..+/.test(this.email) &&
        this.matchedPassword == true &&
        this.firstName.trim() &&
        this.lastName.trim()
      );
    }
  },
  methods: {
    signUpUser() {
      const newUser = {
        email: this.email.trim(),
        password: this.submitablePassword,
        firstName: this.firstName,
        lastName: this.lastName
      };
      this.$store.dispatch("signUpNewUser", newUser);
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  }
};
</script>

<style></style>
