/**
 * BonusGenerator Factory
 * The factory creates bonuses every x seconds for the player to grab
 * For now, the only bonus is an Energy Bonus
 */
var BonusGenerator = function() {

    /**
     * Bonus Constructor Function
     */
    var Bonus = function(args) {

        this.isMoving = false;
        this.htmlElement = null;
        this.className = (args.className) ? args.className : "";
        this.src = (args.src) ? args.src : "";

        /**
         * creates the HTML element and adds it to the DOM
         */
        this.createElement = function() {

            this.htmlElement = $("<img></img>");
            this.htmlElement.css({
                top: (Math.random() * window.innerHeight - 100) + 100 + "px",
                left: window.innerWidth + "px"
            });

            this.htmlElement.attr("src", this.src);
            this.htmlElement.addClass(this.className);

           $("#gameContainer").append(this.htmlElement);
        };

        /**
         * Moves the Bonus from the right side of the screen to the left
         * The Bonus element also randomly moves up or down every 1200ms
         */
        this.move = function() {
            var that = this;
            var oldTimestampX, oldTimestampY;
            this.isMoving = true;

            var randomSign = Math.random() < 0.5 ? -1 : 1;

            var animate = function(currentTimestamp) {

                oldTimestampX = (oldTimestampX) ? oldTimestampX : currentTimestamp;
                oldTimestampY = (oldTimestampY) ? oldTimestampY : currentTimestamp;

                var deltaX = currentTimestamp - oldTimestampX;
                var deltaY = currentTimestamp - oldTimestampY;
                var spaceshipHit, currentPos = null;

                if (deltaX > 30 && game.isPaused == false) {

                    currentPos = that.htmlElement.position();

                    // Moves Left
                    that.htmlElement.css("left", (currentPos.left - 7) + "px");

                    // Moves Up or Down
                   if (randomSign > 0 && currentPos.top >= window.innerHeight - 64 || randomSign < 0 && currentPos.top <= 0){
                        randomSign  = randomSign * -1;
                    }
                    that.htmlElement.css("top", (currentPos.top + (5 * randomSign)) + "px");

                    // Detects when Bonus leaves the screen
                    if(currentPos.left <= 0 ) {
                         that.isMoving = false;
                         console.log("You just missed the " + that.name + " Bonus ! :'(");
                         that.destroy();
                    }

                    // Collision detection with Spaceship
                    spaceshipHit = that.checkCollision({
                        elements: game.elements.spaceships,
                        single: true
                    });

                    if(spaceshipHit) {
                        that.isMoving = false;
                        that.destroy();
                        console.log("Congratulations! You just captured the " + that.name + " Bonus !");
                        var newEnergy = game.elements.spaceships[0].maxEnergy() + 100;
                        game.elements.spaceships[0].maxEnergy(newEnergy);
                        game.elements.spaceships[0].currentEnergy(newEnergy);
                        game.displayEnergy(newEnergy);

                        $("<audio></audio>")
                            .attr("src", "./sound/charge02.mp3")
                            .prop("volume", 0.6)
                            .trigger("play");
                    }

                    oldTimestampX = currentTimestamp;
                }

                // Determine if the Bonus is moving up or down
                if (deltaY > 1200) {
                    randomSign = Math.random() < 0.5 ? -1 : 1;
                    oldTimestampY = currentTimestamp;
                }

                if (that.isMoving)
                    window.requestAnimationFrame(animate);
            };

            window.requestAnimationFrame(animate);
        };


        /**
         * Removes the Bonus from DOM
         */
        this.destroy = function() {
            if (this.htmlElement)
                this.htmlElement.remove();
        };
    };

    // Bonus Object inherits from Utils Object
    Bonus.prototype = new Utils();

    var bonusGenerationIntervalId = null;


    /**
     * Launches the Bonus Generator
     * A new Bonus is created every 30 sec
     */
    this.start = function() {
        var that = this;

        bonusGenerationIntervalId = setInterval(function() {

            that.energyBonus = new Bonus({
                name: "energy",
                className: "bonus",
                src: "./img/energy.png"
            });
            that.energyBonus.createElement();
            that.energyBonus.move();

        }, 30000);

    };


    this.stop = function() {
        clearInterval(bonusGenerationIntervalId);
    };

};
