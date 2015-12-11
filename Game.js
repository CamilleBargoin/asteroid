
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









var Game = function() {

    this.init = function() {
        var that = this;


       var $playerSpan = $("<span id='spacecraft'></span>");
       $("#gameFrame").append($playerSpan);


        playerShip = new Spaceship($playerSpan);
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


        var counterElement = window.document.getElementById("asteroidDestroyed");
        counterElement.innerHTML = 0;
        counterElement.addEventListener("DOMSubtreeModified", this.displayKillCount());


        //
        // Buttons Click Events
        //
        $("#startAsteroids").click(function(event) {
            //bonusGenerator = new BonusGenerator();
            //bonusGenerator.start();
            asteroidGenerator = new AsteroidGenerator();
            asteroidGenerator.start();
        });


        $("#stopAsteroids").click(function() {
            asteroidGenerator.stop();
        });

        $("#rotate").click(function() {
            that.rotateGame();
        });

        $("#hud_rocketsIcon").click(function(event) {
            playerShip.addMoreRockets();
        });

    };



    this.turnOnArrows = function() {
        $(window).keydown(this.keydownListener);
        $(window).keyup(this.keyupListener);
    };

    this.turnOffArrows = function() {
        $(window).off("keydown");
        $(window).off("keyup");
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



    this.rotateGame = function() {

        if ($("#backgroundScroll").hasClass('horizontal_scroll')) {
            $("#backgroundScroll").removeClass('horizontal_scroll');
            $("#backgroundScroll").addClass('vertical_scroll');


            $("#backgroundScroll2").removeClass('horizontal_scrollFast');
            $("#backgroundScroll2").addClass('vertical_scrollFast');

            playerShip.rotate();
        }
        else{
            $("#backgroundScroll").addClass('horizontal_scroll');
            $("#backgroundScroll").removeClass('vertical_scroll');

            $("#backgroundScroll2").addClass('horizontal_scrollFast');
            $("#backgroundScroll2").removeClass('vertical_scrollFast');


        }


    };




    this.init();
};



$(document).ready(function() {


    Spaceship.prototype = new Utils();
    Minigun.prototype = new Utils();
    Rocket.prototype = new Utils();
    Asteroid.prototype = new Utils();

    game = new Game();
    game.turnOnArrows();
});
