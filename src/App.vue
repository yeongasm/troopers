<template>
    <div v-if="showHeader" class="flex-row flex-right flex-middle header-bar">
      <router-link class="unanchor link" to="/update">Update Profile</router-link>&nbsp;|&nbsp;
      <span class="link" @click="logOut">Log out</span>
    </div>
  <router-view/>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, onMounted, reactive } from 'vue'
import Authentication from './controller/auth';

export default {
  setup() {

    const store = useStore();
    const router = useRouter();
    const loginRedirect = { login: 1, create: 1 };

    const getCurrentLocation = () => {
      const url = window.location.href;
      const segments = url.split('/');
      const location = segments[segments.length - 1];
      return location;
    };

    onMounted(async () => {
      const location = getCurrentLocation();
      let loggedIn = await Authentication.isLoggedIn();
      if (!loggedIn) {
        if (!loginRedirect[location])
          router.push('/login');
      } else {
        store.commit('enableNavbar');
        if (loginRedirect[location])
          router.push('/');
      }
    });

    const logOut = () => {
      if (Authentication.logout()) {
        setTimeout(() => store.commit('disableNavbar'), 1);
        router.go();
      }
    };

    return {
      showHeader: computed(() => {
        return store.state.showNavbar;
      }),
      logOut
    }
  }
}

</script>

<style lang="scss"></style>
