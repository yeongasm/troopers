<template>
    <div id="login" class="flex-row flex-middle flex-justify">
        <div class="login-form flex-col flex-start flex-justify">
            <div class="title center-wrapper">Hello! 👋🏻</div>
            <input class="textbox" v-model="username" type="text" placeholder="Username"/>
            <input class="textbox" v-model="password" type="password" placeholder="Password"/>
            <div class="center-wrapper">
                <button class="btn" @click="submitForm">Sign In</button>
            </div>
            <div class="center-wrapper subtext">Not a user?&nbsp;
                <router-link to="/create">Create an account!</router-link>
            </div>
            <ErrorBox :message="errBox.msg" :display="errBox.show"/>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue'
import auth from '../controller/auth';

import ErrorBox from '../components/ErrorBox';

export default {
    components: {
        ErrorBox
    },
    setup() {
        const store = useStore();
        const router = useRouter();

        let username = ref('');
        let password = ref('');
        
        const errBox = ref({
            msg: 'Username or Password is invalid. Please try again.',
            show: false
        });

        const submitForm = async () => {
            if (!username.value.length || !password.value.length) {
                errBox.value.msg = 'Username or Password can not be empty.';
                errBox.value.show = true;
                setTimeout(() => errBox.value.show = false, 10000);
                return;
            }

            if (await auth.login(username.value, password.value)) {
                router.go();
            } else {
                errBox.value.msg = 'Username or Password is invalid. Please try again.';
                errBox.value.show = true;
                setTimeout(() => errBox.value.show = false, 10000);
            }
        };

        onMounted(() => {
            window.addEventListener('keyup', (e) => {
                if (e.key == 'Enter')
                    submitForm();
            });
        });

        return {
            username,
            password,
            errBox,
            submitForm
        }
    }
}
</script>

<style lang="scss"></style>