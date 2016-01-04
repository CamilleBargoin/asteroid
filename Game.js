
var asteroidGenerator, bonusGenerator = null;
var elements = {
    spaceships: [],
    asteroids: [],
    bonuses: []
};

var moveRightAnimationId, moveLeftAnimationId,  moveUpAnimationId,  moveDownAnimationId = null;
var game = null;


var Game = function() {

    var that = this;
    var score = 0;

    this.playerShip = null;
    this.isPaused = false;

    /**
     * Entry door / initialisation of the game
     */
    this.init = function() {
       this.mainMenu();
    };

    /**
     * Display the main menu of the game
     */
    this.mainMenu = function() {

        // click events
        $("#startGame").click(this.start);
        $("#showScores").click(this.showScores);
        $("#showResume").click(this.showResume);



        // selection effect over the menu entry
        $("ul li").mouseenter(function() {
            var el = $(this);
            setTimeout(function() {
                el.css("background-image", "url('./img/gui/main_button_1_selected.png')");
            }, 100);
        });

        $("ul li").mouseleave(function() {
            var el = $(this);
            setTimeout(function() {
                el.css("background-image", "url('./img/gui/main_button_1.png')");
            }, 200);
        });



        // parallax effect for the background
        $("#menuBackground").mousemove(function(e) {

            var amountMovedX = (e.pageX * -1 / 20);
            var amountMovedY = (e.pageY * -1 / 20);
            $(this).css('background-position',  amountMovedX + 'px ' + amountMovedY + 'px');

            amountMovedX = (e.pageX * -1 / 6);
            amountMovedY = (e.pageY * -1 / 6);
            $("#menuBackgroundParallax").css('background-position',  amountMovedX + 'px ' + amountMovedY + 'px');
        });
    };



    /**
     * Launches the game
     *     - hides the main menu
     *     - displays the game interface (hud)
     *     - instanciates a new Spaceship Object
     */
    this.start = function() {





        // creates a new Spaceship Object and adds it to the DOM
        that.playerShip = new Spacehip();
        that.playerShip.generateHtml();
        $("#spaceship").hide();
        elements.spaceships.push(that.playerShip);


        // Starting weapons
        that.playerShip.weapons.rockets.push(new Rocket());
        that.playerShip.weapons.rockets.push(new Rocket());
        that.playerShip.weapons.rockets.push(new Rocket());
        that.playerShip.weapons.miniguns.push(new Minigun(17));
        that.playerShip.weapons.miniguns.push(new Minigun(91));

        that.playerShip.displayInfo();


        // displays basic info on interface (health and score)
        $("#health").prepend(that.playerShip.getHealth());
        $("#scoreLeft").html();
        $("#scoreRight").html(score);


        //
        // Buttons Click Events
        //

        // Starts the game. instanceiates the AsteroidGenerator and activates keyboard
        $("#hud_start").click(function(event) {
            //bonusGenerator = new BonusGenerator();
            //bonusGenerator.start();

            game.turnOnArrows();

            that.playerShip.showFlame();
            asteroidGenerator = new AsteroidGenerator();
            asteroidGenerator.start();
        });

        // Pauses the game
        $("#hud_pause").click(that.togglePause);



        // Displays main menu
        $("#hud_menu").click(that.backToMenu);




        // hides main menu and displays game background and interface
        $("#menuBackground").fadeOut('fast');
        $("#backgroundScroll2").fadeIn('fast');
        $("#backgroundScroll").fadeIn('fast');

        $("#menu").fadeOut("slow", function(){
            $("#gameHud").fadeIn("fast");
            $("#spaceship").fadeIn("fast");
        });
    };

    /**
     * Pauses / unpauses the game
     */
    this.togglePause = function() {
        if (that.isPaused) {

                that.isPaused = false;

                for(var i = 0; i < elements.asteroids.length; i++) {
                    elements.asteroids[i].isMoving= true;
                    elements.asteroids[i].move();
                }
                asteroidGenerator.start();

                that.turnOnArrows();

                $("#backgroundScroll").addClass("horizontal_scroll");
                $("#backgroundScroll2").addClass("horizontal_scrollFast");
            }
            else {

                that.isPaused = true;

                asteroidGenerator.stop();
                that.turnOffArrows();

                $("#backgroundScroll").removeClass("horizontal_scroll");
                $("#backgroundScroll2").removeClass("horizontal_scrollFast");
            }
    };


    /**
     * Activates the keyboard
     */
    this.turnOnArrows = function() {
        $(window).keydown(this.keydownListener);
        $(window).keyup(this.keyupListener);
    };


    /**
     * Deactivates the kayboard
     */
    this.turnOffArrows = function() {
        $(window).off("keydown");
        $(window).off("keyup");
    };


    /**
     * Hides the game interface and calls the mainMenu method
     */
    this.backToMenu = function() {
        $("#gameHud").fadeOut("slow", function() {
            $("#menu").fadeIn("fast");
        });
        $("#spaceship").fadeOut("slow", function() {
            $("#spaceship").remove();
        });

        that.mainMenu();
    };


    this.keydownListener = function(e) {

        if (e.keyCode == 39 || e.keyCode == 68) {
            that.playerShip.moveRight();
        }
        if (e.keyCode == 37 || e.keyCode == 81) {
            that.playerShip.moveLeft();
        }

        if (e.keyCode == 38 || e.keyCode == 90) {
            that.playerShip.moveUp();
        }
        if (e.keyCode == 40 || e.keyCode == 83) {
           that.playerShip.moveDown();
        }

        if (e.keyCode == 32) {
           that.playerShip.fireMiniguns();
        }

        if (e.keyCode == 13 || e.keyCode == 69) {
           that.playerShip.shootRocket();
        }

        if (e.keyCode == 27) {
           that.backToMenu();
        }
    };


    this.keyupListener = function(e) {

        $(".spaceshipFlame").css("left", "-23px");

        if (e.keyCode == 39 || e.keyCode == 68) {
            that.playerShip.isMovingRight = false;

           window.cancelAnimationFrame(moveRightAnimationId);
           moveRightAnimationId = null;
        }
        if (e.keyCode == 37 || e.keyCode == 81) {
            that.playerShip.isMovingLeft = false;

           window.cancelAnimationFrame(moveLeftAnimationId);
           moveLeftAnimationId = null;
        }

        if (e.keyCode == 38 || e.keyCode == 90) {
            that.playerShip.isMovingUp = false;

            window.cancelAnimationFrame(moveUpAnimationId);
            moveUpAnimationId = null;
        }
        if (e.keyCode == 40 || e.keyCode == 83) {
            that.playerShip.isMovingDown = false;

            window.cancelAnimationFrame(moveDownAnimationId);
            moveDownAnimationId = null;
        }


        if (e.keyCode == 32) {
            clearInterval(intervalFireID)  ;  //
            that.playerShip.isFiring = false;
        }

    };

    /**
     * Displays a message box on the screen
     */
    this.displayMessage = function(message) {
        $("#hud_message").text(message);
        $("#hud_messageContainer").fadeToggle("fast").delay(2000).fadeToggle("fast");

    };



    this.rotateGame = function() {

        if ($("#backgroundScroll").hasClass('horizontal_scroll')) {
            $("#backgroundScroll").removeClass('horizontal_scroll');
            $("#backgroundScroll").addClass('vertical_scroll');


            $("#backgroundScroll2").removeClass('horizontal_scrollFast');
            $("#backgroundScroll2").addClass('vertical_scrollFast');

            that.playerShip.rotate();
        }
        else{
            $("#backgroundScroll").addClass('horizontal_scroll');
            $("#backgroundScroll").removeClass('vertical_scroll');

            $("#backgroundScroll2").addClass('horizontal_scrollFast');
            $("#backgroundScroll2").removeClass('vertical_scrollFast');


        }
    };



    this.showScores = function() {

       alert("under construction");
    };


    this.showResume = function() {

        alert("under construction");
    };


    /**
     * Updates the scores displayed with a new value
     */
    this.updateScore = function(newScore) {

        score += newScore;

        var scoreRight = String(score%1000);
        if (score > 999)
            $("#scoreLeft").html(Math.floor(score/1000));

        if (scoreRight.length == 2)
            scoreRight = "0" + scoreRight;

        else if (scoreRight.length == 1)
            scoreRight = "00" + scoreRight;

        $("#scoreRight").html(scoreRight);


        if (score%500 == 0)
           this.displayMessage(score + " Points !");
    };



    this.init();
};



$(document).ready(function() {


    Spaceship.prototype = new Utils();
    Minigun.prototype = new Utils();
    Rocket.prototype = new Utils();
    Asteroid.prototype = new Utils();

    game = new Game();

});
