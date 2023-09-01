// キャッシュを基にしてカレンダーにスケジュールを表示する
function displaySchedulesFromCache(year, month) {
    // キャッシュからスケジュールを取得
    const cacheData = JSON.parse(localStorage.getItem(`${year}-${month}`));
    if (cacheData == null) {
        console.log('キャッシュにデータがありません');
        return;
    }
    const schedules = cacheData.schedule;
    if (schedules) {
        // 予定情報を含むHTMLを生成
        // console.log(`cacheData ${cacheData.isLatestData}`);
        const scheduleBoxes = cacheData.schedule.map(schedule => {
            const formattedDate = schedule.date.replace(/\//g, "-");

            // 予定情報を含むHTMLを作成
            const scheduleInfo = `
                <div class="schedule-box">
                    <div class="schedule-time">${schedule.time}</div>
                    <div class="schedule-site">${schedule.site}</div>
                    <div class="schedule-title"><a href="${schedule.url}">${schedule.title}</a></div>
                </div>
            `;

             return { formattedDate, scheduleInfo };
        });

        // 日付セルに予定情報を追加
        scheduleBoxes.forEach(scheduleBox => {
            const dateCell = document.querySelector(`[data-date="${scheduleBox.formattedDate}"]`);
            if (dateCell) {
                dateCell.innerHTML += scheduleBox.scheduleInfo;
            }
        });
    }
}


// fetchDataFromSpreadsheet() のデータをlocalStorageに保存する
// 保存するデータは data.schedule, data.lastEditedがある
// data.scheduleはtime, site, url, title を含む
function saveData(year, month, data) {
    // 月のデータのキーを作成
    const key = `${year}-${month}`;

    localStorage.setItem(key, JSON.stringify(data));
    // console.log(`データを保存しました: ${key}`);
}


function getLastEdited(year, month) {
    const key = `${year}-${month}`;
    const data = localStorage.getItem(key);
    const jsonData = JSON.parse(data);
    if (jsonData == null) {
        // キャッシュにデータがない場合は、最終更新日を2000-01-01とする
        return '2000-01-01';
    }
    return jsonData.lastEdited;
}


export { displaySchedulesFromCache, saveData, getLastEdited };