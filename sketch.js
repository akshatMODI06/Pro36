var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood,lastFed;
var foodObj,feed,feedTime;
 
function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  feedTime = database.ref('FeedTime');
  feedTime.on("value",function(data){
    lastFed = data.val();
  })
  fill("black");
    if(lastFed >= 12){
      text("lastFed" + lastFed%12 + "PM",325,45)
    }
    else if(lastFed==0){
      text("lastFed : 12 AM",350,30)
    }
    else{
      text("lastFed" + lastFed + "AM",325,45)
    }
 
  drawSprites();
}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog);

  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val*0);
  }
  else{
    foodObj.updateFoodStock(food_stock_val-1);
  }
  database.ref('/').update({
     Food : food_stock_val,
     FeedTime : hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
