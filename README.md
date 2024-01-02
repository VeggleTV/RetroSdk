
# RetroSdk.js

Make retro games like with js for web browser

## Installation

1. Download the RetroSdk.js in a zip file
2. Extract the zip file
3. Open the index.html in your browser
4. Open the index.js on your code editor
5. Make your game/software
6. Run

## Author

- [@shinpilow](https://www.instagram.com/shinpilow?igsh=Y2Q4MmVwdGcya2Np)

## Features

- Easy codes and function
- 8 bits audio function without audio file
- 192x160 resolution
- Simple to manipulate sprites
- Super optmization

## Learn

**Sprites**

~~~js
var player = new Sprite(x, y, "sprite_source.png", has_physics?);

//Make a sprite called player
~~~

*Variables and function on sprite*

- x - position x
- y - position y
- src - sprite source
- kill() - kill the actual sprite
- exist() - return if the actual sprite exist
- vX - velocity v
- vY - velocity y

**Physics**

You can add physics for your sprite in the parameter *has_physics*.

When you add physics in your sprite, the sprite will be a object and will collide with outher objects.

*Velocity*

You can set the velocity x and y for your objetcs using the variable vX or vY and setting for a value.

**Loop**

You can use the onFrame loop only one time but you can.

For use the onFrame loop nou need create it :

~~~js
onFrame = ()=>{
    //Loop code
}
~~~

**Graphics*

Graphics are used for make backgrounds, 
