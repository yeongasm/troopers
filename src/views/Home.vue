<template>
  <div>
    <div class="table-container">
      <table>
        <thead class="table-header">
          <tr class="table-row head">
            <th class="col col-0">Name</th>
            <th class="col col-1">Phone Number</th>
            <th class="col col-2">Date Of Birth</th>
            <th class="col col-3">Address</th>
          </tr>
        </thead>
        <tbody class="flex-col">
          <tr v-for="(user, index) in listOfUsers" :key="index" :class="'table-row data'">
            <td v-for="(col, key) in user" :key="key" :class="`col col-${key}`">{{ col }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Users from '@/controller/user';
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const displayOrder = ['name', 'phone', 'dateOfBirth', 'address'];
    const listOfUsers = ref([]);

    onMounted(async () => {
      const users = await Users.fetchUsers();
      users.forEach(user => {
        let info = [];
        displayOrder.forEach(param => {
          info.push(user[param]);
        });
        listOfUsers.value.push(info);
      });
    });

    return {
      listOfUsers
    }
  }
}
</script>
