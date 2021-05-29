var dog,dogImg,happyDogImg;
var foodStock, foodS;
var database;
var feed,addFood;
var lastFed,CurrentTime;
var foodObj;
var garden,washroom,readState,Bedroom;
var gamestate="hungry";

function preload()
{
  happyDogImg = loadImage("images/dogImg1.png");
  dogImg= loadImage("images/dogImg.png");
  Bedroom=loadImage("images/Bed Room.png");
  washroom=loadImage("images/Wash Room.png");
  garden=loadImage("images/Garden.png");
}

function setup() {
  createCanvas(1000, 600);
  database = firebase.database();
  dog = createSprite(700,300);
  dog.addImage("dog",dogImg);
  dog.scale =0.5;
  
  feed=createButton("Feed the dog"); 
  feed.position(350,95); 
  feed.mousePressed(feedDog); 

  addFood=createButton("Add Food"); 
  addFood.position(450,95); 
  addFood.mousePressed(addFoods);   

  foodStock = database.ref('Food');
  foodStock.on("value",function(data){
    foodS = data.val();
  })
  foodObj = new Food();

  fedTime = database.ref('time');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });
  readState = database.ref('gamestate');
  readState.on("value",function(data){
    gamestate = data.val();
  });
}




function draw() {  
  background(46,139,87);
  

  fill("white");
  textSize(30);
 
  text("Food left:" + foodS,200,500);
  drawSprites();
  
  foodObj.display();
  fill(255,255,254); 
  textSize(15); 
  currentTime=hour();
  if(currentTime==(lastFed+1)){ 
    update("playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){ 
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){ 
    update("bathing");
    foodObj.washroom();
  }
  else{ 
    update("hungry");
    foodObj.display();
  } 
  if (gamestate!="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }
}
function feedDog(){ 
  dog.addImage("dog",happyDogImg); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ 
    Food:foodObj.getFoodStock(),
    time:hour(),
    gamestate:"hungry"
  })
} 

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function update(state){
  database.ref("/").update({
    gamestate:state, 
  })
}

function addFoods(){ 
  foodS++; 
  database.ref('/').update({ 
    Food:foodS 
  }) 
} 