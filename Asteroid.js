var asteroidId = 0;

var Asteroid = function(htmlElement) {
    this.id = asteroidId++;
	this.health = 100;

	this.htmlElement = htmlElement;
    var asteroidMoveId = null;


    /**
     * [move description]
     * @return {[type]} [description]
     */
    this.move = function() {

        var that = this;
        asteroidMoveId = setInterval(function() {
            var currentPos = getPosition(that.htmlElement);
            that.htmlElement.style.left =  (currentPos[0][0] - 10) + "px";
            if(currentPos[0][0] <= 0) {
                 that.die();
            }
        }, 40);
    };


    /**
     * [die description]
     * @return {[type]} [description]
     */
    this.die = function() {

        //romves the asteroid from the screen
        clearInterval(asteroidMoveId);
         window.document.getElementById("gameFrame").removeChild(this.htmlElement);

        //removes Asteroid from the global array Asteroids
         for(var i = 0; i < asteroids.length; i++) {
            if(asteroids[i].id == this.id)
                asteroids.splice(i, 1);
         }
    };

};




var AsteroidGenerator = function() {
    var generationIntervalId = null;

    this.start = function() {
        generationIntervalId = setInterval(function() {

            var asteroidSpan = window.document.createElement("span");
            asteroidSpan.className = "asteroid";


            asteroidSpan.style.left = "1800px";
            asteroidSpan.style.top = Math.random() * 700 + 100 + "px";

            window.document.getElementById("gameFrame").appendChild(asteroidSpan);
            var newAsteroid = new Asteroid(asteroidSpan);
            newAsteroid.move();

            asteroids.push(newAsteroid);

        }, 1500);

    };

    this.stop = function() {
        clearInterval(generationIntervalId);

    };

};
