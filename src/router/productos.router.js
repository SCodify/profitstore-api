const { Router } = require('express')
const router = Router()

const { upload } = require('../middlewares/uploader.js')
const authentication = require("../middlewares/auth.middleware")

const productosController = require('../controllers/productos.controller')

router.get('/', productosController.getProductos)
router.get('/:pid', productosController.getProducto)
router.post('/', authentication, upload.single("imagen"), productosController.postProducto)
router.put('/:pid', authentication, upload.single("imagen"), productosController.putProducto)
router.patch('/:pid', authentication, upload.single("imagen"), productosController.patchProducto)

router.get('/detalles/:pid', authentication, productosController.getDetallesProducto);
router.post('/detalles/:pid', authentication, productosController.addDetalleProducto);
router.put('/detalles/:pid/:clave', authentication, productosController.updateDetalleProducto);
router.delete('/detalles/:pid/:clave', authentication, productosController.deleteDetalleProducto);

router.delete('/imagen/:pid', authentication, productosController.deleteProductImage);

router.delete('/:pid', authentication, productosController.deleteProducto)

module.exports = router