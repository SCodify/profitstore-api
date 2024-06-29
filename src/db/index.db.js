const path = require("path")

const multer = require("multer")
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../../public/uploads"))
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const fileTypes = /jpeg|jpg|png/
    const mimeType = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())

    if(mimeType && extname) {
      return callback(null, true)
    }

    callback("Error: tipo de archivo no soportado")
  },
  limits: { fieldSize: 1024 * 1024 * 1 }
})

const uploadPath = path.join(__dirname, "../../public/uploads");

module.exports = {
  upload,
  uploadPath
}