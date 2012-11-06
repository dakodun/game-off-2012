// Game Class...
// a game object contains all the logic and data of our game
function Game() {
	this.mGameLoop = null;
	this.mFrameLimit = 60;
	this.mAccum = 0.0;
	
	this.mCanvas = null;
	this.mContext = null;
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
	var updateDisplay = false;
	
	this.Input(); // perform input handling
	
	var dt = TIME_SINCE_LAST_CALL; // need timer class
	this.accum += dt;
	while (this.accum > (1 / this.frameLimit)) {
		this.Process(); // process the game
		this.accum -= (1 / this.frameLimit);
		
		// interpolate for smoother running, baby
	}
	
	if (updateDisplay == true) {
		this.Render(); // render the results
	}
}

Game.prototype.Quit = function() {
	clearInterval(this.mGameLoop);
	this.TearDown();
}

Game.prototype.Input = function() {
	nmanagers.sceneManager.GetCurrentScene().Input(); // perform input for the current scene
}

Game.prototype.Process = function() {
	nmanagers.sceneManager.GetCurrentScene().Process(); // process the current scene
}

Game.prototype.Render = function() {
	nmanagers.sceneManager.GetCurrentScene().Render(); // render the current scene
}
// ...End


// main Namespace...
var nmain = new function() {
	this.game = new Game(); // our game object
}
// ...End

