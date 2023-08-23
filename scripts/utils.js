// カレンダーの生成と表示
async function generateCalendar(year, month) {
    const calendarTable = document.getElementById('calendar-table');
    

    let firstDateOfMonth = new Date(year, month, 1);

    
    let firstDayOfMonth = firstDateOfMonth.getDay(); // 曜日を取得

    // 前月の最終日を求める
    let lastDateOfLastMonth = new Date(year, month, 0);
    let lastDayOfLastMonth = lastDateOfLastMonth.getDate();
    console.log(`lastDateOfLastMonth: ${lastDateOfLastMonth}, lastDayOflastMonth: ${lastDayOfLastMonth}`);


    // カレンダーグリッドを生成するためのHTML文字列を生成
    let calendarHTML = '<table>';
    calendarHTML += '<tr><th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr>';

    // 前月の日数分の空白セルを埋める
    calendarHTML += '<tr>';
    for (let i = 0; i < firstDayOfMonth; i++) {
        let dayToShow = lastDayOfLastMonth - firstDayOfMonth + 1 +1;
        calendarHTML += `<td class="lastMonth">${dayToShow}</td>`
    }


    // カレンダーグリッドの日付セルを生成
    while (firstDateOfMonth.getMonth() === month) {
        if (firstDateOfMonth.getDay() === 0) {
            calendarHTML += '<tr>';
        }

        const formattedDate = `${year}-${month + 1}-${firstDateOfMonth.getDate()}`;
        calendarHTML += `<td data-date="${formattedDate}">${firstDateOfMonth.getDate()}</td>`;

        if (firstDateOfMonth.getDay() === 6) {
            calendarHTML += '</tr>';
        }

        firstDateOfMonth.setDate(firstDateOfMonth.getDate() + 1);
    }

    // 最終週を次月の日付で埋める
    while (firstDateOfMonth.getDay() > 0) {
        let dayToShow = firstDateOfMonth.getDate();
        let formattedDay = dayToShow === 1 ? (month + 2) + '/1' : dayToShow;
        calendarHTML += `<td>${formattedDay}</td>`;
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


// 予定を生成して表示
async function displaySchedules (year, month) {
    month += 1; // JSの月は0から始まるため
    const jsonData = await fetchDataFromSpreadsheet(year, month);

    console.log(jsonData);

    // オブジェクト内の配列を取得
    jsonData.forEach(schedule => {
        const formattedDate = schedule.date.replace(/\//g, "-");
        console.log(formattedDate);

        // data-date属性が一致する日付セルを特定
        const dateCell = document.querySelectorAll(`[data-date="${formattedDate}"]`);

        if (dateCell) {
            console.log(`データセルを発見`);
            // 予定情報を含むHTMLを作成してセルに追加
            const scheduleInfo = `
                <div class="schedule-box">
                    <div class="schedule-date">${schedule.date}</div>
                    <div class="schedule-time">${schedule.time}</div>
                    <div class="schedule-site">${schedule.site}</div>
                    <div class="schedule-title"><a href="${schedule.url}">${schedule.title}</a></div>
                </div>
                `;
                dateCell.innerHTML += scheduleInfo;
        }
    });
}



export { generateCalendar, fetchDataFromSpreadsheet, displaySchedules };