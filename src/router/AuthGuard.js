import store from "@/store"
const authGuard = (to, from, next) => {
  if (store.getters.getUser) {
    next()
  } else {
    next('/signin')
  }
}

export default authGuard;