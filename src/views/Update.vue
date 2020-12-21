<template>
  <div id="update">
    <div class="title orange">Update Your Information</div>
    <div class="underline"></div>
    <div class="update-container">
      <div v-for="(param, i) in paramList" :key="i" class="flex-row flex-left flex-middle">
        <span class="update-field">{{ paramString[param] }}</span>
        <input class="textbox constraint-textbox-width" :type="paramType[i]" 
        v-model="userInformation[param]" :disabled="paramEditDisabled[i]"/>
      </div>
    </div>
    <div class="flex-row flex-middle flex-right update-btn-container">
      <button class="btn grey" @click="goBack">Cancel</button>
      <button class="btn" @click="updateInformation">Update</button>
    </div>
    <ErrorBox :message="errorBox.msg" :display="errorBox.show"/>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import Users from '@/controller/user';
import { useRouter } from 'vue-router';
import ErrorBox from '@/components/ErrorBox';

export default {
  components: {
    ErrorBox
  },
  setup() {
    const router = useRouter();

    const paramList = ref(['name', 'phone', 'dateOfBirth', 'address']);
    const paramType = ref(['text', 'number', 'text', 'text']);
    const paramEditDisabled = ref([false, false, true, false]);
    const paramString = ref({
      name: 'Name',
      phone: 'Phone',
      dateOfBirth: 'Date Of Birth',
      address: 'Address'
    });

    let userInformation = ref({});
    
    const errorBox = ref({
      msg: 'Unable to update account at the moment. Please try again later. 😭',
      show: false
    });

    onMounted(async () => {
      userInformation.value = await Users.getCurrentUser();
    });

    const goBack = () => { router.go(-1); };

    const updateInformation = async () => {
      //console.log('userInformation.value > ', userInformation);
      const result = await Users.updateUser(userInformation.value);
      if (!result) {
        errorBox.value.show = true;
        setTimeout(() => errorBox.value.show = false, 10000);
        return;
      }
      router.push('/');
    };

    return {
      paramList,
      paramType,
      paramEditDisabled,
      paramString,
      userInformation,
      goBack,
      errorBox,
      updateInformation
    }
  }
}
</script>
