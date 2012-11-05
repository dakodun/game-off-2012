// Game Class...
// a game object contains all the logic and data of our game
function Game() {
	this.mCanvas = null;
	this.mContext = null;
	
	this.mQuit = false;
};

// initialises the game object
Game.prototype.SetUp = function() {
	this.mCanvas = document.getElementById("canvas"); // get the canvas element handle by id from the html file
	this.mContext = this.mCanvas.getContext("2d"); // get a 2d context handle from the canvas
	
	nmanagers.sceneManager.ChangeScene(new InitScene());
};

// cleans up the game object
Game.prototype.TearDown = function() {
	
};

Game.prototype.Run = function() {
	// while the app is to run
	do {
		this.Input(); // perform input handling
		this.Process(); // process the game
		this.Render(); // render the results
	} while(!mQuit);
}

Game.prototype.Input = function() {
	sceneManager.GetCurrentScene().Input(); // perform input for the current scene
}

Game.prototype.Process = function() {
	sceneManager.GetCurrentScene().Process(); // process the current scene
}

Game.prototype.Render = function() {
	sceneManager.GetCurrentScene().Render(); // render the current scene
}
// ...End


// main Namespace...
var nmain = new function() {
	this.game = new Game(); // our game object
}
// ...End

