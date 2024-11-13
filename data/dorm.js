// 기숙사 식단 스크랩핑 프로그램

const puppteer = require('puppeteer');
const fs = require('fs');

(async() => {
    const browser = await puppteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto('https://dorm.pusan.ac.kr/dorm/function/mealPlan/20000403');
    await page.waitForSelector('.hr_dotted > .vertical-center > h4 > strong');

    /*
    date_day: 날짜_요일
    dates: 조식,중식,석식
    menus: 식단표
    */

    const result = await page.evaluate(() => {
        const date_day= Array.from(document.querySelectorAll('.hr_dotted > .vertical-center > h4 > strong')).map(element => element.innerText.trim());
        const dates = Array.from(document.querySelectorAll('td > span')).map(element => element.innerHTML.trim());
        const menus = Array.from(document.querySelectorAll('.hr_dotted > .col-sm-8')).map(element => element.innerHTML.trim());

        return {date_day,dates,menus};
    })

    // jsonData로 가공
    const jsonData = [];
    const { date_day,dates,menus } = result;

    let index = 0;
    for (let i = 0; i < date_day.length; i++) {
      const [date, day] = date_day[i].replace(/\n/, '').split(/(?<=\d{4}-\d{2}-\d{2})/);
      const meals = [];
  
      for (let j = 0; j < 3; j++) {  
        meals.push({
          when: dates[index],
          mealType: "기숙사식",
          menu: menus[index]
        });
        index++;
      }
  
      jsonData.push({
        res: (i < 8) ? '진리' : (i < 15) ? '웅비' : '자유',
        date: date.trim(),
        day: day.trim(),
        meals
      });
    }
  
    const filename = `./samples/dorm.json`; 
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`${filename}로 저장되었습니다.`);
  
    await browser.close();
})();