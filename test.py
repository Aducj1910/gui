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
    toRet = None
    if(datatype == "players"):
        with open("data/playerInfoProcessed.json") as f:
            return json.load(f)
    elif(datatype == "teaminfo"):
        with open("data/teaminfo.json") as f:
            return json.load(f)
    elif(datatype == "teamlist"):
        with open("teams/teams.json") as f:
            return json.load(f)
    print(toRet)

    


eel.start('index.html')