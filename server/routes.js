const express = require('express');
const router = express.Router();
const UserModel = require('./model');

router.post('/users', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userId = await UserModel.createUser( email, password);
    res.status(201).json({ userId, message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.getUser(email, password);

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
