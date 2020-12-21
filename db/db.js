const config = require('./db.config');
//const bcrypt = require('bcrypt');
const { Sequelize  } = require('sequelize');

const sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        pool: config.pool
    }
);

const userModel = require('../models/user.model');
const sessionModel = require('../models/session.model');

userModel.register(sequelize);
sessionModel.register(sequelize);

module.exports = sequelize;