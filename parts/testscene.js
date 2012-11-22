// TestScene Class...
// self contained parts of the game such as different screens, levels or game modes
function TestScene() {
	this.mPersist = false;
	
	this.mMapBatch = new RenderBatch();
	this.mMap = new GFMap();
	
	this.mCam = new Camera();
	
	this.mCanScroll = false;
	this.mArrowUpSprite = new Sprite();
	this.mArrowDownSprite = new Sprite();
	
	this.mTurn = 0;
	this.mTurnSprite = new Sprite();
	this.mDynamicUIBatch = new RenderBatch();
	this.mEndPlayerTurn = 0;
	this.mEndPlayerTurnTimer = new Timer();
	
	this.mControlsText = new Text();
	this.mControlsBack = new Shape();
	this.mEndTurnTapText = new Text();
	this.mEndTurnTapBack = new Shape();
}

// returns the type of this object for validity checking
TestScene.prototype.Type = function() {
	return "TestScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
TestScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
TestScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	var d = new Date();
	
	var mapGen = new GFMapGen();
	this.mMap = mapGen.GenerateMap(d.getTime(), "b", "b");
	
	for (var x = 0; x < this.mMap.mMapSize.mX; ++x) {
		for (var y = 0; y < this.mMap.mMapSize.mY; ++y) {
			var ind = x + (this.mMap.mMapSize.mX * y);
			this.mMapBatch.AddSprite(this.mMap.mMapTiles[ind].mSprite);
		}
	}
	
	this.mCam.mTranslate.Set(0 - ((nmain.game.mCanvasSize.mX - (this.mMap.mMapSize.mX * 32)) / 2),
			0 - ((nmain.game.mCanvasSize.mY - (this.mMap.mMapSize.mY * 32)) / 2));
	
	if (nmain.game.mCanvasSize.mY < this.mMap.mMapSize.mY * 32) {
		this.mCanScroll = true;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 30, 1);
		this.mTurnSprite.mPos.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY);
		this.mTurnSprite.mDepth = -1000;
		this.mTurn = 3;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_up");
		this.mArrowUpSprite.SetAnimatedTexture(tex, 16, 5, 30, -1);
		this.mArrowUpSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY);
		this.mArrowUpSprite.mDepth = -1000;
	}
	
	{
		var tex = nmgrs.resMan.mTexStore.GetResource("gui_arrow_down");
		this.mArrowDownSprite.SetAnimatedTexture(tex, 16, 5, 30, -1);
		this.mArrowDownSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
		this.mArrowDownSprite.mDepth = -1000;
	}
	
	{
		this.mControlsText.mString = "Up and Down Arrow to scroll.\nDouble-tap E to end your turn.";
		this.mControlsText.mDepth = -1000;
		this.mControlsText.mPos.Set(this.mCam.mTranslate.mX + 4, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.mHeight - 5);
		
		this.mControlsBack.mColour = "#000000";
		this.mControlsBack.mDepth = -999;
		this.mControlsBack.mAlpha = 0.75;
		this.mControlsBack.mPos.Set(this.mCam.mTranslate.mX + 2, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - (this.mControlsText.mHeight * 2) - 4);
		
		var textWidth = this.mControlsText.GetWidth();
		var textHeight = this.mControlsText.GetHeight() * 2;
		this.mControlsBack.AddPoint(new IVec2(textWidth + 4, 0));
		this.mControlsBack.AddPoint(new IVec2(textWidth + 4, textHeight + 2));
		this.mControlsBack.AddPoint(new IVec2(0, textHeight + 2));
	}
	
	{
		this.mEndTurnTapText.SetFontSize(36);
		
		this.mEndTurnTapText.mString = "Press E again to confirm!";
		this.mEndTurnTapText.mDepth = -2000;
		this.mEndTurnTapText.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + this.mEndTurnTapText.GetHeight() + 10);
		
		this.mEndTurnTapBack.mColour = "#000000";
		this.mEndTurnTapBack.mDepth = -1999;
		this.mEndTurnTapBack.mAlpha = 0.75;
		this.mEndTurnTapBack.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + 17);
		
		var textWidth = this.mEndTurnTapText.GetWidth();
		var textHeight = this.mEndTurnTapText.GetHeight();
		this.mEndTurnTapBack.AddPoint(new IVec2(textWidth, 0));
		this.mEndTurnTapBack.AddPoint(new IVec2(textWidth, textHeight + 2));
		this.mEndTurnTapBack.AddPoint(new IVec2(0, textHeight + 2));
	}
}

// cleans up the scene object
TestScene.prototype.TearDown = function() {
	
}

// handles user input
TestScene.prototype.Input = function() {
	if (this.mTurn == 1) {
		if (this.mCanScroll == true) {
			if (this.mCam.mTranslate.mY > -24) {
				if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.up)) {
					this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY - 1);
					
					this.mTurnSprite.mPos.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY);
					this.mArrowUpSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY);
					this.mArrowDownSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
					
					this.mControlsText.mPos.Set(this.mCam.mTranslate.mX + 4, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.mHeight - 5);
					this.mControlsBack.mPos.Set(this.mCam.mTranslate.mX + 2, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - (this.mControlsText.mHeight * 2) - 4);
					this.mEndTurnTapText.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + this.mEndTurnTapText.GetHeight() + 10);
					this.mEndTurnTapBack.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + 17);
				}
			}
			
			if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
				if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.down)) {
					this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY + 1);
					
					this.mTurnSprite.mPos.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY);
					this.mArrowUpSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY);
					this.mArrowDownSprite.mPos.Set(this.mCam.mTranslate.mX + nmain.game.mCanvasSize.mX - 46, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - 64);
					
					this.mControlsText.mPos.Set(this.mCam.mTranslate.mX + 4, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - this.mControlsText.mHeight - 5);
					this.mControlsBack.mPos.Set(this.mCam.mTranslate.mX + 2, this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY - (this.mControlsText.mHeight * 2) - 4);
					this.mEndTurnTapText.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + this.mEndTurnTapText.GetHeight() + 10);
					this.mEndTurnTapBack.mPos.Set(this.mCam.mTranslate.mX + (nmain.game.mCanvasSize.mX / 2) - (this.mEndTurnTapText.GetWidth() / 2), this.mCam.mTranslate.mY + 17);
				}
			}
		}
		
		if (nmgrs.inputMan.GetKeyboardPressed(nkeyboard.key.code.e)) {
			if (this.mEndPlayerTurn == 0) {
				this.mEndPlayerTurn = 1;
				this.mEndPlayerTurnTimer.Reset();
			}
			else {
				this.mEndPlayerTurn = 0;
				this.mTurn = 2;
				
				var tex = nmgrs.resMan.mTexStore.GetResource("turn_1");
				this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 30, 1);
			}
		}
	}
}

// handles game logic
TestScene.prototype.Process = function() {
	if (this.mTurn == 0) {
		// alert("process ai turn");
		this.mTurn = 3;
		
		var tex = nmgrs.resMan.mTexStore.GetResource("turn_2");
		this.mTurnSprite.SetAnimatedTexture(tex, 20, 5, 30, 1);
	}
	else if (this.mTurn == 1) {
		if (this.mEndPlayerTurn == 1) {
			if (this.mEndPlayerTurnTimer.GetElapsedTime() >= 1000) {
				this.mEndPlayerTurn = 0;
			}
		}
	}
	else if (this.mTurn == 2) {
		this.mTurnSprite.Process();
		if (this.mTurnSprite.mNumLoops == 0) {
			this.mTurnSprite.mAnimSpeed = -1;
			this.mTurnSprite.SetCurrentFrame(0);
			this.mTurn = 0;
		}
	}
	else if (this.mTurn == 3) {
		this.mTurnSprite.Process();
		if (this.mTurnSprite.mNumLoops == 0) {
			this.mTurnSprite.mAnimSpeed = -1;
			this.mTurnSprite.SetCurrentFrame(0);
			this.mTurn = 1;
		}
	}
	
	this.mArrowUpSprite.Process();
	this.mArrowDownSprite.Process();
}

// handles all drawing tasks
TestScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mCam.Apply();
	
	this.mMapBatch.Render(this.mCam);
	
	{
		this.mDynamicUIBatch.Clear();
		this.mDynamicUIBatch.AddSprite(this.mTurnSprite);
		
		if (this.mTurn == 1) {
			if (this.mCam.mTranslate.mY > -24) {
				this.mDynamicUIBatch.AddSprite(this.mArrowUpSprite);
			}
			
			if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
				this.mDynamicUIBatch.AddSprite(this.mArrowDownSprite);
			}
		}
		
		
		this.mDynamicUIBatch.AddShape(this.mControlsBack);
		this.mDynamicUIBatch.AddText(this.mControlsText);
		
		if (this.mEndPlayerTurn == 1) {
			this.mDynamicUIBatch.AddShape(this.mEndTurnTapBack);
			this.mDynamicUIBatch.AddText(this.mEndTurnTapText);
		}
		
		this.mDynamicUIBatch.Render(this.mCam);
	}
}
// ...End

