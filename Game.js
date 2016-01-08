
    var playerShip, asteroidGen, bonusGenerator = null;
    var asteroids = [];
    var elements = {
        spaceships: [],
        asteroids: []
    };
    var moveRightAnimationId, moveLeftAnimationId,  moveUpAnimationId,  moveDownAnimationId = null;
    var intervalFireID = null;
    var game = null;

(function () {

    var Game = function() {

        var that = this;
        var score = 0;
        this.power = 100;

        var skills = [{
            name: "HTML/CSS",
            score: 30000,
            locked: true
        },
        {
            name: "Bootstrap",
            score: 50000,
            locked: true
        },
        {
            name: "Javascript",
            score: 80000,
            locked: true
        },
        {
            name: "jQuery",
            score: 120000,
            locked: true
        },
        {
            name: "Angular",
            score: 170000,
            locked: true
        },
        {
            name: "Express",
            score: 230000,
            locked: true
        },
        {
            name: "node.js",
            score: 300000,
            locked: true
        },
        {
            name: "MeteorJS",
            score: 380000,
            locked: true
        },
        {
            name: "Titanium",
            score: 500000,
            locked: true
        },
        {
            name: "Engagez <br/>moi!",
            score: 700000,
            locked: true
        }];
        var skillCount = 0;

        this.isPaused = false;

        this.init = function() {

           this.mainMenu();

           $("#mainContainer").mousemove(function(e) {
                var amountMovedX = (e.pageX * -1 / 20);
                var amountMovedY = (e.pageY * -1 / 20);
                $(this).css('background-position',  amountMovedX + 'px ' + amountMovedY + 'px');

                amountMovedX = (e.pageX * -1 / 6);
                amountMovedY = (e.pageY * -1 / 6);
                $("#backgroundParallax").css('background-position',  amountMovedX + 'px ' + amountMovedY + 'px');
            });


            //
            //  CLICK EVENTS
            //


            // SKIP INTRO from intro screen
            $("#endIntroButton").click(function() {

                $("#intro").fadeOut('slow', function() {
                    that.showGame();
                    $("#introTyped").remove();
                    $(".typed-cursor").remove();
                });
            });

            // BACK TO MENU from game screen
            $("#hud_menu").click(that.backToMenu);

            // PAUSE GAME from game screen
            $("#hud_pause").click(that.togglePause);


            // UNPAUSE from pause screen
            $("#pauseContainer li:nth-of-type(1) p, #pauseContainer li:nth-of-type(1) img").click(function(){
                   that.togglePause();
                });

            // BACK TO MENU from pause screen
            $("#pauseContainer li:nth-of-type(2) p, #pauseContainer li:nth-of-type(2) img").click(function(){
                $("#pauseContainer").hide();
                that.backToMenu();
            });



            // SUBMIT Button from game over screen
            $("#submitNameButton").click(function(event) {

                // TODO: SAVE NAME AND SCORE ON SERVER
               alert($("#endGameContainer input").val());

               $("#endGameContainer span").css({
                    transform: "scale(0)",
                    transition: "all 0.2s ease-in-out"
                });

                setTimeout(function() {
                    $("#endGameContainer").fadeOut('fast', that.backToMenu);
               }, 300);
            });


            // BACK BUTTON from score screen
            $(".backButton").click(function(){
                    $("#scoreContainer").fadeOut('fast', function() {
                    $("#menu").fadeIn('fast');
                });
            });

            // BACK TO MENU from resume screen
            $(".backButton").click(function(){
                    $("#resumeContainer").fadeOut('fast', function() {
                    $("#menu").fadeIn('fast');
                });
            });

            //  DOWNLOAD button from resume screen
            $("#downloadResume").click(function() {
                alert("télécharger le CV");
            });


        };


        this.mainMenu = function() {

            $("#startGame").click(this.intro);
            $("#showScores").click(this.showScores);
            $("#showResume").click(this.showResume);


            $("#menuList ul li").mouseenter(function() {
                var el = $(this);
                setTimeout(function() {
                    el.css("background-image", "url('./img/gui/main_button_1_selected.png')");
                }, 100);
            });

            $("#menuList ul li").mouseleave(function() {
                var el = $(this);
                setTimeout(function() {
                    el.css("background-image", "url('./img/gui/main_button_1.png')");
                }, 200);
            });
        };


        /**
         * [intro description]
         * @return {[type]} [description]
         */
        this.intro = function() {


            $("#intro").show();
            $("#transitionBlack").fadeIn(2500, function(){
                 $("#gameContainer").show();

                 $("#backgroundScroll2").fadeIn('fast');
                 $("#backgroundScroll").fadeIn('fast');


            }).fadeOut(2000, function() {

                $introTyped = $("<span id='introTyped'></span>");
                $("#introTypedContainer").append($introTyped);

                $introTyped.typed({
                    stringsElement: $('#introtext'),
                    typeSpeed: 30,
                    cursorChar: "|",
                    callback: function() {
                        $("#endIntroButton").html("Commencer ->");
                    }
                });
            });



        };


        /**
         * [showGame description]
         * @return {[type]} [description]
         */
        this.showGame = function() {

            score = 0;
            this.power = 100;
            this.isPaused = false;


            //
            //  PLAYER SPACESHIP
            //

            playerShip = new Spaceship();
            playerShip.createElement();
            playerShip.showFlame();
            elements.spaceships[0] = playerShip;
            // Starting weapons
            playerShip.weapons.rockets.push(new Rocket());
            playerShip.weapons.rockets.push(new Rocket());
            playerShip.weapons.rockets.push(new Rocket());
            playerShip.weapons.miniguns.push(new Minigun(17));
            playerShip.weapons.miniguns.push(new Minigun(91));

            playerShip.displayInfo();


            //
            //  GAME HUD
            //
            $("#gameHud").show().animate({
                top: "-16px"
            }, 400, function() {
                playerShip.htmlElement.animate({
                    left: "300px"
                }, 300, function() {
                    $("#bottomResumeContainer").fadeIn('slow');
                });
            });

            $("#health").html(playerShip.getHealth()).append("<sup>%</sup>");
            $("#scoreLeft").html("");
            $("#scoreRight").html(score);

            that.setPower(that.power);
            game.turnOnArrows();










            //
            // STARTS GENERATING ASTEROIDS
            //
            setTimeout(function() {
                asteroidGen = new AsteroidGenerator();
                asteroidGen.start();
            }, 1000);


            $(window).blur(function() {
               // that.togglePause();
            });

        };


        /**
         * [togglePause description]
         * @return {[type]} [description]
         */
        this.togglePause = function() {


            if (that.isPaused) {
                that.isPaused = false;

                for(var i = 0; i < elements.asteroids.length; i++) {
                    elements.asteroids[i].isMoving= true;
                    elements.asteroids[i].move();
                }

                if (asteroidGen)
                    asteroidGen.start();

               // that.turnOnArrows();

                $("#backgroundScroll").addClass("horizontal_scroll");
                $("#backgroundScroll2").addClass("horizontal_scrollFast");


               $("#pauseContainer ul").css({
                    transform: "scale(0)",
                    transition: "all 0.2s ease-in-out"
                });

               setTimeout(function() {
                $("#pauseContainer").fadeOut('fast');
               }, 300);



            }
            else {
                that.isPaused = true;

                if (asteroidGen)
                    asteroidGen.stop();

                //that.turnOffArrows();

                $("#backgroundScroll").removeClass("horizontal_scroll");
                $("#backgroundScroll2").removeClass("horizontal_scrollFast");


                $("#pauseContainer").fadeIn('fast', function() {
                    setTimeout(function() {
                        $("#pauseContainer ul").css({
                        transform: "scale(1)",
                        transition: "all 0.2s ease-in-out"
                    });
                    }, 300);
                });

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



        this.setPower = function(newPower) {
            this.power = newPower;
            $("#hud_power").html("Power: " + newPower);

            if (this.power <= 20)
                $("#hud_power").css("color", "red");
            else
                $("#hud_power").css("color", "white");

        };

        this.addNewSkill = function(skillName) {


            $skillBox = $("<div class='skillBox' >" + skillName+ "</div>");
            $("#bottomResumeContainer").append($skillBox);

            $skillBox.animate({
                left: skillCount * ((window.innerWidth) *10/100) + "px"
            }, 400);

            skillCount++;
/*
            if (skillCount == skills.length){
                $skillBox.css({
                    fontSize: "14px"
                });
            }*/
        };


        this.keydownListener = function(e) {

            if (!this.isPaused) {
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
            }


            if (e.keyCode == 27) {
               that.togglePause();
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
                clearInterval(intervalFireID);
                playerShip.isFiring = false;
            }

        };


        this.displayKillCount = function() {

            this.displayMessage(score + " Points !");

        };


        this.displayMessage = function(message) {
            $("#hud_message").text(message);
            $("#hud_messageContainer").fadeToggle("fast").delay(2000).fadeToggle("fast");

        };

        this.displayAlert = function(message) {
            if (message)
                $("#hud_alertMessage").text(message);
            $("#hud_alertMessageContainer").fadeToggle("fast").delay(2000).fadeToggle("fast");
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

            $("#menu").fadeOut('fast', function() {
                $("#scoreContainer").fadeIn('fast').css('display','table');
            });



        };


        this.showResume = function() {


            $("#menu").fadeOut('fast', function() {
                $("#resumeContainer").fadeIn('fast');
            });




            $(".resumeCol:nth-of-type(1) img").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumePersonalData").fadeIn('fast');
            });

            $(".resumeCol:nth-of-type(2) img").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeSkills").fadeIn('fast');
            });

            $(".resumeCol:nth-of-type(3) img").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeWorks").fadeIn('fast');
            });

            $(".resumeCol:nth-of-type(4) img").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeFormation").fadeIn('fast');
            });


            $("#resumePersonalData").mouseleave(function(){
                $("#resumePersonalData").fadeOut('fast');
            });

            $("#resumeSkills").mouseleave(function(){
                $("#resumeSkills").fadeOut('fast');
            });

            $("#resumeWorks").mouseleave(function(){
                $("#resumeWorks").fadeOut('fast');
            });

            $("#resumeFormation").mouseleave(function(){
                $("#resumeFormation").fadeOut('fast');
            });

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


            if (score%50000 == 0)
                this.displayKillCount();

            this.checkNewSkill();
        };

        this.checkNewSkill = function() {

            for (var i = 0; i < skills.length; i++ ) {

                if (score >= skills[i].score && skills[i].locked) {
                    this.addNewSkill(skills[i].name);
                    skills[i].locked = false;
                    break;
                }
            }
        };

        this.backToMenu = function() {


            asteroidGen.stop();
            // pause the game to prevent remaining asteroids from moving
            that.isPaused = true;
            // prevent the player from moving the spaceship
            that.turnOffArrows();

            $("#transitionBlack").fadeIn(2500, function(){
                that.resetGame();
                $("#gameContainer").hide();

            }).fadeOut(2500);
        };

        this.endGame = function() {
            console.log('game over !');

            // pause the game to prevent remaining asteroids from moving
            that.isPaused = true;
            // prevent the player from moving the spaceship
            that.turnOffArrows();


            setTimeout(function() {
                $("#endGameContainer").fadeIn('fast', function() {
                    setTimeout(function() {
                        $("#endGameContainer input").val("PSEUDO");
                        $("#endGameContainer span").css({
                            transform: "scale(1)",
                            transition: "all 0.2s ease-in-out"
                        });

                         $("#endGameContainer p").html("Score: " + score);
                    }, 300);
                });
            }, 800);



            $("#endGameContainer input").focus(function(event) {
               $(this).val("");
            });


        };

        this.resetGame = function() {
            for (var i = 0; i < elements.asteroids.length; i++) {
                elements.asteroids[i].htmlElement.remove();
                elements.asteroids[i] = null;
            }
            elements.asteroids = [];


            elements.spaceships[0].htmlElement.remove();
            elements.spaceships[0] = null;
            elements.spaceships = [];
            playerShip = null;


            $("#gameHud").css({
                top: "-500px",
                display: "none"
            }).hide();



            $("#bottomResumeContainer").hide();


            for (var i = 0; i < skills.length; i++) {
                skills[i].locked = true;
            }


            $("#spaceshipContainer").remove();
            $(".skillBox").remove();
            $(".rocket").remove();
            $(".bullet").remove();

            $("#health").removeClass("danger");

        };

        this.init();
    };



    $(document).ready(function() {


        var images = ['./img/backgrounds/background_menu.jpg', './img/backgrounds/background_menu2.jpg'];

        $('#mainContainer').css({
            background: 'url(' + images[Math.floor(Math.random() * images.length)] + ') center center'
        });

        Spaceship.prototype = new Utils();
        Minigun.prototype = new Utils();
        Rocket.prototype = new Utils();


        game = new Game();

    });

})();
