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
    
          // Procesar los resultados para formar el objeto JSON deseado
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
            return null; // Producto no encontrado
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
      deleteProductImage: async (pid) => {
        try {
          await pool.query('START TRANSACTION');
    
          // Obtener la URL de la imagen actual
          const [imageResult] = await pool.query('SELECT url FROM imagenes WHERE producto_id = ?', [pid]);
    
          if (imageResult.length === 0) {
            // No hay imagen para este producto
            await pool.query('COMMIT');
            return null;
          }
    
          const imageUrl = imageResult[0].url;
    
          // Eliminar la entrada de la imagen en la base de datos
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
          // Eliminar los detalles del producto
          await pool.query('DELETE FROM detalles_producto WHERE producto_id = ?', [pid]);
    
          // Eliminar las imágenes del producto
          await pool.query('DELETE FROM imagenes WHERE producto_id = ?', [pid]);
    
          // Eliminar el producto
          const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [pid]);
    
          // Retornar true si se eliminó algún producto, false en caso contrario
          return result.affectedRows > 0;
        } catch (error) {
          console.error('Error en deleteProducto:', error);
          throw error;
        }
      }
};

module.exports = productosModel;