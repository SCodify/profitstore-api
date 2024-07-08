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

  postProducto: async (req, res, next) => {
    try {
      let img_producto = null;
      if (req.file) {
        img_producto = `/uploads/${req.file.filename}`;
      }

      const productoData = {
        ...req.body,
        img_producto
      };

      const pid = await productosModel.createProducto(productoData);
      res.status(201).json({ message: 'Producto creado exitosamente', pid });
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(uploadPath, req.file.filename)).catch(console.error);
      }
      next(error);
    }
  },

  putProducto: async (req, res, next) => {
    const { pid } = req.params;
    try {
      const currentProduct = await productosModel.getProductoById(pid);

      if (!currentProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      let img_producto = currentProduct.img_producto;

      if (req.file) {
        img_producto = `/uploads/${req.file.filename}`;
      }

      const productoData = {
        ...req.body,
        img_producto
      };

      const replaced = await productosModel.replaceProducto(pid, productoData);
      if (replaced) {
        if (req.file && currentProduct.img_producto) {
          const oldImagePath = path.join(__dirname, '..', '..', 'public', currentProduct.img_producto);
          await fs.unlink(oldImagePath).catch(console.error);
        }
        res.status(200).json({ message: 'Producto reemplazado exitosamente' });
      } else {
        if (req.file) {
          await fs.unlink(path.join(uploadPath, req.file.filename)).catch(console.error);
        }
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(uploadPath, req.file.filename)).catch(console.error);
      }
      next(error);
    }
  },

  patchProducto: async (req, res, next) => {
    const { pid } = req.params;
    try {
      const currentProduct = await productosModel.getProductoById(pid);

      if (!currentProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      let img_producto = currentProduct.img_producto;

      if (req.file) {
        img_producto = `/uploads/${req.file.filename}`;
      }

      const updateData = {
        ...req.body,
        ...(req.file && { img_producto })
      };

      const updated = await productosModel.updateProducto(pid, updateData);

      if (updated) {
        if (req.file && currentProduct.img_producto) {
          const oldImagePath = path.join(__dirname, '..', '..', 'public', currentProduct.img_producto);
          await fs.unlink(oldImagePath).catch(console.error);
        }
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
      } else {
        if (req.file) {
          await fs.unlink(path.join(uploadPath, req.file.filename)).catch(console.error);
        }
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      if (req.file) {
        await fs.unlink(path.join(uploadPath, req.file.filename)).catch(console.error);
      }
      next(error);
    }
  },

  getDetallesProducto: async (req, res, next) => {
    const { pid } = req.params;
    try {
      const detalles = await productosModel.getDetallesProducto(pid);
      res.json(detalles);
    } catch (error) {
      next(error);
    }
  },

  addDetalleProducto: async (req, res, next) => {
    const { pid } = req.params;
    const { clave, valor } = req.body;
    try {
      const added = await productosModel.addDetalleProducto(pid, clave, valor);
      if (added) {
        res.status(201).json({ message: 'Detalle agregado con éxito' });
      } else {
        res.status(400).json({ error: 'No se pudo agregar el detalle' });
      }
    } catch (error) {
      next(error);
    }
  },
  
  updateDetalleProducto: async (req, res, next) => {
    const { pid, clave } = req.params;
    const { valor } = req.body;
    try {
      const updated = await productosModel.updateDetalleProducto(pid, clave, valor);
      if (updated) {
        res.json({ message: 'Detalle actualizado con éxito' });
      } else {
        res.status(404).json({ error: 'Detalle no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  },
  
  deleteDetalleProducto: async (req, res, next) => {
    const { pid, clave } = req.params;
    try {
      const deleted = await productosModel.deleteDetalleProducto(pid, clave);
      if (deleted) {
        res.json({ message: 'Detalle eliminado con éxito' });
      } else {
        res.status(404).json({ error: 'Detalle no encontrado' });
      }
    } catch (error) {
      next(error);
    }
  },

  deleteProductImage: async (req, res, next) => {
    const { pid } = req.params;
    try {
      const imageUrl = await productosModel.deleteProductImage(pid);

      if (imageUrl === null) {
        return res.status(404).json({ error: 'No se encontró imagen para este producto' });
      }

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
      const producto = await productosModel.getProductoById(pid);

      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const deleted = await productosModel.deleteProducto(pid);

      if (deleted) {
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