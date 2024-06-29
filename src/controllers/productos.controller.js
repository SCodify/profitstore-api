const productosModel = require('../models/productos.model')

const productoController = {

  getProductos: async (req, res) => {
    try {
      const productos = await productosModel.getAllProductos();

      if (productos.length === 0) {
        return res.status(404).json({ error: 'No se encontraron productos' });
      }

      res.json(productos);
    } catch (error) {
      console.error('Error en getProductos:', error);
      res.status(500).json({ error: error.message });
    }
  },

  getProducto: async (req, res) => {
    const { pid } = req.params;

    try {
      const producto = await productosModel.getProductoById(pid);

      if (!producto) {
        return res.status(404).json({ error: "No se encontró el producto" });
      }

      res.json(producto);
    } catch (error) {
      console.error('Error en getProducto:', error);
      res.status(500).json({ error: error.message });
    }
  },


}

module.exports = productoController