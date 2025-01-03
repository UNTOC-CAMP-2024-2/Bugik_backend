import os
import subprocess
import sys

# 현재 스크립트의 디렉토리
base_directory = os.path.dirname(os.path.abspath(__file__))

# scraping_dorm.py 실행
scraping_dorm_path = os.path.join(base_directory, 'scraping_dorm.py')
subprocess.run([sys.executable, scraping_dorm_path], check=True)

# all_sortedList.py 실행
all_sorted_list_path = os.path.join(base_directory, 'all_sortedList.py')
subprocess.run([sys.executable, all_sorted_list_path], check=True)
