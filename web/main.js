function testMain() {
  eel.dummy("check!")(function (result) {
    console.log(result);
  });
}

function customGame() {
  eel.mainconnectGame(
    "dc",
    "csk"
  )(function (result) {
    console.log(result);
  });
}
