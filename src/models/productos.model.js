const pool = require("../db/index.db");

const productosModel = {
  getAllProductos: async () => {
    const sql = `
          SELECT 
            p.id AS producto_id,
            p.nombre AS producto_nombre,
            p.descrip AS producto_descrip,
            p.precio AS producto_precio,
            c.nombre AS categoria_nombre,
            m.nombre AS marca_nombre,
            i.url AS imagen_url,
            dp.clave AS detalle_clave,
            dp.valor AS detalle_valor
          FROM 
            productos p
          JOIN 
            categorias c ON p.categoria_id = c.id
          JOIN 
            marcas m ON p.marca_id = m.id
          LEFT JOIN 
            imagenes i ON p.id = i.producto_id
          LEFT JOIN 
            detalles_producto dp ON p.id = dp.producto_id;
        `;

    try {
      const [results] = await pool.query(sql);

      const productos = {};
      results.forEach(row => {
        if (!productos[row.producto_id]) {
          productos[row.producto_id] = {
            id: row.producto_id,
            nombre: row.producto_nombre,
            descrip: row.producto_descrip,
            precio: row.producto_precio,
            categoria: row.categoria_nombre,
            marca: row.marca_nombre,
            img_producto: row.imagen_url,
            detalles: []
          };
        }
        if (row.detalle_clave && row.detalle_valor) {
          productos[row.producto_id].detalles.push({
            clave: row.detalle_clave,
            valor: row.detalle_valor
          });
        }
      });

      return Object.values(productos);
    } catch (error) {
      console.error('Error en getAllProductos:', error);
      throw error;
    }
  },
  
  getProductoById: async (pid) => {
    const sql = `
          SELECT 
            p.id AS producto_id,
            p.nombre AS producto_nombre,
            p.descrip AS producto_descrip,
            p.precio AS producto_precio,
            c.nombre AS categoria_nombre,
            m.nombre AS marca_nombre,
            i.url AS imagen_url,
            dp.clave AS detalle_clave,
            dp.valor AS detalle_valor
          FROM 
            productos p
          JOIN 
            categorias c ON p.categoria_id = c.id
          JOIN 
            marcas m ON p.marca_id = m.id
          LEFT JOIN 
            imagenes i ON p.id = i.producto_id
          LEFT JOIN 
            detalles_producto dp ON p.id = dp.producto_id
          WHERE 
            p.id = ?
        `;

    try {
      const [results] = await pool.query(sql, [pid]);

      if (results.length === 0) {
      }

      const producto = {
        id: results[0].producto_id,
        nombre: results[0].producto_nombre,
        descrip: results[0].producto_descrip,
        precio: results[0].producto_precio,
        categoria: results[0].categoria_nombre,
        marca: results[0].marca_nombre,
        img_producto: results[0].imagen_url,
        detalles: []
      };

      results.forEach(row => {
        if (row.detalle_clave && row.detalle_valor) {
          producto.detalles.push({
            clave: row.detalle_clave,
            valor: row.detalle_valor
          });
        }
      });

      return producto;
    } catch (error) {
      console.error('Error en getProductoById:', error);
      throw error;
    }
  },

  getCategoriaId: async (categoria) => {
    try {
      const [results] = await pool.query('SELECT id FROM categorias WHERE nombre = ?', [categoria]);

      if (results.length > 0) {
        return results[0].id;
      } else {
        const [result] = await pool.query('INSERT INTO categorias (nombre) VALUES (?)', [categoria]);
        return result.insertId;
      }
    } catch (error) {
      console.error('Error en getCategoriaId:', error);
      throw error;
    }
  },

  getMarcaId: async (marca) => {
    try {
      const [results] = await pool.query('SELECT id FROM marcas WHERE nombre = ?', [marca]);

      if (results.length > 0) {
        return results[0].id;
      } else {
        const [result] = await pool.query('INSERT INTO marcas (nombre) VALUES (?)', [marca]);
        return result.insertId;
      }
    } catch (error) {
      console.error('Error en getMarcaId:', error);
      throw error;
    }
  },

  createProducto: async (productoData) => {
    const { nombre, descrip, precio, categoria, marca, img_producto } = productoData;

    try {
      const categoria_id = await productosModel.getCategoriaId(categoria);
      const marca_id = await productosModel.getMarcaId(marca);

      await pool.query('START TRANSACTION');

      const [result] = await pool.query(
        'INSERT INTO productos (nombre, descrip, precio, categoria_id, marca_id) VALUES (?, ?, ?, ?, ?)',
        [nombre, descrip, precio, categoria_id, marca_id]
      );

      if (img_producto) {
        await pool.query(
          'INSERT INTO imagenes (producto_id, url) VALUES (?, ?)',
          [result.insertId, img_producto]
        );
      }

      await pool.query('COMMIT');
      return result.insertId;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error en createProducto:', error);
      throw error;
    }
  },

  replaceProducto: async (pid, productoData) => {
    const { nombre, descrip, precio, categoria, marca, img_producto } = productoData;

    try {
      const categoria_id = await productosModel.getCategoriaId(categoria);
      const marca_id = await productosModel.getMarcaId(marca);

      await pool.query('START TRANSACTION');

      await pool.query(
        'UPDATE productos SET nombre = ?, descrip = ?, precio = ?, categoria_id = ?, marca_id = ? WHERE id = ?',
        [nombre, descrip, precio, categoria_id, marca_id, pid]
      );

      if (img_producto) {
        await pool.query('DELETE FROM imagenes WHERE producto_id = ?', [pid]);
        await pool.query(
          'INSERT INTO imagenes (producto_id, url) VALUES (?, ?)',
          [pid, img_producto]
        );
      }

      await pool.query('COMMIT');
      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error en replaceProducto:', error);
      throw error;
    }
  },

  updateProducto: async (pid, updateData) => {
    try {
      await pool.query('START TRANSACTION');

      const allowedFields = ['nombre', 'descrip', 'precio', 'categoria', 'marca'];
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          if (key === 'categoria') {
            const categoria_id = await productosModel.getCategoriaId(value);
            updates.push('categoria_id = ?');
            values.push(categoria_id);
          } else if (key === 'marca') {
            const marca_id = await productosModel.getMarcaId(value);
            updates.push('marca_id = ?');
            values.push(marca_id);
          } else {
            updates.push(`${key} = ?`);
            values.push(value);
          }
        }
      }

      if (updates.length > 0) {
        values.push(pid);
        await pool.query(`UPDATE productos SET ${updates.join(', ')} WHERE id = ?`, values);
      }

      if (updateData.img_producto) {
        await pool.query('DELETE FROM imagenes WHERE producto_id = ?', [pid]);
        await pool.query(
          'INSERT INTO imagenes (producto_id, url) VALUES (?, ?)',
          [pid, updateData.img_producto]
        );
      }

      await pool.query('COMMIT');
      return true;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error en updateProducto:', error);
      throw error;
    }
  },

  getDetallesProducto: async (pid) => {
    try {
      const [detalles] = await pool.query(
        'SELECT clave, valor FROM detalles_producto WHERE producto_id = ?',
        [pid]
      );
      return detalles;
    } catch (error) {
      console.error('Error en getDetallesProducto:', error);
      throw error;
    }
  },

  addDetalleProducto: async (pid, clave, valor) => {
    try {
      await pool.query(
        'INSERT INTO detalles_producto (producto_id, clave, valor) VALUES (?, ?, ?)',
        [pid, clave, valor]
      );
      return true;
    } catch (error) {
      console.error('Error en addDetalleProducto:', error);
      throw error;
    }
  },

  updateDetalleProducto: async (pid, clave, valor) => {
    try {
      const [result] = await pool.query(
        'UPDATE detalles_producto SET valor = ? WHERE producto_id = ? AND clave = ?',
        [valor, pid, clave]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en updateDetalleProducto:', error);
      throw error;
    }
  },

  deleteDetalleProducto: async (pid, clave) => {
    try {
      const [result] = await pool.query(
        'DELETE FROM detalles_producto WHERE producto_id = ? AND clave = ?',
        [pid, clave]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en deleteDetalleProducto:', error);
      throw error;
    }
  },

  deleteProductImage: async (pid) => {
    try {
      await pool.query('START TRANSACTION');

      const [imageResult] = await pool.query('SELECT url FROM imagenes WHERE producto_id = ?', [pid]);

      if (imageResult.length === 0) {
        await pool.query('COMMIT');
        return null;
      }

      const imageUrl = imageResult[0].url;

      await pool.query('DELETE FROM imagenes WHERE producto_id = ?', [pid]);

      await pool.query('COMMIT');
      return imageUrl;
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error en deleteProductImage:', error);
      throw error;
    }
  },

  deleteProducto: async (pid) => {
    try {
      await pool.query('DELETE FROM detalles_producto WHERE producto_id = ?', [pid]);

      await pool.query('DELETE FROM imagenes WHERE producto_id = ?', [pid]);

      const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [pid]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en deleteProducto:', error);
      throw error;
    }
  }
};

module.exports = productosModel;