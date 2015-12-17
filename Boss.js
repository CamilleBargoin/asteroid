var Boss = function() {

    this.health = 100;
    this.htmlElement = null;
    this.isMoving = false;
    this.bossMoveId = null;

    this.generateHtml = function() {
        this.htmlElement = $("<span></span>");
        this.htmlElement.css({
            backgroundColor: "firebrick",
            width: "150px",
            height: "150px",
            position: "absolute",
            left: "80%",
            top: "50%"
        });
        $("#gameFrame").append(this.htmlElement);
    };


    this.move = function() {

        var that = this;
        var oldTimestamp;
        this.isMoving = true;

         var movingUp = false;

        var animate = function(currentTimestamp) {

            oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
            var delta = currentTimestamp - oldTimestamp;


            if (delta > 30 && game.isPaused == false) {

                var currentPos = that.htmlElement.position();
                var step = 10;

                if(movingUp) {
                    step = -10;
                    if (currentPos.top <= 5) {
                        movingUp = false;
                        step = 10;
                    }
                } else {
                    step = 10;
                    if (currentPos.top >= (window.innerHeight - 155)) {

                        movingUp = true;
                        step = -10;
                    }
                }

                that.htmlElement.css("top", (currentPos.top + step) + "px");

                oldTimestamp = currentTimestamp;
            }

            if (that.isMoving)
                that.bossMoveId = window.requestAnimationFrame(animate);
        };

        that.bossMoveId = window.requestAnimationFrame(animate);

    };


    this.damage = function() {

    };


    this.explode = function() {

    };


    this.firePrimaryWeapon = function() {

    };

    this.fireSecondaryWeapon = function() {

    };


};
