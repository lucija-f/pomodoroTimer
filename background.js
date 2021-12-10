let timerId = undefined;
let isWorkTime = false;

const workTime = 25 * 60 * 1000;
window.workTime = workTime;
const shortBreak = 5 * 60 * 1000;
window.shortBreak = shortBreak;
const longBreak = 10 * 60 * 1000;
window.longBreak = longBreak;

let myScoreBack = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == "SCORE_LS") {
    myScoreBack = request.data;
  }
  if (request.msg == "CLEAR") {
    myScoreBack = [];
  }
});

function startTimer(time) {
  console.log("starter time počinje");
  if (time == workTime) isWorkTime = true;
  if (!timerId) {
    timerId = setInterval(function () {
      updateTimer(time);
      time = time - 1000;
    }, 1000);
  } else {
    stopTimer();
    chrome.runtime.sendMessage({ msg: "STOP" });
  }
}

function updateTimer(time) {
  let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((time % (1000 * 60)) / 1000);

  chrome.runtime.sendMessage({ msg: "UPDATE", min: minutes, sec: seconds });

  if (time < 0) {
    stopTimer();
    chrome.runtime.sendMessage({ msg: "DONE" });

    if (isWorkTime) {
      isWorkTime = false;
      myScoreBack.push("./poma.png");
      localStorage.setItem("myScore", JSON.stringify(myScoreBack));
      chrome.runtime.sendMessage({ msg: "GET_SCORE", data: myScoreBack });

      let notifOptions = {
        type: "basic",
        iconUrl: "./poma.png",
        title: "DONE!",
        message: "You finished your 25 min of focus! Take a brake!",
      };
      let timestamp = new Date().getTime();
      let id = "idNotification" + timestamp;
      chrome.notifications.create(id, notifOptions);
    }
  }
}

function stopTimer() {
  clearInterval(timerId);
  timerId = undefined;
}
