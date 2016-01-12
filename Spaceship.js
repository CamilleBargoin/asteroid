/**
 * [Spaceship description]
 */
var Spaceship = function() {

    var initialPos = {
        top: 500,
        left: 800
    };

    var lives = 5;
    var level = 0;
    var health = 100;
    var maxEnergy = 100, currentEnergy = 100;

    this.htmlElement = null;
    this.isMovingRight = false;
    this.isMovingLeft = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.isFiring = false;
    this.weapons = {
        rockets: [],
        miniguns: []
    };
    this.minigunsJammed = false;


    this.createElement = function() {

        this.htmlElement = $("<span id='spaceshipContainer'><span id='spaceship'></span></span>");

        $("#gameContainer").append(this.htmlElement);
    };


    /**
     * [moveRight description]
     * @return {[type]} [description]
     */
    this.moveRight = function() {
        if (!this.isMovingRight) {

            this.isMovingRight = true;
            var that = this;
            var oldTimestamp;

            var animate = function(currentTimestamp) {

                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;

                if (delta > 40) {
                    if (that.htmlElement.position().left < window.innerWidth - 100) {
                        $(".spaceshipFlame").css("left", "-44px");
                        that.htmlElement.css("left",  (that.htmlElement.position().left + 10) + "px");
                    }
                }
                moveRightAnimationId = window.requestAnimationFrame(animate);
            };
            moveRightAnimationId = window.requestAnimationFrame(animate);
        }
    };


    /**
     * [moveLeft description]
     * @return {[type]} [description]
     */
    this.moveLeft = function() {
        if (!this.isMovingLeft) {

            this.isMovingLeft = true;
            var that = this;
            var oldTimestamp;

            var animate = function(currentTimestamp) {
                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;

                if (delta > 40) {
                    $(".spaceshipFlame").css("left", "-8px");
                    if (that.htmlElement.position().left > 0)
                        that.htmlElement.css("left",   (that.htmlElement.position().left - 10) + "px");
                }

                moveLeftAnimationId = window.requestAnimationFrame(animate);
            };
            moveLeftAnimationId = window.requestAnimationFrame(animate);
        }
    };


    /**
     * [moveUp description]
     * @return {[type]} [description]
     */
    this.moveUp = function() {
        if (!this.isMovingUp) {

            this.isMovingUp = true;
            var that = this;
            var oldTimestamp;

            var animate = function(currentTimestamp) {
                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;

                if (delta > 40) {
                    var position = that.htmlElement.position();
                    if (position.top > 0) {
                        checkBottomResume(position);
                        that.htmlElement.css("top", (position.top - 10) + "px");

                    }

                }
                moveUpAnimationId = window.requestAnimationFrame(animate);
            };
            moveUpAnimationId = window.requestAnimationFrame(animate);
        }
    };


    /**
     * [moveDown description]
     * @return {[type]} [description]
     */
    this.moveDown = function() {

        if (!this.isMovingDown) {

            this.isMovingDown = true;
            var that = this;
            var oldTimestamp;

            var animate = function(currentTimestamp) {
                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;

                if (delta > 40) {
                    var position = that.htmlElement.position();

                    if (position.top < window.innerHeight - 90) {
                        checkBottomResume(position);
                        that.htmlElement.css("top",  (position.top + 10) + "px");


                    }
                }
                moveDownAnimationId = window.requestAnimationFrame(animate);
            };
            moveDownAnimationId = window.requestAnimationFrame(animate);
        }
    };


    var checkBottomResume = function(position) {
        var lock = false;
        if(position.top  >=  (window.innerHeight - 150 - 90) && !lock) {
            lock = true;
            $("#bottomResumeContainer").fadeOut('fast', function() {
                lock = false;
            });
        }
        else {

            if ($("#bottomResumeContainer").css("display") == "none" && !lock) {
                lock = true;
                $("#bottomResumeContainer").fadeIn('fast', function() {
                    lock = false;
                });
            }
        }
    };


    this.currentEnergy = function(newValue) {
        if (typeof newValue != 'undefined')
            currentEnergy = newValue;
        else
            return currentEnergy;
    };

    this.maxEnergy = function(newValue) {
        if (typeof newValue != 'undefined')
            maxEnergy = newValue;
        else
            return maxEnergy;
    };

    /**
     * [shootRocket description]
     * @return {[type]} [description]
     */
    this.shootRocket = function() {

        if (this.weapons.rockets.length > 0) {
            this.weapons.rockets[this.weapons.rockets.length - 1].fire();
            this.weapons.rockets.pop();
            $("#hud_rockets").innerHTML = this.weapons.rockets.length;
            if (this.weapons.rockets.length === 0) {
                $("#hud_rocketsIcon").className = "hud_dead";
                $("#hud_rockets").className = "hud_dead";
            }
        } else {
            alert("no more !");
        }
    };

    this.shootLaser = function() {
        this.weapons.rockets[0].fire();
    };



    /**
     * [fireMiniguns description]
     * @return {[type]} [description]
     */
    this.fireMiniguns = function() {
        if (!this.isFiring && !this.minigunsJammed) {
            this.isFiring = true;
            var that = this;


            intervalFireID = setInterval(function() {

                $("<audio></audio>")
                    .attr("src", "./sound/laser08.mp3")
                    .prop("volume", 0.2)
                    .trigger("play");

                for(var i = 0; i < that.weapons.miniguns.length; i++) {
                    that.weapons.miniguns[i].fire();
                }

            }, 200);
        }
    };

    this.jamMiniguns = function() {
        console.log("Oh No! The Miniguns are jammed !");
        this.minigunsJammed = true;
        var that = this;
        clearInterval(intervalFireID);

        game.displayAlert("Energie Epuisée!");

        setTimeout(function() {
            that.minigunsJammed = false;
            //game.setPower(100);
            game.displayEnergy(that.maxEnergy());
            that.currentEnergy(that.maxEnergy());
        }, 2000);
    };




    this.getHealth = function() {
        return health;
    };


    this.updateHealth = function(modifier) {
        health += modifier;


        if (health < 100) {
            $("#health").addClass("notFull");

            if(health == 75)
                $("#health_sprite").css({
                    backgroundPosition: "-290px -145px"
                });
            else if (health == 50)
                $("#health_sprite").css({
                    backgroundPosition: "-580px -290px"
                });
            else if (health == 25)
                $("#health_sprite").css({
                    backgroundPosition: "-290px -580px"
                });
        }
        else {
            $("#health").removeClass("notFull");
            $("#health_sprite").css({
                backgroundPosition: "0 0"
            });
        }

        if (health <= 25)
            $("#health").addClass("danger");
        else
            $("#health").removeClass("danger");

        $("#health").html(health + "<sup>%</sup>");


        if (health <= 0){
            $("#health_sprite").css({
                backgroundPosition: "-435px -725px"
            });
            this.die();
        }
    };



    /**
     * [displayInfo description]
     * @return {[type]} [description]
     */
    this.displayInfo = function() {
        console.log("New Player has:");
        console.log("  - " + lives + " lives left");
        console.log("  - " + this.weapons.rockets.length + " rockets left");
        console.log("  - infinite Minigun ammo");
    };


    /**
     * [die description]
     * @return {[type]} [description]
     */
    this.die = function() {


        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isMovingUp = false;
        this.isMovingDown = false;

        asteroidGen.stop();
        game.endGame();

    };


    this.addMoreRockets = function () {
        this.weapons.rockets.push(new Rocket());
        $("#hud_rockets").html(this.weapons.rockets.length);
    };

    this.damage = function() {
        this.updateHealth(-25);

        this.blink(3, 140);
    };


    this.showFlame = function() {
        var $flameLeft = $("<span class='spaceshipFlame'></span>");
        $flameLeft.css("top", "11px");

        var $flameRight = $("<span class='spaceshipFlame'></span>");
        $flameRight.css("top", "87px");

        $("#spaceshipContainer").append($flameLeft);
        $("#spaceshipContainer").append($flameRight);

        var positionY = 0;
        function animateSprite() {

            $(".spaceshipFlame").css("backgroundPosition",  '0px ' + positionY + "px");
            positionY += 30;

            ti = setTimeout(animateSprite, 80);
        }

        animateSprite();
    };

};



var Laser = function() {

    this.power = 10000;
    this.playerShip = playerShip;
    var that = this;

    this.fire = function() {

        var energy = this.playerShip.currentEnergy();

        if (energy >= 300 && game.isPaused == false)
        {
            this.playerShip.currentEnergy(energy - 300);
            game.displayEnergy(energy - 300);

            var $newLaserSpan = $("<div class='laser'><span class='laserHead'></span><span class='laserTail'</span></div>");
            $newLaserSpan.css({
                left: this.playerShip.htmlElement.position().left + 110 +"px",
                top: this.playerShip.htmlElement.position().top +  25  + "px",
                display: 'none'
            });

            $("#gameContainer").append($newLaserSpan);

            $("#gameHud").animate({
                top: "-20px"
            }, 35).animate({
                top: "20px"
            }, 70).animate({
                top: "-20px"
            }, 70).animate({
                top: "20px"
            }, 70).animate({
                top: "-16px"
            }, 70).animate({
                top: "20px"
            }, 70).animate({
                top: "-16px"
            }, 70);

            game.isPaused = true;

            $newLaserSpan.show().children('span:last').animate({
                width: "100%"
            }, 200, function() {
                setTimeout(function() {
                    $newLaserSpan.remove();
                    game.isPaused = false;

                    /*
                    setTimeout(function() {
                        game.displayEnergy(that.playerShip.maxEnergy());
                        that.playerShip.currentEnergy(that.playerShip.maxEnergy());
                    }, 4000);
                    */
                }, 500);
            });


            var asteroidsHit = that.checkCollision({
                elements: elements.asteroids,
                source: $newLaserSpan
            });

            if (asteroidsHit) {
                console.log(asteroidsHit);
                for (var i = 0; i < asteroidsHit.length; i++) {
                    asteroidsHit[i].damage(that.power);
                    console.log("Asteroid Hit !");
                }



            }

        }







    };


};



/**
 * [Rocket description]
 */
var Rocket = function() {

    this.speed = 8;
    this.power = 100;

    this.playerShip = playerShip;
    this.isMoving = false;
    var playerCraftPos = null;


    this.fire = function() {


            this.isMoving = true;

            var $newRocketSpan = $("<span class='rocket'></span>");
            $newRocketSpan.css({
                left: this.playerShip.htmlElement.position().left + 105 +"px",
                top: this.playerShip.htmlElement.position().top +  45  + "px"
            });

            $("#gameContainer").append($newRocketSpan);

            var that = this;
            var animationId;
            var oldTimestamp;

            var animate = function(currentTimestamp) {
                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;


                if (delta > 30 && game.isPaused == false) {

                    // check if rocket is out of screen
                    if($newRocketSpan.position().left + 15 < window.innerWidth) {
                        $newRocketSpan.css("left",  $newRocketSpan.position().left + that.speed + "px");
                    }
                    else {
                        that.isMoving = false;
                        if ($newRocketSpan) {
                            $newRocketSpan.remove();
                            $newRocketSpan = null;
                        }
                        console.log("Rocket Lost in Space!");
                    }

                    var asteroidHit = that.checkCollision({
                        elements: elements.asteroids,
                        source: $newRocketSpan,
                        single: true
                    });

                    if (asteroidHit) {
                        asteroidHit.damage(that.power);
                        that.isMoving = false;
                        if ($newRocketSpan) {
                            $newRocketSpan.remove();
                            $newRocketSpan = null;
                        }
                        console.log("Asteroid Hit !");
                    }


                    oldTimestamp = currentTimestamp;

                }

                if (that.isMoving) {
                    animationId = window.requestAnimationFrame(animate);
                } else {
                    $newRocketSpan = null;
                }

            };
            animationId = window.requestAnimationFrame(animate);





    };
};



/**
 * [Minigun description]
 */
var Minigun = function(gunPosition) {
    this.speed = 20;
    this.power = 8;
    this.playerShip = playerShip;
    this.gunPosition = gunPosition;

    var playerCraftPos = null;


    this.fire = function() {
        var that = this;


        var curEnergy = that.playerShip.currentEnergy();

        if (curEnergy > 0 && game.isPaused == false) {

            that.playerShip.currentEnergy(curEnergy - 2.5);
            game.displayEnergy(curEnergy - 2.5);


            var $newBulletSpan = $("<span class='bullet'></span>");
            $newBulletSpan.css({
                left: this.playerShip.htmlElement.position().left + 80 +"px",
                top: this.playerShip.htmlElement.position().top + this.gunPosition  + "px"
            });
            $("#gameContainer").append($newBulletSpan);



            this.htmlElement = $newBulletSpan;

            $newBulletSpan.isMoving = true;

            var oldTimestamp, lastCollisionChecked;
            var animationId;

            var animate = function(currentTimestamp) {

                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                lastCollisionChecked = (lastCollisionChecked) ? lastCollisionChecked : currentTimestamp;

                var delta = currentTimestamp - oldTimestamp;
                var deltaCollision = currentTimestamp - lastCollisionChecked;

                if (delta > that.speed && game.isPaused == false) {



                    if($newBulletSpan.position().left + 15 < window.innerWidth) {
                        $newBulletSpan.css("left", $newBulletSpan.position().left + 10 + "px");
                    }
                    else {

                        if ($newBulletSpan){
                            $newBulletSpan.remove();
                            $newBulletSpan.isMoving = false;
                        }
                    }


                    if (deltaCollision > 60) {
                        var asteroidHit = that.checkCollision({
                            elements: elements.asteroids,
                            source: $newBulletSpan,
                            single: true
                        });

                        if (asteroidHit) {

                            asteroidHit.damage(that.power);
                            if ($newBulletSpan) {
                                $newBulletSpan.remove();
                                $newBulletSpan.isMoving = false;
                            }
                        }
                        lastCollisionChecked = currentTimestamp;

                    }



                   oldTimestamp = currentTimestamp;
                }

                if ($newBulletSpan && $newBulletSpan.isMoving) {

                    animationId = window.requestAnimationFrame(animate);
                }
                else {
                    $newBulletSpan = null;
                }

            };
            animationId = window.requestAnimationFrame(animate);

        }
        else {
            if (!this.playerShip.minigunsJammed) {
                this.playerShip.jamMiniguns();
            }
        }


    };
};

