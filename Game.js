
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


            $('#saveScoreForm').on('submit', function(e) {
                e.preventDefault();

                var $this = $(this); // L'objet jQuery du formulaire

                // Envoi de la requête HTTP en mode asynchrone
                $.ajax({
                    url: $this.attr('action'),
                    type: $this.attr('method'),
                    data: $this.serialize(),
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

            //  DOWNLOAD button from resume screen
            $("#dlResumeButton").click(function() {
                window.open("Camille Bargoin CV 2015.pdf");
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

            $("#menuFooter > div").mouseenter(function() {
                $(this).animate({
                    height: "120px"
                }, 200);
                $('#pwet').animate({
                    fontSize: "20px",
                }, 200);
            }).mouseout(function() {
                $(this).animate({
                    height: "35px"
                }, 200);
                $('#pwet').animate({
                    fontSize: "12px",
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
                    typeSpeed: 0.1,
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
            playerShip.weapons.rockets.push(new Laser());
            //playerShip.weapons.rockets.push(new Rocket());
            //playerShip.weapons.rockets.push(new Rocket());
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

            that.displayEnergy(that.power);
            game.turnOnArrows();


            //
            // STARTS GENERATING ASTEROIDS
            //
            setTimeout(function() {
                asteroidGen = new AsteroidGenerator();
                asteroidGen.start();

                bonusGen = new BonusGenerator();
                bonusGen.start();
                $("#audioMain")[0].volume = 0.3;
                $("#audioMain")[0].play();
            }, 1000);


            $(window).blur(function() {
               that.togglePause();
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



        this.displayEnergy = function(newEnergy) {
            //this.power = newPower;

            $("#hud_power").html("Energie: " + newEnergy);

            if (newEnergy <= 20)
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
                   //playerShip.shootRocket();
                   playerShip.shootLaser();
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


            // Envoi de la requête HTTP en mode asynchrone
            $.ajax({
                url: "score.php",
                type: "post",
                data: "callFunction=getScores",
                dataType: 'json',
                success: function(json) {

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

                    for (var i = 0; i < 10; i++) {
                        $("#scoreContainer tbody").append('<tr><td><span class="scorePos">' + (i + 1) + '</span></td>' +
                            '<td class="scoreName">' + sortedScores[i].name + '</td>' +
                            '<td class="scoreNumber">' + sortedScores[i].score + '</td></tr>');
                    }
                }
            });
        };


        this.showResume = function() {

            $("#menu").fadeOut('fast', function() {


                $("#resumeContainer").fadeIn('fast', function() {


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

                         setTimeout(function() {

                            $("#resumeBody ul li:nth-of-type(1)").trigger('mouseenter');
                         }, 500);

                    });



                });

            });



            $("#resumeBody ul li:nth-of-type(1)").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeSkills").fadeIn('1500').css("display", "table");

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

            $("#resumeBody ul li:nth-of-type(3)").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeWorks").fadeIn('1500');
            });

            $("#resumeBody ul li:nth-of-type(5)").mouseenter(function(){
                $(".resumeTexts").hide();
                $("#resumeFormation").fadeIn('1500');
            });

/*
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
*/

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
                        $("#scoreFormPseudo").val("PSEUDO");
                        $("#endGameContainer span").css({
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
        Laser.prototype = new Utils();


        game = new Game();

    });

})();
