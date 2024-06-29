const productosRouter = require('./productos.router.js')

const router = (app) => {
  app.use('/api/productos', productosRouter)
}

module.exports = router