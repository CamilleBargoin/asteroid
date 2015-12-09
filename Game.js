
var playerShip, asteroidGenerator, bonusGenerator = null;
var asteroids = [];
var elements = {
    spaceships: [],
    asteroids: [],
    bonuses: []
};
var intervalID = null;
var moveRightAnimationId, moveLeftAnimationId,  moveUpAnimationId,  moveDownAnimationId = null;
var fireMinigunAnimationId = null;
var intervalFireID = null;
var game = null;


window.addEventListener("DOMContentLoaded", function() {
    game = new Game();
    game.turnOnArrows();
});



var explodeAnimate = function(object, callback) {

    var explosionAnimation = [{
        x: 0,
        y: 0,
        width: 61,
        height: 103
    },{
        x: -61,
        y: 0,
        width: 82,
        height: 103
    },
    {
        x: -143,
        y: 0,
        width: 93,
        height: 103
    },
    {
        x: -236,
        y: 0,
        width: 95,
        height: 103
    },
    {
        x: -318,
        y: 0,
        width: 72,
        height: 103
    }];


    var explosionContainer = window.document.createElement("div");
    explosionContainer.className = "explosionContainer";
    explosionContainer.style.width = "120px";
    explosionContainer.style.height = "115px";


    var explosionMasque = window.document.createElement("div");
    explosionMasque.className = "explosionMasque";
    explosionMasque.style.width = explosionAnimation[0].width + 5 + "px";
     explosionMasque.style.height = explosionAnimation[0].height + 5 + "px";
    explosionContainer.appendChild(explosionMasque);


    var explosion = window.document.createElement("div");
    explosion.className = "explosion";
    explosion.style.width = explosionAnimation[0].width + "px";
     explosion.style.height = explosionAnimation[0].height + "px";
    explosionMasque.appendChild(explosion);

    object.htmlElement.appendChild(explosionContainer);

    var oldTimestamp = null;
    var sequencePosition = 0;
    var that = this;
    var isAnimating = true;

    var animate = function(currentTimestamp) {

        oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
        var delta = currentTimestamp - oldTimestamp;

        if (delta > 90) {
            if (sequencePosition == explosionAnimation.length) {
                object.isMoving = false;
                callback();
                isAnimating = false;
            }
            else {
                explosion.style.backgroundPosition = "left " + explosionAnimation[sequencePosition].x + "px top " + explosionAnimation[sequencePosition].y + "px";

                explosion.style.width =  explosionAnimation[sequencePosition].width + "px";
                explosion.style.height = explosionAnimation[sequencePosition].height + "px";
                explosionMasque.style.width =  explosionAnimation[sequencePosition].width + "px";
                explosionMasque.style.height = explosionAnimation[sequencePosition].height + "px";

                sequencePosition++;
                oldTimestamp = currentTimestamp;
            }


        }
        if (isAnimating)
            animationRequestId = window.requestAnimationFrame(animate);
    };
    animationRequestId = window.requestAnimationFrame(animate);

};



var Game = function() {

    this.init = function() {


        var playerSpan = window.document.createElement("span");
        playerSpan.setAttribute("id", "spacecraft");
        window.document.getElementById("gameFrame").appendChild(playerSpan);

        playerShip = new Spaceship(playerSpan);
        elements.spaceships.push(playerShip);


        // Starting weapons
        playerShip.weapons.rockets.push(new Rocket());
        playerShip.weapons.rockets.push(new Rocket());
        playerShip.weapons.rockets.push(new Rocket());
        playerShip.weapons.miniguns.push(new Minigun(15));
        playerShip.weapons.miniguns.push(new Minigun(75));

        window.document.getElementById("hud_lives").innerHTML = playerShip.getLives();
        window.document.getElementById("hud_rockets").innerHTML = playerShip.weapons.rockets.length;

        playerShip.displayInfo();


        //
        // Buttons Click Events
        //

        var startButton = window.document.getElementById("startAsteroids");
        startButton.addEventListener("click", function() {

            bonusGenerator = new BonusGenerator();
            bonusGenerator.start();
            asteroidGenerator = new AsteroidGenerator();
            asteroidGenerator.start();
        });

        var stopButton = window.document.getElementById("stopAsteroids");
        stopButton.addEventListener("click", function() {
            asteroidGenerator.stop();
        });

        var rocketButton = window.document.getElementById("hud_rocketsIcon");
        rocketButton.addEventListener("click", function() {
            playerShip.addMoreRockets();
        });


        var counterElement = window.document.getElementById("asteroidDestroyed");
        counterElement.innerHTML = 0;
        counterElement.addEventListener("DOMSubtreeModified", this.displayKillCount());

    };



    this.turnOnArrows = function() {
        window.document.addEventListener("keydown", this.keydownListener);
        window.document.addEventListener("keyup", this.keyupListener);
    };

    this.turnOffArrows = function() {
        window.document.removeEventListener("keydown", this.keydownListener);
        window.document.removeEventListener("keyup", this.keyupListener);
    };


    this.keydownListener = function(e) {

        if (e.keyCode == 39 || e.keyCode == 68) {
            playerShip.moveRight();
        }
        if (e.keyCode == 37 || e.keyCode == 81) {
            playerShip.moveLeft();
        }

        if (e.keyCode == 38 || e.keyCode == 90) {
            playerShip.moveUp();
        }
        if (e.keyCode == 40 || e.keyCode == 83) {
           playerShip.moveDown();
        }

        if (e.keyCode == 32) {
           playerShip.fireMiniguns();
        }

        if (e.keyCode == 13 || e.keyCode == 69) {
           playerShip.shootRocket();
        }
    };


    this.keyupListener = function(e) {

        if (e.keyCode == 39 || e.keyCode == 68) {
            playerShip.isMovingRight = false;

           window.cancelAnimationFrame(moveRightAnimationId);
           moveRightAnimationId = null;
        }
        if (e.keyCode == 37 || e.keyCode == 81) {
            playerShip.isMovingLeft = false;

           window.cancelAnimationFrame(moveLeftAnimationId);
           moveLeftAnimationId = null;
        }

        if (e.keyCode == 38 || e.keyCode == 90) {
            playerShip.isMovingUp = false;

            window.cancelAnimationFrame(moveUpAnimationId);
            moveUpAnimationId = null;
        }
        if (e.keyCode == 40 || e.keyCode == 83) {
            playerShip.isMovingDown = false;

            window.cancelAnimationFrame(moveDownAnimationId);
            moveDownAnimationId = null;
        }


        if (e.keyCode == 32) {
            //window.cancelAnimationFrame(fireMinigunAnimationId);
            clearInterval(intervalFireID)  ;  //
            playerShip.isFiring = false;
        }

    };


    this.displayKillCount = function() {
        if (parseInt(this.innerHTML)%10 === 0) {


                var displayKillcountContainer = window.document.createElement("div");
                displayKillcountContainer.className = "displayBonusContainer";
                displayKillcountContainer.innerHTML = (this.innerHTML + " asteroids destroyed !").toUpperCase();
                window.document.body.appendChild(displayKillcountContainer);

                setTimeout(function() {
                     window.document.body.removeChild(displayKillcountContainer);
                 }, 1000);


            }
    };


    this.init();
};
