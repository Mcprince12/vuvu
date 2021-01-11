var fedTime,feed, addFood,dog,dogImg, happyDog, database, foodS, foodStock, food;
var readState, gameState;
var bedImg, bathImg, gardenImg;

function preload()
{
  dogImg = loadImage("images/Dog.png");
  happyDog = loadImage(" images/happydog.png");
  bedImg = loadImage("images/Bed Room.png");
  bathImg = loadImage("images/Wash Room.png");
  gardenImg = loadImage("images/Garden.png");
}

function setup() {
  createCanvas(700, 700); 
  database = firebase.database(); 
  dog = createSprite(350,350,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.7;
  food = new Food();
  food.getFoodStock();

  feed = createButton("Feed the Dog");
  feed.position(600,95);
  
  addFood=createButton("Add Food");
  addFood.position(700,95);
 
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });

}




function draw() {  

  background(46,139,87);

  var fedTime=database.ref('Feedtime');
  fedTime.on("value", function(data){
    food.lastFed=data.val();
  });
  fill("white");
  textSize(30)
  if(food.lastFed>=12){
    text("Last Feed : "+food.lastFed%12+"PM", 350, 30);
  }else if(food.lastfed===0){
    text("Last Feed : 12AM", 350, 30);
  }else{
    text("Last Feed : "+food.lastFed+" AM", 350, 30);
  }

  food.display();
  feed.mousePressed(feedDog);  
  addFood.mousePressed(addFoods);


  currentTime=minute();
  if(currentTime===(food.lastfed+1)){
    update("Playing");
    food.garden();
  } else if(currentTime===(food.lastfed+2)){
    update("Sleeping");
    food.bedroom();
  } else if(currentTime>(food.lastfed+2)&&currentTime<=(food.lastfed+4)){
    update("Bathing");
    food.bathroom();
  } else{
    update("Hungry");
    food.display();
  }

  if(gameState!=="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }
 

  drawSprites();
  fill("white");
  textSize(30);
  //text("Note: Press UP_ARROW Key to fead The dog Milk ", 20, 30);
  text("FoodStock: "+food.foodStock, 20,70 );
  
}
function feedDog(){
  if(food.foodStock<=0){
    food.foodStock = 0;
  }else{
    food.foodStock = food.foodStock-1;
  }

 
 
  food.updateStock(food.foodStock);
  dog.addImage(happyDog);
 
  
  
}
function addFoods(){
  food.foodStock++;

}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
