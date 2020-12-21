import { createStore } from 'vuex'

export default createStore({
  state: {
    showNavbar: false,
    offset: 0
  },
  mutations: {
    enableNavbar(state) { 
      state.showNavbar = true; 
    },
    disableNavbar(state) {
      state.showNavbar = false;
    },
    incrementOffset(state) {
      state.offset++;
    },
    decrementOffset(state) {
      state.offset--;
    }
  },
  actions: {
  },
  modules: {
  }
})
