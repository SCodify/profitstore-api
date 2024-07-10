const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const { auth } = require('../config/index.config')
const userModel = require("../models/user.model")
const authModel = require("../models/auth.model")

const authController = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body

      const hashedPassword = bcrypt.hashSync(password, 10)

      const newUser = await userModel.create(username, hashedPassword)

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        user: { id: newUser.id, username: newUser.username }
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error al registrar un nuevo usuario',
        error: error.message
      })
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body

      const user = await userModel.findByUsername(username)
      if (!user) {
        return res.status(404).json('Usuario no encontrado')
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

      res.status(200).json({
        auth: true,
        token
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error al iniciar sesión',
        error: error.message
      })
    }
  },

  protected: async (req, res) => {
    try {
      const user = await userModel.findById(req.userId)
      if (!user) {
        return res.status(404).json('Usuario no encontrado')
      }
      res.json({
        auth: true,
        message: 'Acceso al recurso protegido concedido',
        user: { id: user.id, username: user.username }
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error al acceder a un recurso protegido',
        auth: false,
        error: error.message
      })
    }
  },

  revokeToken: async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      
      await authModel.insertRevokedToken(token);
      
      res.status(200).json({
        auth: false,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error al revocar el token:', error);
      res.status(500).json({
        message: 'Error al revocar el token'
      });
    }
  }
}

module.exports = authController