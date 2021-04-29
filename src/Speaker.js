// The sound produced by the chip-8 computers only have 1 tone
const FREQ = 500;

// process sound output
class Speaker
{
  constructor()
  {
    // create an audio context to output sound by invoking audiocontext API
    this.audioCtx = new window.AudioContext();
    this.audioCtx.resume();

    // needed this because Chrome turn off sound after webpage is loaded
    window.addEventListener('click', () =>
    {
      this.audioCtx.resume();
    });
  }

  play()
  {
    if(this.audioCtx && !this.oscillator)
    {
      // initialized an oscillator to output sound based on pre-defined frequency
      this.oscillator = this.audioCtx.createOscillator();
      this.oscillator.frequency.setValueAtTime(FREQ, this.audioCtx.currentTime);
      this.oscillator.type = 'square';
      this.oscillator.connect(this.audioCtx.destination);
      this.oscillator.start();
    }
  }

  // stop sound
  stop()
  {
    if(this.oscillator)
    {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}

export default Speaker;
