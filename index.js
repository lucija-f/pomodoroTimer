let bg_page = chrome.extension.getBackgroundPage();

const clearBtn = document.getElementById("clear-btn");
const workBtn = document.getElementById("work-btn");
const longBtn = document.getElementById("long-break-btn");
const shortBtn = document.getElementById("short-break-btn");
const scoreEl = document.getElementById("score-display");

let myScore = [];
let scoreFromLocalStorage = JSON.parse(localStorage.getItem("myScore"));
if (scoreFromLocalStorage) {
  myScore = scoreFromLocalStorage;
  chrome.runtime.sendMessage({ msg: "SCORE_LS", data: myScore });
}

window.onload = function () {
  getScore(myScore);

  if (bg_page.timerId)
    document.getElementById("time-display").innerHTML =
      bg_page.minutes + ":" + bg_page.seconds;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.msg) {
    case "STOP":
      document.getElementById("time-display").innerHTML = "00:00";
      break;
    case "UPDATE":
      document.getElementById("time-display").innerHTML =
        request.min + ":" + request.sec;
      break;
    case "DONE":
      document.getElementById("time-display").innerHTML = "DONE!";
      break;
    case "GET_SCORE":
      getScore(request.data);
      break;
  }
});

// show results
function getScore(score) {
  let listItems = "";
  if (score == "") scoreEl.innerHTML = "";
  else {
    for (let i = 0; i < score.length; i++) {
      listItems += `<img class="poma-pic"
    src=${score[i]}>`;
    }
  }

  if (listItems != "") scoreEl.innerHTML = listItems;
}

workBtn.addEventListener("click", function () {
  bg_page.startTimer(bg_page.workTime);
});

clearBtn.addEventListener("click", function () {
  localStorage.clear();
  myScore = [];
  getScore(myScore);
  chrome.runtime.sendMessage({ msg: "CLEAR" });
});

longBtn.addEventListener("click", function () {
  bg_page.startTimer(bg_page.longBreak);
});

shortBtn.addEventListener("click", function () {
  bg_page.startTimer(bg_page.shortBreak);
});
