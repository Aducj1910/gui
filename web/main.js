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
    document.getElementById("bbb-btn").style.backgroundColor = "#32a852";
    document.getElementById("scorecard-btn").style.backgroundColor = "#fff";
    document.getElementById("scorecard-view").hidden = true;
    document.getElementById("ball-list").hidden = false;
    document.getElementById("output").style.overflow = "scroll";
  } else if (arguments[0] == "scorecard") {
    document.getElementById("scorecard-btn").style.backgroundColor = "#32a852";
    document.getElementById("bbb-btn").style.backgroundColor = "#fff";
    document.getElementById("ball-list").hidden = true;
    document.getElementById("scorecard-view").hidden = false;
    document.getElementById("output").style.overflow = "hidden";
  }
}

function handleScorecardCreation() {
  document.getElementById(`scorecard-view-inn${arguments[3]}`).innerHTML = "";
  var battingOrder = [];

  for (var key in arguments[2]) {
    battingOrder.push(arguments[2][key]);
  }
  // console.log(battingOrder);
  battingOrderString = "";
  battingOrder.forEach((e) => {
    battingOrderString += `<tr>
    <td style="height:10px;font-size:0.8rem;padding:3px;width:30%" id="bat-name-inn${arguments[3]}-${e.playerInitials}"><b>${e.playerInitials}</b></td>
    <td style="height:10px;font-size:0.8rem;padding:3px;width:50%" id="bat-info-inn${arguments[3]}-${e.playerInitials}"></td>
    <td style="height:10px;font-size:0.8rem;padding:3px;width:20%" id="bat-runs-inn${arguments[3]}-${e.playerInitials}"></td>
    </tr>`;
  });
  (team1 = arguments[0]), (team2 = arguments[1]);
  var scorecardDiv = document.getElementById(
    `scorecard-view-inn${arguments[3]}`
  );
  var batScorecard = document.createElement("div");
  batScorecard.innerHTML = `<header class=scoreheader style='background-color:${
    teamData[team1.toLowerCase()].color
  };padding-top:2'>${team1.toUpperCase()}</header><body>
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
  <div id="footerscore-inn${arguments[3]}" class="footerscore">
  <b>0/0</b> (0.0)
  </div>
  </footer>
</body>`;
  scorecardDiv.appendChild(batScorecard);
  var bowlScorecard = document.createElement("div");
  bowlScorecard.innerHTML = `<header class=scoreheader style='background-color:${
    teamData[team2.toLowerCase()].color //ADD LAST SIX BALLS FEATURE AT SCORECARD BOTTOM-LEFT
  }'>${team2.toUpperCase()}</header>
  <body>
  <table style="margin-bottom:0;" class="table table-striped">
  <tbody id="ball-table-inn${arguments[3]}">
    <tr style="display:none;">
      <th>Players</th>
      <th>Info</th>
    </tr>
    </tbody>
  </table>`;
  scorecardDiv.appendChild(bowlScorecard);
}

function switchInnings() {
  console.log(document.getElementById("scorecard-view-inn1").hidden);
  if (document.getElementById("scorecard-view-inn1").hidden == true) {
    document.getElementById("scorecard-view-inn1").hidden = false;
    document.getElementById("scorecard-view-inn2").hidden = true;
  } else {
    document.getElementById("scorecard-view-inn1").hidden = true;
    document.getElementById("scorecard-view-inn2").hidden = false;
  }
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
      result.innings1Battracker,
      "1"
    );
    handleScorecardCreation(
      result.innings2BatTeam,
      result.innings1BatTeam,
      result.innings2Battracker,
      "2"
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
          `bat-info-inn1-${element.batter1}`
        ).innerHTML = `<i>not out</i>`;
        document.getElementById(
          `bat-info-inn1-${element.batter2}`
        ).innerHTML = `<i>not out</i>`;

        document.getElementById("footerscore-inn1").innerHTML = `<b>${
          element.runs
        }/${element.wickets}</b>${"     "}(${matchEvent[1]})`;

        document.getElementById(
          `bat-runs-inn1-${element.batsman}`
        ).innerHTML = `<b>
        ${element.batterTracker[element.batsman].runs}
        </b> (${element.batterTracker[element.batsman].balls})`;

        if (matchEvent[4] == "W") {
          document.getElementById(
            `bat-info-inn1-${element.batsman}`
          ).innerHTML = matchEvent[8];
        }

        if (element.bowlerTracker[element.bowler].ballLog.length == 1) {
          document.getElementById("ball-table-inn1").innerHTML += `<tr>
          <td style="height:10px;font-size:0.8rem;padding:3px;width:30%" id="bowl-name-inn1-${
            element.bowler
          }"><b>${element.bowler}</b></td>
          <td id="bowl-info-row-inn1-${
            element.bowler
          }" style="height:10px;font-size:0.8rem;padding:3px;width:50%" id="bowl-info-${
            element.bowler
          }">
          ${
            (~~(element.bowlerTracker[element.bowler].balls / 6)).toString() +
            "." +
            (element.bowlerTracker[element.bowler].balls % 6).toString()
          } - 0 - ${element.bowlerTracker[element.bowler].runs} - <b>${
            element.bowlerTracker[element.bowler].wickets
          }</b>
          </td>
          </tr>`;
        } else {
          document.getElementById(
            `bowl-info-row-inn1-${element.bowler}`
          ).innerHTML = ` ${
            (~~(element.bowlerTracker[element.bowler].balls / 6)).toString() +
            "." +
            (element.bowlerTracker[element.bowler].balls % 6).toString()
          } - 0 - ${element.bowlerTracker[element.bowler].runs} - <b>${
            element.bowlerTracker[element.bowler].wickets
          }</b>`;
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

          //Scorecards
          ballsList.append(newBall);
          document.getElementById(
            `bat-info-inn2-${element.batter1}`
          ).innerHTML = `<i>not out</i>`;
          document.getElementById(
            `bat-info-inn2-${element.batter2}`
          ).innerHTML = `<i>not out</i>`;

          document.getElementById("footerscore-inn2").innerHTML = `<b>${
            element.runs
          }/${element.wickets}</b>${"     "}(${matchEvent[1]})`;

          document.getElementById(
            `bat-runs-inn2-${element.batsman}`
          ).innerHTML = `<b>
        ${element.batterTracker[element.batsman].runs}
        </b> (${element.batterTracker[element.batsman].balls})`;

          if (matchEvent[4] == "W") {
            document.getElementById(
              `bat-info-inn2-${element.batsman}`
            ).innerHTML = matchEvent[8];
          }

          if (element.bowlerTracker[element.bowler].ballLog.length == 1) {
            document.getElementById("ball-table-inn2").innerHTML += `<tr>
          <td style="height:10px;font-size:0.8rem;padding:3px;width:30%" id="bowl-name-inn2-${
            element.bowler
          }"><b>${element.bowler}</b></td>
          <td id="bowl-info-row-inn2-${
            element.bowler
          }" style="height:10px;font-size:0.8rem;padding:3px;width:50%" id="bowl-info-${
              element.bowler
            }">
          ${
            (~~(element.bowlerTracker[element.bowler].balls / 6)).toString() +
            "." +
            (element.bowlerTracker[element.bowler].balls % 6).toString()
          } - 0 - ${element.bowlerTracker[element.bowler].runs} - <b>${
              element.bowlerTracker[element.bowler].wickets
            }</b>
          </td>
          </tr>`;
          } else {
            document.getElementById(
              `bowl-info-row-inn2-${element.bowler}`
            ).innerHTML = ` ${
              (~~(element.bowlerTracker[element.bowler].balls / 6)).toString() +
              "." +
              (element.bowlerTracker[element.bowler].balls % 6).toString()
            } - 0 - ${element.bowlerTracker[element.bowler].runs} - <b>${
              element.bowlerTracker[element.bowler].wickets
            }</b>`;
          }

          //**Scorecards

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
