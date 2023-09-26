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