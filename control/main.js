// Main Job
function calculatePort() {
    const total = parseInt(document.getElementById('total-port').value);
    const cType = document.getElementById('cabinet-type').value;
    
    document.getElementById("more-data").style.display = 'none';

    if (!total || !cType) {
        document.getElementById('result').innerText = 'يرجى إدخال جميع الحقول المطلوبة!';
        document.getElementById('result-table').style.display = 'none';
        return;
    }

    const totalRes = total / 16;
    const row = Math.floor(totalRes) + 1;
    const port = totalRes - Math.floor(totalRes);

    // Add ports in list to complete 16 port
    const cols = [];
    for (let x = 1; x <= 16; x++) {
        cols.push(x / 16);
    }

    const col = cols.indexOf(port) + 1;

    let colResult, rowResult;

    if (cType === 'h') { // if cabinet is Huawei.
        if (col == 0) {
            colResult = 15;
            rowResult = row - 1;
        } else {
            colResult = col - 1;
            rowResult = row;
        }                
    } else if (cType === 'o') { // if cabinet is other cabinet (ZTE / Nokia).

        if (col == 0) {
            colResult = 16;
            rowResult = row - 1;
        } else {
            colResult = col;
            rowResult = row;
        }      

    } else { //  // if cabinet is not selected.

        document.getElementById('result').innerText = 'يرجى اختيار نوع الكابينة الصحيح!';
        document.getElementById('result-table').style.display = 'none';
        return;
    }

    

    document.getElementById('row-result').innerText = rowResult;
    document.getElementById('col-result').innerText = colResult;
    document.getElementById('result-table').style.display = 'table';

}




 