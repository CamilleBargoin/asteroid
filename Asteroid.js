



var AsteroidGenerator = function() {

    this.asteroidId = 0;

    var Asteroid = function(htmlElement) {

        this.health = 100;
        this.htmlElement = htmlElement;
        this.isMoving = false;
        var asteroidnimationRequestId = null;
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
         * [move description]
         * @return {[type]} [description]
         */
        this.move = function() {

            var that = this;
            var oldTimestamp;
            this.isMoving = true;



            var animate = function(currentTimestamp) {

                oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
                var delta = currentTimestamp - oldTimestamp;

                if (delta > 30 && game.isPaused == false) {

                    //$("#nbasteroid").html(elements.asteroids.length);

                    var currentPos = that.htmlElement.position();

                    that.htmlElement.css("left", (currentPos.left - 10) + "px");

                    if(currentPos.left <= 0) {
                         that.isMoving = false;
                         console.log("Asteroid has left the screen");
                         that.die();
                    }

                    var spaceshipHit = that.checkCollision(elements.spaceships);

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


        this.pause = function() {

        };


        /**
         * [die description]
         * @return {[type]} [description]
         */
        this.die = function() {

            this.isMoving = false;

            if (this.htmlElement) {
                this.htmlElement.remove();
            }

            //removes Asteroid from the global array Asteroids
             for(var i = 0; i < elements.asteroids.length; i++) {
                if(elements.asteroids[i].id == this.id) {
                    elements.asteroids[i] = null;
                    elements.asteroids.splice(i, 1);
                }
             }



        };

        this.explode = function() {

            var that = this;

            this.isMoving = false;

            this.explodeAnimate(this, function() {
                that.die();
                game.updateScore(that.score);
            });
        };


        this.damage = function(power) {
            this.health -= power;

            if (this.health <= 0 && !this.destroyed) {
                this.explode();
                this.destroyed = true;
            }
        };

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
    };
    Asteroid.prototype = new Utils();

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

    this.start = function() {
        var that = this;

        generationIntervalId = setInterval(function() {

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
                elements.asteroids.push(newAsteroid);
            }


        }, 43000);

    };

    this.stop = function() {
        clearInterval(generationIntervalId);
    };

};

//Asteroid.prototype = new Utils();


