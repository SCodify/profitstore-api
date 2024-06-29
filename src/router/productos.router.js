const { Router } = require('express')
const router = Router()

const productosController = require('../controllers/productos.controller')

router.get('/', productosController.getProductos)
router.get('/:tid', productosController.getProducto)
router.post('/', productosController.postProducto)
router.put('/:tid', productosController.putProducto)
router.patch('/:tid', productosController.patchProducto)
router.delete('/:tid', productosController.deleteProducto)

module.exports = router