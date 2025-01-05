// 일관된 json 형태로 필터링 프로그램

const fs = require('fs');
const res = [
  '금정회관 교직원 식당', 
  '금정회관 학생 식당', 
  '문창회관 식당', 
  '학생회관 학생 식당'
];

for (let target of res) {
  fs.readFile(`./samples/${target}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error("파일을 읽는 중 오류 발생:", err);
      return;
    }

    const jsonData = JSON.parse(data);
    let result;
    switch (target) {
      case '금정회관 교직원 식당':
        result = jsonData.date.map((date, index) => ({
          res: jsonData.res[0],
          date: date.replace(/\./g, '-'),
          day: jsonData.day[index] + "요일",
          meals: [
            { when: "조식", mealType: "없음", menu: "없음" },
            { when: jsonData.when[0].split('\n')[0], mealType: jsonData.mealType[index], menu: jsonData.menu[index] },
            { when: "석식", mealType: "없음", menu: "없음" }
          ]
        }));
        break;

      case '금정회관 학생 식당':
        result = jsonData.date.map((date, dayIndex) => {
            const breakfastIndexes = [dayIndex * 2, dayIndex * 2 + 1];
            const lunchIndexes = [dayIndex * 2 + 9, dayIndex * 2 + 10];
            const dinnerIndexes = [dayIndex * 2 + 18, dayIndex * 2 + 19];
        
            return {
              res: jsonData.res[0],
              date: date.replace(/\./g, '-'),
              day: jsonData.day[dayIndex] + "요일",
              meals: [
                {
                  when: "조식",
                  mealType: jsonData.mealType[breakfastIndexes[0]],
                  menu: jsonData.menu[breakfastIndexes[0]]
                },
                {
                  when: "조식",
                  mealType: jsonData.mealType[breakfastIndexes[1]],
                  menu: jsonData.menu[breakfastIndexes[1]]
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[0]],
                  menu: jsonData.menu[lunchIndexes[0]]
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[1]],
                  menu: jsonData.menu[lunchIndexes[1]]
                },
                {
                  when: "석식",
                  mealType: jsonData.mealType[dinnerIndexes[0]],
                  menu: jsonData.menu[dinnerIndexes[0]]
                },
                {
                  when: "석식",
                  mealType: jsonData.mealType[dinnerIndexes[1]],
                  menu: jsonData.menu[dinnerIndexes[1]]
                }
              ]
            };
          });
        break;

      case '문창회관 식당':
        result = jsonData.date.map((date, dayIndex) => {
            const lunchIndexes = [dayIndex * 3, dayIndex * 3 + 1, dayIndex * 3 + 2];
        
            return {
              res: jsonData.res[0],
              date: date.replace(/\./g, '-'),
              day: jsonData.day[dayIndex] + "요일",
              meals: [
                {
                  when: "조식",
                  mealType: "없음",
                  menu: "없음"
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[0]],
                  menu: jsonData.menu[lunchIndexes[0]]
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[1]],
                  menu: jsonData.menu[lunchIndexes[1]]
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[2]],
                  menu: jsonData.menu[lunchIndexes[2]]
                },
                {
                  when: "석식",
                  mealType: "없음",
                  menu: "없음"
                }
              ]
            };
          });
        break;

      case '샛벌회관 식당':
        result = jsonData.date.map((date, index) => ({
          res: jsonData.res[0],
          date: date.replace(/\./g, '-'),
          day: jsonData.day[index] + "요일",
          meals: [
            { when: "중식", mealType: jsonData.mealType[index], menu: jsonData.menu[index] },
            { when: "석식", mealType: jsonData.mealType[index], menu: jsonData.menu[index] }
          ]
        }));
        break;

      case '학생회관 학생 식당':
        result = jsonData.date.map((date, dayIndex) => {
            const lunchIndexes = [dayIndex * 2, dayIndex * 2 + 1];
        
            return {
              res: jsonData.res[0],
              date: date.replace(/\./g, '-'),
              day: jsonData.day[dayIndex] + "요일",
              meals: [
                {
                  when: "조식",
                  mealType: "없음",
                  menu: "없음"
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[0]],
                  menu: jsonData.menu[lunchIndexes[0]]
                },
                {
                  when: "중식",
                  mealType: jsonData.mealType[lunchIndexes[1]],
                  menu: jsonData.menu[lunchIndexes[1]]
                },
                {
                  when: "석식",
                  mealType: "없음",
                  menu: "없음"
                }
              ]
            };
          });
        break;

      default:
        console.error("뭐노: ", target);
        return;
    }

    fs.writeFile(`./samples_converted/${target}_변환.json`, JSON.stringify(result, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("error 발생:", err);
        return;
      }
      console.log(`${target} 변환완료`);
    });
  });
}
