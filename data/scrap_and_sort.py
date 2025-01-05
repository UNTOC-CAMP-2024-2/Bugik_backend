import os
import json
import re
import requests
from datetime import datetime, timedelta

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
    
    return menu.strip()


# 데이터 가져오기 및 정리
def fetch_and_clean_meal_data():
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
                print(f"⚠️ {res_name} 데이터 요청 실패 (상태 코드: {response.status_code})")

    return all_data

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

# 메인 실행 로직
if __name__ == "__main__":
    meal_data = fetch_and_clean_meal_data()
    update_menus(meal_data)
