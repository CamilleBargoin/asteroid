/**
 * [SpaceCraft description]
 */
var SpaceCraft = function(htmlElement) {

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

            moveRightintervalID = setInterval(function() {
                var currentPos = getPosition(that.htmlElement);
                that.htmlElement.style.left =  (currentPos[0][0] + 10) + "px";
            }, 40);
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

            moveLeftintervalID = setInterval(function() {
                var currentPos = getPosition(that.htmlElement);
                that.htmlElement.style.left =  (currentPos[0][0] - 10) + "px";
            }, 40);
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

            moveUpintervalID = setInterval(function() {
                var currentPos = getPosition(that.htmlElement);
                that.htmlElement.style.top =  (currentPos[1][0] - 10) + "px";
            }, 40);
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

            moveDownintervalID = setInterval(function() {
                var currentPos = getPosition(that.htmlElement);
                that.htmlElement.style.top =  (currentPos[1][0] + 10) + "px";
            }, 40);
        }
    };


    /**
     * [getInitialPos description]
     * @return {[type]} [description]
     */
    this.getInitialPos = function() {
        return initialPos;
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
            if (this.weapons.rockets.length == 0) {
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
        alert("R.I.P");
    };

};



/**
 * [Rocket description]
 */
var Rocket = function() {

    this.speed = 80;
    this.power = 100;

    this.playerCraft = playerCraft;
    var playerCraftPos = null;


    this.fire = function() {
        playerCraftPos = getPosition(this.playerCraft.htmlElement);
        var newRocketSpan = window.document.createElement("span");
        newRocketSpan.className = "rocket";
        newRocketSpan.style.left = playerCraftPos[0][0] + 78 +"px";
        newRocketSpan.style.top = playerCraftPos[1][0] + 44  + "px";

        window.document.getElementById("gameFrame").appendChild(newRocketSpan);

        var rect = newRocketSpan.getBoundingClientRect();
        var id = setInterval(function() {

            // loop through all the asteroids to check if one is getting hit by the rocket
            for(var i = 0; i < asteroids.length; i++) {
                var asteroidPos = getPosition(asteroids[i].htmlElement);
                var rocketPos = getPosition(newRocketSpan);

                // The positions of the rocket and an asteroid overlap => asteroid hit !
                if(comparePositions(rocketPos[0], asteroidPos[0]) && comparePositions(rocketPos[1], asteroidPos[1]))
                {
                    asteroids[i].die();
                    clearInterval(id);
                    window.document.getElementById("gameFrame").removeChild(newRocketSpan);
                    console.log("Asteroid Hit !");
                }
            }

            // check if rocket is out of screen
            if(parseInt(newRocketSpan.style.left, 10) + 15 < window.innerWidth) {
                rect = newRocketSpan.getBoundingClientRect();
                newRocketSpan.style.left = parseInt(newRocketSpan.style.left, 10) + 15 + "px";
            }
            else {
                clearInterval(id);
                window.document.getElementById("gameFrame").removeChild(newRocketSpan);
                console.log("Rocket Lost in Space!");
            }
        }, this.speed);
    };
};



/**
 * [Minigun description]
 */
var Minigun = function(gunPosition) {
    this.speed = 20;
    this.power = 1;
    this.playerCraft = playerCraft;
    this.gunPosition = gunPosition;
    var playerCraftPos = null;

    this.fire = function() {
        playerCraftPos = getPosition(this.playerCraft.htmlElement);
        var newBulletSpan = window.document.createElement("span");
        newBulletSpan.className = "bullet";
        newBulletSpan.style.left = playerCraftPos[0][0] + 40 +"px";
        newBulletSpan.style.top = playerCraftPos[1][0] + this.gunPosition  + "px";
        window.document.getElementById("gameFrame").appendChild(newBulletSpan);


        var id = setInterval(function() {

            if(parseInt(newBulletSpan.style.left, 10) + 15 < window.innerWidth) {
                var rect = newBulletSpan.getBoundingClientRect();
                newBulletSpan.style.left = parseInt(newBulletSpan.style.left, 10) + 10 + "px";
            }
            else {
                clearInterval(id);
                window.document.getElementById("gameFrame").removeChild(newBulletSpan);
                console.log("Rocket Lost in Space!");
            }
        }, this.speed);
    };
};
