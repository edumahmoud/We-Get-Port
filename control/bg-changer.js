// Background Color Changer 
let allColors = ["#95D392","#AF92D3","#6D399D","#9D3969","#AAA9E0","#ECECF8"];
const color = allColors[Math.floor(Math.random() * allColors.length)];
const bg = document.getElementsByTagName("body")[0];
bg.style.background = color;