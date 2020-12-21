import axios from 'axios';

export default {

    async isLoggedIn() {
        try {
            const { data } = await axios.get('/authenticated');
            return true;
        } catch(e) {
            return false;
        }
    },

    async login(username, password) {
        try {
            let result = await axios.post('/login', {
                username: username,
                password: password
            });
            return true;
            //return result.status == 200;
        } catch(e) {
            console.log('e > ', e);
        }
        return false;
    },

    async logout() {
        try {
            const { data } = await axios.post('/logout');
            return true;
        } catch (e) {
            return false;
        }
    }
}
