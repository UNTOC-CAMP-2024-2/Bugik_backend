//기숙사별
//학생식당별 

//메뉴 리스트 작성 프로그램 제작 해야함

/*

주의사항: '조기식 제외', '없음' 같은 데이터가 있을수도 있는데 그러면 include 제외,없음 하셔서 예외 처리 하시면 될꺼같아요.

진리 메뉴 형식: 흑미밥/두부김치국/찹쌀탕수육/쥐포무침/깻잎순조림/배추김치/142kcal/58g 
(/ 기반 split)
(kcal이나 g replace to '' 해줘야함)

웅비 메뉴 형식: 백미밥\n순두부찌개(E)\n동그랑땡계란전(P,E)/케찹\n참치김치볶음\n구이김/유장\n깍두기\n프로바이오틱스
(\n 기반 split)
((가로) replace to '' 다 해주세요)

자유 메뉴 형식: 백미밥\n땡초콩나물국\n훈제오리숙주볶음(D)\n쌈무/머스타드\n핫타이누들샐러드\n깍두기
(\n 기반 split)
((가로) replace to '' 다 해주세요)

금정회관 교직원 식당 메뉴 형식: 잡곡밥\n<br>감자계란국\n<br>돈육버섯편마늘볶음\n<br>우엉샐러드/소스\n<br>오징어어묵매콤무침\n<br>콩나물무침\n<br>포기김치\n<br>
(\n<br> 기반 split)

금정회관 학생 식당 메뉴 형식: 기장밥\n<br>콩나물유부장국\n<br>돈가스/소스\n<br>비엔나햄볶음\n<br>모밀야채무침\n<br>배추김치\n<br>
(\n<br> 기반 split)

문창회관 식당 메뉴 형식: 
자장면or(밥)\n<br>삼선짬뽕or(밥)\n<br>새우볶음밥\n<br>돼지고기 탕수육\n<br>칠리새우 등\n<br>영업시간(11:00~21:00)\n<br>문의: 051-517-7173
돼지국밥\n<br>순대국밥\n<br>섞어국밥\n<br>황태국밥\n<br>모듬순대 등\n<br>운영시간(11:00~16:00)
(\n<br> 기반 split)
(운영시간, 문의 replace to '' 다 부탁해요)

학생회관 학생 식당 메뉴 형식: 잡곡밥\n<br>닭개장\n<br>제육볶음\n<br>감자고로케\n<br>애기새송이곤약조림\n<br>얼갈이겉절이\n<br>배추김치\n<br
(\n<br> 기반 split)

menus 폴더 안에 각 기숙사,학생식당 별로 메뉴 파일 만들어서 정리 자동으로 하는 프로그램 제작해주세요. 민혁이형

*/