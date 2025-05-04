from flask import Flask, jsonify, request
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


@app.route('/entrada', methods=['POST'])
def entrada_dinero():
    try:
        data = request.json
        cantidad = float(data['cantidad'])
        usuario = data.get('usuario', 'admin')

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE corte_caja 
            SET entrada_dinero = entrada_dinero + %s,
                total_en_caja = total_en_caja + %s
            WHERE usuario = %s
        """, (cantidad, cantidad, usuario))
        
        conn.commit()
        conn.close()

        return jsonify({'status': 'ok', 'mensaje': 'Entrada registrada'})
    except Exception as e:
        print("🚨 Error en /entrada:", str(e))
        return jsonify({'error': 'Error interno en entrada'}), 500

@app.route('/salida', methods=['POST'])
def salida_dinero():
    try:
        data = request.json
        cantidad = float(data['cantidad'])
        usuario = data.get('usuario', 'admin')

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE corte_caja 
            SET total_en_caja = total_en_caja - %s
            WHERE usuario = %s
        """, (cantidad, usuario))
        
        conn.commit()
        conn.close()

        return jsonify({'status': 'ok', 'mensaje': 'Salida registrada'})
    except Exception as e:
        print("🚨 Error en /salida:", str(e))
        return jsonify({'error': 'Error interno en salida'}), 500

@app.route('/dinero-en-caja')
def dinero_en_caja():
    try:
        usuario = request.args.get("usuario", "admin")
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT total_en_caja FROM corte_caja WHERE usuario = %s", (usuario,))
        result = cursor.fetchone()
        conn.close()
        return jsonify({'total_en_caja': float(result['total_en_caja']) if result else 0.0})
    except Exception as e:
        print("🚨 Error en /dinero-en-caja:", str(e))
        return jsonify({'error': 'Error al consultar dinero en caja'}), 500







# Correr servidor
if __name__ == '__main__':
    app.run(port=3000, debug=True)