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