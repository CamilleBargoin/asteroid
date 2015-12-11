var Utils = function() {

    this.checkCollision = function(elements) {

        var sourcePos = this.getPosition();

        for (var i = 0; i < elements.length; i++)
        {

            var currentPos = elements[i].getPosition();
            if (this.comparePositions(sourcePos[0], currentPos[0]) && this.comparePositions(sourcePos[1], currentPos[1])) {
                return elements[i];
            }
        }
        return false;
    };

    this.getPosition = function() {

        var pos, width, height;
        pos = this.htmlElement.position();
        width = this.htmlElement.width();
        height = this.htmlElement.height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    };


    this.comparePositions = function(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    };




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

                    console.log($explosion.css("backgroundPosition"));

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

};
