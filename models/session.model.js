const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const loginRequirements = ['username', 'password'];

let sessionModel = {};

module.exports = {
    validateLoginRequest(data) {
        for (const field of loginRequirements) {
            if (data[field] == undefined )
                return { success: false, msg: field + ' is not defined.' };

            if (!data[field].length)
                return { success: false, msg: field + ' cannot be empty.' };
        }
        return { success: true };
    },

    // validate(data) {
    //     return true;
    // },

    register(sequelize) {
        sessionModel = sequelize.define('Session', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, { timestamps: false });
    },

    async isUserLoggedIn(cookie) {
        if (cookie._userSession == undefined)
            return false;

        const session = JSON.parse(cookie._userSession);
        const result = await sessionModel.findOne({ 
            where: { 
                username: session.username 
            }
        });

        if (!result)
            return false;
        
        const row = result.dataValues;
        if (row.token != session.token) {
            sessionModel.destroy({
                where: {
                    username: session.username
                }
            });
            return false;
        }
        return true;
    },

    async loginUser(username) {
        const timestamp = new Date().toString();
        const token = bcrypt.hashSync(timestamp, bcrypt.genSaltSync());
        sessionModel.findOne({
            where: {
                username: username
            }
        }).then((session) => {
            session.update({ token: token });
        }).catch((error) => {
            const session = sessionModel.build({
                username: username,
                token: token
            });
            session.save();
        });
        return token;
    },

    logoutUser(cookies) {
        const session = JSON.parse(cookies._userSession);        
        sessionModel.destroy({
            where: {
                username: session.username
            }
        });
    }
}