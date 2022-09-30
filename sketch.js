// Horsetrack is a very enthusistic game, 
// we can play it by using space key to jump the hurdles 
// I hope everyone enjoys it!!

var PLAY=1;
var END=0;
var gameState=PLAY;
var horsetrack,horsetrackImg;
var ground,groundImg;
var gif_loadImg, gif_createImg;
var hurdleImg;
var hurdlesGroup;
var gameOverImg,restartImg;
var score=0;
var horse_collided,horse_collidedImg;
var horse,horse_running;
var diesound;

function preload(){
  //loading the images and animations
  horsetrackImg=loadImage("horsetrack1.jpg");
  gif_loadImg = loadAnimation("horse.gif");
  
  horse_collidedImg=loadAnimation("horse_collided.png");
  hurdleImg=loadImage("hurdle_edited_1.png");
  restartImg = loadImage("restart-icon.png");
  gameOverImg = loadImage("gameoverimg.png");
  diesound = loadSound("diesound.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

 
  //create horse track
  horsetrack=createSprite(width/2,height/2,100,100);
  horsetrack.addImage(horsetrackImg);
  horsetrack.velocityX=-4;
  horsetrack.x=horsetrack.width/8;
  
  //create ground
  ground=createSprite(400,250,1000,10);
  ground.velocityX=-4;
  ground.x=ground.width/2;
  ground.visible=false
  
  //create horse 
  horse=createSprite(50,150,50,50);
  horse.addAnimation("running", gif_loadImg)
  horse.addAnimation("collided", horse_collidedImg)
  
  gameOver = createSprite(windowWidth/2,windowHeight/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2+30)
  restart.addImage(restartImg);
  
  gameOver.scale = 0.3;
  restart.scale = 0.15;
  
  horse.setCollider("rectangle",0,0,horse.width,horse.height);
  horse.debug = false;
  score = 0;
   
  
  hurdlesGroup=createGroup();
}

function draw() {
  background("Green");
  
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
    
    //spawning the hurdles on ground
    spawnhurdles();
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //moving ground & track effect
    if(ground.x<0) {
      ground.x=ground.width/2;
    }
    if(horsetrack.x < 100){
      horsetrack.x=horsetrack.width/2;
    }
    
    
  
    // make the horse jump by pressing space key
    if(keyDown("space")&& horse.y >= 100) {
        horse.velocityY = -10;
    }
    //add gravity to pull the horse back to ground
    horse.velocityY = horse.velocityY + 0.5
   
    //check for collision with hurdle
    if(hurdlesGroup.isTouching(horse)){
        horse.velocityY = 0;
        gameState = END;
        diesound.play();
        //console.log(gameState);
    }
    
    
  }else {
    if (gameState == END){
      
      gameOver.visible = true;
      restart.visible = true;

      //set velcity of each game object to 0
      ground.velocityX = 0;
      horse.velocityY = 0;
      horsetrack.velocityX=0;
      hurdlesGroup.setVelocityXEach(0);
    
    
      //change the horse animation
      horse.changeAnimation("collided",horse_collidedImg);

      //set lifetime of the game objects so that they are never destroyed
      hurdlesGroup.setLifetimeEach(-1);
    
      
      if(mousePressedOver(restart)) {
        reset();
      }
      
     
      
    } 
  } // else
  
  //stop horse from falling down the ground
  horse.collide(ground);
  
  
  drawSprites();

  //displaying score
  textSize(30)
  fill("white")
  strokeWeight(20)
  text("Score: "+ score, (windowWidth/4)*3,40);
  
  
}

function spawnhurdles(){
 if (frameCount % 120 === 0){
  var hurdle = createSprite(600,220,40);
  hurdle.velocityX =-3;
  hurdle.addImage(hurdleImg);
  hurdle.setCollider("rectangle",350,0,hurdle.width,hurdle.height);
  hurdle .debug=false
   
  //assign scale and lifetime to the obstacle           
  hurdle.scale = 0.2;
  hurdle.lifetime = 300;
   
  //add each obstacle to the group
  hurdlesGroup.add(hurdle);
 }

}

function reset(){
  gameState=PLAY;
  gameOver.visible = false;
  restart.visible = false;
  hurdlesGroup.destroyEach();
  horse.changeAnimation("running",gif_loadImg);
  ground.velocityX=-4;
  horsetrack.velocityX=-4;
  score=0;
}

