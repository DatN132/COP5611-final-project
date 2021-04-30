// define scaling factor to make the screen viewable on modern monitors
const COLS = 64;
const ROWS = 32;
const SCALE = 15; //15x fits my 1080p monitor well

// process console output by configuring html canvas
class Screen
{
  // take in and modify html canvas
  constructor(canvas)
  {
    // set cols and rows values
    this.cols = COLS;
    this.rows = ROWS;

    // set display buffer and scale
    // represent 2D x,y array as a 1D array
    this.display = new Array(this.cols * this.rows);
    this.scale = SCALE;

    this.canvas = canvas;
    // set canvas cols and rows proportional to scale
    this.canvas.width = this.cols * this.scale;
    this.canvas.height = this.rows * this.scale;

    // set canvas context to 2D
    this.canvasCtx = this.canvas.getContext('2d');
  }

  // set x,y coordinate onto display
  setPixel(x, y)
  {
    // wrap values if out of bound x
    if (x > this.cols)
      x -= this.cols;
    else if (x < 0)
      x+- this.cols;

    // wrap values if out of bound y
    if (y > this.cols)
      y -= this.rows;
    else if (y < 0)
      y += this.rows;

    // toggle the pixel at passed in location
    this.display[x + (y * this.cols)] ^= 1;

    // detect collision
    // return true if pixel is turned off, false if turned on
    return this.display[x + (y * this.cols)] != 1;
  }

  // clear the display
  clear()
  {
    this.display = new Array(this.cols * this.rows);
  }

  // put pixels onto canvas from Array
  paint()
  {
    // initialize canvas context
    this.canvasCtx.fillStyle = '#000';
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // traverse and fill desired pixels. O(n*m).
    // Could probably be optimized for performance
    // display is not too big, so performance should not be affected
    for(let i=0; i < this.cols*this.rows; i++)
    {
      let x = (i % this.cols) * this.scale;
      let y = Math.floor(i / this.cols) * this.scale;

      if(this.display[i] == 1)
      {
        this.canvasCtx.fillStyle = '#FFF';
        this.canvasCtx.fillRect(x, y, this.scale, this.scale);
      }
    }
  }

  // only here for initial testing
  testRender()
  {
    this.setPixel(0, 0);
    this.setPixel(25, 22);
    this.paint();
  }
}

export default Screen;
