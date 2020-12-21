const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const required = ['username', 'password', 'name'];

let userModel = {};

const getUsersParameters = ['offset', 'limit'];
const wantedFields = ['name', 'phone', 'address', 'dateOfBirth'];

module.exports = {

    validate(data) {
        for (const field of required) {
            if (data[field] == undefined)
                return { success: false, msg: field + ' is not defined.' };

            if (!data[field].length)
                return { success: false, msg: field + ' cannot be empty.' };
        }
        return { success: true };
    },

    register(sequelize) {
        userModel = sequelize.define('Users', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: { 
                type: DataTypes.STRING 
            },
            address: { 
                type: DataTypes.STRING 
            },
            dateOfBirth: { 
                type: DataTypes.STRING 
            }
        }, { 
            timestamps: true,
        });
    },

    validateGetUsersRequest(query) {
        for (const param of getUsersParameters) {
            if (!query.hasOwnProperty(param))
                return { success: false, msg: param + ' is not defined.' };
        }
        return { success: true, values: getUsersParameters };
    },

    async getUserInfo(cookie) {
        if (cookie._userSession == undefined)
            return false;
        
        const data = JSON.parse(cookie._userSession);
        let user = await userModel.findOne({
            raw: true,
            where: {
                username: data.username
            }
        });

        if (!user)
            return false;

        const info = {};
        wantedFields.forEach(field => { info[field] = user[field]; });
        return info;
    },

    async getUsers(data) {
        let users = await userModel.findAll({
            raw: true,
            limit: data.limit,
            offset: data.offset
        });

        if (!users)
            return false;
        
        let queriedUsers = [];
        users.forEach(element => {
            let user = {};
            wantedFields.forEach(field => { user[field] = element[field]; });
            queriedUsers.push(user);
        });
        return queriedUsers;
    },

    hashifyPassword(pwd) {
        return bcrypt.hashSync(pwd, bcrypt.genSaltSync());
    },

    doesPwdMatches(pwd1, pwd2) {
        return bcrypt.compareSync(pwd1, pwd2);
    }
};