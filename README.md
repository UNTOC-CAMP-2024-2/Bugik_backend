# BUGIK_BACKEND

부산대학교 학식 및 기숙사 식당 정보 공유 커뮤니티 플랫폼

---

아래 사항은 프로젝트 구조 및 기능 계획입니다.

## **프로젝트 구조**

```
/src
|-- /controllers        
|   |-- mealController.ts
|   |-- mealReviewController.ts
|   |-- menuDatesController.ts
|   |-- menuRatingController.ts
|   |-- restaurantController.ts
|   |-- userController.ts
|
|-- /routes              
|   |-- index.ts         
|   |-- menu.ts          # 메뉴 관련 라우트
|   |-- rate.ts          # 평점 관련 라우트
|   |-- restaurant.ts    # 식당 관련 라우트
|   |-- review.ts        # 리뷰 관련 라우트
|   |-- user.ts          # 사용자 관련 라우트
|
|-- /middlewares         # 미들웨어 
|   |-- auth.ts          # JWT 인증 미들웨어
|
|-- /models              # 데이터베이스 모델 정의(ORM 쓸지말지 고민중중)
|   |-- mealModel.ts
|   |-- reviewModel.ts
|   |-- userModel.ts
|   |-- restaurantModel.ts
|
|-- /utils              
|   |-- jwt.ts           # JWT 관련 유틸리티
|   |-- responseHelper.ts # 응답 처리 헬퍼
|
|-- /data               
|   |-- db.ts            # MySQL 연결 풀
|
|-- app.ts               
|-- .env                 # 환경 변수 파일
|-- tsconfig.json        # TypeScript 설정 파일
```

---

## **기능 설명**

### **1. 사용자(User)**
- **로그인**
  - `POST /api/v1/users/login`
  - 학번과 비밀번호로 로그인 후 JWT 토큰 발급.

- **API Input**:
  ```json
  {
      "student_id": 1,
      "password": "password123"
  }
  ```
- **API Output**:
  ```json
  {
      "message": "Login successful",
      "token": "<JWT>"
  }
  ```

---

### **2. 메뉴(Menu)**
- **특정 날짜의 메뉴 조회**
  - `GET /api/v1/menus/dates?date=<YYYY-MM-DD>`
  - 특정 날짜와 식당의 메뉴 데이터를 조회.

- **API Output**:
  ```json
  {
      "date": "2024-11-14",
      "restaurants": [
          {
              "restaurant_id": 1,
              "name": "진리",
              "meals": [
                  {
                      "meal_id": 10,
                      "when_time": "조식",
                      "meal_type": "기숙사식",
                      "menu_items": [
                          { "food_item": "닭야채죽", "calories": 1166, "protein": 63.0 }
                      ]
                  }
              ]
          }
      ]
  }
  ```

---

### **3. 리뷰(Review)**
- **리뷰 작성**
  - `POST /api/v1/reviews`
  - 특정 식사 시간에 대해 리뷰 작성 (파일 업로드 포함).

- **API Input**:
  ```json
  {
      "meal_id": 10,
      "comment": "아침식사가 훌륭했어요!",
      "photo_path": "/images/breakfast.jpg"
  }
  ```

- **API Output**:
  ```json
  {
      "message": "Review added successfully",
      "review_id": 123
  }
  ```

---

### **4. 평점(Rating)**
- **평점 등록**
  - `POST /api/v1/ratings`
  - 특정 메뉴에 평점을 등록.

- **API Input**:
  ```json
  {
      "item_id": 101,
      "rating_value": 5
  }
  ```

- **API Output**:
  ```json
  {
      "message": "Rating added successfully",
      "rating_id": 456
  }
  ```

---

## **데이터베이스 구조**

### **1. users**

- 사용자 정보를 저장.
- **컬럼**:
  - `student_id`: 학번 (Primary Key)
  - `nickname`: 닉네임
  - `belonging_uni`: 소속 대학

### **2. restaurants**

- 식당 정보를 저장.
- **컬럼**:
  - `restaurant_id`: 식당 ID (Primary Key)
  - `name`: 식당 이름
  - `location`: 식당 위치

### **3. menu_dates**

- 특정 날짜에 제공되는 메뉴 정보를 저장.
- **컬럼**:
  - `menu_date_id`: ID (Primary Key)
  - `restaurant_id`: 식당 ID (Foreign Key)
  - `date`: 날짜
  - `day_of_week`: 요일

### **4. meals**

- 식사 시간별 메뉴 정보를 저장.
- **컬럼**:
  - `meal_id`: 식사 ID (Primary Key)
  - `menu_date_id`: 메뉴 날짜 ID (Foreign Key)
  - `when_time`: 식사 시간 (조식, 중식, 석식)
  - `meal_type`: 식사 유형

### **5. meal_items**

- 개별 메뉴 항목 정보를 저장.
- **컬럼**:
  - `item_id`: 항목 ID (Primary Key)
  - `meal_id`: 식사 ID (Foreign Key)
  - `food_item`: 음식 이름
  - `calories`: 칼로리
  - `protein`: 단백질 함량

### **6. meal_reviews**

- 리뷰 정보를 저장.
- **컬럼**:
  - `review_id`: 리뷰 ID (Primary Key)
  - `meal_id`: 식사 ID (Foreign Key)
  - `student_id`: 작성자 학번 (Foreign Key)
  - `comment`: 리뷰 내용
  - `photo_path`: 사진 경로
  - `review_date`: 리뷰 작성 날짜

### **7. menu_ratings**

- 메뉴 평점 정보를 저장.
- **컬럼**:
  - `rating_id`: 평점 ID (Primary Key)
  - `item_id`: 메뉴 항목 ID (Foreign Key)
  - `student_id`: 작성자 학번 (Foreign Key)
  - `rating_value`: 평점 값
  - `rating_date`: 평점 등록 날짜

### **8. restaurant_rankings**

- 식당 랭킹 정보를 저장.
- **컬럼**:
  - `ranking_id`: 랭킹 ID (Primary Key)
  - `restaurant_id`: 식당 ID (Foreign Key)
  - `total_score`: 총점 (평균 평점)
  - `rank`: 랭킹 순위
  - `ranking_date`: 랭킹 산출 날짜


---

## **기술 스택**
- **백엔드**: Node.js, Express
- **데이터베이스**: MySQL
- **인증**: JWT (JSON Web Token)
- **파일 업로드**: Multer
- **캐싱**: Redis

---