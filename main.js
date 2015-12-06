
var playerCraft = null;
var asteroids = [];
var intervalID = null;
var intervalFireID = null;


window.addEventListener("load", function() {


    

    

    var playerCraftSpan = window.document.createElement("span");
    playerCraftSpan.setAttribute("id", "spacecraft");
    playerCraftSpan.innerHTML = "->";
    window.document.getElementById("gameFrame").appendChild(playerCraftSpan);

    playerCraft = new SpaceCraft(playerCraftSpan);

    // Starting weapons
    playerCraft.weapons.rockets.push(new Rocket());
    playerCraft.weapons.rockets.push(new Rocket());
    playerCraft.weapons.rockets.push(new Rocket());
	playerCraft.weapons.miniguns.push(new Minigun(0));
	playerCraft.weapons.miniguns.push(new Minigun(48));

	window.document.getElementById("hud_lives").innerHTML = playerCraft.getLives();
	window.document.getElementById("hud_rockets").innerHTML = playerCraft.weapons.rockets.length;

	playerCraft.displayInfo();


	



	var asteroidSpan = window.document.createElement("span");
	asteroidSpan.className = "asteroid";
	window.document.getElementById("gameFrame").appendChild(asteroidSpan);


	asteroids.push(new Asteroid(asteroidSpan));






    window.document.addEventListener("keydown", keydownListener);
    window.document.addEventListener("keyup", keyupListener);
});




var keydownListener = function(e) {

    if (e.keyCode == 39 || e.keyCode == 68) {
        playerCraft.moveRight();
    } else if (e.keyCode == 37 || e.keyCode == 81) {
        playerCraft.moveLeft();
    }

    if (e.keyCode == 38 || e.keyCode == 90) {
        playerCraft.moveUp();
    } else if (e.keyCode == 40 || e.keyCode == 83) {
       playerCraft.moveDown();
    }

    if (e.keyCode == 32) {
       playerCraft.fireMiniguns();
    }

    if (e.keyCode == 13 || e.keyCode == 69) {
       playerCraft.shootRocket();
    }
};

var keyupListener = function(e) {

	if ( e.keyCode == 39 || e.keyCode == 68 || e.keyCode == 37 || e.keyCode == 81 || 
		e.keyCode == 38 || e.keyCode == 90 || e.keyCode == 40 || e.keyCode == 83) {
		clearInterval(intervalID);
		playerCraft.isMoving = false;
	}
	if (e.keyCode == 32) {
		clearInterval(intervalFireID);
       	playerCraft.isFiring = false;
    }
	
};

var getPosition = function(element) {
    var pos = element.getBoundingClientRect();
    return [[pos.left, pos.right], [pos.top, pos.bottom]];
};


var comparePositions = function(p1, p2) {
    var r1, r2;
    r1 = p1[0] < p2[0] ? p1 : p2;
    r2 = p1[0] < p2[0] ? p2 : p1;
    return r1[1] > r2[0] || r1[0] === r2[0];
};
