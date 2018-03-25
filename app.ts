
import "jquery";

let playerShipProperties:{lifes:number, munition:number, weapon:number, speed:number, movement:number, score:number, timeRewards:number} = {
    lifes: 3,
    munition: 1000,
    weapon: 1,
		speed: 5,
		movement: 10,
    score: 0,
    timeRewards: 10000
};

let enemyShipProperties:{lifes:number, munition:number, weapon:number, speed:number, movement:number} = {
    lifes: 1,
    munition: 10000,
    weapon: 1,
		speed: 10,
		movement: 2000
};

let numberEnemies:number = 6;
let numberPlayers:number = 1;

let liveShips:number[] = [enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes, enemyShipProperties.lifes];

//keys player
let leftKey:number = 37;
let upKey:number = 38;
let rightKey:number = 39;
let downKey:number = 40;

let widthWindow = $(window).width();

let windowMarginLeft:number = 50;
let windowMarginRight:number = widthWindow - windowMarginLeft;

let widthPlayerShip:number;
let heightPlayerShip:number;

let widthEnemyShipsContanier:number;

let enemyBullets:boolean[];
let enemyShips:JQuery<HTMLElement>[];
let canShoot:boolean;

let pointReward:string = "pointReward";
let lifeReward:string = "lifeReward";
//weaponReward:string = "weaponReward";

$(document).ready(function(){

	const elementPlayerShip:JQuery<HTMLElement> = $("#playerShip");

	widthPlayerShip = elementPlayerShip.width();
	heightPlayerShip = elementPlayerShip.height();

	const elementEnemyShipsContanier:JQuery<HTMLElement> = $(".enemyShipsContainer");
	widthEnemyShipsContanier = elementEnemyShipsContanier.width();

  const enemyShip1:JQuery<HTMLElement> = $("#enemyShip1");
  const enemyShip2:JQuery<HTMLElement> = $("#enemyShip2");
  const enemyShip3:JQuery<HTMLElement> = $("#enemyShip3");
  const enemyShip4:JQuery<HTMLElement> = $("#enemyShip4");
  const enemyShip5:JQuery<HTMLElement> = $("#enemyShip5");
  const enemyShip6:JQuery<HTMLElement> = $("#enemyShip6");

  enemyShips = [enemyShip1, enemyShip2, enemyShip3, enemyShip4, enemyShip5, enemyShip6];
  enemyBullets = [false,false,false,false,false,false];

  canShoot = true;

  initializeScore();
  initializeLifes();
	initializeEvents();
	enemyShipsToRight();
  generateRandomNumberEnemyShoot();

  setInterval(rewards, playerShipProperties.timeRewards);

  $(".preloader").fadeOut("fast");

});

function rewards():void{

  let widthWindow:number = $(window).width();
  let randomNumberInitialPositionReward:number = Math.floor(Math.random() * widthWindow);

  if(randomNumberInitialPositionReward < 20){
    randomNumberInitialPositionReward = 20;
  }else if(randomNumberInitialPositionReward > widthWindow - 20){
    randomNumberInitialPositionReward = randomNumberInitialPositionReward = 20;
  }

  //let rewards:string[] = [pointReward, lifeReward, weaponReward];
  let rewards:string[] = [pointReward, lifeReward];
  let randomRewardObtained:number = Math.floor(Math.random()*rewards.length);

  const elementEnemyShipsContanier:JQuery<HTMLElement> = $(".enemyShipsContainer");
  let rewardElement:any;
  let reward:string;

  for (let i:number = 0; i < rewards.length; i++) {
    if(randomRewardObtained == i){

      elementEnemyShipsContanier.before("<div class='"+rewards[i]+"'></div>");

      rewardElement = $("."+rewards[i]);
      reward = rewards[i];

      rewardElement.css("left",randomNumberInitialPositionReward + "px");

    }
  }

  let heightWindow = windowHeightObtain();

  let topRewardCollidedWithShip:number = heightWindow - 140;

  rewardElement.animate({top:"+" + topRewardCollidedWithShip + "px"},3000,"linear",function(){

    const elementPlayerShip:JQuery<HTMLElement> = $("#playerShip");

    let hasRewardCollisionWithShip = rewardCollides(rewardElement, elementPlayerShip, reward);

    if(hasRewardCollisionWithShip === false){

      rewardElement.animate({top: heightWindow - 60 + "px"},600,"linear",function(){

        hiddenReward(rewardElement);

      });

    }

  });

}

function rewardCollides(rewardElement, elementPlayerShip, reward):boolean{
  let widthRewardElement:number = rewardElement.width();
  let rewardElementPositionLeft:number = rewardElement.offset().left;
  let rewardCollidedWithShip:boolean = false;
  let elementDistancePlayerShip:any = elementPlayerShip.offset();
  let positionXPlayerShip:number = elementDistancePlayerShip.left;
  const scoreContainer:JQuery<HTMLElement> = $("#score");
  const lifeContainer:JQuery<HTMLElement> = $(".lifesContainer");

  if(rewardElementPositionLeft > positionXPlayerShip && rewardElementPositionLeft < positionXPlayerShip + widthPlayerShip){

    rewardCollidedWithShip = true;
    hiddenReward(rewardElement);

    if(reward === pointReward){
      playerShipProperties.score = playerShipProperties.score + 10;
      scoreContainer.text(playerShipProperties.score);
    }else if (reward === lifeReward) {
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

function initializeScore():void{
  const scoreContainer:JQuery<HTMLElement> = $("#score");
  scoreContainer.text(playerShipProperties.score);
}

function initializeLifes():void{
  const lifeContainer:JQuery<HTMLElement> = $(".lifesContainer");

  for (let i:number = 1; i <= playerShipProperties.lifes; i++) {
    lifeContainer.append("<div class='life' id='life" + i + "'></div>");
  }

}

function initializeEvents():void{

	$(window).resize(function() {

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
		let key:number = event.keyCode;

	  windowWidthObtain();

    const elementPlayerShip:JQuery<HTMLElement> = $("#playerShip");

		let elementDistancePlayerShip:any = elementPlayerShip.offset();
		let positionXPlayerShip:number = elementDistancePlayerShip.left;
   	let positionYPlayerShip:number = elementDistancePlayerShip.top;
		let centerXPlayerShip:number = positionXPlayerShip + widthPlayerShip / 2;
		let centerYPlayerShip:number = positionYPlayerShip + heightPlayerShip / 2;

		if(key === leftKey && positionXPlayerShip > windowMarginLeft){
			//elementPlayerShip.animate({left: "-=" + playerShipProperties.movement}, playerShipProperties.speed, 'linear', function () {});
			elementPlayerShip.css("left","-=" + playerShipProperties.speed + "px");
		}

		if(key === rightKey && positionXPlayerShip < windowMarginRight - widthPlayerShip){
			//elementPlayerShip.animate({left: "+=" + playerShipProperties.movement}, playerShipProperties.speed, 'linear', function () {});
			elementPlayerShip.css("left","+=" + playerShipProperties.speed + "px");
		}

		if(key === upKey){

      if(canShoot){

        canShoot = false;

        elementPlayerShip.before("<div class='weaponShip1'></div>");
  	    const bullet:JQuery<HTMLElement> = $(".weaponShip1");

  			let bulletPositionCenter:number = centerXPlayerShip - 10;

  			bullet.css("left",bulletPositionCenter + "px");

  			bullet.animate({top:"110px"},3000,"linear",function(){

          let hasCollided = bulletCollides(bullet);

          if(hasCollided === false){

            bullet.animate({top:"0px"},600,"linear",function(){

              hiddenBullet(bullet);

            });

          }

        });

      }

		}

	});

}

function windowWidthObtain():void{

	widthWindow = $(window).width();
	windowMarginRight = widthWindow - windowMarginLeft;

}

function windowHeightObtain():number{

	let heightWindow:number = $(window).height();
  return heightWindow;

}

function enemyShipsToRight():void{

	windowWidthObtain();
	let finalPositionRight:number = windowMarginRight - widthEnemyShipsContanier;

	$(".enemyShipsContainer").animate({left: finalPositionRight},enemyShipProperties.movement,"linear",function(){enemyShipsToLeft();});

}

function enemyShipsToLeft():void{

	let finalPositionLeft:number = windowMarginLeft;

	$(".enemyShipsContainer").animate({left:finalPositionLeft},enemyShipProperties.movement,"linear",function(){enemyShipsToRight();});

}

function bulletCollides(bulletC):boolean{

  let bullet:any = bulletC;

  let widthBullet:number = bullet.width();
  let widthEnemyShip:number = $(".enemyShips").width();
  let bulletPositionLeft:number = bullet.offset().left;
  let enemyShipsPosition = [];
  let collided:boolean = false;

  $(".enemyShipsContainer div").each(function(){
    let element:any = $(this);
    enemyShipsPosition.push(parseInt(element.offset().left));

  });

    $.each(enemyShipsPosition, function(index, position) {

      const scoreContainer:JQuery<HTMLElement> = $("#score");

      if(bulletPositionLeft > position && bulletPositionLeft < position + widthEnemyShip){

        liveShips[index] = liveShips[index] - 1;

        if(liveShips[index] === 0){

          enemyShips[index].css("visibility","hidden");
          hiddenBullet(bullet);
          collided = true;
          playerShipProperties.score = playerShipProperties.score + 10;
          scoreContainer.text(playerShipProperties.score);

          if(liveShips.indexOf(1) === -1){
            $("body").append("<div class='youWin'></div>");
            $(".youWin").click(function(){

              window.location.reload(true);

            });
          }

        }else if(liveShips[index] < 0){

          liveShips[index] = 0;

        }

      }

    });

    return collided;

}

function hiddenBullet(bullet):void{

  bullet.fadeOut();
  bullet.remove();
  canShoot = true;

}

function hiddenEnemyBullet(enemyBullet):void{

  enemyBullet.fadeOut();
  enemyBullet.remove();

}

function hiddenReward(rewardElement):void{
  rewardElement.fadeOut();
  rewardElement.remove();
}

function generateRandomNumberEnemyShoot(randomNumber?){

	randomNumber = Math.floor(Math.random() * 5);

	if(liveShips[randomNumber] === 0){

		generateRandomNumberEnemyShoot();

	}else{

		enemyShoot(randomNumber);

	}

}

function enemyShoot(enemyNumber:number){

  let elementDistanceEnemyShip:any = enemyShips[enemyNumber].offset();
  let positionXEnemyShip:number = elementDistanceEnemyShip.left;
  let positionYEnemyShip:number = elementDistanceEnemyShip.top;

  let margenDisparoXnaveEnemiga1:number = positionXEnemyShip + 40;
  let margenDisparoYnaveEnemiga1:number = positionYEnemyShip + 70;

  //enemyShips[enemyNumber].before("<div class='weaponEnemyShip1'></div>");

  $(".gameContainer").before("<div class='weaponEnemyShip1'></div>");

  let enemyBullet:JQuery<HTMLElement> = $(".weaponEnemyShip1");

  enemyBullet.css("left", margenDisparoXnaveEnemiga1 - 10 + "px");
  enemyBullet.css("top", margenDisparoYnaveEnemiga1 + "px");

  let heightWindow = windowHeightObtain();

  let topCollidedWithShip:number = heightWindow - 160;

  enemyBullet.animate({top:"+" + topCollidedWithShip + "px"},3000,"linear",function(){

    let hasCollisionWithShip = enemyBulletCollides(enemyBullet);

    if(hasCollisionWithShip === false){

      enemyBullet.animate({top: heightWindow - 60 + "px"},600,"linear",function(){

        hiddenEnemyBullet(enemyBullet);
        generateRandomNumberEnemyShoot();

      });

    }

  });

}

function enemyBulletCollides(enemyBullet:JQuery<HTMLElement>):boolean{

  let elementPlayerShip:JQuery<HTMLElement> = $("#playerShip");
  let widthEnemyBullet:number = enemyBullet.width();
  let bulletPositionLeft:number = enemyBullet.offset().left;
  let collidedWithShip:boolean = false;
  let elementDistancePlayerShip:any = elementPlayerShip.offset();
  let positionXPlayerShip:number = elementDistancePlayerShip.left;

  if(bulletPositionLeft > positionXPlayerShip && bulletPositionLeft < positionXPlayerShip + widthPlayerShip){

    collidedWithShip = true;
    let previouslifes:number = playerShipProperties.lifes;
    let life = $("#life" + previouslifes);
    playerShipProperties.lifes = playerShipProperties.lifes - 1;

    life.remove();

    if(playerShipProperties.lifes === 0){

      elementPlayerShip.remove();
      $("body").append("<div class='gameOver'></div>");
      $(".gameOver").click(function(){

				window.location.reload(true);

			});
    }

    hiddenEnemyBullet(enemyBullet);
    generateRandomNumberEnemyShoot();

  }

  return collidedWithShip;

}
