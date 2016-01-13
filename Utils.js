/**
 * Utils Constructor function
 * A selection of useful methods shared by other Objects
 */
var Utils = function() {


    /**
     * Checks for collision between objects
     * the argurment is an object containing:
     *     - source (optional): the object from wich the collision will be checked
     *     - single (optional): if set to true, the method will stops after detecting the
     *                          collision
     *     - elements (required): an array of objects to loop
     */
    this.checkCollision = function(args) {
        var sourcePos = (args.source) ? this.getPosition(args.source) : this.getPosition();
        var multipleHits = (args.single) ? null : [];

        // looping throught the elements array to check for collision
        for (var i = 0; i < args.elements.length; i++)
        {
            var currentPos = args.elements[i].getPosition();
            if (this.comparePositions(sourcePos[0], currentPos[0]) && this.comparePositions(sourcePos[1], currentPos[1])) {

                // if single is set, the method returns the element hit
                // else, the element is saved in an array returned later
                if (args.single)
                    return args.elements[i];
                else
                    multipleHits.push(args.elements[i]);
            }
        }

        if (multipleHits != null)
            return multipleHits;

        return false;
    };

    /**
     *  returns the coordinates of an element
     */
    this.getPosition = function(source) {

        var element = (source) ? source : this.htmlElement;

        var pos, width, height;
        pos = element.position();
        width = element.width();
        height = element.height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    };

    /**
     *  checks if two elements are overlapping each others
     *  based on their coordinates
     */
    this.comparePositions = function(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    };

    /**
     * Adds an explosion animation
     */
    this.explodeAnimate = function(object, callback) {

        var explosionAnimation = [{
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


        var $explosionContainer = $("<div></div>");
        $explosionContainer.addClass("explosionContainer");
        $explosionContainer.css({
            width: "120px",
            height: "115px"
        });


        var $explosionMasque = $("<div></div>");
        $explosionMasque.addClass("explosionMasque");
        $explosionMasque.css({
            width: $explosionContainer.width() + 5 + "px",
            height: $explosionContainer.height() + 5 + "px"
        });
        $explosionContainer.append($explosionMasque);


        var $explosion = $("<div></div>");
        $explosion.addClass("explosion");
        $explosion.css({
            width: $explosionContainer.width() + "px",
            height: $explosionContainer.height() + "px"
        });
        $explosionMasque.append($explosion);

        object.htmlElement.append($explosionContainer);

        var oldTimestamp = null;
        var sequencePosition = 0;
        var that = this;
        var isAnimating = true;

        var animate = function(currentTimestamp) {

            oldTimestamp = (oldTimestamp) ? oldTimestamp : currentTimestamp;
            var delta = currentTimestamp - oldTimestamp;

            if (delta > 90) {
                if (sequencePosition == explosionAnimation.length) {
                    object.isMoving = false;
                    callback();
                    isAnimating = false;
                }
                else {
                    $explosion.css("backgroundPosition", "left " + explosionAnimation[sequencePosition].x + "px top " + explosionAnimation[sequencePosition].y + "px");

                    $explosion.css({
                        width: explosionAnimation[sequencePosition].width + "px",
                        height: explosionAnimation[sequencePosition].height + "px"
                    });
                    $explosionMasque.css({
                        width: explosionAnimation[sequencePosition].width + "px",
                        height: explosionAnimation[sequencePosition].height + "px"
                    });

                    sequencePosition++;
                    oldTimestamp = currentTimestamp;
                }
            }
            if (isAnimating)
                animationRequestId = window.requestAnimationFrame(animate);
        };
        animationRequestId = window.requestAnimationFrame(animate);

    };



    /**
     * Makes the Object blink based on two parameters (time and speed)
     */
    this.blink = function(times, speed) {

        for(var i = 0; i < times; i++)
            this.htmlElement.fadeOut(speed).fadeIn(speed);
    };

};
