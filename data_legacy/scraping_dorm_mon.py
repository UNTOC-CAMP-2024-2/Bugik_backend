####API로 스크래핑

import os
import json
import requests
from datetime import datetime, timedelta

# API URL 정보
API_URLS = {
    "자유": "https://middle.pusan.ac.kr:8443/meal/sub?no=13&startDt={start}&endDt={end}",
    "웅비": "https://middle.pusan.ac.kr:8443/meal/sub?no=11&startDt={start}&endDt={end}",
    "진리": "https://middle.pusan.ac.kr:8443/meal/sub?no=2&startDt={start}&endDt={end}",
}

# 현재 날짜 기준 2개월치 날짜 생성
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

# API 요청 및 데이터 수집
def fetch_meal_data():
    start_date = datetime.today()  # 오늘 날짜 기준
    date_ranges = generate_date_ranges(start_date, months=2) #2개월치 

    all_data = []

    for res_name, url_template in API_URLS.items():
        for start, end in date_ranges:
            url = url_template.format(start=start, end=end)
            print(f"{res_name} 데이터를 요청 중: {url}")
            response = requests.get(url)
            if response.status_code == 200:
                meals = response.json()
                #print(f"응답 데이터 ({res_name}): {meals}")  # 디버깅용

                # 날짜별 데이터를 그룹화
                grouped_meals = {}
                for meal in meals:
                    date = meal.get("mealDate")
                    meal_kind = meal.get("codeNm")
                    meal_menu = meal.get("mealNm", "정보 없음").replace("\n", ", ")  # 줄바꿈을 쉼표로 변환

                    if date not in grouped_meals:
                        grouped_meals[date] = {
                            "date": date,
                            "day": get_korean_day_of_week(date),
                            "meals": {}
                        }

                    # 조식, 중식, 석식을 키로 구분
                    if meal_kind in ["조식", "중식", "석식"]:
                        grouped_meals[date]["meals"][meal_kind] = meal_menu

                # JSON 형식으로 데이터 정리
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


# JSON 저장
def save_to_json(data, filename="dorm_meals.json"):
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'samples')
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"{filepath}에 데이터가 저장되었습니다.")

# 메인 실행 로직
if __name__ == "__main__":
    meal_data = fetch_meal_data()
    save_to_json(meal_data)
