import eel, sys, json, mainconnect, random

eel.init('web')

@eel.expose
def dummy(param):
    print("Got " + param )
    return "got it"

@eel.expose
def createPlayer(player):
    processed = {"_id": "007", "playerInitials": player['initials'], "displayName": player['display'],
        "batStyle": "right-hand bat" if player['batHand'].strip() == 'R' else 'left-hand bat', "batBallsTotal": 1000 }
    
    bowlStyle = ""
    bowl = player['bowlStyle'].strip()

    if(bowl == "RAF"):
        bowlStyle = "right-arm fast"
    elif(bowl == "RAFM"):
        bowlStyle = "right-arm medium-fast"
    elif(bowl == "LAF"):
        bowlStyle = "left-arm fast"
    elif(bowl == "LAFM"):
        bowlStyle = "left-arm medium-fast"  
    elif(bowl == "RAOS"):
        bowlStyle = "right-arm offbreak"
    elif(bowl == "LAOS"):
        bowlStyle = "slow left-arm orthodox" 
    elif(bowl == "LAWS"):
        bowlStyle = "left-arm wrist-spin"

    processed['bowlStyle'] = bowlStyle

    sr = ((int(player['aggressiveness'].strip())/10)**2)+random.randint(62, 75)
    print(sr, bowlStyle)
    processed['batRunsTotal'] = round(1000.0*sr)

    out_dict = {'caught': 28, 'runOut': 1, 'bowled': 7, 'lbw': 7, 'hitwicket': 0, 'stumped': 0}

    if(int(player['defensiveness'].strip()) > 75):
        out_dict['caught'] -= round((int(player['defensiveness'].strip()) - 75)/3)
        out_dict['bowled'] -= roundn((int(player['defensiveness'].strip()) - 75)/8)
        out_dict['bowled'] -= roundn((int(player['defensiveness'].strip()) - 75)/8)

    elif(int(player['defensiveness'].strip()) < 50):
        out_dict['caught'] += round(50 - (int(player['defensiveness'].strip()))/3)
        out_dict['bowled'] += roundn(50 - (int(player['defensiveness'].strip()))/8)
        out_dict['bowled'] += roundn(50 - (int(player['defensiveness'].strip()))/8)

    if(int(player['running'].strip()) > 75):
        out_dict['runOut'] = 0
    elif(int(player['running'].strip()) < 50):
        if(int(player['running'].strip()) >= 25):
            out_dict['runOut'] += 1
        else:
            out_dict['runOut'] += 2


    print(out_dict['caught'])



@eel.expose
def mainconnectGame(team1, team2):
    for i in range(1, 10):
        try:
            returnInfo = mainconnect.game(False, team1, team2, "testing")
            return returnInfo
            break
        except Exception as e:
            print(e)
            print("Restarting!")
            continue
        else:
            break

@eel.expose
def fetchData(datatype):
    if(datatype == "players"):
        with open("data/playerInfoProcessed.json") as f:
            return json.load(f)
    elif(datatype == "teaminfo"):
        with open("data/teaminfo.json") as f:
            return json.load(f)
    elif(datatype == "teamlist"):
        with open("teams/teams.json") as f:
            return json.load(f)

@eel.expose
def addDataTeam(team):
    with open("teams/teams.json") as f:
        teamData = json.load(f)
    teamData[team['name'].lower()] = team['players']

    with open('teams/teams.json', 'w') as output:
        json.dump(teamData, output) 
    
    with open("data/teaminfo.json") as f:
        teamInfoData = json.load(f)
    
    teamInfoData[team['name'].lower()] = {"color": team['color'], "text": "white"}

    with open("data/teaminfo.json", 'w') as output:
        json.dump(teamInfoData, output)

@eel.expose
def deleteTeam(teamID):
    with open("teams/teams.json") as f:
        data = json.load(f)
        del data[teamID]
        with open("teams/teams.json", "w") as out:
            json.dump(data, out)
    
    with open("data/teamInfo.json") as f:
        data = json.load(f)
        del data[teamID]
        with open("data/teamInfo.json", "w") as out:
            json.dump(data, out)


    


eel.start('index.html')