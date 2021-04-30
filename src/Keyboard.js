// keyboard object that processes keyboard inputs
class Keyboard
{
  constructor()
  {
    // map modern keyboard inputs to chip-8 keyboard
    this.keymap =
    {
      49: 0x1, // 1 = 1
      50: 0x2, // 2 = 2
      51: 0x3, // 3 = 3
      52: 0xc, // 4 = C
      81: 0x4, // Q = 4
      87: 0x5, // W = 5
      69: 0x6, // E = 6
      82: 0xD, // R = D
      65: 0x7, // A = 7
      83: 0x8, // S = 8
      68: 0x9, // D = 9
      70: 0xE, // F = E
      90: 0xA, // Z = A
      88: 0x0, // X = 0
      67: 0xB, // C = B
      86: 0xF  // V = F
    };

    // keep track of which key is pressed to be processed
    this.keysPressed = [];
    this.onNextKeyPress = null;

    // add event listener to when key is pressed and released
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);
  }

  // check if a certain keyCode is toggled (key pressed)
  isKeyPressed(keyCode)
  {
    return this.keysPressed[keyCode];
  }

  //process key down
  onKeyDown(event)
  {
    // fetch which key was pressed
    let key = this.keymap[event.which];
    this.keysPressed[key] = true;

    // Make sure onNextKeyPress is initiated and the pressed key is actually mapped
    if ((this.onNextKeyPress !== null) && key)
    {
      this.onNextKeyPress(parseInt(key));
      this.onNextKeyPress =  null;
    }
  }

  //process key up to prepare for next key
  onKeyUp(event)
  {
    let key = this.keymap[event.which];
    this.keysPressed[key] = false;
  }
}

export default Keyboard;
