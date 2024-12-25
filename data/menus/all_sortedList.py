# 실행 => menu_list.json & result.json 파일 
# => !(in menu_list) => 메뉴를 append to menu_list.json & new_menu_list

import json
import re
import os


base_directory = os.path.dirname(os.path.abspath(__file__)) 

file_path = os.path.join(base_directory, '..', '..', 'data', 'result.json')  
menu_list_path = os.path.join(base_directory, 'menu_list.json') 
new_menu_list_path = os.path.join(base_directory, 'new_menu_list.json') 



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

    menu = re.sub(r'(\d+kcal|\d+g|영업시간\(\d{0,2}:\d{0,2}~\d{0,2}:\d{0,2}\)|운영시간\(:~:\)|없음|문의:\s*\d+-\d+-\d+)', '', menu)
    
    menu = re.sub(r'\d+', '', menu)  #수
    
    menu = re.sub(r'\s+', ' ', menu) #공백
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

def extract_all_menu_items():    #요거는 메뉴 추출을 단독으로 하는 함수 (중복확인 없이 그냥)

    all_restaurant_menus = extract_menu_items_from_file(file_path)
    
    return {restaurant: list(items) for restaurant, items in all_restaurant_menus.items()}


def convertTojson(data, wishToMakePath):

    with open(wishToMakePath, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def load_existing_menus(menu_list_path):
    if os.path.exists(menu_list_path):
        with open(menu_list_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    return {restaurant: [] for restaurant in restaurant_keys}


def update_menus():
    exist_menu = load_existing_menus(menu_list_path)
    exist_menu_lists = {restaurant: set(exist_menu[restaurant]) for restaurant in restaurant_keys}

    new_menus = extract_menu_items_from_file(file_path)
    new_menu_entries = {restaurant: [] for restaurant in restaurant_keys}

    for restaurant, menu_items in new_menus.items():
        new_items = menu_items - exist_menu_lists[restaurant]

        if new_items:
            new_menu_entries[restaurant].extend(new_items)
            exist_menu_lists[restaurant].update(new_items)



    if any(new_menu_entries.values()):  #새로운 메뉴 있으면은 저장함
        convertTojson(new_menu_entries, new_menu_list_path)


result = extract_all_menu_items()  #result = 딕셔너리! ex) 문창 : [밥, 국 ...]

convertTojson(result, menu_list_path)  #먼저 호출해서 menu_list를 일단 생성해


update_menus()  #추가된 놈들을 업데이트해서 기존 menu_list.json에 추가, new_menu_list.json 만들어서 새 정보 다루기