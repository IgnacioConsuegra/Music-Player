export class AudioPlayer {
  myBody = document.getElementsByTagName("body")[0];
  constructor(
    audioEl,
    canvasEl,
    handleSongIsPlaying,
    handleSongIsPaused,
    handleSongIsFinished,
    handleTogglePlay
  ) {
    this.audio = audioEl;
    this.canvas = canvasEl;
    this.canvasCtx = canvasEl.getContext("2d");
    this.handleSongIsPlaying = handleSongIsPlaying;
    this.handleSongIsFinished = handleSongIsFinished;
    this.handleSongIsPaused = handleSongIsPaused;
    this.handleTogglePlay = handleTogglePlay;
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
    if (!this.audio.play) return;

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
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }
  async playAudio() {
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }
    this.audio.play();
    this.handleSongIsPlaying();
    this.updateFrequency();
  }

  pauseAudio() {
    if (this.audio.ended) {
      return;
    }
    this.audio.pause();
    this.handleSongIsPaused();
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
      this.handleSongIsFinished();
    });
    this.audio.addEventListener("pause", () => {
      this.pauseAudio();
    });
    this.audio.addEventListener("play", () => {
      this.playAudio();
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
        this.audio.volume += 0.01;
        break;
      case "-":
        this.audio.volume -= 0.01;

        break;

      default:
        break;
    }
  }
}
