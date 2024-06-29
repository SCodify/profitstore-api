const { Router } = require('express')
const router = Router()

const productosController = require('../controllers/productos.controller')

router.get('/', productosController.getProductos)
router.get('/:pid', productosController.getProducto)
//router.post('/', productosController.postProducto)
//router.put('/:pid', productosController.putProducto)
//router.patch('/:pid', productosController.patchProducto)
//router.delete('/:pid', productosController.deleteProducto)

module.exports = router