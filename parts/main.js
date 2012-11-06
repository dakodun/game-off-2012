// managers Namespace...
var nmanagers = new function() {
	this.sceneManager = new SceneManager();
}
// ...End


function main() {
	try {
		nmain.game.SetUp(); // initialise the game
		
		// run the game loop as fast as the browser will allow
		// note that timing is handled elsewhere (within the Game Run() function)
		nmain.game.mGameLoop = setInterval(function() {nmain.game.Run()}, 0);
	} catch(e) {
		alert(e.What());
	}
};
