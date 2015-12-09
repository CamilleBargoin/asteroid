/**
 * [SpaceCraft description]
 */
var Spaceship = function(htmlElement) {

    var initialPos = {
        top: 500,
        left: 800
    };

    var lives = 5;

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
                    var currentPos = that.getPosition();
                    if (currentPos[0][0] < window.innerWidth - 100)
                        that.htmlElement.style.left =  (currentPos[0][0] + 10) + "px";
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
                    var currentPos = that.getPosition();

                    if (currentPos[0][0] > 0)
                        that.htmlElement.style.left =  (currentPos[0][0] - 10) + "px";
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
                    var currentPos = that.getPosition();
                    if (currentPos[1][0] > 0)
                        that.htmlElement.style.top = (currentPos[1][0] - 10) + "px";
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
                    var currentPos = that.getPosition();
                    if (currentPos[1][0] < window.innerHeight - 90)
                        that.htmlElement.style.top =  (currentPos[1][0] + 10) + "px";
                }
                moveDownAnimationId = window.requestAnimationFrame(animate);
            };
            moveDownAnimationId = window.requestAnimationFrame(animate);
        }
    };

    /**
     * [shootRocket description]
     * @return {[type]} [description]
     */
    this.shootRocket = function() {

        if (this.weapons.rockets.length > 0) {
            this.weapons.rockets[this.weapons.rockets.length - 1].fire();
            this.weapons.rockets.pop();
            window.document.getElementById("hud_rockets").innerHTML = this.weapons.rockets.length;
            if (this.weapons.rockets.length === 0) {
                window.document.getElementById("hud_rocketsIcon").className = "hud_dead";
                window.document.getElementById("hud_rockets").className = "hud_dead";
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
            }, 100);
        }
    };


    /**
     * [getLives description]
     * @return {[type]} [description]
     */
    this.getLives = function() {
        return lives;
    };


    /**
     * [setLives description]
     * @param {[type]} modifier [description]
     */
    this.setLives = function(modifier) {
        lives += modifier;

        window.document.getElementById("hud_lives").innerHTML = lives;

        if(lives <= 0) {
            window.document.getElementById("hud_livesIcon").className = "hud_dead";
            window.document.getElementById("hud_lives").className = "hud_dead";
            this.die();
        }
        else {
            window.document.getElementById("hud_livesIcon").className = "hud_normal";
            window.document.getElementById("hud_lives").className = "hud_normal";
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
        window.document.getElementById("hud_rockets").innerHTML = this.weapons.rockets.length;
    };

    this.damage = function() {
        this.setLives(-1);

    };

};



/**
 * [Rocket description]
 */
var Rocket = function() {

    this.speed = 50;
    this.power = 100;

    this.playerShip = playerShip;
    this.isMoving = false;
    var playerCraftPos = null;


    this.fire = function() {
        this.isMoving = true;

        playerCraftPos =  this.playerShip.getPosition();
        var newRocketSpan = window.document.createElement("span");
        newRocketSpan.className = "rocket";
        newRocketSpan.style.left = playerCraftPos[0][0] + 78 +"px";
        newRocketSpan.style.top = playerCraftPos[1][0] + 44  + "px";

        window.document.getElementById("gameFrame").appendChild(newRocketSpan);

        var rect = newRocketSpan.getBoundingClientRect();

        var that = this;
        var animationId;
        var oldTimestamp;

        var animate = function(currentTimestamp) {
            oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
            var delta = currentTimestamp - oldTimestamp;


            if (delta > that.speed) {



                // check if rocket is out of screen
                if(parseInt(newRocketSpan.style.left, 10) + 15 < window.innerWidth) {
                    rect = newRocketSpan.getBoundingClientRect();
                    newRocketSpan.style.left = parseInt(newRocketSpan.style.left, 10) + 15 + "px";
                }
                else {
                    that.isMoving = false;
                    if (newRocketSpan)
                        window.document.getElementById("gameFrame").removeChild(newRocketSpan);
                    console.log("Rocket Lost in Space!");
                }

                var asteroidHit = that.checkCollision( elements.asteroids, newRocketSpan);

                if (asteroidHit) {
                    asteroidHit.explode();
                    that.isMoving = false;
                    if (newRocketSpan)
                        window.document.getElementById("gameFrame").removeChild(newRocketSpan);
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

        playerCraftPos = this.playerShip.getPosition();
        var newBulletSpan = window.document.createElement("span");
        newBulletSpan.className = "bullet";
        newBulletSpan.style.left = playerCraftPos[0][0] + 40 +"px";
        newBulletSpan.style.top = playerCraftPos[1][0] + this.gunPosition  + "px";
        newBulletSpan.isMoving = true;
        window.document.getElementById("gameFrame").appendChild(newBulletSpan);

        var oldTimestamp;
        var animationId;
        var that = this;

        var animate = function(currentTimestamp) {
            oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
            var delta = currentTimestamp - oldTimestamp;

            if (delta > that.speed) {



                if(parseInt(newBulletSpan.style.left, 10) + 15 < window.innerWidth) {
                    var rect = newBulletSpan.getBoundingClientRect();
                    newBulletSpan.style.left = parseInt(newBulletSpan.style.left, 10) + 10 + "px";
                }
                else {
                    newBulletSpan.isMoving = false;
                    if (newBulletSpan);
                        window.document.getElementById("gameFrame").removeChild(newBulletSpan);
                }

                var asteroidHit = that.checkCollision(elements.asteroids, newBulletSpan);

                if (asteroidHit) {

                    asteroidHit.damage(that.power);
                    if (newBulletSpan)
                        window.document.getElementById("gameFrame").removeChild(newBulletSpan);
                    newBulletSpan.isMoving = false;
                }
            }
            if (newBulletSpan.isMoving)
                animationId = window.requestAnimationFrame(animate);

        };
        animationId = window.requestAnimationFrame(animate);
    };
};

Minigun.prototype = new Utils();
Rocket.prototype = new Utils();
Spaceship.prototype = new Utils();
