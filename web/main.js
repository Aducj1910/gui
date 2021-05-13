var teamData = null;
$.getJSON("./data/teaminfo.json", function (json) {
  teamData = json;
});

function testMain() {
  eel.dummy("check!")(function (result) {
    console.log(result);
  });
}

function updateScroll() {
  if (document.getElementById("scorecard-view").hidden == true) {
    var element = document.getElementById("output");
    element.scrollTop = element.scrollHeight;
  }
}

function setView() {
  if (arguments[0] == "bbb") {
    document.getElementById("scorecard-view").hidden = true;
    document.getElementById("ball-list").hidden = false;
    document.getElementById("output").style.overflow = "scroll";
  } else if (arguments[0] == "scorecard") {
    document.getElementById("ball-list").hidden = true;
    document.getElementById("scorecard-view").hidden = false;
    document.getElementById("output").style.overflow = "hidden";
  }
}

function handleScorecardCreation() {
  document.getElementById("scorecard-view").innerHTML = "";
  var battingOrder = [];

  for (var key in arguments[2]) {
    battingOrder.push(arguments[2][key]);
  }
  // console.log(battingOrder);
  battingOrderString = "";
  battingOrder.forEach((e) => {
    battingOrderString += `<tr>
    <td style="height:10px;font-size:0.8rem;padding:3px;width:30%" id="bat-name-${e.playerInitials}"><b>${e.playerInitials}</b></td>
    <td style="height:10px;font-size:0.8rem;padding:3px;width:50%" id="bat-info-${e.playerInitials}"></td>
    <td style="height:10px;font-size:0.8rem;padding:3px;width:20%" id="bat-runs-${e.playerInitials}"></td>
    </tr>`;
  });
  (team1 = arguments[0]), (team2 = arguments[1]);
  var scorecardDiv = document.getElementById("scorecard-view");
  var batScorecard = document.createElement("div");
  batScorecard.innerHTML = `<header class=scoreheader style='background-color:${
    teamData[team1.toLowerCase()].color
  }'>${team1.toUpperCase()}</header><body>
  <table style="margin-bottom:0;" class="table table-striped">
    <tr style="display:none;">
      <th>Players</th>
      <th>Info</th>
      <th>Runs</th>
    </tr>
    ${battingOrderString}
  </table>
  <footer class=scoreheader style='background-color:${
    teamData[team1.toLowerCase()].color
  };height:8.5vh'>
  <div id="footerscore" class="footerscore">
  <b>0/0</b> (0.0)
  </div>
  </footer>
</body>`;
  scorecardDiv.appendChild(batScorecard);
  var bowlScorecard = document.createElement("div");
  bowlScorecard.innerHTML = `<header class=scoreheader style='background-color:${
    teamData[team2.toLowerCase()].color
  }'>${team2.toUpperCase()}</header>
  <body>
  <table style="margin-bottom:0;" class="table table-striped">
    <tr style="display:none;">
      <th>Players</th>
      <th>Info</th>
      <th>Runs</th>
    </tr>
    ${battingOrderString}
  </table>`;
  scorecardDiv.appendChild(bowlScorecard);
}

function customGame() {
  eel.mainconnectGame(
    document.getElementById("team1").value,
    document.getElementById("team2").value
  )(function (result) {
    console.log(result);
    handleScorecardCreation(
      result.innings1BatTeam,
      result.innings2BatTeam,
      result.innings1Battracker
    );
    scoreDiv = simSpeedValue = document.getElementById("sim-speed").value;
    simSpeed = 1;
    if (simSpeedValue == "realistic") {
      simSpeed = 1500;
    } else if (simSpeedValue == "slow") {
      simSpeed = 500;
    } else if (simSpeedValue == "medium") {
      simSpeed = 150;
    } else if (simSpeedValue == "fast") {
      simSpeed = 80;
    } else if (simSpeedValue == "instant") {
      simSpeed = 1;
    }

    var ballsList = document.getElementById("ball-list");
    ballsList.innerHTML = "";
    patt =
      /(.+?(?=\.).+?(?=\s))\s(.+?(?=\sto))\sto\s(.+?(?=\s(.|Wide)\sSc))\s(.|Wide)\s((.+)(?=\/\d)\/\d)(.+|)/g;

    catchPatt = /Caught by (.+)/g;

    var toss = document.createElement("li");
    toss.innerHTML = `<p><b>${document
      .getElementById("team1")
      .value.toUpperCase()} vs ${document
      .getElementById("team2")
      .value.toUpperCase()}</b></p><p><b>${result.tossMsg.toUpperCase()}</b></p><hr>`;
    ballsList.append(toss);

    result.innings1Log.forEach((element, index) => {
      setTimeout(() => {
        patt.lastIndex = -1;
        var newBall = document.createElement("li");
        newBall.id = index + "inn1";
        var matchEvent = patt.exec(element.event);
        newBall.innerHTML = `<b>${matchEvent[1]}</b> ${matchEvent[2]} to ${matchEvent[3]} <b>${matchEvent[4]}</b> ${matchEvent[6]} <b>${matchEvent[8]}</b>`;

        //Scorecards
        ballsList.append(newBall);
        document.getElementById(
          `bat-info-${element.batter1}`
        ).innerHTML = `<i>not out</i>`;
        document.getElementById(
          `bat-info-${element.batter2}`
        ).innerHTML = `<i>not out</i>`;

        document.getElementById("footerscore").innerHTML = `<b>${
          element.runs
        }/${element.wickets}</b>${"     "}(${matchEvent[1]})`;

        document.getElementById(`bat-runs-${element.batsman}`).innerHTML = `<b>
        ${element.batterTracker[element.batsman].runs}
        </b> (${element.batterTracker[element.batsman].balls})`;

        if (matchEvent[4] == "W") {
          document.getElementById(`bat-info-${element.batsman}`).innerHTML =
            matchEvent[8];
        }
        //**Scorecards

        if (
          result.innings1Log[index + 1] != undefined &&
          result.innings1Log[index + 1].event.startsWith(
            (parseInt(matchEvent[1].split("-")[0]) + 1).toString()
          )
        ) {
          var overEnd = document.createElement("li");
          overEnd.innerHTML = `<hr class="hr-over"><b>${
            matchEvent[6]
          } </b><i>(rr: ${((element.runs / element.balls) * 6).toFixed(
            2
          )})</i><br />${element.batter1}: ${
            element.batterTracker[element.batter1].runs
          } (${element.batterTracker[element.batter1].balls})<br />${
            element.batter2
          }: ${element.batterTracker[element.batter2].runs} (${
            element.batterTracker[element.batter2].balls
          })<br />${element.bowler}: ${
            element.bowlerTracker[element.bowler].balls / 6
          }-${element.bowlerTracker[element.bowler].runs}-${
            element.bowlerTracker[element.bowler].wickets
          }<hr class="hr-over">`;

          ballsList.append(overEnd);
        }
        if (index == result.innings1Log.length - 1) {
          var innBreak = document.createElement("div");
          innBreak.innerHTML = `<br /><b>${result.innings2BatTeam.toUpperCase()} needs ${
            result.innings1Runs + 1
          } runs to win </b><br /><br />`;
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

          if (
            result.innings2Log[index + 1] != undefined &&
            result.innings2Log[index + 1].event.startsWith(
              (parseInt(matchEvent[1].split("-")[0]) + 1).toString()
            )
          ) {
            var overEnd = document.createElement("li");
            overEnd.innerHTML = `<hr class="hr-over"><b>${
              matchEvent[6]
            } </b><i>(rr: ${((element.runs / element.balls) * 6).toFixed(
              2
            )}, req. rr: ${(
              ((result.innings1Runs + 1 - element.runs) /
                (120 - element.balls)) *
              6
            ).toFixed(2)})</i><br />${element.batter1}: ${
              element.batterTracker[element.batter1].runs
            } (${element.batterTracker[element.batter1].balls})<br />${
              element.batter2
            }: ${element.batterTracker[element.batter2].runs} (${
              element.batterTracker[element.batter2].balls
            })<br />${element.bowler}: ${
              element.bowlerTracker[element.bowler].balls / 6
            }-${element.bowlerTracker[element.bowler].runs}-${
              element.bowlerTracker[element.bowler].wickets
            }<hr class="hr-over">`;
            ballsList.append(overEnd);
          }
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
