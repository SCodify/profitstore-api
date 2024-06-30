const productosModel = require('../models/productos.model')
const fs = require('fs').promises
const path = require('path')
const { uploadPath } = require('../middlewares/uploader')
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
  postProducto: async (req, res, next) => {},
  putProducto: async (req, res, next) => {},
  patchProducto: async (req, res, next) => {},
  deleteProductImage: async (req, res, next) => {
    const { pid } = req.params;
    try {
      const imageUrl = await productosModel.deleteProductImage(pid);

      if (imageUrl === null) {
        return res.status(404).json({ error: 'No se encontró imagen para este producto' });
      }

      // Eliminar el archivo físico
      const imagePath = path.join(__dirname, '..', '..', 'public', imageUrl);
      await fs.unlink(imagePath).catch(console.error);

      res.status(200).json({ message: 'Imagen del producto eliminada exitosamente' });
    } catch (error) {
      next(error);
    }
  },

  deleteProducto: async (req, res, next) => {
    const { pid } = req.params;

    try {
      // Primero, obtener la información del producto para conocer la ruta de la imagen
      const producto = await productosModel.getProductoById(pid);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Eliminar el producto de la base de datos
      const deleted = await productosModel.deleteProducto(pid);

      if (deleted) {
        // Si el producto tenía una imagen, eliminarla del sistema de archivos
        if (producto.img_producto) {
          const imagePath = path.join(uploadPath, path.basename(producto.img_producto));
          await fs.unlink(imagePath).catch(console.error);
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = productoController