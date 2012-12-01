// MenuScene Class...
// self contained parts of the game such as different screens, levels or game modes
function MenuScene() {
	this.mPersist = false;
	
	this.mBatch = new RenderBatch();
	
	this.mButtonText = new Array();
	this.mButtonText[0] = new Text();
	this.mButtonText[1] = new Text();
	this.mButtonText[2] = new Text();
	this.mButtonText[3] = new Text();
	this.mButtonText[4] = new Text();
	this.mButtonText[5] = new Text();
	
	this.mButtons = new Array();
	this.mButtons[0] = new Sprite;
	this.mButtons[1] = new Sprite;
	this.mButtons[2] = new Sprite;
	this.mButtons[3] = new Sprite;
	this.mButtons[4] = new Sprite;
	
	this.mRand = new RNG(0);
	
	this.mSizeArray = new Array();
	this.mSizeArray[0] = "s";
	this.mSizeArray[1] = "m";
	this.mSizeArray[2] = "b";
	
	this.mMapSize = "s";
	this.mBaseSize = "s";
	this.mSeed = 0;
}

// returns the type of this object for validity checking
MenuScene.prototype.Type = function() {
	return "MenuScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
MenuScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
MenuScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("smb_select");
		
		{
			this.mButtonText[0].SetFontName("sans-serif");
			this.mButtonText[0].SetFontSize(18);
			this.mButtonText[0].mString = "Map Size";
			this.mButtonText[0].mDepth = -2000;
			this.mButtonText[0].mShadow = true;
			
			this.mButtons[0].SetAnimatedTexture(tex, 3, 1, -1, -1);
			this.mButtons[0].SetCurrentFrame(0);
			this.mButtons[0].mDepth = -2000;
			
			this.mButtonText[0].mPos.Set((nmain.game.mCanvasSize.mX / 2) - this.mButtonText[0].GetWidth() - 8, 30 + this.mButtons[0].GetHeight() / 16);
			this.mButtons[0].mPos.Set((nmain.game.mCanvasSize.mX / 2) + 8, 30);
		}
		
		{
			this.mButtonText[1].SetFontName("sans-serif");
			this.mButtonText[1].SetFontSize(18);
			this.mButtonText[1].mString = "Base Size";
			this.mButtonText[1].mDepth = -2000;
			this.mButtonText[1].mShadow = true;
			
			this.mButtons[1].SetAnimatedTexture(tex, 3, 1, -1, -1);
			this.mButtons[1].SetCurrentFrame(0);
			this.mButtons[1].mDepth = -2000;
			
			this.mButtonText[1].mPos.Set((nmain.game.mCanvasSize.mX / 2) - this.mButtonText[1].GetWidth() - 8, 70 + this.mButtons[1].GetHeight() / 16);
			this.mButtons[1].mPos.Set((nmain.game.mCanvasSize.mX / 2) + 8, 70);
		}
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("menu_button");
		
		{
			this.mButtonText[2].SetFontName("sans-serif");
			this.mButtonText[2].SetFontSize(18);
			this.mButtonText[2].mString = "Randomise Seed";
			this.mButtonText[2].mDepth = -2000;
			this.mButtonText[2].mShadow = true;
			
			this.mButtons[2].SetTexture(tex);
			this.mButtons[2].mDepth = -2000;
			
			this.mButtons[2].mPos.Set((nmain.game.mCanvasSize.mX / 2) - ((3 * this.mButtons[2].GetWidth()) / 2) + 24, 150);
			this.mButtonText[2].mPos.Set(this.mButtons[2].mPos.mX - (this.mButtonText[2].GetWidth() / 2) + (this.mButtons[2].GetWidth() / 2), 120 + this.mButtons[2].GetHeight() / 16);
		}
		
		{
			this.mButtonText[3].SetFontName("sans-serif");
			this.mButtonText[3].SetFontSize(18);
			this.mButtonText[3].mString = "Start Game";
			this.mButtonText[3].mDepth = -2000;
			this.mButtonText[3].mShadow = true;
			
			this.mButtons[3].SetTexture(tex);
			this.mButtons[3].mDepth = -2000;
			
			this.mButtons[3].mPos.Set((nmain.game.mCanvasSize.mX / 2) + (this.mButtons[3].GetWidth() / 2) - 24, 150);
			this.mButtonText[3].mPos.Set(this.mButtons[3].mPos.mX - (this.mButtonText[3].GetWidth() / 2) + (this.mButtons[3].GetWidth() / 2), 120 + this.mButtons[3].GetHeight() / 16);
		}
	}
	
	{
		var d = new Date();
		this.mRand.SetSeed(d.getTime());
		var seed = this.mRand.GetRandInt(0, 99999999);
		this.mRand.SetSeed(seed);
		this.mSeed = seed;
		
		this.mButtonText[4].SetFontName("sans-serif");
		this.mButtonText[4].SetFontSize(12);
		this.mButtonText[4].mString = (this.mRand.GetSeed()).toString();
		this.mButtonText[4].mDepth = -2010;
		this.mButtonText[4].mShadow = true;
		
		this.mButtonText[4].mPos.Set(this.mButtons[2].mPos.mX + (this.mButtons[2].GetWidth() / 2) - (this.mButtonText[4].GetWidth() / 2), this.mButtons[2].mPos.mY + this.mButtons[2].GetHeight() - 7);
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("help_icon");
		
		this.mButtonText[5].SetFontName("sans-serif");
		this.mButtonText[5].SetFontSize(12);
		this.mButtonText[5].mString = "Learn a little about how the game works ->";
		this.mButtonText[5].mDepth = -2000;
		this.mButtonText[5].mShadow = true;
		
		this.mButtons[4].SetTexture(tex);
		this.mButtons[4].SetCurrentFrame(0);
		this.mButtons[4].mDepth = -2000;
		
		this.mButtons[4].mPos.Set(nmain.game.mCanvasSize.mX - this.mButtons[4].GetWidth() - 12, nmain.game.mCanvasSize.mY - this.mButtons[4].GetHeight() - 12);
		this.mButtonText[5].mPos.Set(nmain.game.mCanvasSize.mX - this.mButtons[4].GetWidth() - this.mButtonText[5].GetWidth(), nmain.game.mCanvasSize.mY - (this.mButtons[4].GetHeight() / 2) - 12);
	}
	
	this.SetUpBatch();
}

// cleans up the scene object
MenuScene.prototype.TearDown = function() {
	
}

// handles user input
MenuScene.prototype.Input = function() {
	if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
		// the mouse cursor position offset by the current camera (view)
		var pt = new IVec2(0, 0);
		pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
		
		for (var i = 0; i < this.mButtons.length; ++i) {
			// top left of the buttons boundbox
			var tl = new IVec2(this.mButtons[i].mPos.mX, this.mButtons[i].mPos.mY);
			
			// bottom right of the buttons boundbox
			var br = new IVec2(this.mButtons[i].mPos.mX + this.mButtons[i].GetWidth(),
					this.mButtons[i].mPos.mY + this.mButtons[i].GetHeight());
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				if (i == 0 || i == 1) {
					var frame = (this.mButtons[i].mCurrFrame + 1) % this.mButtons[i].mNumFrames;
					this.mButtons[i].SetCurrentFrame(frame);
					this.SetUpBatch();
					
					if (i == 0) {
						this.mMapSize = this.mSizeArray[frame];
					}
					else {
						this.mBaseSize = this.mSizeArray[frame];
					}
				}
				else if (i == 2) {
					var seed = this.mRand.GetRandInt(0, 99999999);
					this.mRand.SetSeed(seed);
					this.mSeed = seed;
					this.mButtonText[4].mString = (this.mRand.GetSeed()).toString();
					this.mButtonText[4].mPos.Set(this.mButtons[2].mPos.mX + (this.mButtons[2].GetWidth() / 2) - (this.mButtonText[4].GetWidth() / 2), this.mButtons[2].mPos.mY + this.mButtons[2].GetHeight() - 7);
					this.SetUpBatch();
				}
				else if (i == 3) {
					this.mPersist = true;
					nmgrs.sceneMan.ReadyScene(new GameScene());
					
					nmgrs.sceneMan.mReadyScene.mMenuMapSize = this.mMapSize;
					nmgrs.sceneMan.mReadyScene.mMenuBaseSize = this.mBaseSize;
					nmgrs.sceneMan.mReadyScene.mMenuSeed = this.mSeed;
					
					nmgrs.sceneMan.SwitchScene();
				}
				else if (i == 4) {
					this.mPersist = true;
					nmgrs.sceneMan.ChangeScene(new HelpScene());
				}
			}
		}
	}
}

// handles game logic
MenuScene.prototype.Process = function() {
	
}

// handles all drawing tasks
MenuScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mBatch.Render();
}

MenuScene.prototype.SetUpBatch = function() {
	this.mBatch.Clear();
	
	for (var i = 0; i < this.mButtonText.length; ++i) {
		this.mBatch.AddText(this.mButtonText[i]);
	}
	
	for (var i = 0; i < this.mButtons.length; ++i) {
		this.mBatch.AddSprite(this.mButtons[i]);
	}
}
// ...End

