const { Router } = require('express')
const router = Router()
const { upload } = require('../middlewares/uploader.js')
const productosController = require('../controllers/productos.controller')

router.get('/', productosController.getProductos)
router.get('/:pid', productosController.getProducto)
router.post('/',upload.single("imagen"), productosController.postProducto)
router.put('/:pid', upload.single("imagen"), productosController.putProducto)
router.patch('/:pid',upload.single("imagen"),  productosController.patchProducto)
router.delete('/imagen/:pid', productosController.deleteProductImage);
router.delete('/:pid', productosController.deleteProducto)

module.exports = router