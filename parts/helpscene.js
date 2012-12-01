// HelpScene Class...
// self contained parts of the game such as different screens, levels or game modes
function HelpScene() {
	this.mPersist = false;
	
	this.mBatch = new RenderBatch();
	
	this.mText = new Array();
	this.mText[0] = new Text();
	
	this.mText[1] = new Text();
	this.mText[2] = new Text();
	
	this.mText[3] = new Text();
	this.mText[4] = new Text();
	this.mText[5] = new Text();
	
	this.mText[6] = new Text();
	this.mText[7] = new Text();
	this.mText[8] = new Text();
	this.mText[9] = new Text();
	
	this.mSprite = new Sprite();
}

// returns the type of this object for validity checking
HelpScene.prototype.Type = function() {
	return "HelpScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
HelpScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
HelpScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	{
		this.mText[0].SetFontName("sans-serif");
		this.mText[0].SetFontSize(12);
		this.mText[0].mString = "Click anywhere to return to menu";
		this.mText[0].mDepth = -2000;
		this.mText[0].mShadow = true;
		
		this.mText[0].mPos.Set((nmain.game.mCanvasSize.mX / 2) - (this.mText[0].GetWidth() / 2), 12);
	}
	
	{
		this.mText[1].SetFontName("sans-serif");
		this.mText[1].SetFontSize(16);
		this.mText[1].mString = "Our Units";
		this.mText[1].mDepth = -2000;
		this.mText[1].mShadow = true;
		
		this.mText[1].mPos.Set(56, 80);
		
		this.mText[2].SetFontName("sans-serif");
		this.mText[2].SetFontSize(16);
		this.mText[2].mString = "Enemy Units";
		this.mText[2].mDepth = -2000;
		this.mText[2].mShadow = true;
		
		this.mText[2].mPos.Set(328, 80);
	}
	
	{
		this.mText[3].SetFontName("sans-serif");
		this.mText[3].SetFontSize(12);
		this.mText[3].mString = "Worker Creation Building\nbuild your extra worker\nunits here";
		this.mText[3].mDepth = -2000;
		this.mText[3].mShadow = true;
		
		this.mText[3].mPos.Set(160, 130);
		
		this.mText[4].SetFontName("sans-serif");
		this.mText[4].SetFontSize(12);
		this.mText[4].mString = "Pusher and Puller\nuse the worker units to move\nyour artillery and scout";
		this.mText[4].mDepth = -2000;
		this.mText[4].mShadow = true;
		
		this.mText[4].mPos.Set(160, 190);
		
		this.mText[5].SetFontName("sans-serif");
		this.mText[5].SetFontSize(12);
		this.mText[5].mString = "Artillery\nyour only offensive units which\nare immobile by themselves;\nlose these and lose the game;\nattack range is visible when unit\nis selected";
		this.mText[5].mDepth = -2000;
		this.mText[5].mShadow = true;
		
		this.mText[5].mPos.Set(160, 250);
	}
	
	{
		this.mText[6].SetFontName("sans-serif");
		this.mText[6].SetFontSize(12);
		this.mText[6].mString = "Ion Cannon\nlong range enemy building;\nthis is a primary target";
		this.mText[6].mDepth = -2000;
		this.mText[6].mShadow = true;
		
		this.mText[6].mPos.Set(420, 130);
		
		this.mText[7].SetFontName("sans-serif");
		this.mText[7].SetFontSize(12);
		this.mText[7].mString = "Scout Creation Building\nthe enemy produces scouts from here\nthis is a primary target";
		this.mText[7].mDepth = -2000;
		this.mText[7].mShadow = true;
		
		this.mText[7].mPos.Set(420, 190);
		
		this.mText[8].SetFontName("sans-serif");
		this.mText[8].SetFontSize(12);
		this.mText[8].mString = "Scout\npassive unit which seeks out player\nunits and stalks them, obstructing\ntheir movement and providing vision";
		this.mText[8].mDepth = -2000;
		this.mText[8].mShadow = true;
		
		this.mText[8].mPos.Set(420, 250);
		
		this.mText[9].SetFontName("sans-serif");
		this.mText[9].SetFontSize(12);
		this.mText[9].mString = "Targeting Indication\nif you see this then an enemy unit can\nattack any units on that tile; only visible\nwhen the player has vision of the\nattacking unit";
		this.mText[9].mDepth = -2000;
		this.mText[9].mShadow = true;
		
		this.mText[9].mPos.Set(420, 330);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("help_cheat");
		this.mSprite.SetTexture(tex);
		this.mSprite.mDepth = 500;
	}
	
	for (var i = 0; i < this.mText.length; ++i) {
		this.mBatch.AddText(this.mText[i]);
	}
	
	this.mBatch.AddSprite(this.mSprite);
}

// cleans up the scene object
HelpScene.prototype.TearDown = function() {
	
}

// handles user input
HelpScene.prototype.Input = function() {
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		nmgrs.sceneMan.ChangeScene(new MenuScene());
	}
}

// handles game logic
HelpScene.prototype.Process = function() {
	
}

// handles all drawing tasks
HelpScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mBatch.Render();
}
// ...End

