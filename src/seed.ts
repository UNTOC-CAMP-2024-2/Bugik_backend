import db from './data/db'; 

async function seedData() {
  try {
    console.log('[Seed] Seeding data...');

    // 0) 테이블 초기화
    console.log('[Seed] Resetting tables...');
    await db.execute('SET FOREIGN_KEY_CHECKS = 0');
    await db.execute('TRUNCATE TABLE food_reviews');
    await db.execute('TRUNCATE TABLE restaurants_meal_food');
    await db.execute('TRUNCATE TABLE food_info');
    await db.execute('TRUNCATE TABLE meal_reviews');
    await db.execute('TRUNCATE TABLE restaurants_meal');
    await db.execute('TRUNCATE TABLE restaurants');
    await db.execute('TRUNCATE TABLE users');
    await db.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('[Seed] Tables reset complete.');

    // 1) users 테이블
    await db.execute(`
      INSERT INTO users (email, nickname, college, phone_number)
      VALUES
        ('user1@test.com', '유저1', '정보의생명대학', '010-1111-1111'),
        ('user2@test.com', '유저2', '공과대학', '010-2222-2222'),
        ('user3@test.com', '유저3', '예술대학', '010-3333-3333'),
        ('user4@test.com', '유저4', '경영대학', '010-4444-4444'),
        ('user5@test.com', '유저5', '나노대학', '010-5555-5555')
    `);

    console.log('[Seed] Inserted users.');

    // 2) restaurants 테이블
    await db.execute(`
      INSERT INTO restaurants (name, type)
      VALUES
        ('진리', '기숙사'),
        ('웅비', '학교식당'),
        ('금정회관 교직원 식당', '학교식당'),
        ('금정회관 학생 식당', '학교식당'),
        ('문창회관 식당', '학교식당')
    `);

    console.log('[Seed] Inserted restaurants.');

    // 3) restaurants_meal 테이블
    await db.execute(`
      INSERT INTO restaurants_meal (restaurant_id, date, time)
      VALUES
        (1, '2024-11-14', '조식'),
        (1, '2024-11-14', '중식'),
        (2, '2024-11-14', '조식'),
        (2, '2024-11-15', '석식'),
        (3, '2024-11-11', '중식'), 
        (3, '2024-11-12', '중식'), 
        (4, '2024-11-11', '조식'), 
        (4, '2024-11-11', '중식'), 
        (5, '2024-11-11', '중식')  
    `);

    console.log('[Seed] Inserted restaurants_meal.');

    // 4) meal_reviews 테이블
    await db.execute(`
      INSERT INTO meal_reviews (menu_date_id, email, comment, photo_path)
      VALUES
        (1, 'user1@test.com', '조식이 맛있어요!', '/images/breakfast1.jpg'),
        (2, 'user2@test.com', '중식, 무난했습니다.', '/images/lunch1.jpg'),
        (3, 'user1@test.com', '웅비 조식도 괜찮네요.', '/images/breakfast2.jpg'),
        (6, 'user5@test.com', '금정회관 중식, 괜찮았어요.', '/images/lunch2.jpg'),
        (7, 'user4@test.com', '문창회관 식당의 비빔밥은 최고입니다.', '/images/lunch3.jpg')
    `);

    console.log('[Seed] Inserted meal_reviews.');

    // 5) food_info 테이블
    await db.execute(`
      INSERT INTO food_info (name, restaurant_id, explanation)
      VALUES
        ('김치찌개', 1, '매콤하고 진한 맛'),
        ('불고기',   1, '달콤 짭조름한 불고기'),
        ('샌드위치', 2, '간단한 식사로 제격'),
        ('라면',     2, '즉석 라면'),
        ('잡곡밥',   3, '영양 밥'),
        ('강황밥',   3, '특유의 향과 맛'),
        ('비빔밥',   5, '다양한 나물과 고추장이 어우러진 한식'),
        ('카레라이스', 2, '한국식 카레라이스로 든든한 한 끼'),
        ('참치샐러드', 5, '신선한 참치와 채소로 만든 샐러드'),
        ('된장찌개', 3, '전통 된장의 깊은 맛'),
        ('우동', 4, '담백하고 깔끔한 맛의 일본식 국수'),
        ('돈가스', 2, '바삭한 튀김과 부드러운 고기'),
        ('오므라이스', 5, '부드러운 계란과 케첩 밥의 조화'),
        ('찜닭', 1, '매콤달콤한 닭요리'),
        ('짜장면', 5, '춘장의 풍미가 가득한 중국식 면요리'),
        ('양념갈비', 3, '고소한 숯불향과 달콤한 양념'),
        ('해물파전', 4, '바삭하고 고소한 해물 부침개'),
        ('순두부찌개', 2, '부드럽고 얼큰한 한식 찌개'),
        ('콩나물국밥', 5, '시원한 국물이 일품인 한식'),
        ('매운닭볶음', 5, '맵고 달콤한 닭볶음 요리'),
        ('갈비탕', 3, '진하고 깊은 국물의 한식 스프')
    `);

    console.log('[Seed] Inserted food_info.');

    // 6) restaurants_meal_food 테이블
    await db.execute(`
      INSERT INTO restaurants_meal_food (menu_date_id, mealtype, item_id)
      VALUES
        (1, '국/찌개', 1),  -- menu_date_id=1 + item_id=1(김치찌개)
        (1, '주요리',   2),  -- (불고기)
        (1, '반찬',    14),  -- 찜닭
        (1, '디저트',  10),  -- 된장찌개
        (1, '밥/면류',     15), -- 짜장면
        (2, '밥/면류',       5),  -- 잡곡밥
        (2, '국/찌개', 19),  -- 순두부찌개
        (2, '주요리',   7),  -- 비빔밥
        (2, '반찬',    18),  -- 해물파전
        (2, '디저트',   9),  -- 참치샐러드
        (3, '밥/면류',    11),  -- 우동
        (3, '주요리',   8),  -- 카레라이스
        (3, '반찬',    14),  -- 찜닭
        (3, '국/찌개', 20), -- 갈비탕
        (3, '밥/면류',      13), -- 오므라이스
        (4, '주요리',  16), -- 양념갈비
        (4, '국/찌개', 20), -- 갈비탕
        (4, '반찬',    18), -- 해물파전
        (4, '디저트',  10), -- 된장찌개
        (4, '밥/면류',     4)  -- 라면
    `);

    console.log('[Seed] Inserted restaurants_meal_food.');

    // 7) food_reviews 테이블
    await db.execute(`
      INSERT INTO food_reviews (review_id, item_id, rating_value, comment)
      VALUES
        (1, 1, 5, '김치찌개 정말 맛있어요'),
        (1, 2, 4, '불고기도 괜찮았어요'),
        (2, 2, 3, '불고기 조금 짰어요'),
        (3, 3, 4, '샌드위치 담백합니다'),
        (3, 4, 2, '라면이 조금 불어서 아쉬움')
    `);

    console.log('[Seed] Inserted food_reviews.');

    console.log('[Seed] All data inserted successfully!');
  } catch (error) {
    console.error('[Seed] Error inserting data:', error);
  } finally {
    await db.end(); 
    console.log('[Seed] DB connection closed.');
  }
}

seedData();
