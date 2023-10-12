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
        // 日付から曜日を取得
        const date = new Date(schedule.date);
        const dayOfWeek = date.getDay();

        const formattedDate = schedule.date.replace(/\//g, "-");
        const formattedTime = schedule.time.slice(0, -3);
        const detailDate = `${formattedDate}-${formattedTime}`;

        // 予定情報を含むHTMLを作成
        const scheduleInfo = `
                <div data-title="${schedule.title}" data-detail-date="${detailDate}" data-site="${schedule.site}" data-url="${schedule.url}" data-day="${dayOfWeek}" class="schedule-box ${schedule.site}">
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
            // schedule-boxのdata属性を取得
            const title = scheduleBoxElement.dataset.title;
            const detailDate = scheduleBoxElement.dataset.detailDate;
            const site = scheduleBoxElement.dataset.site;
            const url = scheduleBoxElement.dataset.url;
            const dayOfWeek = scheduleBoxElement.dataset.day;
            
            const formattedDate = convertTime(detailDate);

            // detail-box要素を取得
            const detailBox = document.getElementById('detail-box');

            // detail-box要素の中身を書き換え
            detailBox.innerHTML = `
            <h2>${title}</h2>
            <p>${formattedDate}</p>
            <p>サイト ${site}</p>
            <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
            `;

            // detail-box要素のdisplayをblockに変更
            detailBox.style.display = 'block';

            // detail-box要素の位置を調整
            // schedule-box要素の位置を取得
            const scheduleBoxRect = scheduleBoxElement.getBoundingClientRect();
            const scheduleBoxTop = scheduleBoxRect.top;
            const scheduleBoxLeft = scheduleBoxRect.left;
            const scheduleBoxWidth = scheduleBoxRect.width;

            // calendar-table要素の位置を取得
            const calendarTable = document.getElementById('calendar-table');
            const calendarTableRect = calendarTable.getBoundingClientRect();
            const calendarTableBottom = calendarTableRect.bottom;
            const calendarTableRight = calendarTableRect.right;

            // detail-box要素の位置を設定
            // もしdetail-box要素がcalendar-table要素の右端を超えたら左に表示
            if (scheduleBoxLeft + scheduleBoxWidth + 10 + 300 > calendarTableRight) {
                detailBox.style.top = `${scheduleBoxTop}px`;
                detailBox.style.left = `${scheduleBoxLeft - 530}px`;
                // console.log('左に表示');
                
            } else {
                detailBox.style.top = `${scheduleBoxTop}px`;
                detailBox.style.left = `${scheduleBoxLeft + scheduleBoxWidth + 10}px`;
            }

            // detail-box要素の位置を取得
            const detailBoxRect = detailBox.getBoundingClientRect();
            const detailBoxBottom = detailBoxRect.bottom;

            // もしdetail-box要素のbottomがcalendar-table要素のbottomを超えたらdetail-box要素のbottomをcalendar-table要素のbottomに合わせる
            if (detailBoxBottom > calendarTableBottom) {
                detailBox.style.top = `${scheduleBoxTop - (detailBoxBottom - calendarTableBottom)}px`;
            }
        });
    });
}

// ユーザーに表示するための時間に変換
function convertTime(time) {
    // 変換前の形式: YYYY-MM-DD-HH:MM
    // 変換後の形式: MM月DD日 HH時MM分
    // ハイフンで分割
    const timeArray = time.split('-');
    
    // :でmmを分割
    const mmArray = timeArray[3].split(':');

    // 各要素を変数に代入
    const month = timeArray[1];
    const day = timeArray[2];
    const hour = mmArray[0];
    const minute = mmArray[1];

    // もしmonth, day, hourが0で始まる場合は0を削除
    const formattedMonth = month.startsWith('0') ? month.slice(1) : month;
    const formattedDay = day.startsWith('0') ? day.slice(1) : day;
    const formattedHour = hour.startsWith('0') ? hour.slice(1) : hour;

    // 変換後の形式に変換
    const formattedTime = `${formattedMonth}月${formattedDay}日 ${formattedHour}時${minute}分`;


    // console.log(formattedTime);
    return formattedTime;
}



export { generateCalendar, fetchDataFromSpreadsheet, displaySchedules };