// import all components
import Screen from './Screen.js';
import Chip8 from './Chip8.js';
import Keyboard from './Keyboard.js';
import Speaker from './Speaker.js';

// define each part
const screen = new Screen(document.getElementById('screen'));
const keyboard = new Keyboard();
const speaker = new Speaker();

// pass in the components into the interpreter
const chip8 = new Chip8(screen, keyboard, speaker);
const FPS = 60; // 60hz delay for sound and timer
let loop, fpsInterval, startTime, now, then, elapsed;

// load ROM into the program
function loadROM(romName)
{
  const url = '/Chip-8/rom/' + romName;

  // step through the program
  function step()
  {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval)
    {
      chip8.cycle();
    }

    loop = requestAnimationFrame(step);
  }

  // start program
  fetch(url).then(res => res.arrayBuffer())
    .then(buffer =>
      {
        const program = new Uint8Array(buffer);
        fpsInterval = 1000 / FPS;
        then = Date.now();
        startTime = then;
        chip8.loadSpritsIntoMemory();
        chip8.loadProgramIntoMemory(program);
        loop = requestAnimationFrame(step);
      })
}

// fetch rom name from URL if there is any
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let rom ='';
if (urlParams.has('rom'))
{
  rom = urlParams.get('rom');
}

switch(rom)
{
  case 'TANK': loadROM('TANK'); break;
  case 'TETRIS': loadROM('TETRIS'); break;
  default: loadROM('SPACE-INVADER');
}
