from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json

app = Flask(__name__)
CORS(app)  # CORS 설정: 다른 도메인에서의 요청을 허용

# MySQL 데이터베이스 연결 함수
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="1234",
        database="bugik",
        charset='utf8mb4'
    )

# 특정 날짜에 대한 메뉴 조회 API
@app.route('/menu/<date>', methods=['GET'])
def get_menu_by_date(date):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 특정 날짜에 해당하는 메뉴 목록 조회
        cursor.execute("""
            SELECT rm.menu_date_id, r.name AS restaurant_name, rm.time, ri.name AS food_item_name, ri.explanation
            FROM restaurants_meal rm
            JOIN restaurants r ON rm.restaurant_id = r.restaurant_id
            JOIN restaurants_meal_food rmf ON rm.menu_date_id = rmf.menu_date_id
            JOIN food_info ri ON rmf.item_id = ri.item_id
            WHERE rm.date = %s
        """, (date,))
        
        menu_items = cursor.fetchall()
        
        # 메뉴 항목들이 있으면 반환
        if menu_items:
            # json.dumps로 한글을 유니코드 이스케이프 없이 출력하도록 설정
            json_data = json.dumps(menu_items, ensure_ascii=False)
            return Response(json_data, mimetype='application/json; charset=utf-8')
        else:
            return jsonify({"message": "No menu found for the selected date."}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# 특정 메뉴 항목에 대한 상세 정보 조회 API
@app.route('/food/<item_id>', methods=['GET'])
def get_food_details(item_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # 특정 메뉴 항목의 상세 정보 조회
        cursor.execute("""
            SELECT ri.name, ri.explanation, f.rating_value, f.comment
            FROM food_info ri
            LEFT JOIN food_reviews f ON ri.item_id = f.item_id
            WHERE ri.item_id = %s
        """, (item_id,))
        
        food_details = cursor.fetchall()
        
        if food_details:
            return jsonify(food_details)
        else:
            return jsonify({"message": "No food details found."}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

# 서버 실행
if __name__ == '__main__':
    app.run(port=5000)
