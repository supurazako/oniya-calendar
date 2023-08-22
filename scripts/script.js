// 選択されている年と月の変数
let selectedYear;
let selectedMonth;

// 最小年と最大年の定義
const minYear = 2022;
const maxYear = 2024;


const currentDate = new Date();


// セレクトボックスの選択状態が変更されたときの処理
async function handleSelectChange() {
    selectedYear = parseInt(document.getElementById('year-select').value);
    selectedMonth = parseInt(document.getElementById('month-select').value);

    // カレンダーの生成と表示
    generateCalendar(selectedYear, selectedMonth);

    // スプレッドシートからデータを取得
    const scheduleData = fetchDataFromSpreadsheet(selectedYear, selectedMonth);
    await displaySchedules(selectedYear, selectedMonth);
}


// セレクトボックスの選択状態が変更されたときのイベントリスナーを追加
document.getElementById('year-select').addEventListener('change', handleSelectChange);
document.getElementById('month-select').addEventListener('change', handleSelectChange);




import { generateYearOptions, generateMonthOptions, generateCalendar, fetchDataFromSpreadsheet, displaySchedules } from './utils.js';


// 初期表示のカレンダーを作成
// 年と月の選択肢を生成
generateYearOptions(minYear, maxYear);
generateMonthOptions();


selectedYear = currentDate.getFullYear();
selectedMonth = currentDate.getMonth();

// カレンダーを初期表示
generateCalendar(selectedYear, selectedMonth);


const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const currentMonthLabel = document.getElementById('current-month');

let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

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
    currentMonthLabel.textContent = `${currentYear} ${currentMonth + 1}月 `;
}



// ページが読み込まれた後に予定を表示
window.addEventListener('DOMContentLoaded', async () => {
    await displaySchedules(selectedYear, selectedMonth);
})