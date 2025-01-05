import os
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

# Chrome 드라이버 설정
service = Service(ChromeDriverManager().install())
options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')


# 브라우저 실행
driver = webdriver.Chrome(service=service)
driver.get('https://dorm.pusan.ac.kr/dorm/function/mealPlan/20000403')

driver.implicitly_wait(10)

# HTML 파싱
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

date_day_elements = soup.select('.hr_dotted > .vertical-center > h4 > strong')
date_day = [element.get_text(strip=True) for element in date_day_elements]

# 조식, 중식, 석식 정보 추출
dates_elements = soup.select('td > span')
dates = [element.get_text(strip=True) for element in dates_elements]

menus_elements = soup.select('.hr_dotted > .col-sm-8')
menus = [element.get_text(strip=True) for element in menus_elements]

json_data = []
index = 0

for i, date_day_item in enumerate(date_day):
    match = re.match(r"(\d{4}-\d{2}-\d{2})(.*)", date_day_item.replace("\n", ""))
    date, day = match.groups() if match else ("", "")

    meals = []
    for j in range(3):  # 조식, 중식, 석식
        meals.append({
            "when": dates[index],
            "mealType": "기숙사식",
            "menu": menus[index]
        })
        index += 1

    res = "진리" if i < 8 else "웅비" if i < 15 else "자유"

    json_data.append({
        "res": res,
        "date": date.strip(),
        "day": day.strip(),
        "meals": meals
    })

# JSON 파일 저장 경로 수정
script_dir = os.path.dirname(os.path.abspath(__file__))

os.chdir(script_dir)
filename = os.path.join(script_dir, 'samples', 'dorm.json')

os.makedirs(os.path.dirname(filename), exist_ok=True)

with open(filename, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, ensure_ascii=False, indent=2)

print(f"{filename}로 저장되었습니다.")

driver.quit()
