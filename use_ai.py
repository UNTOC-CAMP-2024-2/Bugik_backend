import os
import openai
import mysql.connector
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import requests
from datetime import datetime
from flask_cors import CORS


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
gemini_api_key = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app)
    
def db_connection():
    connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PW"),
            database=os.getenv("DB_NAME")
    )
    
    return connection

def get_menus_for_same_time(target_date, target_time):
    connection = db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT 
        r.restaurant_id,
        r.name AS restaurant_name,
        rm.date,
        rm.time,
        f.name AS food_name
    FROM 
        restaurants_meal rm
    JOIN 
        restaurants r ON rm.restaurant_id = r.restaurant_id
    JOIN 
        restaurants_meal_food rmf ON rm.menu_date_id = rmf.menu_date_id
    JOIN 
        food_info f ON rmf.item_id = f.item_id
    WHERE 
        rm.date = %s
        AND rm.time = %s
    ORDER BY 
        r.restaurant_id;
    """
    cursor.execute(query, (target_date, target_time))
    results = cursor.fetchall()

    # 데이터를 식당별로 그룹화
    grouped_data = {}
    for row in results:
        restaurant_id = row["restaurant_id"]
        restaurant_name = row["restaurant_name"]

        if restaurant_id not in grouped_data:
            grouped_data[restaurant_id] = {
                "restaurant_name": restaurant_name,
                "menus": []
            }

        grouped_data[restaurant_id]["menus"].append({
            "food_name": row["food_name"]
        })

    cursor.close()
    connection.close()
    return grouped_data




#-------------------------- AI ENGINE ------------------------------------------

def recommend_restaurant_with_gemini():
    target_date = "2025-01-07"
    target_time = "석식"

    grouped_data = get_menus_for_same_time(target_date, target_time)

    prompt = f"다음은 {target_date}의 {target_time} 메뉴 정보입니다:\n\n"

    for restaurant_id, data in grouped_data.items():
        prompt += f"- 식당 이름: {data['restaurant_name']}\n"
        prompt += "  메뉴:\n"
        for item in data["menus"]:
            prompt += f"    - {item['food_name']}\n"
        prompt += "\n"

    prompt += "위의 정보를 바탕으로 가장 추천할 만한 식당과 그 이유를 알려주세요."

    # 호출
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_api_key}"
        headers = {
            "Content-Type": "application/json",
        }
        data = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()

        # 응답 처리  -예상이라, 답변 나오는 구조보고 수정할 수도 있음.
        response_json = response.json()
        if "contents" in response_json and response_json["contents"]:
            return response_json["contents"][0]["parts"][0]["text"].strip()
        
        else:
            return "Gemini 응답 데이터가 예상 형식과 다릅니다."
    except requests.RequestException as e:
        return f"Gemini API 호출 중 오류가 발생했습니다: {str(e)}"




def recommend_restaurant_with_gpt():
    target_date = "2025-01-07"
    target_time = "석식"

    grouped_data = get_menus_for_same_time(target_date, target_time)

    prompt = f"다음은 {target_date}의 {target_time} 메뉴 정보입니다:\n\n"

    for restaurant_id, data in grouped_data.items():
        prompt += f"- 식당 이름: {data['restaurant_name']}\n"
        prompt += "  메뉴:\n"
        for item in data["menus"]:
            prompt += f"    - {item['food_name']}\n"
        prompt += "\n"

    prompt += "위의 정보를 바탕으로 가장 추천할 만한 식당과 그 이유를 알려주세요."

    #호출
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant recommending the best restaurant based on menu and preferences."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=200,
            temperature=0.4
        )
        return response.choices[0].message["content"].strip()
    except Exception as e:
        print(f"An error occurred: {e}")

#------------------------------------------------------------------------

@app.route("/menus", methods=["GET"])

def menus():
    try:
        # target_date = request.args.get("date")
        # target_time = request.args.get("time")

        target_date = "2025-01-07"
        target_time = "석식"

        if not target_date or not target_time:
            return jsonify({"error": "date와 time 매개변수가 필요."}), 400

        menus = get_menus_for_same_time(target_date, target_time)
        return jsonify(menus)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/recommend/gpt', methods=['POST'])

def recommend_with_gpt():
    data = request.json
    grouped_data = data.get('grouped_data', {})
    target_date = data.get('target_date', '')
    target_time = data.get('target_time', '')

    result = recommend_restaurant_with_gpt()
    return jsonify({"recommendation": result})

@app.route('/recommend/gemini', methods=['POST'])
def recommend_with_gemini():
    data = request.json
    grouped_data = data.get('grouped_data', {})
    target_date = data.get('target_date', '')
    target_time = data.get('target_time', '')

    result = recommend_restaurant_with_gemini()
    return jsonify({"recommendation": result})

# 서버 실행
if __name__ == "__main__":
    app.run(debug=True)