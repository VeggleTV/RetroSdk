var player = new Sprite(192/2,0,"player01.png", true);
var inventory = [0,0,0,0,0,0,0,1];

for(var x = -1; x < 3; x++)
{
  new Sprite(192/2+(x*8),160/2,"block01.png",true);
}
for(y = 0; y < 2; y++) for(var x = -1; x < 3; x++)
{
  new Sprite(192/2+(x*8),160/2+((y+1)*8),"block02.png",true);
}
for(var x = -1; x < 3; x++)
{
  new Sprite(192/2+(x*8),160/2+(3*8),"block03.png",true);
}

function die()
{
  player.x = 192/2;
  player.y = 0;
  setTimeout(function(){
    beep(2);
  });
  setTimeout(function(){
    beep(1.5);
  },100);
  setTimeout(function(){
    beep(1);
  },200);
  setTimeout(function(){
    beep(0.5);
  },300);
}

function tree(x, y)
{
  max_tall = Math.floor(Math.random()*3)+2;
  for(tall = 0; tall < max_tall; tall++)
  {
    var wood = new Sprite(x, y-(tall*8),"block05.png",true);
  }
  
  for(i = x-8; i < x+16; i+=8)
  {
    var leaves = new Sprite(i, y-(max_tall*8),"block04.png");
  }
}

var keys = new inputListener();

var direction = 8;
var actual_block = 1;

var graph = new Graphics();

var block_show = new Text(2,10,1,8, "#f00");
var slot1 = new Text(2,20,"Dirt : 0",8, "#ff0");
var slot2 = new Text(2,30,"Sand : 0",8, "#ff0");
var slot3 = new Text(2,35,"Stone : 0",8, "#ff0");
var slot4 = new Text(2,45,"Leaves : 0",8, "#ff0");
var slot5 = new Text(2,55,"Wood : 0",8, "#ff0");
var slot6 = new Text(2,60,"Tall Grass : 0",8, "#ff0");
var slot7 = new Text(2,70,"Sugar : 0",8, "#ff0");
var slot8 = new Text(2,75,"Plant : 0",8, "#ff0");

onFrame = function()
{
  slot1.str = "Dirt : " + inventory[0];
  slot2.str = "Sand : " + inventory[1];
  slot3.str = "Stone : " + inventory[2];
  slot4.str = "Leaves : " + inventory[3];
  slot5.str = "Wood : " + inventory[4];
  slot6.str = "Tall Grass : " + inventory[5];
  slot7.str = "Sugar : " + inventory[6];
  slot8.str = "Plant : " + inventory[7];
  
  player.vY += 0.1;
  
  if(keys.downKeys.includes("key:d")) player.vX = 0.5, direction = 8;;
  if(keys.downKeys.includes("key:a")) player.vX = -0.5, direction = -8;
  if(!keys.downKeys.includes("key:d") && !keys.downKeys.includes("key:a")) player.vX = 0;
  
  graph.rectangle(0,0,screenWidth,screenHeight,"blue");
  
  graph.rectangle(Math.floor((player.x+4+direction)/8)*8,Math.floor((player.y+4+8)/8)*8,8,8,"#fff");
  
  block_show.str = actual_block;
  
  if(player.y > 160) die();
}

addEventListener("keypress",(e)=>{
  if(e.key == " " )
  {
    player.vY = -1.5;
    beep(1);
  }
  
  if(e.key == "q" && actual_block < inventory.length+1)
  {
    beep(0.1);
    actual_block++;
  }
  if(actual_block >= inventory.length+1) actual_block = 1;
  
  if(e.key == "e")
  {
    playNoise()
    var last_block = new Sprite(Math.floor((player.x+4 + direction )/ 8)*8, Math.floor((player.y+12)/8)*8, "block0" + actual_block + ".png",actual_block != 8);
    if(actual_block == 8) setTimeout(function(){
      for(obj in scene)
      {
        if(scene[obj] != last_block && scene[obj] != player && scene[obj].src == "block01.png" && scene[obj].y == last_block.y+8 && last_block.exist() && scene[obj].x == last_block.x)
        {
          tree(last_block.x, last_block.y);
          last_block.kill();
        }
      }
    },10000);
   
    for(block in scene)
    {
      if(scene[block] != last_block && scene[block] != player)
      {
        var type = inventory[parseInt(last_block.src.replace("block0","").replace(".png",""))-1];
        if(verify_collision(scene[block], last_block))
        {
          type += 1;
          scene[block].kill();
          last_block.kill();
        }else if(last_block.exist() && type) type--;
      }
    }
    
  }
});