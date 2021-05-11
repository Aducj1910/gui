function testMain() {
  eel.dummy("check!")(function (result) {
    console.log(result);
  });
}

function updateScroll() {
  var element = document.getElementById("output");
  element.scrollTop = element.scrollHeight;
}

function customGame() {
  eel.mainconnectGame(
    document.getElementById("team1").value,
    document.getElementById("team2").value
  )(function (result) {
    console.log(result);
    simSpeedValue = document.getElementById("sim-speed").value;
    simSpeed = 1;
    if (simSpeedValue == "realistic") {
      simSpeed = 1500;
    } else if (simSpeedValue == "slow") {
      simSpeed = 1000;
    } else if (simSpeedValue == "medium") {
      simSpeed = 500;
    } else if (simSpeedValue == "fast") {
      simSpeed = 150;
    } else if (simSpeedValue == "instant") {
      simSpeed = 1;
    }

    var ballsList = document.getElementById("ball-list");
    ballsList.innerHTML = "";
    patt =
      /(.+?(?=\.).+?(?=\s))\s(.+?(?=\sto))\sto\s(.+?(?=\s(.|Wide)\sSc))\s(.|Wide)\s((.+)(?=\/\d)\/\d)(.+|)/g;

    var toss = document.createElement("li");
    toss.innerHTML = `<p><b>${document
      .getElementById("team1")
      .value.toUpperCase()} vs ${document
      .getElementById("team2")
      .value.toUpperCase()}</b></p><p><b>${result.tossMsg.toUpperCase()}</b></p><hr>`;
    ballsList.append(toss);

    latestIndex = 0;
    result.innings1Log.forEach((element, index) => {
      setTimeout(() => {
        patt.lastIndex = -1;
        var newBall = document.createElement("li");
        newBall.id = index + "inn1";
        var matchEvent = patt.exec(element.event);
        newBall.innerHTML = `<b>${matchEvent[1]}</b> ${matchEvent[2]} to ${matchEvent[3]} <b>${matchEvent[4]}</b> ${matchEvent[6]} <b>${matchEvent[8]}</b>`;
        ballsList.append(newBall);
        latestIndex = index;
        if (index == result.innings1Log.length - 1) {
          var innBreak = document.createElement("div");
          innBreak.innerHTML = `<b>${result.innings2BatTeam.toUpperCase()} needs ${
            result.innings1Runs
          } runs to win </b> <hr>`;
          ballsList.append(innBreak);
        }
        updateScroll();
      }, simSpeed * index);
    });
    setTimeout(() => {
      result.innings2Log.forEach((element, index) => {
        setTimeout(() => {
          patt.lastIndex = -1;
          var newBall = document.createElement("li");
          newBall.id = index + "inn1";
          var matchEvent = patt.exec(element.event);
          newBall.innerHTML = `<b>${matchEvent[1]}</b> ${matchEvent[2]} to ${matchEvent[3]} <b>${matchEvent[4]}</b> ${matchEvent[6]} <b>${matchEvent[8]}</b>`;
          ballsList.append(newBall);
          if (index == result.innings2Log.length - 1) {
            var resultMsg = document.createElement("div");
            resultMsg.innerHTML = `<b>${result.winMsg.toUpperCase()}</b><hr>`;
            ballsList.append(resultMsg);
          }
          updateScroll();
        }, simSpeed * index);
      });
    }, simSpeed * result.innings1Log.length + simSpeed * 10);
  });
}
