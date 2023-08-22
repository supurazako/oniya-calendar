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
// selectedMonth = currentDate.getMonth();
generateCalendar(selectedYear, selectedMonth);

// ページが読み込まれた後に予定を表示
window.addEventListener('DOMContentLoaded', async () => {
    await displaySchedules(selectedYear, selectedMonth);
})