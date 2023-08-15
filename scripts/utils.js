// 年の選択肢を生成
function generateYearOptions(minYear, maxYear) {
    const yearSelect = document.getElementById('year-select');

    // 選択肢の範囲を最小年と最大年に設定
    for (let year = minYear; year <= maxYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    }

    // 最初に現在の年を選択状態にする
    const currentYear = new Date().getFullYear();
    yearSelect.value = currentYear;
}


// 月の選択肢を生成
function generateMonthOptions() {
    const monthSelect = document.getElementById('month-select');


    // 選択肢の範囲を1月から12月に設定
    // 0から数えるので0は1月を表す
    for (let month = 0; month < 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.text = month + 1;
        monthSelect.appendChild(option);
    }

    // 最初に現在の月を選択状態にする
    const currentMonth = new Date().getMonth();
    monthSelect.value = currentMonth;
}


// カレンダーの生成と表示
async function generateCalendar(year, month) {
    const calendarTable = document.getElementById('calendar-table');
    

    let firstDateOfMonth = new Date(year, month, 1);

    
    let firstDayOfMonth = firstDateOfMonth.getDay(); // 曜日を取得


    // カレンダーグリッドを生成するためのHTML文字列を生成
    let calendarHTML = '<table>';
    calendarHTML += '<tr><th class="sunday">日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th class="saturday">土</th></tr>';

    // 1日の曜日まで空白のセルを追加
    calendarHTML += `<tr>${'<td></td>'.repeat(firstDayOfMonth)}`;



    // カレンダーグリッドの日付セルを生成
    while (firstDateOfMonth.getMonth() === month) {
        if (firstDateOfMonth.getDay() === 0) {
            calendarHTML + '<tr>';
        }

        calendarHTML += `<td>${firstDateOfMonth.getDate()}</td>`;

        if (firstDateOfMonth.getDay() === 6) {
            calendarHTML += '</tr>';
        }

        firstDateOfMonth.setDate(firstDateOfMonth.getDate() + 1);
    }

    calendarHTML += '</table>';


    // カレンダーを表示
    calendarTable.innerHTML = calendarHTML;
}


// スプレッドシートからデータを取得
async function fetchDataFromSpreadsheet(year, month) {
    const url = `https://script.google.com/macros/s/AKfycbzYNS1k8RuD8iNJw9J-m9Clin6k1Za3WDDjSsGla_Pn9iHJlexb2RpDWGAhmZZMvmkG/exec?year=${year}&month=${month}`;

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const options = {
        method: 'GET',
        headers: headers 
    };

    try {
        const response = await fetch(url, options)
        
        if (!response.ok) {
            throw new Error('Fetch request failed');
        }

        const jsonData = await response.json();
        console.log(`spreadsheet data: ${jsonData}`);
        return jsonData;

    } catch (error) {
        console.error('Error fetching data: ', error);
    }
   
}



export { generateYearOptions, generateMonthOptions, generateCalendar, fetchDataFromSpreadsheet };