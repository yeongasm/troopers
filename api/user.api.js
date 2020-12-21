const express = require('express');
const db = require('../db/db');
const router = new express.Router();

const userModel = require('../models/user.model');
const sessionModel = require('../models/session.model');

router.get('/authenticated', async (req, res) => {
    let result = await sessionModel.isUserLoggedIn(req.cookies);
    if (!result) {
        res.status(401).clearCookie('_userSession').send(false);
        return;
    }
    res.status(201).send(true);
});

router.get('/user', async (req, res) => {
    const userInfo = await userModel.getUserInfo(req.cookies);
    if (!userInfo) {
        res.status(400).json({ msg: 'Unable to retrieve user from database.' });
        return;
    }
    res.status(200).json(userInfo);
});

router.get('/users', async (req, res) => {
    const params = userModel.validateGetUsersRequest(req.query);
    if (!params.success) {
        res.status(400).json({
            msg: params.msg
        });
        return;
    }

    const data = {};
    params.values.forEach(param => {
        data[param] = parseInt(req.query[param]);
    });

    const users = await userModel.getUsers(data);
    
    if (!users) {
        res.status(400).json({ msg: 'Unable to retieve users list from database.' });
        return;
    }

    res.status(200).json({ users: users });
});

router.post('/user', async (req, res) => {
    let data = req.body;
    const validify = userModel.validate(data);
    if (!validify.success) {
        res.status(400).json({
            msg: validify.msg
        });
        return;
    }
    data.password = userModel.hashifyPassword(data.password);
    const user = db.models.Users.build(data);
    await user.save();
    res.status(200).json({
        msg: 'User created successfully.'
    });
});

router.patch('/user', async (req, res) => {
    const cookie = JSON.parse(req.cookies._userSession);
    const data = req.body;
    console.log('data > ', data);
    db.models.Users.findOne({
        where: {
            username: cookie.username
        }
    }).then((user) => {
        user.update({
            name: data.name,
            phone: data.phone,
            address: data.address
        }).then((result) => {
            res.status(200).send(true);
        }).catch((error) => {
            res.status(400).json({ msg: 'Unable to update entry in database.' });
        })
    }).catch((error) => {
        res.status(400).json({ msg: 'Unable to fetch user from current session.' });
    });
});

router.post('/login', async (req, res) => {
    const data = req.body;
    const validify = sessionModel.validateLoginRequest(data);
    if (!validify.success) {
        res.status(404).json({ msg: validify.msg });
        return;
    }

    let Users = db.models.Users;
    const result = await Users.findOne({
        where: {
            username: data.username
        }
    });

    if (!result) {
        res.status(404).json({ msg: 'User does not exist.' });
        return;
    }
    
    const { password } = result.dataValues;
    if (!userModel.doesPwdMatches(data.password, password)) {
        res.status(400).json({ msg: 'Invalid password.' });
        return;
    }

    const token = await sessionModel.loginUser(data.username);
    res.status(200).cookie('_userSession', JSON.stringify({
        username: data.username,
        token: token
    })).send(true);
});

router.post('/logout', (req, res) => {
    sessionModel.logoutUser(req.cookies);
    res.status(200).clearCookie('userSession').send(true);
});

module.exports = router;