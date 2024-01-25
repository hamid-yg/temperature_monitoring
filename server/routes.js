// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserModel = require('./model');

router.post('/users', async (req, res) => {
  const { username, email } = req.body;

  try {
    const userId = await UserModel.createUser(username, email);
    res.status(201).json({ userId, message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.getUser(userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/users', async (req, res) => {
    const { userRole } = req.query;

    try {
        const users = await UserModel.getUsers(userRole);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
