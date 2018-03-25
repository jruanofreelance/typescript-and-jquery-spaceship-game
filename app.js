"use strict";
exports.__esModule = true;
require("jquery");
var playerShipProperties = {
    lifes: 3,
    munition: 1000,
    weapon: 1,
    speed: 5,
    movement: 10,
    score: 0,
    timeRewards: 10000
};
var enemyShipProperties = {
    lifes: 1,
    munition: 10000,
    weapon: 1,
    speed: 10,
    movement: 2000
};
var numberEnemies = 6;
var numberPlayers = 1;
var liveShips = [enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes];
//keys player
var leftKey = 37;
var upKey = 38;
var rightKey = 39;
var downKey = 40;
var widthWindow = $(window).width();
var windowMarginLeft = 50;
var windowMarginRight = widthWindow - windowMarginLeft;
var widthPlayerShip;
var heightPlayerShip;
var widthEnemyShipsContanier;
var enemyBullets;
var enemyShips;
var canShoot;
var pointReward = "pointReward";
var lifeReward = "lifeReward";
//weaponReward:string = "weaponReward";
$(document).ready(function () {
    var elementPlayerShip = $("#playerShip");
    widthPlayerShip = elementPlayerShip.width();
    heightPlayerShip = elementPlayerShip.height();
    var elementEnemyShipsContanier = $(".enemyShipsContainer");
    widthEnemyShipsContanier = elementEnemyShipsContanier.width();
    var enemyShip1 = $("#enemyShip1");
    var enemyShip2 = $("#enemyShip2");
    var enemyShip3 = $("#enemyShip3");
    var enemyShip4 = $("#enemyShip4");
    var enemyShip5 = $("#enemyShip5");
    var enemyShip6 = $("#enemyShip6");
    enemyShips = [enemyShip1, enemyShip2, enemyShip3, enemyShip4, enemyShip5, enemyShip6];
    enemyBullets = [false, false, false, false, false, false];
    canShoot = true;
    initializeScore();
    initializeLifes();
    initializeEvents();
    enemyShipsToRight();
    generateRandomNumberEnemyShoot();
    setInterval(rewards, playerShipProperties.timeRewards);
    $(".preloader").fadeOut("fast");
});
function rewards() {
    var widthWindow = $(window).width();
    var randomNumberInitialPositionReward = Math.floor(Math.random() * widthWindow);
    if (randomNumberInitialPositionReward < 20) {
        randomNumberInitialPositionReward = 20;
    }
    else if (randomNumberInitialPositionReward > widthWindow - 20) {
        randomNumberInitialPositionReward = randomNumberInitialPositionReward = 20;
    }
    //let rewards:string[] = [pointReward, lifeReward, weaponReward];
    var rewards = [pointReward, lifeReward];
    var randomRewardObtained = Math.floor(Math.random() * rewards.length);
    var elementEnemyShipsContanier = $(".enemyShipsContainer");
    var rewardElement;
    var reward;
    for (var i = 0; i < rewards.length; i++) {
        if (randomRewardObtained == i) {
            elementEnemyShipsContanier.before("<div class='" + rewards[i] + "'></div>");
            rewardElement = $("." + rewards[i]);
            reward = rewards[i];
            rewardElement.css("left", randomNumberInitialPositionReward + "px");
        }
    }
    var heightWindow = windowHeightObtain();
    var topRewardCollidedWithShip = heightWindow - 140;
    rewardElement.animate({ top: "+" + topRewardCollidedWithShip + "px" }, 3000, "linear", function () {
        var elementPlayerShip = $("#playerShip");
        var hasRewardCollisionWithShip = rewardCollides(rewardElement, elementPlayerShip, reward);
        if (hasRewardCollisionWithShip === false) {
            rewardElement.animate({ top: heightWindow - 60 + "px" }, 600, "linear", function () {
                hiddenReward(rewardElement);
            });
        }
    });
}
function rewardCollides(rewardElement, elementPlayerShip, reward) {
    var widthRewardElement = rewardElement.width();
    var rewardElementPositionLeft = rewardElement.offset().left;
    var rewardCollidedWithShip = false;
    var elementDistancePlayerShip = elementPlayerShip.offset();
    var positionXPlayerShip = elementDistancePlayerShip.left;
    var scoreContainer = $("#score");
    var lifeContainer = $(".lifesContainer");
    if (rewardElementPositionLeft > positionXPlayerShip && rewardElementPositionLeft < positionXPlayerShip + widthPlayerShip) {
        rewardCollidedWithShip = true;
        hiddenReward(rewardElement);
        if (reward === pointReward) {
            playerShipProperties.score = playerShipProperties.score + 10;
            scoreContainer.text(playerShipProperties.score);
        }
        else if (reward === lifeReward) {
            playerShipProperties.lifes = playerShipProperties.lifes + 1;
            lifeContainer.append("<div class='life' id='life" + playerShipProperties.lifes + "'></div>");
        }
        //TODO: Another weapon
        /*
        }else if(reward === weaponReward){
          console.log(weaponReward);
        }
        */
    }
    return rewardCollidedWithShip;
}
function initializeScore() {
    var scoreContainer = $("#score");
    scoreContainer.text(playerShipProperties.score);
}
function initializeLifes() {
    var lifeContainer = $(".lifesContainer");
    for (var i = 1; i <= playerShipProperties.lifes; i++) {
        lifeContainer.append("<div class='life' id='life" + i + "'></div>");
    }
}
function initializeEvents() {
    $(window).resize(function () {
        //TODO: resize width screen
        /*
            newWidthWindow = $(window).width();
            let elementDistancePlayerShip:number = elementPlayerShip.offset();
            let positionXPlayerShip:number = elementDistancePlayerShip.left;
            let toDeduct:number = widthWindow - newWidthWindow;
            newPositionXPlayerShip = positionXPlayerShip - toDeduct;
    
            elementPlayerShip.css("left",newPositionXPlayerShip + "px");
    
            widthWindow = newWidthWindow;
        */
    });
    $("body").keydown(function (event) {
        event.preventDefault();
        var key = event.keyCode;
        windowWidthObtain();
        var elementPlayerShip = $("#playerShip");
        var elementDistancePlayerShip = elementPlayerShip.offset();
        var positionXPlayerShip = elementDistancePlayerShip.left;
        var positionYPlayerShip = elementDistancePlayerShip.top;
        var centerXPlayerShip = positionXPlayerShip + widthPlayerShip / 2;
        var centerYPlayerShip = positionYPlayerShip + heightPlayerShip / 2;
        if (key === leftKey && positionXPlayerShip > windowMarginLeft) {
            //elementPlayerShip.animate({left: "-=" + playerShipProperties.movement}, playerShipProperties.speed, 'linear', function () {});
            elementPlayerShip.css("left", "-=" + playerShipProperties.speed + "px");
        }
        if (key === rightKey && positionXPlayerShip < windowMarginRight - widthPlayerShip) {
            //elementPlayerShip.animate({left: "+=" + playerShipProperties.movement}, playerShipProperties.speed, 'linear', function () {});
            elementPlayerShip.css("left", "+=" + playerShipProperties.speed + "px");
        }
        if (key === upKey) {
            if (canShoot) {
                canShoot = false;
                elementPlayerShip.before("<div class='weaponShip1'></div>");
                var bullet_1 = $(".weaponShip1");
                var bulletPositionCenter = centerXPlayerShip - 10;
                bullet_1.css("left", bulletPositionCenter + "px");
                bullet_1.animate({ top: "110px" }, 3000, "linear", function () {
                    var hasCollided = bulletCollides(bullet_1);
                    if (hasCollided === false) {
                        bullet_1.animate({ top: "0px" }, 600, "linear", function () {
                            hiddenBullet(bullet_1);
                        });
                    }
                });
            }
        }
    });
}
function windowWidthObtain() {
    widthWindow = $(window).width();
    windowMarginRight = widthWindow - windowMarginLeft;
}
function windowHeightObtain() {
    var heightWindow = $(window).height();
    return heightWindow;
}
function enemyShipsToRight() {
    windowWidthObtain();
    var finalPositionRight = windowMarginRight - widthEnemyShipsContanier;
    $(".enemyShipsContainer").animate({ left: finalPositionRight }, enemyShipProperties.movement, "linear", function () { enemyShipsToLeft(); });
}
function enemyShipsToLeft() {
    var finalPositionLeft = windowMarginLeft;
    $(".enemyShipsContainer").animate({ left: finalPositionLeft }, enemyShipProperties.movement, "linear", function () { enemyShipsToRight(); });
}
function bulletCollides(bulletC) {
    var bullet = bulletC;
    var widthBullet = bullet.width();
    var widthEnemyShip = $(".enemyShips").width();
    var bulletPositionLeft = bullet.offset().left;
    var enemyShipsPosition = [];
    var collided = false;
    $(".enemyShipsContainer div").each(function () {
        var element = $(this);
        enemyShipsPosition.push(parseInt(element.offset().left));
    });
    $.each(enemyShipsPosition, function (index, position) {
        var scoreContainer = $("#score");
        if (bulletPositionLeft > position && bulletPositionLeft < position + widthEnemyShip) {
            liveShips[index] = liveShips[index] - 1;
            if (liveShips[index] === 0) {
                enemyShips[index].css("visibility", "hidden");
                hiddenBullet(bullet);
                collided = true;
                playerShipProperties.score = playerShipProperties.score + 10;
                scoreContainer.text(playerShipProperties.score);
                if (liveShips.indexOf(1) === -1) {
                    $("body").append("<div class='youWin'></div>");
                    $(".youWin").click(function () {
                        window.location.reload(true);
                    });
                }
            }
            else if (liveShips[index] < 0) {
                liveShips[index] = 0;
            }
        }
    });
    return collided;
}
function hiddenBullet(bullet) {
    bullet.fadeOut();
    bullet.remove();
    canShoot = true;
}
function hiddenEnemyBullet(enemyBullet) {
    enemyBullet.fadeOut();
    enemyBullet.remove();
}
function hiddenReward(rewardElement) {
    rewardElement.fadeOut();
    rewardElement.remove();
}
function generateRandomNumberEnemyShoot(randomNumber) {
    randomNumber = Math.floor(Math.random() * 5);
    if (liveShips[randomNumber] === 0) {
        generateRandomNumberEnemyShoot();
    }
    else {
        enemyShoot(randomNumber);
    }
}
function enemyShoot(enemyNumber) {
    var elementDistanceEnemyShip = enemyShips[enemyNumber].offset();
    var positionXEnemyShip = elementDistanceEnemyShip.left;
    var positionYEnemyShip = elementDistanceEnemyShip.top;
    var margenDisparoXnaveEnemiga1 = positionXEnemyShip + 40;
    var margenDisparoYnaveEnemiga1 = positionYEnemyShip + 70;
    //enemyShips[enemyNumber].before("<div class='weaponEnemyShip1'></div>");
    $(".gameContainer").before("<div class='weaponEnemyShip1'></div>");
    var enemyBullet = $(".weaponEnemyShip1");
    enemyBullet.css("left", margenDisparoXnaveEnemiga1 - 10 + "px");
    enemyBullet.css("top", margenDisparoYnaveEnemiga1 + "px");
    var heightWindow = windowHeightObtain();
    var topCollidedWithShip = heightWindow - 160;
    enemyBullet.animate({ top: "+" + topCollidedWithShip + "px" }, 3000, "linear", function () {
        var hasCollisionWithShip = enemyBulletCollides(enemyBullet);
        if (hasCollisionWithShip === false) {
            enemyBullet.animate({ top: heightWindow - 60 + "px" }, 600, "linear", function () {
                hiddenEnemyBullet(enemyBullet);
                generateRandomNumberEnemyShoot();
            });
        }
    });
}
function enemyBulletCollides(enemyBullet) {
    var elementPlayerShip = $("#playerShip");
    var widthEnemyBullet = enemyBullet.width();
    var bulletPositionLeft = enemyBullet.offset().left;
    var collidedWithShip = false;
    var elementDistancePlayerShip = elementPlayerShip.offset();
    var positionXPlayerShip = elementDistancePlayerShip.left;
    if (bulletPositionLeft > positionXPlayerShip && bulletPositionLeft < positionXPlayerShip + widthPlayerShip) {
        collidedWithShip = true;
        var previouslifes = playerShipProperties.lifes;
        var life = $("#life" + previouslifes);
        playerShipProperties.lifes = playerShipProperties.lifes - 1;
        life.remove();
        if (playerShipProperties.lifes === 0) {
            elementPlayerShip.remove();
            $("body").append("<div class='gameOver'></div>");
            $(".gameOver").click(function () {
                window.location.reload(true);
            });
        }
        hiddenEnemyBullet(enemyBullet);
        generateRandomNumberEnemyShoot();
    }
    return collidedWithShip;
}
