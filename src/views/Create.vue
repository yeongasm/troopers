<template>
  <div id="create">
    <div class="title orange">Create Account</div>
    <div class="underline"></div>
    <div class="update-container">
      <div
        v-for="(param, i) in paramList"
        :key="i"
        class="flex-row flex-left flex-middle"
      >
        <span class="update-field flex-row flex-left flex-middle">
            {{ paramString[param] }}
            <span class="asterisk" v-if="paramRequired[i]">*</span>
        </span>
        <input
          class="textbox constraint-textbox-width"
          :type="paramType[i]"
          v-model="newUserInformation[param]"
          :required="paramRequired[i]"
        />
      </div>
    </div>
    <div class="flex-row flex-middle flex-right create-btn-container">
      <button class="btn grey" @click="goBack">Cancel</button>
      <button class="btn" @click="createNewUser">Create</button>
    </div>
    <ErrorBox :message="errorBox.msg" :display="errorBox.show"/>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Users from "@/controller/user";
import { useRouter } from "vue-router";
import ErrorBox from '@/components/ErrorBox';

export default {
  components: {
    ErrorBox
  },
  setup() {
    const router = useRouter();

    const paramList = ref([
      "username",
      "password",
      "name",
      "dateOfBirth",
      "phone",
      "address",
    ]);
    const paramType = ref([
      "text",
      "password",
      "text",
      "date",
      "number",
      "text",
    ]);
    const paramRequired = ref([true, true, true, true, false, false]);
    const paramString = ref({
      username: "Username",
      password: "Password",
      name: "Name",
      dateOfBirth: "Date Of Birth",
      phone: "Phone",
      address: "Address",
    });

    let newUserInformation = ref({});

    const errorBox = ref({
      msg: 'Unable to update account at the moment. Please try again later. 😭',
      show: false
    });

    const goBack = () => {
      router.go(-1);
    };

    const createNewUser = async () => {
        for (let i = 0; i < paramList.value.length; i++) {
            const param = paramList.value[i];
            if (!newUserInformation.value[param] && paramRequired.value[i]) {
                errorBox.value.msg = paramString.value[param] + ' cannot be empty!';
                errorBox.value.show = true;
                setTimeout(() => errorBox.value.show = false, 10000);
                return;
            }
        }

        const result = await Users.createNewUser(newUserInformation.value);

        if (!result) {
            errorBox.value.msg = 'Unable to update account at the moment. Please try again later. 😭';
            errorBox.value.show = true;
            setTimeout(() => errorBox.value.show = false, 10000);
            return;
        }

        router.push("/login");
    };

    return {
      paramList,
      paramType,
      paramRequired,
      paramString,
      newUserInformation,
      goBack,
      errorBox,
      createNewUser,
    };
  },
};
</script>