/**
 * [Spaceship description]
 */
var Spaceship = function(htmlElement) {

    var initialPos = {
        top: 500,
        left: 800
    };

    var lives = 5;

    var health = 100;

    this.htmlElement = htmlElement;
    this.isMovingRight = false;
    this.isMovingLeft = false;
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.isFiring = false;
    this.weapons = {
        rockets: [],
        miniguns: []
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
                    if (that.htmlElement.position().top > 0)
                        that.htmlElement.css("top", (that.htmlElement.position().top - 10) + "px");
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
                    if (that.htmlElement.position().top < window.innerHeight - 90)
                        that.htmlElement.css("top",  (that.htmlElement.position().top + 10) + "px");
                }
                moveDownAnimationId = window.requestAnimationFrame(animate);
            };
            moveDownAnimationId = window.requestAnimationFrame(animate);
        }
    };


    this.rotate = function() {

           // this.htmlElement.addClass('rotateUp');

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



    /**
     * [fireMiniguns description]
     * @return {[type]} [description]
     */
    this.fireMiniguns = function() {
        if (!this.isFiring) {
            this.isFiring = true;
            var that = this;

            intervalFireID = setInterval(function() {
                for(var i = 0; i < that.weapons.miniguns.length; i++) {
                    that.weapons.miniguns[i].fire();
                }
            }, 200);
        }
    };




    this.getHealth = function() {
        return health;
    };


    this.updateHealth = function(modifier) {
        health += modifier;

        
        if (health < 100)
            $("#health").addClass("notFull");
        else 
             $("#health").removeClass("notFull");


        if (health <= 25)
            $("#health").addClass("danger");
        else
            $("#health").removeClass("danger");

        $("#health").html(health + "<sup>%</sup>");
        


        if (health <= 0){
            this.die();
            game.pause();
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
        alert("AAAaaaaarrrrrggghhhh !!!");
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

        $("#gameFrame").append($newRocketSpan);

        this.htmlElement = $newRocketSpan;

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
                    if ($newRocketSpan)
                        $newRocketSpan.remove();
                    console.log("Rocket Lost in Space!");
                }

                var asteroidHit = that.checkCollision( elements.asteroids);

                if (asteroidHit) {
                    asteroidHit.damage(that.power);
                    that.isMoving = false;
                    if ($newRocketSpan)
                        $newRocketSpan.remove();
                    console.log("Asteroid Hit !");
                }


                oldTimestamp = currentTimestamp;

            }

            if (that.isMoving)
                animationId = window.requestAnimationFrame(animate);

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

        var $newBulletSpan = $("<span class='bullet'></span>");
        $newBulletSpan.css({
            left: this.playerShip.htmlElement.position().left + 80 +"px",
            top: this.playerShip.htmlElement.position().top + this.gunPosition  + "px"
        });
        $("#gameFrame").append($newBulletSpan);


        this.htmlElement = $newBulletSpan;

        $newBulletSpan.isMoving = true;

        var oldTimestamp;
        var animationId;
        var that = this;

        var animate = function(currentTimestamp) {
            oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
            var delta = currentTimestamp - oldTimestamp;

            if (delta > that.speed && game.isPaused == false) {


                if($newBulletSpan.position().left + 15 < window.innerWidth) {
                    $newBulletSpan.css("left", $newBulletSpan.position().left + 10 + "px");
                }
                else {
                    $newBulletSpan.isMoving = false;
                    if ($newBulletSpan);
                        $newBulletSpan.remove();
                }

                var asteroidHit = that.checkCollision(elements.asteroids, $newBulletSpan);

                if (asteroidHit) {

                    asteroidHit.damage(that.power);
                    if ($newBulletSpan)
                        $newBulletSpan.remove();
                    $newBulletSpan.isMoving = false;
                }


               oldTimestamp = currentTimestamp;
            }
            if ($newBulletSpan.isMoving)
                animationId = window.requestAnimationFrame(animate);

        };
        animationId = window.requestAnimationFrame(animate);
    };
};

//Minigun.prototype = new Utils();
//Rocket.prototype = new Utils();
//Spaceship.prototype = new Utils();
