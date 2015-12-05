/**
 * [SpaceCraft description]
 */
var SpaceCraft = function() {

    var initialPos = {
        top: 500,
        left: 800
    };

    this.shootRocket = shootRocket;

    this.moveRight = moveRight;
    this.moveLeft = moveLeft;
    this.moveUp = moveUp;
    this.moveDown = moveDown;

    this.getPosition = getPosition;
    this.getHTMLElement = getHTMLElement;
    this.getInitialPos = function() {
        return initialPos;
    };

    this.isMoving = false;
};


/**
 * [moveRight description]
 * @return {[type]} [description]
 */
var moveRight = function() { 
    if (!this.isMoving) {
        
        this.isMoving = true;
        var that = this;

        intervalID = setInterval(function() {
            var currentPos = that.getPosition();
            var htmlElement = that.getHTMLElement();
            htmlElement.style.left =  (currentPos.left + 10) + "px";
        }, 60);
    }
};


/**
 * [moveLeft description]
 * @return {[type]} [description]
 */
var moveLeft = function() { 
     if (!this.isMoving) {
        
        this.isMoving = true;
        var that = this;

        intervalID = setInterval(function() {
            var currentPos = that.getPosition();
            var htmlElement = that.getHTMLElement();
            htmlElement.style.left =  (currentPos.left - 10) + "px";
        }, 60);
    }
};


/**
 * [moveUp description]
 * @return {[type]} [description]
 */
var moveUp = function() { 
     if (!this.isMoving) {
        
        this.isMoving = true;
        var that = this;

        intervalID = setInterval(function() {
            var currentPos = that.getPosition();
            var htmlElement = that.getHTMLElement();
            htmlElement.style.top =  (currentPos.top - 10) + "px";
        }, 60);
    }
};


/**
 * [moveDown description]
 * @return {[type]} [description]
 */
var moveDown = function() { 
    if (!this.isMoving) {
        
        this.isMoving = true;
        var that = this;

        intervalID = setInterval(function() {
            var currentPos = that.getPosition();

            var htmlElement = that.getHTMLElement();
            htmlElement.style.top =  (currentPos.top + 10) + "px";
        }, 60);
    }
};


/**
 * [getPosition description]
 * @return {[type]} [description]
 */
var getPosition = function() {

	var htmlElement = this.getHTMLElement();
	var left =  (htmlElement.style.left) ? htmlElement.style.left : this.getInitialPos().left;
	var top =  (htmlElement.style.top) ? htmlElement.style.top : this.getInitialPos().top;
 	return {
		left: parseInt(left, 10),
		top: parseInt(top, 10)
	};
};


/**
 * [getHTMLElement description]
 * @return {[type]} [description]
 */
var getHTMLElement = function() {
    return  window.document.getElementById("spacecraft");
};


var shootRocket = function() {
    var newRocketSpan = window.document.createElement("span");
    newRocketSpan.className = "rocket";

    newRocketSpan.style.left = this.getPosition().left + 50 +"px";
    newRocketSpan.style.top = this.getPosition().top + 23  + "px";
    window.document.getElementById("gameFrame").appendChild(newRocketSpan);

    launchRocket(newRocketSpan);

};

var launchRocket = function(rocket) {

   var rect = rocket.getBoundingClientRect();
    var id = setInterval(function() {
       if(parseInt(rocket.style.left, 10) + 15< window.innerWidth){
            rect = rocket.getBoundingClientRect();
            rocket.style.left = parseInt(rocket.style.left, 10) + 10 + "px";
        }
        else {
            clearInterval(id);
            window.document.getElementById("gameFrame").removeChild(rocket);
        }
    }, 100);

};