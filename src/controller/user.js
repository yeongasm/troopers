import axios from 'axios';

export default {
    async fetchUsers() {
        try {
            let { data } = await axios.get('/users', {
                params: {
                    limit: 100,
                    offset: 0
                }
            });
            return data.users;
        } catch(e) {
            console.log('e > ', e);
            return false;
        }
    },

    async getCurrentUser() {
        try {
            let { data } = await axios.get('/user');
            return data;
        } catch(e) {
            return false;
        }
    },

    async updateUser(userData) {
        try {
            let { data } = await axios.patch('/user', userData);
            return data;
        } catch (e) {
            console.log('e > ', e);
            return false;
        }
    },

    async createNewUser(userData) {
        try {
            let { data} = await axios.post('/user', userData)
            return data;
        } catch (e) {
            console.log('e > ', e);
            return false;
        }
    }
}