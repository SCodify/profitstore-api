const authRouter = require('./auth.router.js')
const productosRouter = require('./productos.router.js')

const router = (app) => {
  app.use('/api/auth', authRouter),
  app.use('/api/productos', productosRouter)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  })
}

module.exports = router