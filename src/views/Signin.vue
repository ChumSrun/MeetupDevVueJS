<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2" xl="4" offset-xl="4" class="text-center">
        <h1 class="mb-6">Sign In Your Account</h1>
        <Alert v-if="error" @dissmissed="onDismissed" :message="error"></Alert>

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
          label=" Password"
          :append-icon="
            passwordInputData.show ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
          "
          :rules="[ruleInput.required]"
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
          <v-btn to="/signup" text class="ml-n8 mt-3 blue--text">Create Account</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            style="width:130px"
            :disabled="!validationSignupForm"
            x-large
            outlined
            color="green accent-4"
            @click.prevent="signInUser"
          >Sign In</v-btn>
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
      ruleInput: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters"
      },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      passwordInputValue: "",
      email: ""
    };
  },
  watch: {
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    getLoading() {
      return this.$store.getters.getLoading;
    },
    user() {
      return this.$store.getters.getUser;
    },
    alertErrorMessage() {
      return this.$store.getters.getAlertMessage;
    },
    validationSignupForm() {
      return this.passwordInputValue != "" && /.+@.+\..+/.test(this.email);
    },
    error() {
      return this.$store.getters.getAlertMessage;
    }
  },
  methods: {
    signInUser() {
      const newUser = {
        email: this.email.trim(),
        password: this.passwordInputValue
      };
      this.$store.dispatch("signIn", newUser);
    },
    onDismissed() {
      this.$store.commit("clearError");
    }
  }
};
</script>

<style></style>
