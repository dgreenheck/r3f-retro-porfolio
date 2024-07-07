export class BASICOutput {
  /**
   * @type {string[]}
   */
  buffer;

  constructor() {
    this.buffer = [];
  }

  clear() {
    this.buffer = [];
  }

  writeLine(text) {
    this.buffer.push(`${text}`);
  }
}