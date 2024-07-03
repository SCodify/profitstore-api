const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const { auth } = require('../config/index.config')
const users = require("../models/user.model")

const userController = {
  register: async (req, res) => {
    const { username, password } = req.body

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = { id: Date.now(), username, password: hashedPassword }

    users.push(newUser)

    const token = jwt.sign(
      { id: newUser.id },
      auth.secretKey,
      { expiresIn: auth.tokenExpiresIn }
    )

    console.log(users);

    res.status(201).json({
      auth: true,
      token
    })
  },

  login: async (req, res) => {
    const { username, password } = req.body

    const user = users.find(user => user.username === username)
    if (!user) {
      return res.status(404).json('User not found')
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if (!passwordIsValid) {
      return res.status(401).json({
        auth: false,
        token: null
      })
    }

    const token = jwt.sign(
      { id: user.id },
      auth.secretKey,
      { expiresIn: auth.tokenExpiresIn }
    )

    res.status(201).json({
      auth: true,
      token
    })
  },

  protected: (req, res) => {
    res.json({
      userId: req.userId
    })
  }
}

module.exports = userController