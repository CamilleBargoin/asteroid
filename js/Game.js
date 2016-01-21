
var game = null;

(function () {

    var Game = function() {

        var that = this;
        var score = 0;

        this.isPaused = false;
        this.mute = false;
        this.elements = {
            spaceships: [],
            asteroids: []
        };

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


        /**
         * Initializes the game, launches the main menu, initializes the click events
         */
        this.init = function() {

           this.mainMenu();

           // Parallax effect on main menu
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

            // UNPAUSE from pause menu
            $("#pauseContainer li:nth-of-type(1) p, #pauseContainer li:nth-of-type(1) img").click(function(){
                   that.togglePause();
                });

            // BACK TO MENU from pause menu
            $("#pauseContainer li:nth-of-type(2) p, #pauseContainer li:nth-of-type(2) img").click(function(){
                $("#pauseContainer").hide();
                that.backToMenu();
            });

            // TOGGLE MUSIC from pause menu
            $("#pauseContainer li:nth-of-type(3) p, #pauseContainer li:nth-of-type(3) img").click(function(){
                if (!that.mute) {
                    $("#pauseContainer li:nth-of-type(3) p").html("Musique: non");
                    that.mute = true;
                    $("#audioMain")[0].pause();
                } else {
                    $("#pauseContainer li:nth-of-type(3) p").html("Musique: oui");
                    that.mute = false;
                    $("#audioMain")[0].play();
                }

            });

            // SUBMIT score and name to server side php script using jquery ajax object
            $('#saveScoreForm').on('submit', function(e) {
                e.preventDefault();

                $.ajax({
                    url: $(this).attr('action'),
                    type: $(this).attr('method'),
                    data: $(this).serialize(),
                    dataType: 'json',
                    success: function(json) {
                        if(json.reponse === 'ok') {

                            $("#endGameContainer span").css({
                                transform: "scale(0)",
                                transition: "all 0.2s ease-in-out"
                            });

                            $("#endGameContainer").fadeOut('fast', that.backToMenu);

                        } else {
                            alert('Erreur : '+ json.reponse);
                        }
                    }
                });
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

                    $("#resumePersonalData").css("left", "500px");
                    $("#resumeBodyCenter > div").css("top", "3000px");
                    $(".resumeSide ul").css("left", "-500px");


                });
            });

            // DOWNLOAD button from resume screen
            $("#dlResumeButton").click(function() {
                window.open("Camille Bargoin CV 2015.pdf");
            });
        };


        /**
         * Initializes the main menu
         */
        this.mainMenu = function() {

            $("#startGame").click(this.intro);
            $("#showScores").click(this.showScores);
            $("#showResume").click(this.showResume);


            // Hover effect on menu entries
            $("#menuList ul li").mouseenter(function() {
                var el = $(this);
                setTimeout(function() {
                    el.css("background-image", "url('./img/gui/main_button_1_selected.png')");
                }, 70);
            });

            $("#menuList ul li").mouseleave(function() {
                var el = $(this);
                setTimeout(function() {
                    el.css("background-image", "url('./img/gui/main_button_1.png')");
                }, 200);
            });


            // animates Footer
            $("#menuFooter > div").mouseenter(function() {
                $(this).animate({
                    height: "120px"
                }, 200);
                $('#pwet').animate({
                    fontSize: "20px",
                }, 200);
            }).mouseleave(function() {
                $(this).animate({
                    height: "35px"
                }, 200);
                $('#pwet').animate({
                    fontSize: "12px",
                }, 200);
            });
        };


        /**
         * Displays the intro screen and starts the animation
         */
        this.intro = function() {

            $("#intro").show();

            var backgroundScroll1 = $("#backgroundScroll");
            var backgroundScroll2 = $("#backgroundScroll2");

            if ( !backgroundScroll1.hasClass('"horizontal_scroll'))
                backgroundScroll1.addClass("horizontal_scroll");

            if (!backgroundScroll2.hasClass('"horizontal_scrollFast'))
                backgroundScroll2.addClass("horizontal_scrollFast");

            $("#transitionBlack").fadeIn(2500, function(){
                 $("#gameContainer").show();

                 $("#backgroundScroll2").fadeIn('fast');
                 $("#backgroundScroll").fadeIn('fast');

            }).fadeOut(2000, function() {

                $introTyped = $("<span id='introTyped'></span>");
                $("#introTypedContainer").append($introTyped);

                // Using Jquery plugin Typed.js for the animation
                $introTyped.typed({
                    stringsElement: $('#introtext'),
                    typeSpeed: 0.1,
                    cursorChar: "|",
                    callback: function() {
                        $("#endIntroButton").html("Commencer ->");
                    }
                });
            });
        };


        /**
         * Displays the game screen and initializes a new game
         */
        this.showGame = function() {

            score = 0;
            this.isPaused = false;

            //
            //  PLAYER SPACESHIP
            //
            var playerShip = new Spaceship();
            playerShip.createElement();
            playerShip.showFlame();

            // Starting weapons
            playerShip.weapons.lasergun.push(new Laser());
            playerShip.weapons.miniguns.push(new Minigun(17));
            playerShip.weapons.miniguns.push(new Minigun(91));

            this.elements.spaceships[0] = playerShip;


            //
            //  GAME HUD
            //

            // starting animation
            $("#gameHud").show().animate({
                top: "-16px"
            }, 400, function() {
                playerShip.htmlElement.animate({
                    left: "300px"
                }, 300, function() {
                    $("#bottomResumeContainer").fadeIn('slow');
                });
            });

            //initialization of the game data
            $("#health").html(playerShip.getHealth()).append("<sup>%</sup>");
            $("#scoreLeft").html("");
            $("#scoreRight").html(score);
            that.displayEnergy(this.elements.spaceships[0].maxEnergy());

            game.turnOnArrows();


            //
            // STARTS the game
            //
            setTimeout(function() {
                asteroidGen = new AsteroidGenerator();
                asteroidGen.start();

                bonusGen = new BonusGenerator();
                bonusGen.start();

                // starts main music theme
                if(!that.mute) {
                    $("#audioMain")[0].volume = 0.3;
                    $("#audioMain")[0].play();
                }

            }, 1000);


            // pauses the game when leaving the window
            $(window).blur(function() {
               //that.togglePause();
            });
        };


        /**
         * Displays the Score Screen and sends a server request for scores
         */
        this.showScores = function() {

            $("#menu").fadeOut('fast', function() {
                $("#scoreContainer").fadeIn('fast').css('display','table');
            });


            // using Jquery ajax object to send a http request to server
            $.ajax({
                url: "score.php",
                type: "post",
                data: "callFunction=getScores",
                dataType: 'json',
                success: function(json) {

                    // retrieving the scores and sorting them
                   var namesAndScores = json.reponse.split(";");
                   var sortedScores = [];

                   for(var i = 0; i < namesAndScores.length; i++) {
                        if (namesAndScores[i] !="") {
                            var line = namesAndScores[i].split(":");

                            sortedScores.push({
                                name: line[0],
                                score: parseInt(line[1])
                            });
                        }

                   }

                    sortedScores.sort(function (a, b) {
                        if (a.score < b.score)
                          return 1;
                        if (a.score > b.score)
                          return -1;
                        return 0;
                    });

                    // displaying the scores
                    for (var i = 0; i < 10; i++) {
                        $("#scoreContainer tbody").append('<tr><td><span class="scorePos">' + (i + 1) + '</span></td>' +
                            '<td class="scoreName">' + sortedScores[i].name + '</td>' +
                            '<td class="scoreNumber">' + sortedScores[i].score + '</td></tr>');
                    }
                }
            });
        };


        /**
         * Displays the resume screen and launches the animations
         */
        this.showResume = function() {

            $("#menu").fadeOut('fast', function() {


                $("#resumeContainer").fadeIn('fast', function() {

                    // moving the 3 panels (left menu / central panel / right personal data panel)
                    $("#resumeBodyCenter > div").animate({
                        top: "20px"
                    }, 800, function() {
                        $("#resumePersonalData").animate({
                            left: 0,
                            top: "20px"
                        }, 500);
                         $(".resumeSide ul").animate({
                            left: "3%",
                            top: "20px"
                        }, 500);

                         // triggers the skill animation on the central panel
                        setTimeout(function() {
                            $("#resumeBody ul li:nth-of-type(1)").trigger('mouseenter');
                        }, 500);

                    });
                });

            });


            // Left menu Skill entry animation
            $("#resumeBody ul li:nth-of-type(1)").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeSkills").fadeIn('1500').css("display", "table");

                // using the circleProgress Jquery plugin to display the skill level and animation
                gradient3 = {
                    color: "#00FDFA"
                };

                gradient2 = {
                    color: "#00ADAD"
                };

                gradient1 = {
                    color: "#006767"
                };

                $("#circleHtml").circleProgress({
                    value: 0.95,
                    animationStartValue: 0,
                    size: 80,
                    fill: gradient3,
                    startAngle: 0
                });

                $("#circleBootstrap").circleProgress({
                    value: 0.95,
                    animationStartValue: 0,
                    size: 80,
                    fill: gradient3,
                    startAngle: 0
                });

                $("#circleJquery").circleProgress({
                    value: 0.95,
                    animationStartValue: 0,
                    size: 80,
                    fill: gradient3,
                    startAngle: 0
                });

                $("#circleAngular").circleProgress({
                    value: 0.8,
                    size: 80,
                    fill: gradient2,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleMongo").circleProgress({
                    value: 0.8,
                    size: 80,
                    fill: gradient2,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleNode").circleProgress({
                    value: 0.5,
                    size: 80,
                    fill: gradient1,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleExpress").circleProgress({
                    value: 0.5,
                    size: 80,
                    fill: gradient1,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleMeteor").circleProgress({
                    value: 0.5,
                    size: 80,
                    fill: gradient1,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleTitanium").circleProgress({
                    value: 0.95,
                    size: 80,
                    fill: gradient3,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleConception").circleProgress({
                    value: 0.90,
                    size: 80,
                    fill: gradient3,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circlePhp").circleProgress({
                    value: 0.80,
                    size: 80,
                    fill: gradient2,
                    animationStartValue: 0,
                    startAngle: 0
                });

                $("#circleSymfony").circleProgress({
                    value: 0.80,
                    size: 80,
                    fill: gradient2,
                    animationStartValue: 0,
                    startAngle: 0
                });

                // Hover effect
                $(".resumeSkillContainer").mouseenter(function() {
                    $(this).css({
                        transform: "scale(1.5)",
                        transition: "all 0.2s ease-in-out"
                    });
                }).mouseleave(function(){
                    $(this).css({
                        transform: "scale(1)",
                        transition: "all 0.2s ease-in-out"
                    });
                });
            });

            // Left menu Work experience entry animation
            $("#resumeBody ul li:nth-of-type(3)").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeWorks").fadeIn('1500');
            });

            // Left menu Education entry animation
            $("#resumeBody ul li:nth-of-type(5)").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeFormation").fadeIn('1500');
            });
        };


        /**
         * Toggle pause on the game
         */
        this.togglePause = function() {

            // If the game is paused, we unpause it by moving the asteroids again
            // and starting the generators again
            if (that.isPaused) {
                that.isPaused = false;

                for(var i = 0; i < this.elements.asteroids.length; i++) {
                    this.elements.asteroids[i].isMoving= true;
                    this.elements.asteroids[i].move();
                }

                if (asteroidGen)
                    asteroidGen.start();
                if (bonusGen)
                    bonusGen.start();

                $("#backgroundScroll").addClass("horizontal_scroll");
                $("#backgroundScroll2").addClass("horizontal_scrollFast");

                //hiding pause menu
               $("#pauseContainer ul").css({
                    transform: "scale(0)",
                    transition: "all 0.2s ease-in-out"
                });

               setTimeout(function() {
                $("#pauseContainer").fadeOut('fast');
               }, 300);

            }
            // If the game is not paused, we stops the generators
            // and stops all moving objects on screen
            else {
                that.isPaused = true;

                if (asteroidGen)
                    asteroidGen.stop();

                if (bonusGen)
                    bonusGen.stop();

                $("#backgroundScroll").removeClass("horizontal_scroll");
                $("#backgroundScroll2").removeClass("horizontal_scrollFast");

                // showing pause menu
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

        /**
         * turns on keyboard key listeners
         */
        this.turnOnArrows = function() {
            $(window).keydown(this.keydownListener);
            $(window).keyup(this.keyupListener);
        };

        /**
         * turns off keyboard key listeners
         */
        this.turnOffArrows = function() {
            $(window).off("keydown");
            $(window).off("keyup");
        };


        /**
         * Displays the new amount of energy on the screen
         */
        this.displayEnergy = function(newEnergy) {

            $("#hud_power").html("Energie: " + newEnergy);

            if (newEnergy <= 20)
                $("#hud_power").css("color", "red");
            else
                $("#hud_power").css("color", "white");

        };

        /**
         * checks if there is a new skill to be unlock in the skill array
         */
        this.checkNewSkill = function() {

            for (var i = 0; i < skills.length; i++ ) {

                if (score >= skills[i].score && skills[i].locked) {
                    this.addNewSkill(skills[i].name);
                    skills[i].locked = false;
                    break;
                }
            }
        };

        /**
         *  Displays a new skill at the bottom of the screen and animates it
         *  from right to left
         */
        this.addNewSkill = function(skillName) {

            $skillBox = $("<div class='skillBox' >" + skillName+ "</div>");
            $("#bottomResumeContainer").append($skillBox);

            $skillBox.animate({
                left: skillCount * ((window.innerWidth) *10/100) + "px"
            }, 400);

            skillCount++;

            if (skillCount == skills.length){
                $skillBox.css({
                    fontSize: "14px"
                });
            }
        };



        //
        //  MESSAGES
        //

        /*this.displayKillCount = function() {
            this.displayMessage(score + " Points !");
        };*/

        this.displayMessage = function(message) {
            $("#hud_message").text(message);
            $("#hud_messageContainer").fadeToggle("fast").delay(2000).fadeToggle("fast");
        };

        this.displayAlert = function(message) {
            if (message)
                $("#hud_alertMessage").text(message);
            $("#hud_alertMessageContainer").fadeToggle("fast").delay(2000).fadeToggle("fast");
        };


        /**
         *  Displays the new score on the game screen and changes the difficulty
         *  according to the score amount
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


            // calls displayMessage method to show current score to player
            if (score%50000 == 0)
                this.displayMessage(score + " Points !");


            // changes difficulty by reducing the delay between each asteroid
            if (score >= 100000) {
                asteroidGen.stop();
                asteroidGen.start(2000);
            }

            if (score >= 300000) {
                asteroidGen.stop();
                asteroidGen.start(1000);
            }

            if (score >= 600000) {
                asteroidGen.stop();
                asteroidGen.start(500);
            }

            this.checkNewSkill();
        };


        // Hides the game menu and go back to main menu
        this.backToMenu = function() {

            // stop generators
            if (asteroidGen)
                asteroidGen.stop();
            if (bonusGen)
                bonusGen.stop();

            // pauses the game to prevent remaining asteroids from moving
            that.isPaused = true;
            // prevents the player from moving the spaceship
            that.turnOffArrows();

            $("#transitionBlack").fadeIn(2500, function() {
                // calls the resetGame method to clean the game from remainging asteroids
                // and resetting dom elements to their initial positions
                that.resetGame();
                $("#gameContainer").hide();

            }).fadeOut(2500);
        };


        /**
         * Displays a game over Message with a form to save your score
         */
        this.endGame = function() {
            console.log('game over !');

            // pauses the game to prevent remaining asteroids from moving
            that.isPaused = true;
            // prevents the player from moving the spaceship
            that.turnOffArrows();

            setTimeout(function() {
                $("#endGameContainer").fadeIn('fast', function() {
                    setTimeout(function() {
                        $("#scoreFormPseudo").val("PSEUDO");
                        $("#endGameContainer div").css({
                            transform: "scale(1)",
                            transition: "all 0.2s ease-in-out"
                        });

                         $("#endGameContainer p").html("Score: " + score);
                         $("#scoreFormScore").val(score);
                    }, 300);
                });
            }, 800);

            $("#scoreFormPseudo").focus(function(event) {
               $(this).val("");
            });
        };


        /**
         *  Removes every remaingin elements and move every game element back to starting position
         */
        this.resetGame = function() {
            // removing asteroids
            for (var i = 0; i < this.elements.asteroids.length; i++) {
                this.elements.asteroids[i].htmlElement.remove();
                this.elements.asteroids[i] = null;
            }
            this.elements.asteroids = [];

            // removing spaceship
            this.elements.spaceships[0].htmlElement.remove();
            this.elements.spaceships[0] = null;
            this.elements.spaceships = [];
            playerShip = null;


            $("#gameHud").css({
                top: "-500px",
                display: "none"
            }).hide();

            $("#bottomResumeContainer").hide();

            // re-locking every skill in the skills array
            for (var i = 0; i < skills.length; i++) {
                skills[i].locked = true;
            }
            skillCount = 0;

            // removing remainging elements from DOM
            $("#spaceshipContainer").remove();
            $(".skillBox").remove();
            $(".bullet").remove();
            $("#health").removeClass("danger");
        };


        this.keydownListener = function(e) {

            if (!that.isPaused) {
                var playerShip = that.elements.spaceships[0];

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
                   playerShip.shootLaser();
                }
            }

            if (e.keyCode == 27) {
               that.togglePause();
            }
        };


        this.keyupListener = function(e) {

            $(".spaceshipFlame").css("left", "-23px");
            var playerShip = that.elements.spaceships[0];

            if (e.keyCode == 39 || e.keyCode == 68) {
                playerShip.isMovingRight = false;

               window.cancelAnimationFrame(playerShip.moveRightAnimationId);
               playerShip.moveRightAnimationId = null;
            }
            if (e.keyCode == 37 || e.keyCode == 81) {
                playerShip.isMovingLeft = false;

               window.cancelAnimationFrame(playerShip.moveLeftAnimationId);
               playerShip.moveLeftAnimationId = null;
            }

            if (e.keyCode == 38 || e.keyCode == 90) {
                playerShip.isMovingUp = false;

                window.cancelAnimationFrame(playerShip.moveUpAnimationId);
                playerShip.moveUpAnimationId = null;
            }
            if (e.keyCode == 40 || e.keyCode == 83) {
                playerShip.isMovingDown = false;

                window.cancelAnimationFrame(playerShip.moveDownAnimationId);
                playerShip.moveDownAnimationId = null;
            }

            if (e.keyCode == 32) {
                clearInterval(playerShip.intervalFireID);
                playerShip.isFiring = false;
            }
        };


        // entry door
        this.init();
    };



    $(document).ready(function() {

        // main menu random background
        var images = ['./img/backgrounds/background_menu.jpg', './img/backgrounds/background_menu2.jpg'];

        $('#mainContainer').css({
            background: 'url(' + images[Math.floor(Math.random() * images.length)] + ') center center'
        });

        // Object inheritance
        Spaceship.prototype = new Utils();
        Minigun.prototype = new Utils();
        Laser.prototype = new Utils();

        game = new Game();
    });

})();
