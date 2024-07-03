const jwt = require("jsonwebtoken")

const { auth } = require("../config/index.config")
const users = require("../models/user.model")

const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"]

  if (!authHeader) {
    return res.status(403).json({
      auth: false,
      message: "No token provided"
    })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(403).json({
      auth: false,
      message: "Malformed token"
    })
  }

  jwt.verify(
    token,
    auth.secretKey,
    (err, decoded) => {
      if (err) {
        return res.status(500).json({
          auth: false,
          message: "Failed to authentication token"
        })
      }

      const user = users.find(user => user.id === decoded.id)
      if (!user) {
        return res.status(404).json('User not found')
      }

      req.userId = decoded.id

      next();
    }
  )
}

module.exports = authentication