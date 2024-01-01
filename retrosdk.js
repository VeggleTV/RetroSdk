const canvas = document.createElement("canvas");
const pencil = canvas.getContext("2d");

var html = document.body;
html.appendChild(canvas);
canvas.width = 192;
canvas.height = 160;

canvas.style.backgroundColor = "#000";
canvas.style.position = "fixed";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%, -50%)";
canvas.style.width = "50%";
canvas.style.height = "80%";
canvas.style.imageRendering = "pixelated";
canvas.style.border = "1px solid #fff";
canvas.style.fontSmooth = "never";
canvas.style.filter = "saturate(50000)";
canvas.focus();

html.style.backgroundColor = "#000";

/////////////////////////////////////////////////////////

function onFrame() {}
const screenWidth = 192;
const screenHeight = 160;

var scene = [];
var interfaces = [];

class inputListener
{
  constructor()
  {
    this.downKeys = "";
    addEventListener("keydown", (e)=>{
      if(!this.downKeys.includes("key:" + e.key)) this.downKeys += "key:" + e.key;
    });
    addEventListener("keyup", (e)=>{
      if(this.downKeys.includes("key:" + e.key)) this.downKeys = this.downKeys.replace("key:" + e.key, "");
    });
  }
  
  onPress(key, func)
  {
    addEventListener("keypres",(e)=>{
      console.log(e.key)
      if(e.key == key) setTimeout(func,0);
    })
  }
}

class Text
{
  constructor(x, y, str, size, color="#f00")
  {
    this.x = x;
    this.y = y;
    this.str = str;
    this.size = size;
    this.color = color;
    
    interfaces.push(this);
  }
  
  draw()
  {
    pencil.restore();
    pencil.save();
    pencil.imageSmoothEnabled = false;
    pencil.textRendering = "geometricPrecision";
    pencil.font = this.size + "px monospace";
    pencil.fillStyle = this.color;
    pencil.fillText(this.str, Math.floor(this.x/8)*8, Math.floor(this.y/8)*8);
  }
}

class Graphics
{
  constructor()
  {
    //
  }
  
  line(x, y, x1, y1, color="#fff", width=1)
  {
    pencil.restore();
    pencil.save();
    pencil.beginPath();
    pencil.moveTo(x, y);
    pencil.lineTo(x1, y1);
    pencil.strokeStyle = color;
    pencil.lineWidth = width;
    pencil.stroke();
  }
  
  rectangle(x,y,wx,wh,color)
  {
    pencil.restore();
    pencil.save();
    pencil.fillStyle = color;
    pencil.fillRect(x,y,wx,wh);
  }
}

class Sprite
{
  constructor(x, y, src, physic)
  {
    this.x = x;
    this.y = y;
    this.vX = 0;
    this.vY = 0;
    this.src = src;
    this.physics = physic || false;
    
    this.img = new Image();
    this.img.style.imageRendering = "pixelated";
    this.img.src = this.src;
    
    scene.push(this);
  }
  
  draw()
  {
    pencil.restore();
    pencil.save();
    pencil.drawImage(this.img, Math.round(this.x / 1) * 1, Math.round(this.y / 1) * 1, 8, 8);
  }
  
  exist()
  {
    return scene.includes(this);
  }
  
  kill()
  {
    if(this.exist()) scene.splice(scene.indexOf(this), 1);
  }
  
  update()
  {
    this.img.src = this.src;
    if(!this.static)
    {
      this.x += this.vX;
      this.y += this.vY;
    }
    this.draw();
  }
}

//Audio
let sharedAudioContext;

function beep(pitch) {
  const audioContext = sharedAudioContext || (sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)());
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(440 * Math.pow(2, pitch), audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playSquareWave(pitch) {
  const audioContext = sharedAudioContext || (sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)());
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440 * Math.pow(2, pitch), audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playTriangleWave(pitch) {
  const audioContext = sharedAudioContext || (sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)());
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(440 * Math.pow(2, pitch), audioContext.currentTime);
  oscillator.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.1);
}

function playNoise() {
  const audioContext = sharedAudioContext || (sharedAudioContext = new (window.AudioContext || window.webkitAudioContext)());
  const bufferSize = audioContext.sampleRate * 0.5;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;
  noise.connect(audioContext.destination);
  noise.start();
  noise.stop(audioContext.currentTime + 0.1);
}

function reflect_if_colliding(rectangle1, rectangle2) {
  const dx = rectangle1.x - rectangle2.x;
  const dy = rectangle1.y - rectangle2.y;
  const combinedHalfWidths = 8;
  const combinedHalfHeights = 8;

  const overlapX = combinedHalfWidths - Math.abs(dx);
  const overlapY = combinedHalfHeights - Math.abs(dy);

  if (overlapX > 0 && overlapY > 0) {
    rectangle1.colliding = true;
    rectangle2.colliding = true;
    if (overlapX > overlapY) {
      if (dy > 0) {
        rectangle1.y += overlapY;
      } else {
        rectangle1.y -= overlapY;
      }
    } else {
      if (dx > 0) {
        rectangle1.x += overlapX;
      } else {
        rectangle1.x -= overlapX;
      }
      rectangle1.vX = -rectangle1.vX/1000;
    }
    rectangle1.vY = -rectangle1.vY/1000;
    
  }else{
    rectangle1.colliding = false;
    rectangle2.colliding = false;
  }
}

function verify_collision(rect1, rect2) {
  return (
    rect1.x < rect2.x + 8 &&
    rect1.x + 8 > rect2.x &&
    rect1.y < rect2.y + 8 &&
    rect1.y + 8 > rect2.y
  );
}

function frame()
{
  requestAnimationFrame(frame);
  pencil.clearRect(0,0,canvas.width,canvas.height);
  onFrame();
  
  for(obj in scene)
  {
    scene[obj].update();
    if(scene[obj].physic == false) obj++;
    for(static_object in scene)
    {
      if(scene[obj] != scene[static_object] && scene[obj].physics && scene[static_object].physics)
      {
        if(scene[static_object].physic == false) static_object++;
        reflect_if_colliding(scene[obj], scene[static_object]);
      }
    }
  }
  
  if(interfaces.length > 0) for(txt in interfaces)
  {
    interfaces[txt].draw();
  }
}
frame();

/////////////////////////////////////////////////////////