export default class ParserState {
  constructor(progress) {
    this.groupCounter = 1;
    this.cancelRender = false;
    this.warnings = [];
    this._renderCounter = 0;
    this._maxCounter = 0;
    this._progress = progress;
  }

  get renderCounter() {
    return this._renderCounter;
  }

  set renderCounter(value) {
    if (value > this.renderCounter) {
      this._maxCounter = value;
    }

    this._renderCounter = value;

    if (this._maxCounter && !this.cancelRender) {
      this._progress.style.width = ((1 - this.renderCounter / this._maxCounter) * 100).toFixed(2) + '%';
    }
  }
}
