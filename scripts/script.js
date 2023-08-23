// 最小年と最大年の定義
const minYear = 2022;
const maxYear = 2024;


const currentDate = new Date();


// セレクトボックスの選択状態が変更されたときの処理
async function handleSelectChange() {
    currentYear = parseInt(document.getElementById('year-select').value);
    currentMonth = parseInt(document.getElementById('month-select').value);

    // カレンダーの生成と表示
    generateCalendar(currentYear, currentMonth);

    // スプレッドシートからデータを取得
    const scheduleData = fetchDataFromSpreadsheet(currentYear, currentMonth);
    await displaySchedules(currentYear, currentMonth);
}


// セレクトボックスの選択状態が変更されたときのイベントリスナーを追加
// document.getElementById('year-select').addEventListener('change', handleSelectChange);
// document.getElementById('month-select').addEventListener('change', handleSelectChange);




import { generateCalendar, fetchDataFromSpreadsheet, displaySchedules } from './utils.js';


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
    updateCurrentMonthLabel();
});

// カレンダーの表示を更新
function updateCurrentMonthLabel() {
    currentMonthLabel.textContent = `${currentYear} ${currentMonth + 1}月`;
}

// 月の初期表示
currentMonthLabel.textContent = `${currentYear} ${currentMonth + 1}月`;


// ページが読み込まれた後に予定を表示
window.addEventListener('DOMContentLoaded', async () => {
    await displaySchedules(currentMonth, currentMonth);
})