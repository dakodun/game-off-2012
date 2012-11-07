// Game Class...
// a game object contains all the logic and data of our game
function Game() {
	this.mGameLoop = null;
	this.mFrameLimit = 60;
	this.mAccum = 0.0;
	this.mTimer = new Timer();
	
	this.mCanvas = null;
	this.mContext = null;
};

// initialises the game object
Game.prototype.SetUp = function() {
	this.mCanvas = document.getElementById("canvas"); // get the canvas element handle by id from the html file
	this.mContext = this.mCanvas.getContext("2d"); // get a 2d context handle from the canvas
	
	nmgrs.sceneMan.ChangeScene(new InitScene());
};

// cleans up the game object
Game.prototype.TearDown = function() {
	
};

Game.prototype.Run = function() {
	var updateDisplay = false;
	
	this.Input(); // perform input handling
	
	var dt = (this.mTimer.GetElapsedTime() / 1000);
	this.mTimer.Reset();
	this.mAccum += dt;
	while (this.mAccum > (1 / this.mFrameLimit)) {
		this.Process(); // process the game
		this.mAccum -= (1 / this.mFrameLimit);
		
		// interpolate for smoother running, baby
		
		updateDisplay = true;
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
	nmgrs.sceneMan.GetCurrentScene().Input(); // perform input for the current scene
}

Game.prototype.Process = function() {
	nmgrs.sceneMan.GetCurrentScene().Process(); // process the current scene
}

Game.prototype.Render = function() {
	nmgrs.sceneMan.GetCurrentScene().Render(); // render the current scene
}
// ...End


// main Namespace...
var nmain = new function() {
	this.game = new Game(); // our game object
}
// ...End

