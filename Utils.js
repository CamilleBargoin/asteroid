var Utils = function() {

    this.checkCollision = function(elements, htmlSource) {

        var sourcePos = (htmlSource) ? this.getPosition(htmlSource) : this.getPosition();

        for (var i = 0; i < elements.length; i++)
        {
            var currentPos = this.getPosition(elements[i].htmlElement);
            if (this.comparePositions(sourcePos[0], currentPos[0]) && this.comparePositions(sourcePos[1], currentPos[1])) {
                return elements[i];
            }
        }
        return false;
    };

    this.getPosition = function(element) {
        var pos = (element)? element.getBoundingClientRect() : this.htmlElement.getBoundingClientRect();
        return [[pos.left, pos.right], [pos.top, pos.bottom]];
    };


    this.comparePositions = function(p1, p2) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    };
};
