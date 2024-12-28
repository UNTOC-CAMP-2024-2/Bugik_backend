import db from './data/db';

/**
 * 많은 Seed 데이터 삽입 예시
 */
async function seedData() {
  try {
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE food_reviews');
    await db.query('TRUNCATE TABLE restaurants_meal_food');
    await db.query('TRUNCATE TABLE meal_reviews');
    await db.query('TRUNCATE TABLE restaurants_meal');
    await db.query('TRUNCATE TABLE food_info');
    await db.query('TRUNCATE TABLE menu_rank');
    await db.query('TRUNCATE TABLE restaurant_rank');
    await db.query('TRUNCATE TABLE restaurants');
    await db.query('TRUNCATE TABLE users');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('➕ (1) users 데이터 삽입');
    await db.execute(`
      INSERT INTO users (user_id, belonging_uni, nickname)
      VALUES
        ('202412345', '정보의생명대학', 'nick1'),
        ('202412346', '공과대학', 'nick2'),
        ('202412347', '경영대학', 'nick3'),
    `);
    await db.execute(`
      INSERT INTO restaurants (name, type)
      VALUES
        ('진리', '기숙사'),
        ('웅비', '기숙사'),
        ('자유', '기숙사'),
        ('금정회관', '학교식당'),
        ('학생회관', '학교식당'),
    `);
    await db.execute(`
      INSERT INTO restaurants_meal (restaurant_id, date, day_of_week, time)
      VALUES
        -- restaurant_id = 1 (진리), 날짜 6개
        (1, '2024-01-01', '월', '조식'),
        (1, '2024-01-02', '화', '조식'),
        (1, '2024-01-03', '수', '조식'),
        (1, '2024-01-04', '목', '조식'),
        (1, '2024-01-05', '금', '조식'),
        (1, '2024-01-06', '토', '조식'),

        -- restaurant_id = 2 (웅비), 날짜 6개
        (2, '2024-01-01', '월', '중식'),
        (2, '2024-01-02', '화', '중식'),
        (2, '2024-01-03', '수', '중식'),
        (2, '2024-01-04', '목', '중식'),
        (2, '2024-01-05', '금', '중식'),
        (2, '2024-01-06', '토', '중식'),

        -- restaurant_id = 3 (자유), 날짜 6개
        (3, '2024-01-01', '월', '석식'),
        (3, '2024-01-02', '화', '석식'),
        (3, '2024-01-03', '수', '석식'),
        (3, '2024-01-04', '목', '석식'),
        (3, '2024-01-05', '금', '석식'),
        (3, '2024-01-06', '토', '석식')
    `);
    await db.execute(`
      INSERT INTO meal_reviews (menu_date_id, user_id, comment, photo_path)
      VALUES
        (1, '202412345', '매우 만족스러웠습니다.', '/img/m1.jpg'),
        (2, '202412345', '양이 조금 적었어요.', '/img/m2.jpg'),
        (3, '202412346', '맛이 아주 좋았습니다.', NULL),
        (4, '202412346', '보통이었어요.', NULL),
        (5, '202412347', '기대 이상이었습니다.', '/img/m3.jpg'),
        (6, '202412347', '소소했어요.', '/img/m4.jpg'),
        (7, '202412347', '재료가 신선해요.', NULL),
    `);
    await db.execute(`
      INSERT INTO food_info (name, restaurant_id, explanation)
      VALUES
        ('닭야채죽', 1, '닭고기와 야채가 들어간 든든한 죽'),
        ('계란말이', 1, '부드러운 식감의 계란말이'),
        ('김치찌개', 2, '묵은지로 맛을 낸 칼칼한 찌개'),
        ('된장찌개', 2, '구수한 전통 된장찌개'),
        ('돈까스정식', 3, '바삭한 돈까스와 밥, 반찬 세트'),
        ('제육볶음', 3, '매콤달콤한 양념이 매력적'),
        ('샐러드', 3, '다양한 채소로 만든 신선한 샐러드'),
        ('스파게티', 1, '토마토 소스로 만든 파스타'),
        ('오므라이스', 1, '계란으로 감싼 볶음밥'),
        ('북어국', 2, '담백한 맛의 북어국')
    `);
    await db.execute(`
      INSERT INTO restaurants_meal_food (menu_date_id, mealtype, item_id)
      VALUES
        (1, '주요리', 1),
        (1, '반찬', 2),
        (2, '주요리', 3),
        (2, '국/찌개', 4),
        (3, '주요리', 5),
        (3, '반찬', 6),
        (4, '반찬', 2),
        (4, '국/찌개', 3),
        (5, '주요리', 1),
        (5, '국/찌개', 4),
        (6, '밥/면류', 8),
        (7, '주요리', 5),
        (7, '밥/면류', 9),
        (8, '주요리', 1),
        (8, '반찬', 2),
        (9, '주요리', 6),
        (9, '국/찌개', 3),
        (10, '반찬', 2),
        (10, '주요리', 1),
        (11, '주요리', 5),
        (11, '반찬', 6),
        (12, '밥/면류', 9),
        (12, '반찬', 2),
        (13, '주요리', 3),
        (13, '반찬', 2),
        (14, '국/찌개', 4),
        (14, '주요리', 1),
        (15, '밥/면류', 8),
        (16, '주요리', 5),
        (16, '국/찌개', 3),
        (17, '밥/면류', 9),
        (17, '반찬', 2),
        (18, '주요리', 1),
        (18, '국/찌개', 4),
        -- 추가로 몇 개 더 중복 메뉴_date_id/아이템 섞어서
        (1, '디저트', 7),
        (2, '디저트', 7),
        (3, '디저트', 7),
        (4, '디저트', 7),
        (5, '디저트', 7),
        (6, '디저트', 7)
    `);
    await db.execute(`
      INSERT INTO food_reviews (review_id, item_id, user_id, rating_value, comment)
      VALUES
        (1, 1, 'user1', 5, '닭야채죽이 아주 맛있었어요.'),
        (2, 3, 'user2', 4, '김치찌개 괜찮았습니다.'),
        (3, 5, 'user3', 4, '돈까스정식 바삭하고 좋아요.'),
        (4, 2, 'user4', 3, '계란말이는 무난합니다.'),
        (5, 6, 'user5', 5, '제육볶음 끝내주네요.'),
        (6, 4, 'user6', 4, '된장찌개 구수했습니다.'),
        (7, 7, 'user7', 3, '샐러드는 신선하지만 평범.'),
        (8, 8, 'user8', 5, '스파게티 최고의 맛!'),
        (9, 9, 'user9', 4, '오므라이스도 꽤 맛있었습니다.'),
        (10, 10, 'user10', 2, '북어국은 조금 싱거웠어요.'),
        (11, 1, 'user11', 4, '닭야채죽 뚝딱했네요.'),
        (12, 5, 'user12', 3, '돈까스정식 조금 기름졌어요.'),
        (13, 1, 'user1', 5, '다시 먹어도 맛있습니다.'),
        (14, 3, 'user2', 2, '김치찌개 이번엔 별로...'),
        (15, 4, 'user3', 5, '된장찌개가 의외로 대박.'),
        (16, 2, 'user4', 4, '계란말이, 촉촉하네요.'),
        (17, 9, 'user5', 5, '오므라이스 부드럽습니다.'),
        (18, 6, 'user6', 3, '제육볶음 평타.'),
        (19, 7, 'user7', 5, '샐러드 아주 신선합니다.'),
        (20, 8, 'user8', 4, '스파게티 다소 짰어요.'),
        (21, 2, 'user9', 5, '계란말이 최고!'),
        (22, 3, 'user10', 1, '김치찌개 엄청 짰습니다.'),
        (23, 1, 'user11', 4, '죽은 속 편해서 좋아요.'),
        (24, 10, 'user12', 5, '북어국 몸에 좋은 맛.'),
        (25, 9, 'user1', 5, '오므라이스 다시 먹고 싶네요.'),
        (26, 4, 'user2', 4, '된장찌개 계속 생각나요.'),
        (27, 5, 'user3', 3, '돈까스정식은 평범.'),
        (28, 8, 'user4', 5, '스파게티 인생 맛집입니다.'),
        (29, 9, 'user5', 3, '오므라이스 괜찮은 편.'),
        (30, 2, 'user6', 5, '계란말이 맛있게 잘 먹었습니다.')
    `);
    await db.execute(`
      INSERT INTO menu_rank (item_id, rating_value)
      VALUES
        (1, 4.50),
        (2, 4.10),
        (3, 3.85),
        (4, 4.25),
        (5, 4.30),
        (6, 4.50),
        (7, 3.90),
        (8, 4.70),
        (9, 4.20),
        (10, 3.60),
        (1, 4.55),  -- 예: 중복 아이템 기록을 위해(실제로는 PK나 Unique가 없으면 가능)
        (2, 4.20),
        (3, 3.95),
        (4, 4.40),
        (5, 4.50)
    `);
    await db.execute(`
      INSERT INTO restaurant_rank (restaurant_id, rating_value, rank)
      VALUES
        (1, 4.60, 1),
        (2, 4.30, 2),
        (3, 4.15, 3),
        (4, 4.00, 4),
        (5, 3.95, 5),
        (6, 3.80, 6),
        (1, 4.70, 1), -- 예: 이력 누적용(실제로 PK/Unique 설계에 따라 다름)
        (2, 4.50, 2)
    `);
    console.log('✅ 테스트 데이터 삽입 성공');
  } catch (error) {
    console.error('❌ 오류: ', error);
  } finally {
    await db.end();
    console.log('🌱 DB 연결 종료');
  }
}

seedData();
