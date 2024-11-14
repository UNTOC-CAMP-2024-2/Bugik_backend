import json
import re
import os


base_directory = os.path.dirname(os.path.abspath(__file__))  # 현재 스크립트 파일의 절대 경로를 가져옴

# 상대 경로로 파일 경로 설정
file_path = os.path.join(base_directory, '..', '..', 'data', 'result.json')  # 두 단계 위로 올라가야 합니다.
output_file_path = os.path.join(base_directory, 'menu_list.json')  # 출력 파일 경로도 수정




restaurant_keys = [
    "문창회관 식당",
    "학생회관 학생 식당",
    "자유",
    "진리",
    "웅비",
    "금정회관 교직원 식당",
    "금정회관 학생 식당"
]

def clean_menu(menu):
    menu = re.sub(r'(\d+kcal|\d+g|영업시간\(\d{0,2}:\d{0,2}~\d{0,2}:\d{0,2}\)|없음|문의:\s*\d+-\d+-\d+)', '', menu)

    menu = re.sub(r'\d+', '', menu)
 
    menu = re.sub(r'\s+', ' ', menu)
    return menu.strip()


def extract_menu_items_from_file(file_path):
    restaurant_menus = {restaurant: set() for restaurant in restaurant_keys}

    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)


    for restaurant_data in data:
        for entry in restaurant_data:

            if entry['res'] in restaurant_keys:
                for meal in entry['meals']:
                    
                        try:
                            menu = meal['menu'].replace('\n<br>', ', ')  
                            cleaned_menu = clean_menu(menu)  

                            if entry['res'] in ["자유", "웅비"]:
                                menu_items = [item.strip() for item in re.split(r'[ ,/.]', cleaned_menu) if item.strip()]
                            
                            else:
                                menu_items = [item.strip() for item in re.split(r'[,/]', cleaned_menu) if item.strip()]
                        
                            restaurant_menus[entry['res']].update(menu_items)  

                        except KeyError:
                            pass

    return restaurant_menus

def extract_all_menu_items():

    all_restaurant_menus = extract_menu_items_from_file(file_path)
    
    return {restaurant: list(items) for restaurant, items in all_restaurant_menus.items()}


def convertTojson(data, output_file_path):

    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


result = extract_all_menu_items()

convertTojson(result, output_file_path)
