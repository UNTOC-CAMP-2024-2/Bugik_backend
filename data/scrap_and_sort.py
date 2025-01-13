import os
import json
import re
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

import mysql.connector
from mysql.connector import Error

# API URL 정보
API_URLS = {
    "자유": "https://middle.pusan.ac.kr:8443/meal/sub?no=13&startDt={start}&endDt={end}",
    "웅비": "https://middle.pusan.ac.kr:8443/meal/sub?no=11&startDt={start}&endDt={end}",
    "진리": "https://middle.pusan.ac.kr:8443/meal/sub?no=2&startDt={start}&endDt={end}",
}

restaurant_keys = [
    "문창회관 식당",
    "학생회관 학생 식당",
    "자유",
    "진리",
    "웅비",
    "금정회관 교직원 식당",
    "금정회관 학생 식당"
]

# 날짜 범위 생성 함수
def generate_date_ranges(start_date, months=2):
    date_ranges = []
    current_date = start_date
    while current_date < start_date + timedelta(days=30 * months):
        start = current_date.strftime("%Y-%m-%d")
        end = (current_date + timedelta(days=6)).strftime("%Y-%m-%d")  # 일주일 단위
        date_ranges.append((start, end))
        current_date += timedelta(days=7)
    return date_ranges

# 요일 변환 함수
def get_korean_day_of_week(date_str):
    days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"]
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    return days[date_obj.weekday()]


# 데이터 가져오기 및 정리 
def scrap_and_formatting():
    start_date = datetime.today()
    date_ranges = generate_date_ranges(start_date, months=2)

    all_data = []

    for res_name, url_template in API_URLS.items():
        for start, end in date_ranges:
            url = url_template.format(start=start, end=end)
            print(f"{res_name} 데이터를 요청 중: {url}")
            response = requests.get(url)
            if response.status_code == 200:
                meals = response.json()
                grouped_meals = {}
                for meal in meals:
                    date = meal.get("mealDate") 
                    meal_kind = meal.get("codeNm")
                    meal_menu = meal.get("mealNm", "정보 없음").replace("\n", ", ")

                    if date not in grouped_meals:
                        grouped_meals[date] = {
                            "date": date,
                            "day": get_korean_day_of_week(date),
                            "meals": {}
                        }

                    if meal_kind in ["조식", "중식", "석식"]:
                        grouped_meals[date]["meals"][meal_kind] = meal_menu

                for date, data in grouped_meals.items():
                    all_data.append({
                        "res": res_name,
                        "date": data["date"],
                        "day": data["day"],
                        "meals": [
                            {
                                "when": "조식",
                                "mealType": "기숙사식",
                                "menu": data["meals"].get("조식", "정보 없음")
                            },
                            {
                                "when": "중식",
                                "mealType": "기숙사식",
                                "menu": data["meals"].get("중식", "정보 없음")
                            },
                            {
                                "when": "석식",
                                "mealType": "기숙사식",
                                "menu": data["meals"].get("석식", "정보 없음")
                            },
                        ]
                    })
            else:
                print(f"{res_name} 데이터 요청 실패 (상태 코드: {response.status_code})")

    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'samples')
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, "dorm_meals.json")

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)


    return all_data




# 메뉴 정리 함수
def clean_menu(menu): 
    
    menu = re.sub(r'(\d+kcal|\d+g|영업시간\(\d{0,2}:\d{0,2}~\d{0,2}:\d{0,2}\)|운영시간\(:~:\)|없음|문의:\s*\d+-\d+-\d+)', '', menu)
    menu = re.sub(r'\d+', '', menu)  #수
    menu = re.sub(r'운영시간\(:~:\)', '', menu)
    menu = re.sub(r'제외', '', menu)
    menu = re.sub(r'(\d+kcal|\d+g|운영시간\(.*?\)|제외|문의:\s*\d+-\d+-\d+|없음)', '', menu)
    
    menu = re.sub(r'\(C\)', '', menu)
    menu = re.sub(r'\(C', '', menu)
    menu = re.sub(r'C\)', '', menu)
    menu = re.sub(r'C', '', menu)

    menu = re.sub(r'\(D\)', '', menu)
    menu = re.sub(r'\(D', '', menu)
    menu = re.sub(r'D\)', '', menu)
    menu = re.sub(r'D', '', menu)

    menu = re.sub(r'\(P\)', '', menu)
    menu = re.sub(r'\(P', '', menu)
    menu = re.sub(r'P\)', '', menu)
    menu = re.sub(r'P', '', menu)

    menu = re.sub(r'\(E\)', '', menu)
    menu = re.sub(r'\(E', '', menu)
    menu = re.sub(r'E\)', '', menu)
    menu = re.sub(r'E', '', menu)

    menu = re.sub(r'\(F\)', '', menu)
    menu = re.sub(r'\(F', '', menu)
    menu = re.sub(r'F\)', '', menu)
    menu = re.sub(r'F', '', menu)

    menu = re.sub(r'\(B\)', '', menu)
    menu = re.sub(r'\(B', '', menu)
    menu = re.sub(r'B\)', '', menu)
    menu = re.sub(r'B', '', menu)

    menu = re.sub(r'<.*?>', '', menu) #<~~> 제거
    menu = re.sub(r'\(신라\)', '', menu)

    menu = re.sub(r'\s+', ' ', menu)  # 공백 제거

    menu = re.sub(r'&', '', menu)
    menu = re.sub(r'정보', '', menu)

    return menu.strip()



# 메뉴 항목 추출 함수
def extract_menu_items(data):
    restaurant_menus = {restaurant: set() for restaurant in restaurant_keys}

    for restaurant_data in data:
        try:
            restaurant = restaurant_data['res']
            if restaurant in restaurant_keys:
                for meal in restaurant_data.get('meals', []):

                    menu = meal.get('menu', '').replace('\n', ', ')
                    cleaned_menu = clean_menu(menu)

                    split_menus = re.split(r'[\n/,]', cleaned_menu)
                    menu_items = [item.strip() for item in split_menus if item.strip()]
                    
                    restaurant_menus[restaurant].update(menu_items)
        
        except KeyError as e:
            print(f"KeyError 발생: {e}")
        except TypeError as e:
            print(f"TypeError 발생: {e}")

    return restaurant_menus

# JSON 변환 및 저장
def convert_to_json(data, path):
    data = {restaurant: list(menu_items) for restaurant, menu_items in data.items()}
    with open(path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# 기존 메뉴 로드
def load_existing_menus(menu_list_path):
    if os.path.exists(menu_list_path):
        with open(menu_list_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    return {restaurant: [] for restaurant in restaurant_keys}

# 메뉴 업데이트 및 저장
def update_menus(data):
    base_directory = os.path.dirname(os.path.abspath(__file__))
    menu_list_path = os.path.join(base_directory, 'menus', 'menu_list.json')
    new_menu_list_path = os.path.join(base_directory, 'menus', 'new_menu_list.json')
    
    os.makedirs(os.path.dirname(menu_list_path), exist_ok=True)
    os.makedirs(os.path.dirname(new_menu_list_path), exist_ok=True)

    existing_menus = load_existing_menus(menu_list_path)
    existing_menu_sets = {restaurant: set(existing_menus[restaurant]) for restaurant in restaurant_keys}

    new_menus = extract_menu_items(data)
    new_menu_entries = {restaurant: set() for restaurant in restaurant_keys}

    new_items_found = False

    # 새로운 항목 -> 기존 메뉴 업데이트 및 new_menu_list.json에 추가

    for restaurant, menu_items in new_menus.items():
        new_items = menu_items - existing_menu_sets[restaurant]

        if new_items:
            print(f"새로운 메뉴 항목이 {restaurant}에 추가됨: {new_items}")
            new_menu_entries[restaurant].update(new_items)
            existing_menu_sets[restaurant].update(new_items)
            new_items_found = True

    if new_items_found:
        new_menu_entries_as_list = {restaurant: list(menu_items) for restaurant, menu_items in new_menu_entries.items() if menu_items}
        convert_to_json(new_menu_entries_as_list, new_menu_list_path)

    else:
        print('새로운 메뉴가 없습니다.') #디버깅

    updated_menus = {restaurant: list(existing_menu_sets[restaurant]) for restaurant in restaurant_keys}
    convert_to_json(updated_menus, menu_list_path)




#-------------mySQL연결 (db에서의 f-string은 자제하자)------------------------------------------------------

from dotenv import load_dotenv

load_dotenv()

def create_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PW"),
            database=os.getenv("DB_NAME"),
            charset='utf8mb4'
    )
    
        if connection.is_connected():
            print("MySQL 연결 성공")
        return connection
    
    except Error as e:
        print(f"Error: {e}")
        return None
    


def load_json_menu_dict(filename='menu_list.json'):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    menu_list_path = os.path.join(base_dir, 'menus', filename)

    with open(menu_list_path, 'r', encoding='utf-8') as f:
        return json.load(f)
    
def load_json_for_date(filename='dorm_meals.json'):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'samples', filename)

    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def div_mealtype(menu):
    meal_dict = {
        '주요리': [], 
        '밥/면류': [], 
        '국/찌개': [], 
        '디저트': [], 
        '반찬': []
    }
    

    dessert_li = "주스,쥬스,우유,요거트,샌드,요구르트,과일,바나나,귤,요러브,복숭아,사이다,딸기,파인애플,후르츠,방울토마토그린샐러드,콜라,쿨피스"
    mainDish = "제육,찜,묵은지고등어무조림,야채볶음,순대볶음,구이,전,미트볼폭찹조림,치킨,갈비,치킨까스,돈까스,불고기,떡갈비,또띠아,토스트,강정,탕수,카츠"

    dessert_li = dessert_li.split(',')
    mainDish = mainDish.split(',')

    if isinstance(menu, list):  #이중리스트땜에 
        for single_menu in menu:
            if '국' in single_menu or '탕' in single_menu or '찌개' in single_menu:
                meal_dict['국/찌개'].append(single_menu)
            elif '밥' in single_menu or '면' in single_menu or '짬뽕' in single_menu or '국수' in single_menu:
                meal_dict['밥/면류'].append(single_menu)
            elif any(des in single_menu for des in dessert_li):
                meal_dict['디저트'].append(single_menu)
            elif any(main_d in single_menu for main_d in mainDish):
                meal_dict["주요리"].append(single_menu)
            else:
                meal_dict['반찬'].append(single_menu)
    else:
        # 단일 문자열 메뉴 처리
        if '국' in menu or '탕' in menu or '찌개' in menu:
            meal_dict['국/찌개'].append(menu)
        elif '밥' in menu or '면' in menu or '짬뽕' in menu or '국수' in menu:
            meal_dict['밥/면류'].append(menu)
        elif any(des in menu for des in dessert_li):
            meal_dict['디저트'].append(menu)
        elif any(main_d in menu for main_d in mainDish):
            meal_dict["주요리"].append(menu)
        else:
            meal_dict['반찬'].append(menu)

    return meal_dict

def insert_data_into_db(menu_list, dorm_meals):
    
    # db에 데이터 초기화하려면은 npm run seed
    
    connection = create_connection()
    if connection is None:
        print("데이터베이스 연결 실패")
        return
    
    cursor = connection.cursor()

    try:
          # menu_list.json 데이터를 food_info 테이블에 삽입
        for restaurant, food_list in menu_list.items():
            # restaurant_id 찾기
            cursor.execute("SELECT restaurant_id FROM restaurants WHERE name = %s", (restaurant,))
            restaurant_id = cursor.fetchall()
            if restaurant_id:
                restaurant_id = restaurant_id[0][0]
            else:       
                #print(f"식당 '{restaurant}'이 존재하지 않습니다.")
                continue
            cursor.nextset()

            # food_info 테이블에 메뉴 삽입
            for food in food_list:
                cursor.execute(
                    "SELECT COUNT(*) FROM food_info WHERE name = %s AND restaurant_id = %s",
                    (food, restaurant_id)
                )

                count_result = cursor.fetchone()
                if count_result and count_result[0] == 0:  # 중복되지 않은 경우에만 삽입
                    cursor.execute(
                        "INSERT INTO food_info (name, restaurant_id) VALUES (%s, %s)",
                        (food, restaurant_id)
                    )
                # else:
                #     print(f"음식 '{food}'은 이미 restaurant_id {restaurant_id}에 존재합니다. 삽입을 건너뜁니다.")
                    

            connection.commit()
            
        print("menu_list 데이터를 food_info 테이블에 잘 삽입했습니다.")


        for restaurant_data in dorm_meals:
            restaurant = restaurant_data['res']  # 식당 이름
            date = restaurant_data.get('date', '')  # 날짜 (없을 경우 빈 문자열)
            
            if restaurant in restaurant_keys:
                for meal in restaurant_data.get('meals', []):   
                    when = meal.get('when', '')  # 조식, 중식, 석식 등
                    menu = meal.get('menu', '').replace('\n', ', ')  # 줄바꿈을 쉼표로 대체
                    cleaned_menu = clean_menu(menu)

                    split_menus = re.split(r'[\n/,]', cleaned_menu)
                    menu_items = [item.strip() for item in split_menus if item.strip()]

                    # restaurants 테이블에서 restaurant_id 찾기
                    cursor.execute("SELECT restaurant_id FROM restaurants WHERE name = %s", (restaurant,))
                    restaurant_id = cursor.fetchone()
                    if not restaurant_id:
                        print(f"식당 '{restaurant}'이 존재하지 않습니다.")
                        continue
                    restaurant_id = restaurant_id[0]

                    # 메뉴가 유효한지 체크
                    menu_found = False
                    for menu_item in menu_items:
                        cursor.execute(
                            "SELECT item_id FROM food_info WHERE name = %s AND restaurant_id = %s",
                            (menu_item, restaurant_id)
                        )
                        result = cursor.fetchone()
                        if result:
                            menu_found = True
                            break  # 하나라도 일치하면 menu_found를 True로 설정하고 중단

                    if not menu_found:
                        print(f"식당 '{restaurant}' 날짜 '{date}', '{when}'에 해당하는 유효한 메뉴가 없습니다.")
                        continue

                    # restaurants_meal 테이블에 삽입
                    cursor.execute(
                        "INSERT INTO restaurants_meal (restaurant_id, date, time) VALUES (%s, %s, %s)",
                        (restaurant_id, date, when)
                    )
                    menu_date_id = cursor.lastrowid  # 삽입된 menu_date_id 가져오기
                    


                    # 메뉴 항목 분류
                    meal_types = div_mealtype(menu_items)
                    #print(f"'{when}'의 식사 메뉴 분류: {meal_types}")

                    # restaurants_meal_food에 삽입
                    for meal_type, items in meal_types.items():
                        for item in items:
                            cursor.execute(
                                "SELECT item_id FROM food_info WHERE name = %s AND restaurant_id = %s",
                                (item, restaurant_id)
                            )
                            item_id = cursor.fetchone()
                            if not item_id:
                                #print(f"메뉴 '{item}'이 food_info에 존재하지 않습니다. 건너뛰어잇.")
                                continue
                            item_id = item_id[0]

                            # restaurants_meal_food 테이블에 삽입
                            cursor.execute(
                                "SELECT COUNT(*) FROM restaurants_meal_food WHERE menu_date_id = %s AND item_id = %s",
                                (menu_date_id, item_id)
                            )
                            result = cursor.fetchone()

                            # 결과가 있을 때만 처리
                            if result and result[0] == 0:
                                cursor.execute(
                                    "INSERT INTO restaurants_meal_food (menu_date_id, mealtype, item_id) VALUES (%s, %s, %s)",
                                    (menu_date_id, meal_type, item_id)
                                )


            connection.commit()  # 모든 작업 후 한 번만 commit
            #print(f"'{restaurant_name}'의 데이터 삽입 완료.")

        
    except Error as e:
        print(f"DB 삽입 중 오류 발생: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()
        print("데이터베이스 연결 종료")




def main():
    # 데이터베이스 연결 생성
    connection = create_connection()

    if connection is not None:
        try:
            # 메뉴 데이터와 기숙사 식사 데이터 로드
            menus = load_json_menu_dict('menu_list.json')
            dorm_data = load_json_for_date('dorm_meals.json')

            # 메뉴 삽입 함수 호출
            insert_data_into_db(menus, dorm_data)
        
        except FileNotFoundError as e:
            print(f"파일을 찾을 수 없음: {e}")
        except json.JSONDecodeError as e:
            print(f"JSON 디코딩 오류: {e}")
        
        finally:
            # 데이터베이스 연결 종료
            if connection.is_connected():
                connection.close()
    else:
        print("MySQL 연결 실패. 프로그램 종료.")



if __name__ == "__main__":
    main()