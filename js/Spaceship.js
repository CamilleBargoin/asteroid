/**
 * Spaceship Constructor function
 */
var Spaceship = function() {

    var health = maxEnergy = currentEnergy = 100;
    var models = ["spaceship_01", "spaceship_02", "spaceship_03"];

    this.htmlElement = null;

    this.moveRightAnimationId = this.moveLeftAnimationId = this.moveUpAnimationId = this.moveDownAnimationId = null;
    this.intervalFireID = null;

    this.isMovingRight = this.isMovingLeft = this.isMovingUp = this.isMovingDown = false;
    this.isFiring = false;
    this.minigunsJammed = false;

    this.weapons = {
        lasergun: [],
        miniguns: []
    };


    /**
     * creates a html element and adds it to the DOM
     */
    this.createElement = function() {

        this.htmlElement = $("<span id='spaceshipContainer'><span id='spaceship'></span></span>");
        $("#gameContainer").append(this.htmlElement);

        var url = "./img/" + models[Math.floor(Math.random() * 3)] + ".png";
        $("#spaceship").css("background-image", "url('" + url + "')");
    };


    /**
     * Animates the spaceship to the right using requestAnimationFram
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
                that.moveRightAnimationId = window.requestAnimationFrame(animate);
            };
            this.moveRightAnimationId = window.requestAnimationFrame(animate);
        }
    };


    /**
     * Animates the spaceship to the left using requestAnimationFrame
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

                that.moveLeftAnimationId = window.requestAnimationFrame(animate);
            };
            this.moveLeftAnimationId = window.requestAnimationFrame(animate);
        }
    };


    /**
     * Animates the spaceship up using requestAnimationFrame
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
                that.moveUpAnimationId = window.requestAnimationFrame(animate);
            };
            this.moveUpAnimationId = window.requestAnimationFrame(animate);
        }
    };


    /**
     * Animates the spaceship down using requestAnimationFrame
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
                that.moveDownAnimationId = window.requestAnimationFrame(animate);
            };
            this.moveDownAnimationId = window.requestAnimationFrame(animate);
        }
    };

    /**
     * Checks if the spaceship is entering in the Bottom resume zone and hides it
     */
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

    /**
     * Getter/Setter for the currentEnergy property
     */
    this.currentEnergy = function(newValue) {
        if (typeof newValue != 'undefined')
            currentEnergy = newValue;
        else
            return currentEnergy;
    };

    /**
     * Getter/Setter for the maxEnergy
     */
    this.maxEnergy = function(newValue) {
        if (typeof newValue != 'undefined')
            maxEnergy = newValue;
        else
            return maxEnergy;
    };

    /**
     * Getter for the health property
     */
    this.getHealth = function() {
        return health;
    };



    /**
     *  Calls the Laser Object fire method
     */
    this.shootLaser = function() {
        this.weapons.lasergun[0].fire();
    };


    /**
     *  If the miniguns aren't jammed, calls the Miniguns fire method
     */
    this.fireMiniguns = function() {
        if (!this.isFiring && !this.minigunsJammed) {
            this.isFiring = true;
            var that = this;

            this.intervalFireID = setInterval(function() {

                if(!game.mute) {
                    $("<audio></audio>")
                        .attr("src", "./sound/laser08.mp3")
                        .prop("volume", 0.2)
                        .trigger("play");
                }
                

                for(var i = 0; i < that.weapons.miniguns.length; i++) {
                    that.weapons.miniguns[i].fire();
                }

            }, 200);
        }
        else {
            if (this.minigunsJammed && !game.mute) {
                $("<audio></audio>")
                    .attr("src", "./sound/laser02.mp3")
                    .prop("volume", 0.2)
                    .trigger("play");
            }
        }
    };

    /**
     *  Sets the minigunsJammed property to true and displays a message for the player
     *  Afrer 2 seconds, the minigunsJammed property is set back to false and the
     *  spaceship energy is set back to its max
     */
    this.jamMiniguns = function() {
        console.log("Oh No! The Miniguns are jammed !");
        this.minigunsJammed = true;
        var that = this;
        clearInterval(this.intervalFireID);

        game.displayAlert("Energie Epuisée!");

        setTimeout(function() {
            that.minigunsJammed = false;
            //game.setPower(100);
            game.displayEnergy(that.maxEnergy());
            that.currentEnergy(that.maxEnergy());
        }, 2000);
    };

    /**
     * Updates the health property with the modifier argument
     * and updates the health displayed on screen and its style
     * TODO: move the display part / styling out of Spaceship Object
     */
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
     * Kills the Spaceship and calls the endGame method
     */
    this.die = function() {

        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.isMovingUp = false;
        this.isMovingDown = false;

        asteroidGen.stop();
        game.endGame();
    };

    /**
     *  deals damage to the Spaceship
     */
    this.damage = function(damage) {

        var newDamage = (damage) ? damage : -25;
        this.updateHealth(newDamage);

        $overlay = $("<div class='takeDamageOverlay'></div>");
        $("#gameContainer").append($overlay);

        $overlay.fadeOut('fast').fadeIn('fast').fadeOut('fast', function() {
            $(this).remove();
        });

        this.blink(3, 140);
    };

    /**
     * Adds flames for the Spaceship and animates them
     */
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


/**
 * Laser Constructor function
 */
var Laser = function() {

    this.power = 10000;
    var that = this;


    /**
     * Fires the Laser Beam if energy is at least of 300
     * creates the html element and adds it to the dom
     * detects the asteroids hit
     */
    this.fire = function() {

        var playerShip = game.elements.spaceships[0];
        var energy = playerShip.currentEnergy();

        if (energy >= 300 && game.isPaused == false)
        {
            playerShip.currentEnergy(energy - 300);
            game.displayEnergy(energy - 300);

            // creates html element
            var $newLaserSpan = $("<div class='laser'><span class='laserHead'></span><span class='laserTail'</span></div>");
            $newLaserSpan.css({
                left: playerShip.htmlElement.position().left + 107 +"px",
                top: playerShip.htmlElement.position().top +  21  + "px",
                display: 'none'
            });
            $("#gameContainer").append($newLaserSpan);

            if(!game.mute) {
                 $("<audio></audio>")
                    .attr("src", "./sound/ray_gun02.mp3")
                    .prop("volume", 0.6)
                    .trigger("play");
            }
           


            // animates the HUD to create a wobbling effect
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

            // animates the laser and then removes it
            $newLaserSpan.show().children('span:last').animate({
                width: "100%"
            }, 200, function() {
                setTimeout(function() {
                    $newLaserSpan.remove();
                    game.isPaused = false;
                }, 500);
            });


            // Check for asteroid collisions
            var asteroidsHit = that.checkCollision({
                elements: game.elements.asteroids,
                source: $newLaserSpan
            });

            if (asteroidsHit) {
                console.log(asteroidsHit);
                for (var i = 0; i < asteroidsHit.length; i++) {
                    asteroidsHit[i].damage(that.power);
                    console.log("Asteroid Hit !");
                }
            }

        } else {
            if (energy < 300 && !game.mute) {
                $("<audio></audio>")
                    .attr("src", "./sound/laser02.mp3")
                    .prop("volume", 0.2)
                    .trigger("play");
            }
        }
    };
};



/**
 * Minigun Construcor Function
 * the gunPosition argument is needed to position the guns
 * on both sides of the Spaceship
 */
var Minigun = function(gunPosition) {

    this.speed = 20;
    this.power = 8;
    this.gunPosition = gunPosition;

    /**
     * Fires the Minigun if the Spaceship has energy
     * creates the html element for the bullet and adds it to the dom
     * detects the asteroid hit
     */
    this.fire = function() {
        var playerShip = game.elements.spaceships[0];
        var that = this;
        var curEnergy = playerShip.currentEnergy();

        if (curEnergy > 0 && game.isPaused == false) {

            playerShip.currentEnergy(curEnergy - 2.5);
            game.displayEnergy(curEnergy - 2.5);

            // creates html element
            var $newBulletSpan = $("<span class='bullet'></span>");
            $newBulletSpan.css({
                left: playerShip.htmlElement.position().left + 80 +"px",
                top: playerShip.htmlElement.position().top + this.gunPosition  + "px"
            });
            $("#gameContainer").append($newBulletSpan);

            this.htmlElement = $newBulletSpan;

            $newBulletSpan.isMoving = true;


            // Animates the bullet using requestAnimationFrame
            // For performance concerns, we check for collision every
            // 60ms instead of every 20ms (bullet speed)
            var oldTimestamp, lastCollisionChecked;
            var animationId;

            var animate = function(currentTimestamp) {

                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                lastCollisionChecked = (lastCollisionChecked) ? lastCollisionChecked : currentTimestamp;

                var delta = currentTimestamp - oldTimestamp;
                var deltaCollision = currentTimestamp - lastCollisionChecked;

                if (delta > that.speed && game.isPaused == false) {


                    // check if bullet is leaving screen
                    if($newBulletSpan.position().left + 15 < window.innerWidth) {
                        $newBulletSpan.css("left", $newBulletSpan.position().left + 10 + "px");
                    }
                    else {

                        if ($newBulletSpan){
                            $newBulletSpan.remove();
                            $newBulletSpan.isMoving = false;
                        }
                    }

                    // asteroid collision
                    if (deltaCollision > 60) {
                        var asteroidHit = that.checkCollision({
                            elements: game.elements.asteroids,
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
            // If Spaceship has no more energy, we jam the miniguns
            if (!playerShip.minigunsJammed) {
                playerShip.jamMiniguns();
            }
        }


    };
};

