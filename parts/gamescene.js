// GameScene Class...
// self contained parts of the game such as different screens, levels or game modes
function GameScene() {
	this.mPersist = false;
	
	this.mCam = new Camera();
	this.mMap = new GFMap();
	
	this.mCanScroll = false;
	
	this.mTurn = 0;
	this.mEndPlayerTurn = 0;
	
	this.mGameUI = new GFGameUI();
	
	this.mUnitBatch = new RenderBatch();
	this.mGameEntities = new Array();
	
	this.mSelectID = -1;
	this.mPusherCount = 0;
	this.mPullerCount = 0;
	
	this.mPlacementMode = false;
	this.mPlacementBounds = new Array();
	this.mPlacementHighlight = new Array();
}

// returns the type of this object for validity checking
GameScene.prototype.Type = function() {
	return "GameScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
GameScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
GameScene.prototype.SetUp = function() {
	nmain.game.mClearColour = "#604039";
	
	var d = new Date();
	
	var mapGen = new GFMapGen();
	this.mMap = mapGen.GenerateMap(d.getTime(), "s", "s");
	
	this.mCam.mTranslate.Set(0 - ((nmain.game.mCanvasSize.mX - (this.mMap.mMapSize.mX * 32)) / 2),
			0 - ((nmain.game.mCanvasSize.mY - (this.mMap.mMapSize.mY * 32)) / 2));
	
	if (nmain.game.mCanvasSize.mY < this.mMap.mMapSize.mY * 32) {
		this.mCanScroll = true;
	}
	
	this.mTurn = 3;
	this.SetUpPlayerUnits();
	this.mGameUI.SetUp(this.mCam);
}

// cleans up the scene object
GameScene.prototype.TearDown = function() {
	
}

// handles user input
GameScene.prototype.Input = function() {
	if (this.mTurn == 1) { // if it is the player's turn
		if (this.mCanScroll == true) {
			if (this.mCam.mTranslate.mY > -24) {
				if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.up)) {
					this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY - 1);
					
					this.mGameUI.Input(this.mCam);
					
					if (this.mSelectID >= 0) {
						this.mGameEntities[this.mSelectID].UpdateUI(this.mCam);
					}
				}
			}
			
			if (this.mCam.mTranslate.mY + nmain.game.mCanvasSize.mY < (this.mMap.mMapSize.mY * 32) + 24) {
				if (nmgrs.inputMan.GetKeyboardDown(nkeyboard.key.code.down)) {
					this.mCam.mTranslate.Set(this.mCam.mTranslate.mX, this.mCam.mTranslate.mY + 1);
					
					this.mGameUI.Input(this.mCam);
					
					if (this.mSelectID >= 0) {
						this.mGameEntities[this.mSelectID].UpdateUI(this.mCam);
					}
				}
			}
		}
		
		if (nmgrs.inputMan.GetKeyboardPressed(nkeyboard.key.code.e)) {
			if (this.mEndPlayerTurn == 0) {
				this.mEndPlayerTurn = 100;
				
				if (this.mSelectID >= 0) {
					this.mGameEntities[this.mSelectID].SoftReset();
				}
			}
			else {
				this.mEndPlayerTurn = 0;
				this.mTurn = 2;
				
				this.mGameUI.SwitchTurn(1);
			}
		}
		
		if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.left)) {
			// check if we are in placement mode or not
			if (this.mPlacementMode == true) {
				// the mouse cursor position offset by the current camera (view)
				var pt = new IVec2(0, 0);
				pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
				pt.mX += this.mCam.mTranslate.mX; pt.mY += this.mCam.mTranslate.mY;
				
				for (var i = 0; i < this.mPlacementBounds.length; i += 2) {
					if (util.PointInRectangle(pt, this.mPlacementBounds[i], this.mPlacementBounds[i + 1]) == true) {
						var pos = new IVec2();
						pos.Set(this.mPlacementBounds[i].mX / 32, this.mPlacementBounds[i].mY / 32);
						this.mGameEntities[this.mSelectID].PlacementCallback(this.mGameEntities[this.mSelectID].mPlacementInfo, this.mMap.PosToID(pos));
					}
				}
			}
			else {
				var uiClick = false;
				
				if (this.mSelectID >= 0) {
					uiClick = this.mGameEntities[this.mSelectID].ProcessUI(this.mCam);
				}
				
				// ui clicks take precedence over unit clicks - this handles any overlap between the elements
				if (uiClick == false) {
					this.OnEntityClick(uiClick);
				}
			}
		}
		else if (nmgrs.inputMan.GetMousePressed(nmouse.button.code.middle)) {
			this.TogglePlacementMode(false);
			
			if (this.mSelectID >= 0) {
				this.mGameEntities[this.mSelectID].mSelected = false;
				this.mGameEntities[this.mSelectID].mUI.mShow = true;
				this.mGameEntities[this.mSelectID].SoftReset();
				this.mSelectID = -1;
			}
		}
	}
}

// handles game logic
GameScene.prototype.Process = function() {
	this.HandleTurns();
	this.mGameUI.Process();
	
	for (var i = 0; i < this.mGameEntities.length; ++i) {
		this.mGameEntities[i].Process();
	}
	
	for (var i = 0; i < this.mPlacementHighlight.length; ++i) {
		this.mPlacementHighlight[i].Process();
	}
}

// handles all drawing tasks
GameScene.prototype.Render = function() {
	nmain.game.SetIdentity();
	this.mCam.Apply();
	
	this.mMap.mMapBatch.Render(this.mCam);
	
	{
		var arr = new Array();
		for (var i = 0; i < this.mGameEntities.length; ++i) {
			arr = arr.concat(this.mGameEntities[i].GetRender());
		}
		
		arr = arr.concat(this.mPlacementHighlight);
		
		this.mUnitBatch.Clear();
		
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i].Type() == "Sprite") {
				this.mUnitBatch.AddSprite(arr[i]);
			}
			else if (arr[i].Type() == "Text") {
				this.mUnitBatch.AddText(arr[i]);
			}
			else if (arr[i].Type() == "Shape") {
				this.mUnitBatch.AddShape(arr[i]);
			}
		}
		
		this.mUnitBatch.Render(this.mCam);
	}
	
	{
		this.mGameUI.Render(this.mCam, this.mTurn, this.mMap.mMapSize.mY);
	}
}

// handles turn logic
GameScene.prototype.HandleTurns = function() {
	// process ai turn
	if (this.mTurn == 0) {
		this.mTurn = 3;
		
		this.mGameUI.SwitchTurn(2);
	}
	else if (this.mTurn == 1) { // process player turn
		if (this.mEndPlayerTurn > 0) {
			this.mEndPlayerTurn--;
		}
	}
	else if (this.mTurn == 2) { // intermediate between player -> ai (for setup)
		if (this.mGameUI.OnTurnStart()) {
			this.mTurn = 0;
			
			// reset the status of all entities
			for (var i = 0; i < this.mGameEntities.length; ++i) {
				this.mGameEntities[i].SetActive(true);
			}
			
			if (this.mSelectID >= 0) {
				this.mGameEntities[this.mSelectID].mSelected = false;
				this.mGameEntities[this.mSelectID].mUI.mShow = true;
				this.mGameEntities[this.mSelectID].SoftReset();
				this.mSelectID = -1;
			}
			
			this.TogglePlacementMode(false, null, null);
		}
	}
	else if (this.mTurn == 3) { // intermediate between ai -> player (for setup)
		if (this.mGameUI.OnTurnStart()) {
			this.mTurn = 1;
			
			// reset the status of all entities
			for (var i = 0; i < this.mGameEntities.length; ++i) {
				this.mGameEntities[i].SetActive(true);
			}
			
			if (this.mSelectID >= 0) {
				this.mGameEntities[this.mSelectID].mSelected = false;
				this.mGameEntities[this.mSelectID].mUI.mShow = true;
				this.mGameEntities[this.mSelectID].SoftReset();
				this.mSelectID = -1;
			}
			
			this.TogglePlacementMode(false, null, null);
		}
	}
}

// handles clicking units and buildings
GameScene.prototype.OnEntityClick = function(uiClick) {
	for (var i = 0; i < this.mGameEntities.length; ++i) {
		if (this.mGameEntities[i].mActive == true) {
			// the mouse cursor position offset by the current camera (view)
			var pt = new IVec2(0, 0);
			pt.Copy(nmgrs.inputMan.GetLocalMouseCoords());
			pt.mX += this.mCam.mTranslate.mX; pt.mY += this.mCam.mTranslate.mY;
			
			// top left of the buildings boundbox
			var tl = new IVec2(0, 0);
			tl.Set(this.mGameEntities[i].mPos.mX * 32, this.mGameEntities[i].mPos.mY * 32);
			
			// bottom right of the buildings boundbox
			var br = new IVec2(0, 0);
			br.Set((this.mGameEntities[i].mPos.mX * 32) + this.mGameEntities[i].mBound.mSize.mX, (this.mGameEntities[i].mPos.mY * 32) + this.mGameEntities[i].mBound.mSize.mY);
			
			if (util.PointInRectangle(pt, tl, br) == true) {
				// check if this is already selected
				if (i != this.mSelectID) {
					// check if something is already selected
					if (this.mSelectID >= 0) {
						this.mGameEntities[this.mSelectID].mSelected = false; // deselect it
						this.mGameEntities[this.mSelectID].SoftReset();
					}
					
					this.mGameEntities[i].mSelected = true; // select this
					this.mGameEntities[i].UpdateUI(this.mCam);
					this.mSelectID = i;
				}
				
				return true;
			}
		}
	}
	
	// if we reach here, then an unoccupied part of the map was clicked
	
	// if we have a selected entity, unselect it
	if (this.mSelectID >= 0) {
		this.mGameEntities[this.mSelectID].mSelected = false;
		this.mGameEntities[this.mSelectID].SoftReset();
		this.mSelectID = -1;
	}
	
	return false;
}

// 
GameScene.prototype.TogglePlacementMode = function(mode, bounds, hilite) {
	if (this.mPlacementMode != mode) {
		this.mPlacementMode = mode;
		
		if (this.mPlacementMode == true) {
			this.mPlacementBounds = this.mPlacementBounds.concat(bounds);
			this.mPlacementHighlight = this.mPlacementHighlight.concat(hilite);
		}
		else {
			this.mPlacementBounds.splice(0, this.mPlacementBounds.length);
			this.mPlacementHighlight.splice(0, this.mPlacementHighlight.length);
		}
	}
}

// 
GameScene.prototype.SetUpPlayerUnits = function() {
	{
		var workerProd = new GFBuildingWP();
		
		var id = (this.mMap.mBlueTiles.length / 3) * this.mMap.mRand.GetRandInt(1, 2);
		id = this.mMap.mRand.GetRandInt(0, (this.mMap.mBlueTiles.length / 3) - 2) + id;
		
		var pos = new IVec2(0, 0);
		pos.Copy(this.mMap.mBlueTiles[id]);
		
		workerProd.SetUp(this.mCam, pos);
		this.mGameEntities.push(workerProd);
		
		{
			var notFreeID = this.mMap.PosToID(pos);
			this.mMap.mMapTiles[notFreeID].mFree = false;
			this.mMap.mMapTiles[notFreeID + 1].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mFree = false;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mFree = false;
			
			this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + 1].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX].mEntityID = this.mGameEntities.length - 1;
			this.mMap.mMapTiles[notFreeID + this.mMap.mMapSize.mX + 1].mEntityID = this.mGameEntities.length - 1;
		}
	}
	
	{
		var pusher = new GFUnitPusher();
		
		var id = this.mMap.mRand.GetRandInt(0, this.mMap.mBlueTiles.length - 1);
		var notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		
		while (this.mMap.mMapTiles[notFreeID].mFree == false) {
			id = (id + 1) % this.mMap.mBlueTiles.length;
			notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		}
		
		pusher.SetUp(this.mCam, this.mMap.mBlueTiles[id]);
		this.mGameEntities.push(pusher);
		
		this.mMap.mMapTiles[notFreeID].mFree = false;
		this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
		
		this.mPusherCount++;
	}
	
	{
		var puller = new GFUnitPuller();
		
		var id = this.mMap.mRand.GetRandInt(0, this.mMap.mBlueTiles.length - 1);
		var notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		
		while (this.mMap.mMapTiles[notFreeID].mFree == false) {
			id = (id + 1) % this.mMap.mBlueTiles.length;
			notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		}
		
		puller.SetUp(this.mCam, this.mMap.mBlueTiles[id]);
		this.mGameEntities.push(puller);
		
		this.mMap.mMapTiles[notFreeID].mFree = false;
		this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
		
		this.mPullerCount++;
	}
	
	{
		var arty = new GFUnitArtillery();
		
		var id = this.mMap.mRand.GetRandInt(0, this.mMap.mBlueTiles.length - 1);
		var notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		
		while (this.mMap.mMapTiles[notFreeID].mFree == false) {
			id = (id + 1) % this.mMap.mBlueTiles.length;
			notFreeID = this.mMap.PosToID(this.mMap.mBlueTiles[id]);
		}
		
		arty.SetUp(this.mCam, this.mMap.mBlueTiles[id]);
		this.mGameEntities.push(arty);
		
		this.mMap.mMapTiles[notFreeID].mFree = false;
		this.mMap.mMapTiles[notFreeID].mEntityID = this.mGameEntities.length - 1;
	}
}
// ...End

