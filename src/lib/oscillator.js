export class AudioPlayer {
  playing = false;
  myBody = document.getElementsByTagName("body")[0];
  constructor(
    audioEl,
    canvasEl,
    handleAudioStop,
    handleAudioPlay,
    handleSongFinished
  ) {
    this.audio = audioEl;
    this.canvas = canvasEl;
    this.canvasCtx = canvasEl.getContext("2d");
    this.handleAudioStop = handleAudioStop;
    this.handleSongFinished = handleSongFinished;
    this.handleAudioPlay = handleAudioPlay;
    this.repeatSong = false;
    this.attachEvents();
    this.initializeAudio();
  }

  initializeAudio() {
    this.audio.volume = 0.1;
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
  handleRepeatSong = value => {
    if (value) {
      this.repeatSong = true;
    } else {
      this.repeatSong = false;
    }
  };

  attachEvents() {
    this.audio.addEventListener("ended", () => {
      this.handleAudioStop();
    });
    this.myBody.addEventListener("keypress", key => {
      this.handleKeyPress(key.key);
    });
  }

  destroy() {
    this.audioCtx?.close();
  }
  handleKeyPress(key) {
    switch (key) {
      case "+":
        this.audio.volume += 0.1;
        break;
      case "-":
        this.audio.volume -= 0.1;

        break;

      default:
        break;
    }
  }
}
