// Chip-8 interpreter
const MEMORY_SIZE  = 4096;
const NUM_REGISTERS = 16;
const debug = false;
const testedOP = new Array(0x1000, 0x1100, 0x1200, 0x1300, 0x1400, 0x1500, 0x1600, 0x1700, 0x1800, 0x1900, 0x1A00, 0x1B00, 0x1C00, 0x1D00, 0x1E00, 0x1F00,
                          0x6000, 0x6100, 0x6200, 0x6300, 0x6400, 0x6500, 0x6600, 0x6700, 0x6800, 0x6900, 0x6A00, 0x6B00, 0x6C00, 0x6D00, 0x6E00, 0x6F00,
                          0xA000, 0xA100, 0xA200, 0xA300, 0xA400, 0xA500, 0xA600, 0xA700, 0xA800, 0xA900, 0xAA00, 0xAB00, 0xAC00, 0xAD00, 0xAE00, 0xAF00,
                          0xD000, 0xD100, 0xD200, 0xD300, 0xD400, 0xD500, 0xD600, 0xD700, 0xD800, 0xD900, 0xDA00, 0xDB00, 0xDC00, 0xDD00, 0xDE00, 0xDF00,
                          0x7000, 0x7100, 0x7200, 0x7300, 0x7400, 0x7500, 0x7600, 0x7700, 0x7800, 0x7900, 0x7A00, 0x7B00, 0x7C00, 0x7D00, 0x7E00, 0x7F00,
                          0x3000, 0x3100, 0x3200, 0x3300, 0x3400, 0x3500, 0x3600, 0x3700, 0x3800, 0x3900, 0x3A00, 0x3B00, 0x3C00, 0x3D00, 0x3E00, 0x3F00,
                          0xF000, 0xF100, 0xF200, 0xF300, 0xF400, 0xF500, 0xF600, 0xF700, 0xF800, 0xF900, 0xFA00, 0xFB00, 0xFC00, 0xFD00, 0xFE00, 0xFF00,
                          0x2000, 0x2100, 0x2200, 0x2300, 0x2400, 0x2500, 0x2600, 0x2700, 0x2800, 0x2900, 0x2A00, 0x2B00, 0x2C00, 0x2D00, 0x2E00, 0x2F00,
                          0x0000,
                          0xC000, 0xC100, 0xC200, 0xC300, 0xC400, 0xC500, 0xC600, 0xC700, 0xC800, 0xC900, 0xCA00, 0xCB00, 0xCC00, 0xCD00, 0xCE00, 0xCF00,
                          0x4000, 0x4100, 0x4200, 0x4300, 0x4400, 0x4500, 0x4600, 0x4700, 0x4800, 0x4900, 0x4A00, 0x4B00, 0x4C00, 0x4D00, 0x4E00, 0x4F00,
                          0x9000, 0x9100, 0x9200, 0x9300, 0x9400, 0x9500, 0x9600, 0x9700, 0x9800, 0x9900, 0x9A00, 0x9B00, 0x9C00, 0x9D00, 0x9E00, 0x9F00,
                          0xE000, 0xE100, 0xE200, 0xE300, 0xE400, 0xE500, 0xE600, 0xE700, 0xE800, 0xE900, 0xEA00, 0xEB00, 0xEC00, 0xED00, 0xEE00, 0xEF00,
                          0x8000, 0x8100, 0x8200, 0x8300, 0x8400, 0x8500, 0x8600, 0x8700, 0x8800, 0x8900, 0x8A00, 0x8B00, 0x8C00, 0x8D00, 0x8E00, 0x8F00);


class Chip8
{
  // accept monitor and keyboard
  constructor(screen, keyboard, speaker)
  {
    // set memory and register
    this.memory = new Uint8Array(MEMORY_SIZE);
    this.v = new Uint8Array(NUM_REGISTERS);

    // starting PC of all chip-8 counter is 0x200
    this.index = 0;
    this.pc = 0x200;

    // set up the stack
    this.stack = [];
    this.sp = 0;

    // both are for sound
    this.delayTimer = 0;
    this.soundTimer = 0;

    // initiate components
    this.keyboard = keyboard;
    this.screen = screen;
    this.speaker = speaker;

    this.paused = false;
    this.speed = 10;
  }


  // set up sprites according to data sheet
  loadSpritsIntoMemory()
  {
    // make it so that program can quickly draw pixels on screen
    const sprites =
    [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];
    for (let i = 0; i < sprites.length; i++)
    {
      this.memory[i] = sprites[i];
    }
  }

  // load program into memory
  loadProgramIntoMemory(program)
  {
    for (let i = 0; i < program.length; i++)
    {
      this.memory[0x200 + i] = program[i];
    }
  }

  // interpret 10 instructions per cycle
  // else it will be too slow on a browser
  cycle()
  {
    for(let i=0; i < this.speed; i++)
    {
      if(!this.paused)
      {
        // opcode is stored in continuous PC as each memory location is only 1B
        // 2 memory loccations = 2B => proper opcode
        //Ex: FF << 8 | 44 => FF44
        let opcode = (this.memory[this.pc] << 8 | this.memory[this.pc + 1]);
        this.interpretInstruction(opcode);
      }
    }

    // update screen + sound
    if(!this.paused)
        this.updateTimers();
    this.sound();
    this.screen.paint();
  }

  // play sound if opcode is set to play sound
  sound()
  {
    if(this.soundTimer > 0)
      this.speaker.play();
    else
      this.speaker.stop();
  }

  // update sound duration
  updateTimers()
  {
    if (this.delayTimer > 0)
      this.delayTimer -= 1;
    if (this.soundTimer > 0)
      this.soundTimer -= 1;
  }


  // interpret opcodes 36 differnt instructions
  interpretInstruction(instruction)
  {
    let debugOutput = "";

    // get x & y values
    const x = (instruction & 0x0F00) >> 8;
    const y = (instruction & 0x00F0) >> 4;

    // make debug message
    if (debug && !testedOP.includes(instruction & 0xFF00))
    {
      debugOutput += "OPCODE: 0x" + instruction.toString(16).toUpperCase() + "\n";
      debugOutput += "Stack before: [" + this.stack.toString() + "]\n";
      debugOutput += "Register Vx before: " + this.v[x] + "\n";
      debugOutput += "Register Vy before: " + this.v[y] + "\n";
      debugOutput += "PC before: " + this.pc + "\n";
      debugOutput += "Index before: " + this.index + "\n";
    }

    // each instruction is 2 byte long
    this.pc += 2;
    // nnn or addr - A 12-bit value, the lowest 12 bits of the instruction
    // n or nibble - A 4-bit value, the lowest 4 bits of the instruction
    // x - A 4-bit value, the lower 4 bits of the high byte of the instruction
    // y - A 4-bit value, the upper 4 bits of the low byte of the instruction
    // kk or byte - An 8-bit value, the lowest 8 bits of the instruction
    switch(instruction & 0xF000)
    {
      case 0x0000: //0x0nnn is no longer used => not interpreted
        switch(instruction)
        {
          case 0x00E0: // CLS
            this.screen.clear(); // Clear the display
            break;
          case 0x0EE: // RET
            // Return from a subroutine.
            // The interpreter sets the program counter to the address at the top of the stack
            this.pc = this.stack.pop();
            break;
        }
        break;
      case 0x1000: // Jump to location nnn
        // The interpreter sets the program counter to nnn.
        this.pc = instruction & 0xFFF; // JP addr
        break;
      case 0x2000: // CALL addr
        // puts the current PC on the top of the stack.
        // The PC is then set to nnn.
        this.stack.push(this.pc);
        this.pc = instruction & 0xFFF;
        break;
      case 0x3000: // jump if Vx == kk (3xkk)
        if(this.v[x] === (instruction & 0xFF)) // SE Vx, byte
            this.pc += 2; // increment pc by 2 if equals
        break;
      case 0x4000: // jump if not equal
        if(this.v[x] != (instruction & 0xFF)) { // SNE Vx, byte
            this.pc += 2; // increment pc if Vx != kk
        }
        break;
      case 0x5000:
        if(this.v[x] === this.v[y]) { // SE Vx, Vy
            this.pc += 2; // increment if Vx == Vy
        }
        break;
      case 0x6000: // Set Vx = kk
        this.v[x] = (instruction & 0xFF); // LD Vx, byte
        break;
      case 0x7000: // Set Vx = Vx + kk
        this.v[x] += (instruction & 0xFF); // ADD Vx, byte
        break;
      case 0x8000:
        switch (instruction & 0xF)
        {
          case 0x0:  // Set Vx = Vy
            this.v[x] = this.v[y]; // LD Vx, Vy
            break;
          case 0x1: // Vx = Vx | Vy
            this.v[x] |= this.v[y]; // OR Vx, Vy
            break;
          case 0x2: // Vx = Vx & Vy
            this.v[x] &= this.v[y]; // AND Vx, Vy
            break;
          case 0x3: // Vx = Vx ^ Vy
            this.v[x] ^= this.v[y]; // XOR Vx, Vy
            break;
          case 0x4: // Vx = Vx + Vy VF carry
            let sum = (this.v[x] += this.v[y]); // ADD Vx, Vy
            this.v[0xF] = 0;
            // check if there is carry
            if(sum > 0xFF)
              this.v[0xF] = 1;
            this.v[x] = sum;
            break;
          case 0x5: // Vx = Vx - Vy VF = NOT borrow
            this.v[0xF] = 0;
            if(this.v[x] > this.v[y]) // SUB Vx, Vy
              this.v[0xF] = 1; // set to 1 if no borrow
            this.v[x] -= this.v[y];
            break;
          case 0x6: // set Vx = Vx SHR 1
            // If the least-significant bit of Vx is 1, then VF is set to 1, otherwise 0
            this.v[0xF] = this.v[x] & 0x1; // SHR Vx, vy
            // Then Vx is divided by 2
            this.v[x] >>= 1;
            break;
          case 0x7: // set Vx = Vy - Vx
            this.v[0xF] = 0;
            if(this.v[y] > this.v[x]) // SUBN Vx, Vy
              this.v[0xF] = 1;
            this.v[x] = this.v[y] - this.v[x];
            break;
          case 0xE: // Vx - Vx SHL 1
            // If the most-significant bit of Vx is 1, then VF is set to 1, otherwise to 0
            this.v[0xF] = this.v[x] & 0x80; // SHL Vx {, Vy}
            // Then Vx is multiplied by 2
            this.v[x] <<= 1;
            break;
          default:
            throw new Error('BAD OPCODE');
        }
        break;
      case 0x9000: // skip next instr if Vx != Vy
        if(this.v[x] != this.v[y]) // SNE Vx, Vy
          this.pc += 2;
        break;
      case 0xA000: // set I = nnn
        this.index = instruction & 0xFFF; // LD I, addr
        break;
      case 0xB000: // Jump to location nnn + V0
        this.pc = (instruction & 0xFFF) + this.v[0]; // JP V0, addr
        break;
      case 0xC000: // Vx = randByte & kk
        let rand = Math.floor(Math.random() * 0xFF); // RND Vx, byte
        this.v[x] = rand & (instruction & 0xFF);
        break;
      case 0xD000: // Display n-byte sprite starting at memory location I at (Vx, Vy)
        let width = 8; // DRW Vx, Vy, nibble (4-bit value)
        let height = (instruction & 0xF);
        this.v[0xF] = 0;
        for(let row = 0; row < height; row++)
        {
          let sprite = this.memory[this.index + row];

          for(let col = 0; col < width; col++)
          {
            if((sprite & 0x80) > 0)
            {
              if(this.screen.setPixel(this.v[x] + col, this.v[y] + row))
              {
                this.v[0xF] = 1; // set VF if collision
              }
            }
            sprite <<= 1;
          }
        }
        break;
      case 0xE000:
        switch (instruction & 0xFF)
        {
          case 0x9E: // skip next instr if keyboard key with value Vx is pressed
            if(this.keyboard.isKeyPressed(this.v[x]))
            { // SKP Vx
              this.pc += 2;
            }
            break;
          case 0xA1: // skip next instr if key with value Vx is not pressed
            if (!this.keyboard.isKeyPressed(this.v[x]))
            { // SKNP Vx
              this.pc += 2;
            }
            break;
          default:
            throw new Error('BAD OPCODE');
        }

          break;
      case 0xF000:
        switch(instruction & 0xFF)
        {
          case 0x07: // Vx = delay time value
            this.v[x] = this.delayTimer; // LD Vx, DT
            break;
          case 0x0A: // store value of keypress into Vx
            // execution stop until key is pressed
            this.paused = true; // LD Vx, K

            let nextKeyPress = (key) =>
            {
              this.v[x] = key;
              this.paused = false;
            };

            this.keyboard.onNextKeyPress = nextKeyPress.bind(this);
            break;
          case 0x15: // delay timer = Vx
            this.delayTimer = this.v[x]; // LD Dt, Vx
            break;
          case 0x18: // sound timer = Vx
            this.soundTimer = this.v[x]; // LD ST, Vx
            break;
          case 0x1E: // I = I + Vx
            this.index += this.v[x]; // ADD I, Vx
            break;
          case 0x29: // I = location of sprite for digit Vx
            this.index = this.v[x] * 5; //  LD F, Vx
            break;
          case 0x33: // split Vx into hundredth, tens, and ones digits and store at index locations in mem
            this.memory[this.index] = parseInt(this.v[x] / 100); // LD B, Vx
            this.memory[this.index + 1] = parseInt((this.v[x]%100)/10);
            this.memory[this.index + 2] = parseInt(this.v[x]%10);
            break;
          case 0x55: // store V0 through Vx at location starting at I
            for (let reg=0; reg <= x; reg++)  // LD [I], Vx
              this.memory[this.index + reg] = this.v[reg];
            break;
          case 0x65: // read reg V0 through Vx starting at I
            for(let reg=0; reg <= x; reg++) // LD Vx, [I]
                this.v[reg] = this.memory[this.index + reg];
            break;
          default:
              throw new Error('0xF BAD OPCODE ' + instruction);
        }
        break;
      default:
        throw new Error('BAD OPCODE');
    }

    // continue debug message and print out alert
    if (debug && !testedOP.includes(instruction & 0xFF00))
    {
      debugOutput += "Stack after: [" + this.stack.toString() + "]\n";
      debugOutput += "Register Vx after: " + this.v[x] + "\n";
      debugOutput += "Register Vy after: " + this.v[y] + "\n";
      debugOutput += "PC after: " + this.pc + "\n";
      debugOutput += "Index after: " + this.index + "\n";
      alert(debugOutput);
    }
  }
}

export default Chip8;
