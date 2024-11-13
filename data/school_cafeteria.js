//학교 식당 식단 스크랩핑 프로그램

const puppeteer = require('puppeteer');
const fs = require('fs');

const res = ['금정회관 교직원 식당', '금정회관 학생 식당', '문창회관 식당', '학생회관 학생 식당'];
//샛벌회관 학생 식당 로직상 문제로 제외, 추후 추가 예정

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://www.pusan.ac.kr/kor/CMS/MenuMgr/menuListOnBuilding.do?mCode=MN202#childTab_tmp');
  
  for (let target of res) {
    // 식당이름 버튼 찾아서 클릭해주면서 넘어가야함.
    await page.evaluate((target) => {
      const link = Array.from(document.querySelectorAll('a > span')).find(
        (element) => element.textContent === target
      );
      if (link) link.click();
    }, target);

    //금정회관 학생식당만 menu-tit03 class를 사용함으로 예외처리 해줌
    if (target === '금정회관 학생 식당') {
      await page.waitForSelector('.menu-tit03');
    } else {
      await page.waitForSelector('.menu-tit01');
    }

    const result = await page.evaluate((target) => {
      const day = Array.from(document.querySelectorAll('div.day')).map(element => element.innerText.trim());
      const date = Array.from(document.querySelectorAll('div.date')).map(element => element.innerText.trim());
      let when = Array.from(document.querySelectorAll('tbody > tr > th')).map(element => element.innerText.trim());
    
    // 금정회관 교직원 식당,문창회관 식당의 경우 중식만 운영
    // 샛벌회관 식당의 경우 중식,석식만 운영
    // 예외처리
      if (target === '금정회관 교직원 식당' || target === '문창회관 식당') {
        when = when.filter(text => text.includes('중식'));
      } else if (target === '샛벌회관 식당') {
        when = when.filter(text => text.includes('중식') || text.includes('석식'));
      }

    // 금정회관 학생식당과 문창회관 menu-tit03 class를 같이 사용함으로 예외처리
      const mealType = (target === '금정회관 학생 식당' || target === '문창회관 식당')
        ? Array.from(document.querySelectorAll('.menu-tit03, .menu-tit01')).map(element => element.innerHTML.trim())
        : Array.from(document.querySelectorAll('.menu-tit01')).map(element => element.innerHTML.trim());

      const menu = Array.from(document.querySelectorAll('li > p')).map(element => element.innerHTML.trim());
      const res = [target];

      return { res,day, date, when, mealType, menu };
    }, target);

    const filename = `./samples/${target}.json`;
    fs.writeFileSync(filename, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`${filename}로 저장되었습니다.`);
  }

  await browser.close();
})();
