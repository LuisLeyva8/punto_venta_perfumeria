from flask import Flask, jsonify
import pymysql
from flask_cors import CORS

app = Flask(__name__)  # ✅ Primero creas app
CORS(app, resources={r"/*": {"origins": "*"}})  # ✅ Luego aplicas CORS al app

db_config = {
    "host": "localhost",
    "user": "root",  
    "password": "rootpassword",  
    "database": "perfumeria_pdv",  
    "port": 3307 
}


# Ruta de buscar producto
@app.route('/buscar-producto/<codigo>', methods=['GET'])
def buscar_producto(codigo):
    try:
        print(f"🛒 Buscando producto en la base de datos: {codigo}")

        # Conectar a MySQL
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        # Consulta SQL
        sql = """
            SELECT codigo_barras, descripcion, precio_venta, cantidad
            FROM productos
            WHERE codigo_barras = %s
        """
        cursor.execute(sql, (codigo,))
        row = cursor.fetchone()

        cursor.close()
        connection.close()

        if row:
            producto = {
                "codigo_barras": row[0],
                "descripcion": row[1],
                "precio_venta": float(row[2]),
                "cantidad": float(row[3])
            }
            print("✅ Producto encontrado:", producto)
            return jsonify(producto)
        else:
            print("⚠️ Producto no encontrado.")
            return jsonify({"error": "Producto no encontrado"})

    except Exception as e:
        print("🚨 Error en servidor:", str(e))
        return jsonify({"error": "Error interno en servidor"}), 500

@app.route('/buscar-descripcion/<texto>', methods=['GET'])
def buscar_descripcion(texto):
    try:
        print(f"🔍 Buscando productos que coincidan con: {texto}")
        
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        sql = """
            SELECT codigo_barras, descripcion, precio_venta, cantidad, departamento
            FROM productos
            WHERE descripcion LIKE %s
            LIMIT 20
        """
        buscar = f"%{texto}%"
        cursor.execute(sql, (buscar,))
        rows = cursor.fetchall()

        cursor.close()
        connection.close()

        productos = []
        for row in rows:
            productos.append({
                "codigo_barras": row[0],
                "descripcion": row[1],
                "precio_venta": float(row[2]),
                "cantidad": float(row[3]),  # 💥 AHORA sí trae la existencia
                "departamento": row[4]
            })

        return jsonify(productos)

    except Exception as e:
        print("🚨 Error en búsqueda:", str(e))
        return jsonify({"error": "Error interno en servidor"}), 500

@app.route('/buscar-mayoreo/<codigo>', methods=['GET'])
def buscar_mayoreo(codigo):
    try:
        print(f"🔎 Buscando precio mayoreo para: {codigo}")
        
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        sql = """
            SELECT precio_mayoreo
            FROM productos
            WHERE codigo_barras = %s
        """
        cursor.execute(sql, (codigo,))
        row = cursor.fetchone()

        cursor.close()
        connection.close()

        if row and row[0] is not None:
            return jsonify({"precio_mayoreo": float(row[0])})
        else:
            return jsonify({"error": "No tiene precio mayoreo"})

    except Exception as e:
        print("🚨 Error buscando precio mayoreo:", str(e))
        return jsonify({"error": "Error interno en servidor"}), 500













# Correr servidor
if __name__ == '__main__':
    app.run(port=3000, debug=True)