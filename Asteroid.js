var asteroidId = 0;

var Asteroid = function(htmlElement) {
    this.id = asteroidId++;
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

            if (delta > 30 && that.isMoving) {

                var currentPos = that.getPosition(that.htmlElement);
                that.htmlElement.style.left =  (currentPos[0][0] - 10) + "px";
                if(currentPos[0][0] <= 0) {
                     that.isMoving = false;
                     console.log("Asteroid leaves screen");
                     that.die();
                }


                var spaceshipHit = that.checkCollision(elements.spaceships);

                if (spaceshipHit) {
                    that.isMoving = false;
                    spaceshipHit.damage();
                    that.damage(100);
                }
                oldTimestamp = currentTimestamp;
            }

            if (that.isMoving)
                that.asteroidMoveId = window.requestAnimationFrame(animate);
        };

        that.asteroidMoveId = window.requestAnimationFrame(animate);
    };


    /**
     * [die description]
     * @return {[type]} [description]
     */
    this.die = function() {

        this.isMoving = false;

        if (this.htmlElement) {
            window.document.getElementById("gameFrame").removeChild(this.htmlElement);
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
        var counterElement = window.document.getElementById("asteroidDestroyed");
        counterElement.innerHTML = parseInt(counterElement.innerHTML, 10) + 1;

        explodeAnimate(this, function() {
            that.die();
        });
    };


    this.damage = function(power) {
        this.health -= power;

        if (this.health <= 0 && !this.destroyed) {
            this.explode();
            this.destroyed = true;
        }
    };
};



var AsteroidGenerator = function() {
    var generationIntervalId = null;

    this.start = function() {
        generationIntervalId = setInterval(function() {

            var asteroidSpan = window.document.createElement("span");
            asteroidSpan.className = "asteroid";

            asteroidSpan.style.left = window.innerWidth + "px";
            asteroidSpan.style.top = (Math.random() * window.innerHeight - 100) + 100 + "px";

            window.document.getElementById("gameFrame").appendChild(asteroidSpan);

            var newAsteroid = new Asteroid(asteroidSpan);
            newAsteroid.move();

            elements.asteroids.push(newAsteroid);

        }, 600);

    };

    this.stop = function() {
        clearInterval(generationIntervalId);

    };

};

Asteroid.prototype = new Utils();


