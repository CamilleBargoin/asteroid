
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

    var that = this;
    var score = 0;


    this.isPaused = false;

    this.init = function() {

       this.mainMenu();

    };


    this.mainMenu = function() {

        $("#startGame").click(this.start);
        $("#showScores").click(this.showScores);
        $("#showResume").click(this.showResume);



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



        $("#menuBackground").mousemove(function(e) {
            var amountMovedX = (e.pageX * -1 / 20);
            var amountMovedY = (e.pageY * -1 / 20);
            $(this).css('background-position',  amountMovedX + 'px ' + amountMovedY + 'px');

            amountMovedX = (e.pageX * -1 / 6);
            amountMovedY = (e.pageY * -1 / 6);
            $("#menuBackgroundParallax").css('background-position',  amountMovedX + 'px ' + amountMovedY + 'px');

        });



        var boss = new Boss();
        boss.generateHtml();
        boss.move();
    };




    this.start = function() {


        var $playerSpan = $("<span id='spaceshipContainer'><span id='spaceship'></span></span>");

        $("#gameFrame").append($playerSpan);
        $playerSpan.hide();

        playerShip = new Spaceship($playerSpan);
        elements.spaceships.push(playerShip);


        // Starting weapons
        playerShip.weapons.rockets.push(new Rocket());
        playerShip.weapons.rockets.push(new Rocket());
        playerShip.weapons.rockets.push(new Rocket());
        playerShip.weapons.miniguns.push(new Minigun(17));
        playerShip.weapons.miniguns.push(new Minigun(91));

        playerShip.displayInfo();


        $("#hud_lives").html(playerShip.getLives());
        $("#hud_rockets").html(playerShip.weapons.rockets.length);


        $("#scoreLeft").html();
        $("#scoreRight").html(score);





        $("#menuBackground").fadeOut('fast', function() {
        });

        $("#backgroundScroll2").fadeIn('fast', function() {

        });

        $("#backgroundScroll").fadeIn('fast', function() {

        });





        //
        // Buttons Click Events
        //
        $("#hud_start").click(function(event) {
            //bonusGenerator = new BonusGenerator();
            //bonusGenerator.start();

            $playerSpan.fadeIn("fast", function() {
            });


            game.turnOnArrows();

            playerShip.showFlame();
            asteroidGenerator = new AsteroidGenerator();
            asteroidGenerator.start();
        });


        $("#stopAsteroids").click(function() {
            asteroidGenerator.stop();
        });


        /**
         *  PAUSE METHOD
         */
        $("#hud_pause").click(that.togglePause);


        /**
         *  SHOW MENU METHOD
         */
        $("#hud_menu").click(that.backToMenu);


        /**
         * [description]
         */
        $("#hud_rocketsIcon").click(function(event) {
            playerShip.addMoreRockets();
        });



        // Init game by hiding the main menu and showing game hud
        $("#menu").fadeOut("slow", function(){
            $("#gameHud").fadeIn("fast");

        });

    };


    this.togglePause = function() {
        if (that.isPaused) {

                that.isPaused = false;

                for(var i = 0; i < elements.asteroids.length; i++) {
                    elements.asteroids[i].isMoving= true;
                    elements.asteroids[i].move();
                }
                asteroidGenerator.start();

                that.turnOnArrows();

            }
            else {

                that.isPaused = true;
                /*
                for(var i = 0; i < elements.asteroids.length; i++) {
                    elements.asteroids[i].isMoving = false;
                }*/
                asteroidGenerator.stop();
                that.turnOffArrows();
            }
    };


    this.turnOnArrows = function() {
        $(window).keydown(this.keydownListener);
        $(window).keyup(this.keyupListener);
    };

    this.turnOffArrows = function() {
        $(window).off("keydown");
        $(window).off("keyup");
    };

    this.backToMenu = function() {
        $("#gameHud").fadeOut("slow", function() {
            $("#menu").fadeIn("fast");
        });
        $("#spacecraft").fadeOut("slow", function() {
            $playerSpan.remove();
        });

        that.mainMenu();
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

        if (e.keyCode == 27) {
           that.backToMenu();
        }
    };


    this.keyupListener = function(e) {

        $(".spaceshipFlame").css("left", "-23px");

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

                var displayKillcountContainer = $("<div class='displayBonusContainer'></div>");
                displayKillcountContainer.text((score + " Points !").toUpperCase());
                displayKillcountContainer.css("display", "none");
                $("body").append(displayKillcountContainer);
                displayKillcountContainer.fadeIn('fast', function() {
                    setTimeout(function() {
                        displayKillcountContainer.fadeOut('fast', function() {
                            displayKillcountContainer.remove();
                        });

                 }, 1000);
                });




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

    this.showScores = function() {

       alert("under construction");
    };


    this.showResume = function() {

               alert("under construction");
    };


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
            this.displayKillCount();
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
