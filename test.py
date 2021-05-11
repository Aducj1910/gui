import eel
import sys
# insert at 1, 0 is the script path (or '' in REPL)
import mainconnect

eel.init('web')

@eel.expose
def dummy(param):
    print("Got " + param )
    return "got it"

@eel.expose
def mainconnectGame(team1, team2):
    returnInfo = mainconnect.game(False, team1, team2, "testing")
    print(returnInfo)
    return returnInfo



eel.start('index.html')