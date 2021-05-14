import eel
import sys, json
# insert at 1, 0 is the script path (or '' in REPL)
import mainconnect

eel.init('web')

@eel.expose
def dummy(param):
    print("Got " + param )
    return "got it"

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