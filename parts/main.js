// managers Namespace...
var nmanagers = new function() {
	this.sceneManager = new SceneManager();
}
// ...End


function main() {
	try {
		nmain.game.SetUp();
		nmain.game.Run();
		nmain.game.TearDown();
	} catch(e) {
		alert(e.What());
	}
};
