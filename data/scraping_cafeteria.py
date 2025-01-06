# 지금 테이블 안에 있는 자료들을 스스로 찾아서 긁어오려했는데 실패 -> 태그를 일일히 입력해야함함
# 식단이 안나와있어서 정확한 태그를 입력할 수가 없음..

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import os

# 식당 목록
res = [
    '금정회관 교직원 식당',
    '금정회관 학생 식당',
    '문창회관 식당',
    '학생회관 학생 식당'
]
# 샛벌회관 학생 식당 로직상 문제로 제외, 추후 추가 예정

# 브라우저 초기화
options = webdriver.ChromeOptions()

#화면 보기
#options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(options=options)

# 페이지 이동
driver.get('https://www.pusan.ac.kr/kor/CMS/MenuMgr/menuListOnBuilding.do?mCode=MN202#childTab_tmp')

for target in res:
    # 식당 이름 버튼 클릭
    try:
        link = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH, f"//a/span[text()='{target}']"))
        )
        ActionChains(driver).move_to_element(link).click(link).perform()
    except Exception as e:
        print(f"{target} 버튼 클릭 중 오류: {e}")
        continue

    # 금정회관 학생식당만 menu-tit03 클래스를 사용하므로 예외처리
    if target == '금정회관 학생 식당':
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'menu-tit03')))
    else:
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CLASS_NAME, 'menu-tit01')))

    # 데이터 추출
    try:
        day = [element.text.strip() for element in driver.find_elements(By.CSS_SELECTOR, 'div.day')] #금학 
        date = [element.text.strip() for element in driver.find_elements(By.CSS_SELECTOR, 'div.date')] #금학
        when = [element.text.strip() for element in driver.find_elements(By.CSS_SELECTOR, 'tbody > tr > th')] 

        # 금정회관 교직원 식당, 문창회관 식당의 경우 중식만 운영
        # 샛벌회관 식당의 경우 중식, 석식만 운영
        if target in ['금정회관 교직원 식당', '문창회관 식당']:
            when = [text for text in when if '중식' in text]
        elif target == '샛벌회관 식당':
            when = [text for text in when if '중식' in text or '석식' in text]

        # 금정회관 학생식당과 문창회관 식당 menu-tit03 클래스를 같이 사용하므로 예외처리
        if target in ['금정회관 학생 식당', '문창회관 식당']:
            meal_type = [
                element.get_attribute('innerHTML').strip()
                for element in driver.find_elements(By.CSS_SELECTOR, '.menu-tit03, .menu-tit01')
            ]
        else:
            meal_type = [
                element.get_attribute('innerHTML').strip()
                for element in driver.find_elements(By.CSS_SELECTOR, '.menu-tit01')
            ]

        menu = [
            element.get_attribute('innerHTML').strip()
            for element in driver.find_elements(By.CSS_SELECTOR, 'li > p')
        ]

        result = {
            "res": target,
            "day": day,
            "date": date,
            "when": when,
            "mealType": meal_type,
            "menu": menu
        }

        # JSON 파일로 저장
        script_dir = os.path.dirname(os.path.abspath(__file__))
        filename = os.path.join(script_dir, 'data', 'samples', f'{target}.json')

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"{filename}로 저장되었습니다.")

    except Exception as e:
        print(f"{target} 데이터 추출 중 오류: {e}")
        continue

# 브라우저 닫기
driver.quit()
