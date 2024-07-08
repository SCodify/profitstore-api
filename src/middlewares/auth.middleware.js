const jwt = require("jsonwebtoken")

const { auth } = require("../config/index.config")
const userModel = require("../models/user.model")

const authentication = async (req, res, next) => {
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    return res.status(403).json({
      auth: false,
      message: "No se proporciona token"
    })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(403).json({
      auth: false,
      message: "Token Malformado"
    })
  }

  try {
    const decoded = jwt.verify(token, auth.secretKey)
    const user = await userModel.findById(decoded.id)
    if (!user) {
      return res.status(404).json('Usuario no encontrado')
    }

    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(500).json({
      auth: false,
      message: "Fallo en la autenticación del token"
    })
  }
}

module.exports = authentication