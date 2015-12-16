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

                var currentPos = that.htmlElement.position();
                that.htmlElement.css("left", (currentPos.left - 10) + "px");

                if(currentPos.left <= 0) {
                     that.isMoving = false;
                     console.log("Asteroid have left the screen");
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
        var counterElement = $("#asteroidDestroyed");
        counterElement.innerHTML = parseInt(counterElement.innerHTML, 10) + 1;

        this.explodeAnimate(this, function() {
            that.die();
            game.updateScore(100);
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

    this.types = [
    {
        width: 180,
        height: 150,
        filename: "asteroid_01.png"
    },
    {
        width: 156,
        height: 129,
        filename: "asteroid_02.png"
    },
    {
        width: 120,
        height: 100,
        filename: "asteroid_07.png"
    }];

    this.start = function() {
        var that = this;

        generationIntervalId = setInterval(function() {

            var $asteroidSpan = $("<span></span>");
            $asteroidSpan.addClass("asteroid");

            var random = Math.floor(Math.random() * 3);
            var asteroidData =  that.types[random];


            $asteroidSpan.css({
                width: asteroidData.width,
                height: asteroidData.height,
                background: "url('./img/asteroids/" + asteroidData.filename + "')",
                left: window.innerWidth + "px",
                top: (Math.random() * window.innerHeight - 100) + 100 + "px"
            });

            $("#gameFrame").append($asteroidSpan);

            var newAsteroid = new Asteroid($asteroidSpan);

            newAsteroid.move();

            elements.asteroids.push(newAsteroid);

        }, 1000);

    };

    this.stop = function() {
        clearInterval(generationIntervalId);

    };

};

//Asteroid.prototype = new Utils();


