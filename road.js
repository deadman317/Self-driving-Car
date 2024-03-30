class Road {
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinite = 1000000;
    this.top = -infinite;
    this.bottom = infinite;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  getLaneCenter(laneIndex) {
    return linearInterpolation(
      this.left,
      this.right,
      (Math.min(laneIndex, this.laneCount - 1) + 0.5) / this.laneCount
    );
  }

  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i < this.laneCount; i++) {
      const a = linearInterpolation(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([30, 30]);
      ctx.beginPath();
      ctx.moveTo(a, this.top);
      ctx.lineTo(a, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}
