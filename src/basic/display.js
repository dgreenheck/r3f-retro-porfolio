export class BASICDisplay {
  constructor(width = 32, height = 32) {
    this.width = 32;
    this.height = 32;
    this.pixels = [];

    // Initialize pixels to black
    for (let x = 0; x < this.width; x++) {
      this.pixels[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.pixels[x][y] = 0;
      }
    }
  }

  /**
   * Sets the color of the pixel at (x, y)
   * @param {number} x The x-coordinate of the pixel
   * @param {number} y The y-coordinate of the pixel
   * @param {number} color The hex value of the color
   */
  setPixel(x, y, color) {
    // If x/y coordinates are out of bounds, do nothing
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return;
    }

    // Verify color is in the correct range
    if (color >= 0 && color < 65536) {
      this.pixels[x][y] = color;
    }
  }

  /**
   * Gets the color of the pixel at (x, y)
   * @param {number} x The x-coordinate of the pixel
   * @param {number} y The y-coordinate of the pixel
   */
  getPixel(x, y) {
    return this.pixels[x][y];
  }
}