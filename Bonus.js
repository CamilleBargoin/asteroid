var bonusId = 0;

var BonusFactory = function(args) {

    var Bonus = function(args) {
        this.id = bonusId++;
        this.name = (args.name) ? args.name : "default";
        this.isMoving = false;
        this.htmlElement = null;
        this.className = (args.className) ? args.className : "";
        this.src = (args.src) ? args.src : "";
        this.rgba = args.rgba;

        this.createElement = function() {
            this.htmlElement = window.document.createElement("img");
            this.htmlElement.className = this.className;
            this.htmlElement.style.left =  window.innerWidth + "px";
            this.htmlElement.src = this.src;
            this.htmlElement.style.top = (Math.random() * window.innerHeight - 100) + 100 + "px";

            window.document.getElementById("gameFrame").appendChild(this.htmlElement);
        };

        this.launch = function() {
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


                if (deltaX > 30) {

                    currentPos = that.getPosition();
                    that.htmlElement.style.left =  (currentPos[0][0] - 7) + "px";


                   if (randomSign > 0 && currentPos[1][0] >= window.innerHeight - 64 || randomSign < 0 && currentPos[1][0] <= 0){
                        randomSign  = randomSign * -1;
                    }

                    that.htmlElement.style.top = (currentPos[1][0] + (5 * randomSign)) + "px";

                    if(currentPos[0][0] <= 0 ) {
                         that.isMoving = false;
                         console.log("You just missed the " + that.name + " Bonus ! :'(");
                         that.destroy();
                    }

                    spaceshipHit = that.checkCollision(elements.spaceships);

                    if(spaceshipHit) {
                        that.isMoving = false;
                        that.destroy();
                        console.log("Congratulations! You just captured the " + that.name + " Bonus !");
                        that.displayBonus();
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


        this.displayBonus = function() {
            var displayBonusContainer = window.document.createElement("div");
            displayBonusContainer.className = "displayBonusContainer";
            displayBonusContainer.style.backgroundColor = "rgba(" + this.rgba + ")";
            displayBonusContainer.innerHTML = (this.name + " learned !").toUpperCase();
            window.document.body.appendChild(displayBonusContainer);

            setTimeout(function() {
                 window.document.body.removeChild(displayBonusContainer);
             }, 1000);
        };


        /**
         * [destroy description]
         * @return {[type]} [description]
         */
        this.destroy = function() {
            if (this.htmlElement)
                window.document.getElementById("gameFrame").removeChild(this.htmlElement);

            //removes Bonus from the global array elements.Bonuses
             for(var i = 0; i < elements.bonuses.length; i++) {
                if(elements.bonuses[i].id == this.id) {
                    elements.bonuses[i] = null;
                    elements.bonuses.splice(i, 1);
                }
             }
        };
    };

    Bonus.prototype = new Utils();

    return new Bonus(args);
};




var BonusGenerator = function() {


    this.start = function() {


        var html5Bonus = BonusFactory({
            name: "html5",
            className: "bonus",
            src: "html5.png",
            rgba: "244,100,47,0.8"
        });
        html5Bonus.createElement();
        html5Bonus.launch();

        setTimeout(function() {
            var css3Bonus = BonusFactory({
                name: "css3",
                className: "bonus",
                src: "css3.png",
                rgba: "39,166,221,0.8"
            });
            css3Bonus.createElement();
            css3Bonus.launch();

            setTimeout(function() {
                var angularBonus = BonusFactory({
                    name: "Angular",
                    className: "bonus",
                    src: "angular.png",
                    rgba: "185,41,51,0.8"
                });
                angularBonus.createElement();
                angularBonus.launch();

            }, 4000);
        }, 4000);
    };



    this.stop = function() {

    };


};


