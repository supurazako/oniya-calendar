// カレンダーの生成と表示
async function generateCalendar(year, month) {
    const calendarTable = document.getElementById('calendar-table');
    

    let firstDateOfMonth = new Date(year, month, 1);

    
    let firstDayOfMonth = firstDateOfMonth.getDay(); // 曜日を取得

    // 前月の最終日を求める
    let lastDateOfLastMonth = new Date(year, month, 0);
    let lastDayOfLastMonth = lastDateOfLastMonth.getDate();


    // 月の週数を求める
    // 前月の0日、つまり今月の最終日を求める
    const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
    // 今月の1日の曜日を求める
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    // 週数を計算
    const weeeksInMonth = Math.ceil((lastDayOfCurrentMonth + firstDayOfWeek) / 7);

    // console.log(`週数: ${weeeksInMonth}`);


    // カレンダーグリッドを生成するためのHTML文字列を生成
    let calendarHTML = '<table>';
    calendarHTML += '<tr><th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr>';

    // 前月の日数分の空白セルを埋める
    calendarHTML += '<tr>';
    for (let i = 0; i < firstDayOfMonth; i++) {
        let dayToShow = lastDayOfLastMonth - firstDayOfMonth + 1 +1;
        calendarHTML += `<td class="lastMonth"}>${dayToShow}</td>`
    }


    // カレンダーグリッドの日付セルを生成
    while (firstDateOfMonth.getMonth() === month) {
        if (firstDateOfMonth.getDay() === 0) {
            calendarHTML += '<tr>';
        }

        const formattedMonth = (month + 1).toString().padStart(2, '0'); // 2桁の月
        const formattedDay = firstDateOfMonth.getDate().toString().padStart(2, '0'); // 2桁の日
        const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
        calendarHTML += `<td data-date="${formattedDate}" class="week-${weeeksInMonth}">${firstDateOfMonth.getDate()}</td>`;

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
async function fetchDataFromSpreadsheet(year, month, lastEdited) {
    // console.log(`request date: ${year}-${month}, lastEdited: ${lastEdited}`);
    const url = `https://script.google.com/macros/s/AKfycbzYNS1k8RuD8iNJw9J-m9Clin6k1Za3WDDjSsGla_Pn9iHJlexb2RpDWGAhmZZMvmkG/exec?year=${year}&month=${month}&lastEdited=${lastEdited}`;

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
        // console.log(`spreadsheet data: ${jsonData}`);
        return jsonData;

    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}


// 予定を生成して表示
function displaySchedules(jsonData) {
    // 予定情報を含むHTMLを生成
    const scheduleBoxes = jsonData.map(schedule => {
        const formattedDate = schedule.date.replace(/\//g, "-");
        const formattedTime = schedule.time.slice(0, -3);
        const detailDate = `${formattedDate}-${formattedTime}`;

        // 予定情報を含むHTMLを作成
        const scheduleInfo = `
                <div data-title="${schedule.title}" data-detail-date="${detailDate}" data-site="${schedule.site}" data-url="${schedule.url}" class="schedule-box ${schedule.site}">
                    <div class="schedule-info">${formattedTime} ${schedule.title}</div>
                </div>
            `;

        // 重複したschedule-boxを削除
        const scheduleBox = document.querySelector(`[data-date="${formattedDate}"] .schedule-box`);
        if (scheduleBox) {
            scheduleBox.remove();
        }
        

        return { formattedDate, scheduleInfo };
    });

    // 日付セルに予定情報を追加
    scheduleBoxes.forEach(scheduleBox => {
        const dateCell = document.querySelector(`[data-date="${scheduleBox.formattedDate}"]`);
        if (dateCell) {
            dateCell.innerHTML += scheduleBox.scheduleInfo;
        }
    });

    // schedule-boxのクリックイベントを追加
    const scheduleBoxElements = document.querySelectorAll('.schedule-box');
    
    scheduleBoxElements.forEach(scheduleBoxElement => {
        scheduleBoxElement.addEventListener('click', () => {
            // どのschedule-boxがクリックされたかを判定するために、クリックされたschedule-boxのtitleを取得
            const title = scheduleBoxElement.querySelector('.schedule-info').textContent;
            console.log(`title: ${title}`);
            // クリックされたschedule-boxに対応するschedule-detailを取得
            const scheduleDetailElement = document.getElementById(title);

            // schedule-detailを表示
            scheduleDetailElement.style.display = 'block';
        });
    });
}



export { generateCalendar, fetchDataFromSpreadsheet, displaySchedules };