// Main Job
function calculatePort() {
    const total = parseInt(document.getElementById('total-port').value);
    const cType = document.getElementById('cabinet-type').value;

    if (!total || !cType) {
        document.getElementById('result').innerText = 'يرجى إدخال جميع الحقول المطلوبة!';
        document.getElementById('result-table').style.display = 'none';
        return;
    }

    const totalRes = total / 16;
    const row = Math.floor(totalRes) + 1;
    const port = totalRes - Math.floor(totalRes);

    const cols = [];
    for (let x = 1; x <= 16; x++) {
        cols.push(x / 16);
    }

    const col = cols.indexOf(port) + 1;

    let colResult, rowResult;
    if (cType === 'h') {
        if (col == 0) {
            colResult = 15;
            rowResult = row - 1;
        } else {
            colResult = col - 1;
            rowResult = row;
        }                
    } else if (cType === 'o') {    
        if (col == 0) {
            colResult = 16;
            rowResult = row - 1;
        } else {
            colResult = col;
            rowResult = row;
        }            
    } else {
        document.getElementById('result').innerText = 'يرجى اختيار نوع الكابينة الصحيح!';
        document.getElementById('result-table').style.display = 'none';
        return;
    }

    document.getElementById('row-result').innerText = rowResult;
    document.getElementById('col-result').innerText = colResult;
    document.getElementById('result-table').style.display = 'table';


}


// Background Color Changer 
let allColors = ["#95D392","#AF92D3","#6D399D","#9D3969","#AAA9E0","#ECECF8"];
const color = allColors[Math.floor(Math.random() * allColors.length)];
const bg = document.getElementsByTagName("body")[0];
bg.style.background = color;
 
    


// Service Worker register
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}


// Cache Editor
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
    if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    });
}

// منع كليك يمين
document.addEventListener("contextmenu", function(e){
e.preventDefault();
});

// منع اختصارات DevTools
document.addEventListener("keydown", function(e) {
if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && (e.key == "i" || e.key == "j" || e.key == "c")) ||
    (e.ctrlKey && e.key == "u")
) {
    e.preventDefault();
}
});
