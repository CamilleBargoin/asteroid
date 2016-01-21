/**
 *  AsteroidGenerator Factory
 *  The factory creates Asteroid Object every x seconds
 */
var AsteroidGenerator = function() {

    this.asteroidId = 0;


    /**
     * Asteroid Constructor Function
     */
    var Asteroid = function(htmlElement) {

        this.health = 100;
        this.htmlElement = htmlElement;
        this.isMoving = false;
        this.destroyed = false;


        this.explosionAnimation = [{
            x: 0,
            y: 0,
            width: 61,
            height: 103
        },{
            x: -61,
            y: 0,
            width: 82,
            height: 103
        },
        {
            x: -143,
            y: 0,
            width: 93,
            height: 103
        },
        {
            x: -236,
            y: 0,
            width: 95,
            height: 103
        },
        {
            x: -318,
            y: 0,
            width: 72,
            height: 103
        }];

        /**
         *  Creates the HTML element and adds it to the DOM
         */
        this.createElement = function() {
            this.htmlElement = $("<span></span>");

            this.htmlElement.css({
                width: this.width,
                height: this.height,
                background: "url('./img/asteroids/" + this.filename + "')",
                left: window.innerWidth + "px",
                top: (Math.random() * ((window.innerHeight - 160) - 60) + 60) + "px",
                position: "absolute"
            });

            $("#gameContainer").append(this.htmlElement);
        };

        /**
         * Moves the Asteroid from the right side of the scren to the left
         * Uses requestAnimationFrame, and tests for collision with the
         * Spaceship every 30ms
         */
        this.move = function() {

            var that = this;
            var oldTimestamp;
            this.isMoving = true;

            var animate = function(currentTimestamp) {

                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;

                if (delta > 30 && game.isPaused == false) {

                    // moves left
                    var currentPos = that.htmlElement.position();
                    that.htmlElement.css("left", (currentPos.left - 10) + "px");

                    // check for Asteroid leaving the screen
                    if(currentPos.left <= 0) {
                         that.isMoving = false;
                         console.log("Asteroid has left the screen");
                         that.die();
                    }

                    // Check for collisoin with Spaceship
                    var spaceshipHit = that.checkCollision({
                        elements: game.elements.spaceships,
                        single: true
                    });

                    if (spaceshipHit) {
                        that.isMoving = false;
                        spaceshipHit.damage();
                        that.damage(1000);
                    }

                    oldTimestamp = currentTimestamp;
                }

                if (that.isMoving)
                    that.asteroidMoveId = window.requestAnimationFrame(animate);
            };

            that.asteroidMoveId = window.requestAnimationFrame(animate);
        };


        /**
         *  Removes the Asteroid from the DOM and from the game elements array
         */
        this.die = function() {

            this.isMoving = false;

            if (this.htmlElement) {
                this.htmlElement.remove();
            }

            //removes Asteroid from the game array elements.asteroids
             for(var i = 0; i < game.elements.asteroids.length; i++) {
                if(game.elements.asteroids[i].id == this.id) {
                    game.elements.asteroids[i] = null;
                    game.elements.asteroids.splice(i, 1);
                }
             }
        };

        /**
         * Launches the explosion animation and then calls the die method
         */
        this.explode = function() {

            var that = this;

            this.isMoving = false;
            if (!game.mute) {
                $("<audio></audio>")
                    .attr("src", "./sound/explosion02.mp3")
                    .prop("volume", 0.4)
                    .trigger("play");
            }
            

            this.explodeAnimate(this, function() {

                

                that.die();
                game.updateScore(that.score);
            });
        };


        /**
         * Deals damage to the Asteroid
         */
        this.damage = function(power) {
            this.health -= power;

            if (this.health <= 0 && !this.destroyed) {
                this.explode();
                this.destroyed = true;
            }
        };

    };

    // Asteroid Object inherits from Utils Object
    Asteroid.prototype = new Utils();


    /**
     * smallAsteroid, mediumAsteroid and largeAsteroid Constructor functions
     * the objects inherit from the Asteroid Object
     */
    var smallAsteroid = function() {
        this.width=  120;
        this.height = 100;
        this.filename = "asteroid_07.png";
        this.health = 40;
        this.score = 1000;
    };
    smallAsteroid.prototype = new Asteroid();

    var mediumAsteroid = function() {
        this.width=  156;
        this.height = 129;
        this.filename = "asteroid_02.png";
        this.health = 100;
        this.score = 10000;
    };
    mediumAsteroid.prototype = new Asteroid();

    var largeAsteroid = function() {
        this.width=  180;
        this.height = 150;
        this.filename = "asteroid_01.png";
        this.health = 200;
        this.score = 50000;
    };
    largeAsteroid.prototype = new Asteroid();

    var generationIntervalId = null;

    /**
     * Launches the Asteroid Generator
     * A new random Asteroid (small, medium or large)
     * is generated every [delay] seconds
     */
    this.start = function(delay) {
        var that = this;

        var startDelay = (delay) ? delay : 3000;

        this.launchAsteroid = function(newDelay) {

            generationIntervalId = setTimeout(function() {

                var newAsteroid = null;
                var randomAsteroid = Math.floor(Math.random() * 3);

                if (randomAsteroid == 0)
                    newAsteroid = new smallAsteroid();
                else if (randomAsteroid == 1)
                    newAsteroid = new mediumAsteroid();
                else if (randomAsteroid == 2)
                    newAsteroid = new largeAsteroid();

                if (newAsteroid) {
                    that.asteroidId++;

                    newAsteroid.id = that.asteroidId;

                    newAsteroid.createElement();
                    newAsteroid.move();
                    game.elements.asteroids.push(newAsteroid);
                }

                generationIntervalId = setTimeout(function() {
                    that.launchAsteroid(newDelay);
                }, newDelay);

            }, newDelay);
        };

        this.launchAsteroid(startDelay);
    };

    this.stop = function() {
        clearInterval(generationIntervalId);
    };
};
