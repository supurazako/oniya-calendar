const currentDate = new Date();


import { generateCalendar, fetchDataFromSpreadsheet, displaySchedules } from './utils/utils.js';
import { saveData, getLastEdited } from './utils/cache.js';


const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthLabel = document.getElementById('current-month');

let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

// カレンダーを初期表示
generateCalendar(currentYear, currentMonth);


// 前の月に移動するボタンのクリックイベント
prevMonthButton.addEventListener('click', () => {
    currentMonth -= 1;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    }
    generateCalendar(currentYear, currentMonth);
    displaySchedulesFlow(currentYear, currentMonth);
    updateCurrentMonthLabel();
});

// 次の月に移動するボタンのクリックイベント
nextMonthButton.addEventListener('click', () => {
    currentMonth += 1;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }
    generateCalendar(currentYear, currentMonth);
    displaySchedulesFlow(currentYear, currentMonth);
    updateCurrentMonthLabel();
});

// カレンダーの表示を更新
function updateCurrentMonthLabel() {
    currentMonthLabel.textContent = `${currentYear} ${currentMonth + 1}月`;
}

// 月の初期表示
currentMonthLabel.textContent = `${currentYear} ${currentMonth + 1}月`;


// まず、キャッシュを使用したカレンダーの表示を行い、そのあとにfetchDataFromSpreadsheet()を実行して、データに変更があった場合はカレンダーの表示を更新する
async function displaySchedulesFlow(year, month) {
    month += 1; // 月は0から始まるので、1を足して1月を0から始まる1月にする
    // キャッシュを基にしてカレンダーにスケジュールを表示する
    // キャッシュからスケジュールを取得
    const cacheData = JSON.parse(localStorage.getItem(`${year}-${month}`));
    if (cacheData == null) {
        console.log('キャッシュにデータがありません');
    } else {
        const schedules = cacheData.schedule;
        if (schedules) {
            await displaySchedules(schedules);
        }
    }
    
    // lastEditedを取得
    const lastEdited = getLastEdited(year, month);
    // console.log(`lastEdited: ${lastEdited}`);

    // スプレッドシートからデータを取得
    const data = await fetchDataFromSpreadsheet(year, month, lastEdited);
    // console.log(`isLatestData: ${data.isLatestData}`);
    if (data.isLatestData == false) {
    // カレンダーの表示を更新
    await displaySchedules(data.schedule);

    // データをlocalStorageに保存
    saveData(year, month, data);
    console.log('データは更新されました');

    } else {
        console.log('データは最新です');
    }
}

// ページが読み込まれた後に予定を表示
window.addEventListener('DOMContentLoaded', async () => {
    await displaySchedulesFlow(currentYear, currentMonth);
})