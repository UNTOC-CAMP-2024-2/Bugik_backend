import json
import re


file_path = r'C:\projects\back\Alien_slaves_backend\data\result.json'


with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

def clean_menu(menu):
    menu = re.sub(r'(\d+kcal|\d+g|영업시간\(\d{0,2}:\d{0,2}~\d{0,2}:\d{0,2}\)|없음|문의:\s*\d+-\d+-\d+)', '', menu)

    menu = re.sub(r'\d+', '', menu)
 
    menu = re.sub(r'\s+', ' ', menu)
    return menu.strip()


def extract_menu_items(data):
    all_menu_items = set()
    
    for restaurant_data in data:
        for entry in restaurant_data:
            for meal in entry['meals']:
                
                if entry['res'] == "금정회관 학생 식당":
                    try:
                        menu = meal['menu'].replace('\n<br>', ', ')
                        cleaned_menu = clean_menu(menu)
                        
                        menu_items = [item.strip() for item in re.split(r'[,/]', cleaned_menu) if item.strip()]
                        
                        all_menu_items.update(menu_items)
                    except KeyError:
                        pass

    return list(all_menu_items)


print(extract_menu_items(data))
