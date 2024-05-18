const button = document.getElementById('button');
const text = document.querySelector('main p');
const counter = document.querySelector('main counter p2');
clicks = 0

document.getElementById('homeButton').addEventListener('click', () => {
  window.location.href = '/site/archive';
});

let OSName = "Unknown OS";
if (window.navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
if (window.navigator.userAgent.indexOf("Mac") != -1) OSName = "MacOS";
if (window.navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
if (window.navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
if (window.navigator.userAgent.indexOf("iPhone") != -1) OSName = "iPhone";
if (OSName == "UNIX") {
    alert("this site may not work properly on your device");
}
if (OSName == "iPhone") {
    document.getElementById('homeButton').innerHTML = "EW IPHONE USER (home button btw)";
    alert("IPHONE USER BOO!!!11!1!!!1")
}

button.addEventListener('click', () => {
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  text.style.color = '#' + randomColor;
  clicks += 1
  if (clicks >= 0) {
      counter.innerHTML = "you have clicked " + clicks + " times"
  }
  if (clicks >=10) {
      document.querySelector('main note n1').innerHTML = "this was half made with AI but i still learnt a whole lot"
  }
  if (clicks >= 20) {
      document.querySelector('main note n2').innerHTML = "i learnt how to do html websites and javascript coding"
  }
  if (clicks >= 30) {
      document.querySelector('main note n3').innerHTML = "...as well as CSS, which makes the website actually look nice"
  }
  if (clicks >= 40) {
      document.querySelector('main note n4').innerHTML = "AI is a tool to help you learn, it's not cheating"
  }
  if (clicks >= 50) {
      document.querySelector('main note n5').innerHTML = "and it can really help you when you're stuck."
  }
  if (clicks >= 100) {
      document.querySelector('main note n6').innerHTML = "nice you found this secret part. so basically i learnt everything completely from inferring from what the AI coded. great huh"
  }
  if (clicks >= 150) {
      document.querySelector('main note n1').innerHTML = "###"
  }
  if (clicks >= 160) {
      document.querySelector('main note n2').innerHTML = "###"
  }
  if (clicks >= 170) {
      document.querySelector('main note n3').innerHTML = "###"
  }
  if (clicks >= 180) {
      document.querySelector('main note n4').innerHTML = "###"
  }
  if (clicks >= 190) {
      document.querySelector('main note n5').innerHTML = "###"
  }
  if (clicks >= 200) {
    document.querySelector('main note n6').innerHTML = "###"
    conditionalButton.style.display = "inline-block";
    conditionalButton.style.backgroundColor = "#3c3c3c"; 
    conditionalButton.style.color = "white";
    conditionalButton.style.fontFamily = "monospace"; 
    conditionalButton.style.fontSize = "3vw"; 
    conditionalButton.style.padding = "1.4vw"; 
    conditionalButton.style.margin = "0.5vw"; 
    conditionalButton.style.border = "none";
    conditionalButton.style.justifyContent = "center";
  }
});
