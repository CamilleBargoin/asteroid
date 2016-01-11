var BonusGenerator = function() {

    var bonusId = 0;

    var Bonus = function(args) {

        this.isMoving = false;
        this.htmlElement = null;
        this.className = (args.className) ? args.className : "";
        this.src = (args.src) ? args.src : "";
        this.rgba = args.rgba;

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
                    that.htmlElement.css("left", (currentPos.left - 7) + "px");


                   if (randomSign > 0 && currentPos.top >= window.innerHeight - 64 || randomSign < 0 && currentPos.top <= 0){
                        randomSign  = randomSign * -1;
                    }

                    that.htmlElement.css("top", (currentPos.top + (5 * randomSign)) + "px");

                    if(currentPos.left <= 0 ) {
                         that.isMoving = false;
                         console.log("You just missed the " + that.name + " Bonus ! :'(");
                         that.destroy();
                    }

                    spaceshipHit = that.checkCollision(elements.spaceships);

                    if(spaceshipHit) {
                        that.isMoving = false;
                        that.destroy();
                        console.log("Congratulations! You just captured the " + that.name + " Bonus !");
                        var newEnergy = elements.spaceships[0].maxEnergy() + 100;
                        elements.spaceships[0].maxEnergy(newEnergy);
                        elements.spaceships[0].currentEnergy(newEnergy);
                        game.displayEnergy(newEnergy);

                        $("<audio></audio>")
                            .attr("src", "./sound/charge02.mp3")
                            .prop("volume", 0.6)
                            .trigger("play");
                    }

                    oldTimestampX = currentTimestamp;
                }


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
         * [destroy description]
         * @return {[type]} [description]
         */
        this.destroy = function() {
            if (this.htmlElement)
                this.htmlElement.remove();

        };
    };

    Bonus.prototype = new Utils();

    var bonusGenerationIntervalId = null;


    this.start = function() {
        var that = this;

        bonusGenerationIntervalId = setInterval(function() {

            that.energyBonus = new Bonus({
                name: "energy",
                className: "bonus",
                src: "./img/energy.png",
                rgba: "244,100,47,0.8"
            });
            that.energyBonus.createElement();
            that.energyBonus.move();

        }, 30000);

    };


    this.stop = function() {

    };


};


