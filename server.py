from flask import Flask, jsonify, request
import pymysql
from flask_cors import CORS
from flask_mysqldb import MySQL

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


from datetime import date

@app.route('/entrada', methods=['POST'])
def entrada_dinero():
    try:
        data = request.json
        cantidad = float(data['cantidad'])
        usuario = data.get('usuario', 'admin')
        fecha = data.get('fecha', str(date.today()))

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si existe el corte
        cursor.execute("""
            SELECT id FROM corte_caja WHERE usuario = %s AND fecha = %s
        """, (usuario, fecha))
        result = cursor.fetchone()

        if not result:
            cursor.execute("""
                INSERT INTO corte_caja (
                    fecha, usuario, dinero_inicial, entrada_dinero, salida_dinero,
                    ventas_efectivo, ventas_tarjeta, pagos_clientes,
                    pagos_proveedores, total_en_caja, ganancias
                ) VALUES (%s, %s, 0,  0, 0, 0, 0, 0, 0, 0, 0)
            """, (fecha, usuario))

        # Actualizar entrada_dinero y total_en_caja
        cursor.execute("""
            UPDATE corte_caja
            SET entrada_dinero = entrada_dinero + %s,
                total_en_caja = total_en_caja + %s
            WHERE usuario = %s AND fecha = %s
        """, (cantidad, cantidad, usuario, fecha))

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
        fecha = data.get('fecha', str(date.today()))

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        # Verificar si existe el corte
        cursor.execute("""
            SELECT id FROM corte_caja WHERE usuario = %s AND fecha = %s
        """, (usuario, fecha))
        result = cursor.fetchone()

        if not result:
            cursor.execute("""
                INSERT INTO corte_caja (
                    fecha, usuario, dinero_inicial, entrada_dinero, salida_dinero,
                    ventas_efectivo, ventas_tarjeta, pagos_clientes,
                    pagos_proveedores, total_en_caja, ganancias
                ) VALUES (%s, %s, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            """, (fecha, usuario))

        # Actualizar salida_dinero y total_en_caja
        cursor.execute("""
            UPDATE corte_caja
            SET salida_dinero = salida_dinero + %s,
                total_en_caja = total_en_caja - %s
            WHERE usuario = %s AND fecha = %s
        """, (cantidad, cantidad, usuario, fecha))

        conn.commit()
        conn.close()

        return jsonify({'status': 'ok', 'mensaje': 'Salida registrada'})
    except Exception as e:
        print("🚨 Error en /salida:", str(e))
        return jsonify({'error': 'Error interno en salida'}), 500



from datetime import datetime, date

@app.route('/dinero-en-caja')
def dinero_en_caja():
    try:
        usuario = request.args.get("usuario", "admin")
        fecha_str = request.args.get("fecha")  # formato esperado: YYYY-MM-DD

        # Usar la fecha recibida o la de hoy si no hay parámetro
        if fecha_str:
            try:
                fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({'error': 'Fecha con formato inválido. Use YYYY-MM-DD'}), 400
        else:
            fecha = date.today()

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor(pymysql.cursors.DictCursor)

        # Consultar corte existente
        cursor.execute("""
            SELECT total_en_caja 
            FROM corte_caja 
            WHERE usuario = %s AND fecha = %s
        """, (usuario, fecha))
        
        result = cursor.fetchone()

        # Crear el registro si no existe
        if not result:
            cursor.execute("""
                INSERT INTO corte_caja (
                    fecha, usuario, dinero_inicial, entrada_dinero, salida_dinero
                    ventas_efectivo, ventas_tarjeta, pagos_clientes, 
                    pagos_proveedores, total_en_caja, ganancias
                ) VALUES (%s, %s, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            """, (fecha, usuario))
            conn.commit()

            # Consultar nuevamente
            cursor.execute("""
                SELECT total_en_caja 
                FROM corte_caja 
                WHERE usuario = %s AND fecha = %s
            """, (usuario, fecha))
            result = cursor.fetchone()

        conn.close()
        return jsonify({'total_en_caja': float(result['total_en_caja']) if result else 0.0})

    except Exception as e:
        print("🚨 Error en /dinero-en-caja:", str(e))
        return jsonify({'error': 'Error al consultar dinero en caja'}), 500


CORS(app)
mysql = MySQL(app)

@app.route('/producto', methods=['POST'])
def guardar_producto():
    try:
        data = request.get_json()

        tipo_producto = data['tipoProducto']
        unidad = data['unidad']
        codigo_kit = data.get('codigoKit') or None  # Puede venir como null o vacío

        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO productos (
                codigo_barras, descripcion, tipo_producto,
                precio_costo, precio_venta, precio_mayoreo,
                cantidad, minimo_inventario, departamento, unidad, codigo_kit
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['codigo'],
            data['descripcion'],
            tipo_producto,
            data['precioCosto'],
            data['precioVenta'],
            data['precioMayoreo'],
            data['cantidad'],
            data['minimo'],
            data['departamento'],
            unidad,
            codigo_kit
        ))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Producto guardado correctamente'}), 200

    except Exception as e:
        print("❌ ERROR AL GUARDAR PRODUCTO:")
        traceback.print_exc()
        return jsonify({'message': f'Error al guardar producto: {str(e)}'}), 500


@app.route('/kits', methods=['GET'])
def buscar_kits():
    buscar = request.args.get('buscar', '')
    connection = pymysql.connect(**db_config)
    cursor = connection.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT codigo, nombre FROM kits WHERE codigo LIKE %s OR nombre LIKE %s", 
                   (f"%{buscar}%", f"%{buscar}%"))
    kits = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(kits)

@app.route('/kits', methods=['POST'])
def crear_kit():
    data = request.get_json()
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("INSERT INTO kits (codigo, nombre) VALUES (%s, %s)", 
                       (data['codigo'], data['nombre']))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Kit creado exitosamente'}), 201
    except Exception as e:
        print("Error al crear kit:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/departamentos', methods=['GET'])
def obtener_departamentos():
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT id, nombre FROM departamentos ORDER BY nombre")
        departamentos = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(departamentos)
    except Exception as e:
        print("Error al obtener departamentos:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500


@app.route('/departamentos', methods=['POST'])
def crear_departamento():
    data = request.get_json()
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("INSERT INTO departamentos (nombre) VALUES (%s)", (data['nombre'],))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Departamento creado exitosamente'}), 201
    except Exception as e:
        print("Error al crear departamento:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500


@app.route('/departamentos/<int:id>', methods=['DELETE'])
def eliminar_departamento(id):
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("DELETE FROM departamentos WHERE id = %s", (id,))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({'message': 'Departamento eliminado'}), 200
    except Exception as e:
        print("Error al eliminar departamento:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500

@app.route('/departamentos/<int:id>', methods=['PUT'])
def modificar_departamento(id):
    try:
        data = request.get_json()
        nuevo_nombre = data.get("nombre", "").strip()

        if not nuevo_nombre:
            return jsonify({'message': 'Nombre inválido'}), 400

        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()
        cursor.execute("UPDATE departamentos SET nombre = %s WHERE id = %s", (nuevo_nombre, id))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Departamento actualizado'}), 200
    except Exception as e:
        print("Error al actualizar departamento:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500


from datetime import datetime

@app.route('/clientes', methods=['POST'])
def registrar_cliente():
    try:
        nombre = request.form.get('nombre')
        telefono = request.form.get('telefono')
        correo = request.form.get('correo')
        descuento = request.form.get('descuento', 0)
        monto_minimo = request.form.get('monto_minimo_mensual', 0)
        foto = request.files.get('foto')

        # Convertir a tipos adecuados
        descuento = float(descuento)
        monto_minimo = float(monto_minimo)
        foto_binario = foto.read() if foto else None

        connection = pymysql.connect(**db_config)
        cursor = connection.cursor()

        query = """
            INSERT INTO clientes (
                nombre_completo, telefono, saldo_actual,
                monto_minimo_mensual, descuento, foto
            )
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            nombre, telefono, 0.0,
            monto_minimo, descuento, foto_binario
        ))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Cliente registrado exitosamente'}), 201

    except Exception as e:
        print("Error al registrar cliente:", e)
        return jsonify({'message': f'Error: {str(e)}'}), 500


from flask import jsonify
import base64


@app.route('/clientes', methods=['GET'])
def obtener_clientes():
    try:
        connection = pymysql.connect(**db_config)
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        cursor.execute("""
            SELECT id, nombre_completo, telefono, descuento, saldo_actual,
                   suscripcion_activa, monto_minimo_mensual, fecha_ultima_compra, foto
            FROM clientes
        """)
        clientes = cursor.fetchall()
        cursor.close()
        connection.close()

        for cliente in clientes:
            try:
                if cliente["foto"]:
                    cliente["foto"] = base64.b64encode(cliente["foto"]).decode("utf-8")
                else:
                    cliente["foto"] = None
            except Exception as fe:
                print(f"Error procesando foto del cliente {cliente['id']}: {fe}")
                cliente["foto"] = None

        return jsonify(clientes), 200
    except Exception as e:
        print("🔥 Error en /clientes:", e)
        return jsonify({'message': f'Error interno: {str(e)}'}), 500



@app.route('/producto/<codigo>', methods=['GET'])
def obtener_producto_por_codigo(codigo):
    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT descripcion, cantidad FROM productos WHERE codigo_barras = %s", (codigo,))
        producto = cursor.fetchone()
        conn.close()

        if producto:
            return jsonify({
                'descripcion': producto[0],
                'cantidad': float(producto[1])
            })
        else:
            return jsonify({'error': 'Producto no encontrado'}), 404
    except Exception as e:
        print("🚨 Error en /producto:", str(e))
        return jsonify({'error': 'Error interno'}), 500

@app.route('/actualizar_inventario', methods=['POST'])
def actualizar_inventario():
    try:
        data = request.json
        codigo = data['codigo']
        cantidad = float(data['cantidad'])

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE productos
            SET cantidad = cantidad + %s
            WHERE codigo_barras = %s
        """, (cantidad, codigo))

        conn.commit()
        conn.close()

        return jsonify({'status': 'ok', 'mensaje': 'Cantidad agregada correctamente'})
    except Exception as e:
        print("🚨 Error en /actualizar_inventario:", str(e))
        return jsonify({'error': 'Error interno en inventario'}), 500


from flask import jsonify
from datetime import datetime, date

@app.route('/corte_entradas', methods=['GET'])
def obtener_entradas_corte():
    try:
        usuario = request.args.get("usuario", "admin")
        fecha_str = request.args.get("fecha")
        fecha = date.today()

        if fecha_str:
            try:
                fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
            except ValueError:
                return jsonify({'error': 'Formato de fecha inválido. Use YYYY-MM-DD'}), 400

        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT dinero_inicial, entrada_dinero, salida_dinero,
                   ventas_efectivo, ventas_tarjeta, pagos_proveedores, total_en_caja,
                   pagos_clientes, ganancias
            FROM corte_caja
            WHERE fecha = %s AND usuario = %s
        """, (fecha, usuario))
        datos = cursor.fetchone()
        conn.close()

        if datos:
            (dinero_inicial, entrada_dinero, salida_dinero,
             ventas_efectivo, ventas_tarjeta, pagos_proveedores,
             total_en_caja, pagos_clientes, ganancias) = map(float, datos)
        else:
            dinero_inicial = entrada_dinero = salida_dinero = ventas_efectivo = 0.0
            ventas_tarjeta = pagos_proveedores = total_en_caja = pagos_clientes = ganancias = 0.0

        total_calculado = dinero_inicial + entrada_dinero + ventas_efectivo + ventas_tarjeta - salida_dinero - pagos_proveedores

        return jsonify({
            'dinero_inicial': dinero_inicial,
            'entrada_dinero': entrada_dinero,
            'salida_dinero': salida_dinero,
            'ventas_efectivo': ventas_efectivo,
            'ventas_tarjeta': ventas_tarjeta,
            'pagos_proveedores': pagos_proveedores,
            'total_en_caja': total_en_caja,
            'total_calculado': total_calculado,
            'diferencia_total': round(total_en_caja - total_calculado, 2),
            'pagos_clientes': pagos_clientes,
            'ganancias': ganancias
        })

    except Exception as e:
        print("🚨 Error en /corte_entradas:", e)
        return jsonify({'error': 'Error al obtener datos de corte'}), 500


@app.route('/ventas_por_departamento', methods=['GET'])
def obtener_ventas_por_departamento():
    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT p.departamento, SUM(dv.total) AS total_ventas
            FROM detalle_ventas dv
            JOIN ventas v ON dv.id_venta = v.id
            JOIN productos p ON dv.id_producto = p.id
            GROUP BY p.departamento
            ORDER BY total_ventas DESC
        """)
        resultados = cursor.fetchall()
        conn.close()

        datos = []
        for fila in resultados:
            departamento = fila[0] if fila[0] else "Sin departamento"
            total_ventas = float(fila[1])
            datos.append({'departamento': departamento, 'total_ventas': total_ventas})
        print(jsonify(datos))
        return jsonify(datos)

    except Exception as e:
        print("🚨 Error en /ventas_por_departamento:", e)
        return jsonify({'error': 'Error al obtener ventas por departamento'}), 500














# Correr servidor
if __name__ == '__main__':
    app.run(port=3000, debug=True)