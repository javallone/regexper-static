class Path {
  constructor({ relative } = {}) {
    this.relative = relative || false;
    this.currentPosition = { x: 0, y: 0 };
    this.lastStartPosition = { x: 0, y: 0 };
    this.pathParts = [];
  }

  moveTo({ x, y, relative }) {
    relative = relative === undefined ? this.relative : relative;
    const command = relative ? 'm' : 'M';

    if (relative) {
      this.currentPosition = {
        x: x + this.currentPosition.x,
        y: y + this.currentPosition.y
      };
    } else {
      this.currentPosition = { x, y };
    }

    this.pathParts.push(`${command}${x},${y}`);
    this.lastStartPosition = { ...this.currentPosition };

    return this;
  }

  lineTo({ x, y, relative }) {
    if (relative === undefined) {
      relative = this.relative;
    }
    if (x === undefined) {
      x = relative ? 0 : this.currentPosition.x;
    }
    if (y === undefined) {
      y = relative ? 0 : this.currentPosition.y;
    }

    if ((relative && x === 0 && y === 0)
      || (!relative && x === this.currentPosition.x && y === this.currentPosition.y)) {
      return this;
    }

    if (y === (relative ? 0 : this.currentPosition.y)) {
      const command = relative ? 'h' : 'H';
      this.pathParts.push(`${command}${x}`);
    } else if (x === (relative ? 0 : this.currentPosition.x)) {
      const command = relative ? 'v' : 'V';
      this.pathParts.push(`${command}${y}`);
    } else {
      const command = relative ? 'l' : 'L';
      this.pathParts.push(`${command}${x},${y}`);
    }

    this.currentPosition = {
      x: relative ? this.currentPosition.x + x : x,
      y: relative ? this.currentPosition.y + y : y
    };

    return this;
  }

  closePath() {
    this.pathParts.push('Z');
    this.currentPosition = { ...this.lastStartPosition };
    return this;
  }

  cubicCurveTo({ cx1, cy1, cx2, cy2, x, y, relative }) {
    relative = relative === undefined ? this.relative : relative;
    if (cx1 === undefined || cy1 === undefined) {
      const command = relative ? 's' : 'S';
      this.pathParts.push(`${command}${cx2},${cy2} ${x},${y}`);
    } else {
      const command = relative ? 'c' : 'C';
      this.pathParts.push(`${command}${cx1},${cy1} ${cx2},${cy2} ${x},${y}`);
    }

    this.currentPosition.x = relative ? this.currentPosition.x + x : x;
    this.currentPosition.y = relative ? this.currentPosition.y + y : y;

    return this;
  }

  quadraticCurveTo({ cx, cy, x, y, relative }) {
    relative = relative === undefined ? this.relative : relative;
    if (cx === undefined || cy === undefined) {
      const command = relative ? 't' : 'T';
      this.pathParts.push(`${command} ${x},${y}`);
    } else {
      const command = relative ? 'q' : 'Q';
      this.pathParts.push(`${command}${cx},${cy} ${x},${y}`);
    }

    this.currentPosition.x = relative ? this.currentPosition.x + x : x;
    this.currentPosition.y = relative ? this.currentPosition.y + y : y;

    return this;
  }

  arcTo({ rx, ry, rotation, arc, sweep, x, y, relative }) {
    relative = relative === undefined ? this.relative : relative;
    const command = relative ? 'a' : 'A';

    this.pathParts.push(`${command}${rx},${ry} ${rotation} ${arc} ${sweep},${x},${y}`);

    this.currentPosition.x = relative ? this.currentPosition.x + x : x;
    this.currentPosition.y = relative ? this.currentPosition.y + y : y;

    return this;
  }

  toString() {
    return this.pathParts.join('');
  }
}

export default Path;
