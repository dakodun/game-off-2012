// InitScene Class...
// self contained parts of the game such as different screens, levels or game modes
function InitScene() {
	this.mPersist = false;
}

// returns the type of this object for validity checking
InitScene.prototype.Type = function() {
	return "InitScene";
};

// returns whether this scene is to persist or not (when changing to a new scene -- preserves state)
InitScene.prototype.Persistent = function() {
	return this.mPersist;
};

// initialises the scene object
InitScene.prototype.SetUp = function() {
	try {
		// load the textures we need
		nmgrs.resLoad.QueueTexture("smb_select", "./res/vis/smb_select.png");
		nmgrs.resLoad.QueueTexture("menu_button", "./res/vis/menu_button.png");
		
		nmgrs.resLoad.QueueTexture("tile_set_default", "./res/vis/tile_set_default.png");
		nmgrs.resLoad.QueueTexture("tile_hilite", "./res/vis/tile_hilite.png");
		nmgrs.resLoad.QueueTexture("tile_hilite_fire", "./res/vis/tile_hilite_fire.png");
		nmgrs.resLoad.QueueTexture("explode", "./res/vis/explode.png");
		
		nmgrs.resLoad.QueueTexture("turn_1", "./res/vis/turn_1.png");
		nmgrs.resLoad.QueueTexture("turn_2", "./res/vis/turn_2.png");
		nmgrs.resLoad.QueueTexture("endturn", "./res/vis/endturn.png");
		nmgrs.resLoad.QueueTexture("cancel", "./res/vis/cancel.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_up", "./res/vis/gui_arrow_up.png");
		nmgrs.resLoad.QueueTexture("gui_arrow_down", "./res/vis/gui_arrow_down.png");
		nmgrs.resLoad.QueueTexture("gui_moves", "./res/vis/gui_moves.png");
		nmgrs.resLoad.QueueTexture("gui_debug", "./res/vis/gui_debug.png");
		
		nmgrs.resLoad.QueueTexture("unit_b_workerprod", "./res/vis/unit_b_workerprod.png");
		nmgrs.resLoad.QueueTexture("gui_workerprod", "./res/vis/gui_workerprod.png");
		nmgrs.resLoad.QueueTexture("unit_u_pusher", "./res/vis/unit_u_pusher.png");
		nmgrs.resLoad.QueueTexture("gui_pusher", "./res/vis/gui_pusher.png");
		nmgrs.resLoad.QueueTexture("unit_u_puller", "./res/vis/unit_u_puller.png");
		nmgrs.resLoad.QueueTexture("gui_puller", "./res/vis/gui_puller.png");
		nmgrs.resLoad.QueueTexture("unit_u_arty", "./res/vis/unit_u_arty.png");
		nmgrs.resLoad.QueueTexture("gui_arty", "./res/vis/gui_arty.png");
		nmgrs.resLoad.QueueTexture("arty_firezone", "./res/vis/arty_firezone.png");
		
		nmgrs.resLoad.QueueTexture("unit_b_enemyion", "./res/vis/unit_b_enemyion.png");
		nmgrs.resLoad.QueueTexture("unit_b_enemyscoutprod", "./res/vis/unit_b_enemyscoutprod.png");
		nmgrs.resLoad.QueueTexture("unit_u_enemyscout", "./res/vis/unit_u_enemyscout.png");
		nmgrs.resLoad.QueueTexture("ic_firezone", "./res/vis/ic_firezone.png");
		
		nmgrs.resLoad.QueueTexture("fog", "./res/vis/fog.png");
		
		nmgrs.resLoad.QueueTexture("lose", "./res/vis/lose.png");
		nmgrs.resLoad.QueueTexture("won", "./res/vis/won.png");
		
		nmgrs.resLoad.AcquireResources();
		nmgrs.resLoad.mIntervalID = setInterval(function() {nmgrs.resLoad.ProgressCheck();}, 0);
	} catch(e) {
		alert(e.What());
	}
}

// cleans up the scene object
InitScene.prototype.TearDown = function() {
	
}

// handles user input
InitScene.prototype.Input = function() {
	
}

// handles game logic
InitScene.prototype.Process = function() {
	if (nmgrs.resLoad.mWorking == false) {
		nmgrs.sceneMan.ChangeScene(new MenuScene());
		// nmgrs.sceneMan.ChangeScene(new GameScene());
	}
}

// handles all drawing tasks
InitScene.prototype.Render = function() {
	
}
// ...End

