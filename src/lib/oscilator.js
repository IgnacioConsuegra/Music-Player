export class AudioPlayer {
  playing = false;
  currentTime = 0;
  volume = 0.4;

  constructor(audioEl, canvasEl, setIsPlaying, handleSongFinished) {
    this.audio = audioEl;
    this.canvas = canvasEl;
    this.canvasCtx = canvasEl.getContext("2d");
    this.setIsPlaying = setIsPlaying;
    this.initializeAudio();
    this.attachEvents();
    this.handleSongFinished = handleSongFinished;
  }

  initializeAudio() {
    this.audioCtx = new AudioContext();
    this.track = this.audioCtx.createMediaElementSource(this.audio);
    this.analyzerNode = this.audioCtx.createAnalyser();

    this.analyzerNode.fftSize = 2048;
    this.bufferLength = this.analyzerNode.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.track.connect(this.analyzerNode).connect(this.audioCtx.destination);
  }

  updateFrequency = () => {
    if (!this.playing) return;

    this.analyzerNode.getByteFrequencyData(this.dataArray);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let x = 0;
    const barWidth = 1;
    const gap = 2;

    for (let i = 0; i < this.bufferLength; i++) {
      const h = (this.dataArray[i] / 255) * this.canvas.height;
      this.canvasCtx.fillStyle = `rgb(${this.dataArray[i]},100,255)`;
      this.canvasCtx.fillRect(x, this.canvas.height - h, barWidth, h);
      x += barWidth + gap;
    }

    requestAnimationFrame(this.updateFrequency);
  };

  async togglePlay() {
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    if (this.playing) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }
  async playAudio() {
    try {
      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume();
      }

      if (!this.audio.paused) return;

      await this.audio.play();
      this.playing = true;
      this.updateFrequency();
    } catch (err) {
      this.playing = false;
    }
  }

  pauseAudio() {
    if (this.audio.paused) return;
    this.playing = false;
    this.audio.pause();
    this.decayBars();
  }
  decayBars = () => {
    const decay = 0.92;
    const copyOfDataArray = [...this.dataArray];
    const step = () => {
      let stillVisible = false;

      for (let i = 0; i < this.bufferLength; i++) {
        copyOfDataArray[i] *= decay;

        if (copyOfDataArray[i] < 1) {
          copyOfDataArray[i] = 0;
        } else {
          stillVisible = true;
        }
      }

      this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let x = 0;
      const barWidth = 1;
      const gap = 2;

      for (let i = 0; i < this.bufferLength; i++) {
        const h = (copyOfDataArray[i] / 255) * this.canvas.height;
        this.canvasCtx.fillStyle = `rgb(${copyOfDataArray[i]},100,255)`;
        this.canvasCtx.fillRect(x, this.canvas.height - h, barWidth, h);
        x += barWidth + gap;
      }

      if (stillVisible) {
        requestAnimationFrame(step);
      }
    };

    step();
  };

  attachEvents() {
    this.audio.addEventListener("ended", () => {
      // this.playing = false;
      this.audio.currentTime = 0;
      this.setIsPlaying(false);
      this.handleSongFinished();
    });
  }
  changeTime(time) {
    this.audio.currentTime += time;
  }
  destroy() {
    this.audioCtx?.close();
  }
}
