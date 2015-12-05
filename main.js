
var playerCraft = null;
var intervalID = null;


window.addEventListener("load", function() {


    playerCraft = new SpaceCraft();

    var playerCraftSpan = window.document.createElement("span");
    playerCraftSpan.setAttribute("id", "spacecraft");
    window.document.getElementById("gameFrame").appendChild(playerCraftSpan);


    window.document.addEventListener("keydown", keydownListener);
    window.document.addEventListener("keyup", keyupListener);
});




var keydownListener = function(e) {

    if (e.keyCode == 39 || e.keyCode == 68) {
        playerCraft.moveRight();
    } else if (e.keyCode == 37 || e.keyCode == 81) {
        playerCraft.moveLeft();
    } else if (e.keyCode == 38 || e.keyCode == 90) {
        playerCraft.moveUp();
    } else if (e.keyCode == 40 || e.keyCode == 83) {
       playerCraft.moveDown();
    }

    if (e.keyCode == 32) {
       playerCraft.shootRocket();
    }
};

var keyupListener = function(e) {

	if ( e.keyCode == 39 || e.keyCode == 68 || e.keyCode == 37 || e.keyCode == 81 || 
		e.keyCode == 38 || e.keyCode == 90 || e.keyCode == 40 || e.keyCode == 83) {
		clearInterval(intervalID);
		playerCraft.isMoving = false;
	}
	
};
