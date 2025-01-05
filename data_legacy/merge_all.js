//모든 변환된 json 한개로 합치는 프로그램

const fs = require('fs');
const path = require('path');

const filePaths = [
  './samples_converted/금정회관 교직원 식당_변환.json', 
  './samples_converted/금정회관 학생 식당_변환.json', 
  './samples_converted/문창회관 식당_변환.json', 
  './samples_converted/학생회관 학생 식당_변환.json',
  './samples/dorm.json'
];

const mergedData = [];

async function merge_all() {
  for (let filePath of filePaths) {
    const fullPath = path.join(__dirname, filePath);
    try {
      const data = await fs.promises.readFile(fullPath, 'utf8');  
      const jsonData = JSON.parse(data);  
      mergedData.push(jsonData);  
    } catch (error) {
      console.error(`뭐노 ${filePath}:`, error);
    }
  }

  const outputPath = path.join(__dirname, 'result.json');
  try {
    await fs.promises.writeFile(outputPath, JSON.stringify(mergedData, null, 2), 'utf8');
    console.log('병합완료');
  } catch (error) {
    console.error('뭐노:', error);
  }
}

merge_all();
