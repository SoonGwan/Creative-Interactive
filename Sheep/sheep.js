export class Sheep {
  constructor(img, stageWidth) {
    this.img = img;

    this.totalFrame = 8; //양 이미지 토탈 프레임이 8이라서 정의
    this.curFrame = 0; // 현재 프레임 0

    this.imgWidth = 360; //이미지 크기는 양그림 한장의 넓이와 높이로
    this.imgHeight = 300;

    this.sheepWidth = 180; // 그려질 양의 크기는 레티나 디스플레이 고려하여 절반 사이즈로 잡아주기
    this.sheepHeight = 150;

    this.sheepWidthHalf = this.sheepWidth / 2;
    this.x = stageWidth + this.sheepWidth;
    this.y = 0;
    this.speed = Math.random() * 2 + 1; // 속도를 랜덤으로 정의해주기

    this.fps = 24; // adobe Animate에서 그릴때 사용했던 24로 정의해주기
    this.fpsTime = 1000 / this.fps; // 이 fps time이 타임스태프와 비교 값이 됨
  }

  draw(ctx, t, dots) {
    // requestAnimationFrame 함수에서 넘겨받은 타임 스탬프를 정의하고 이시간을 내가 정한 fps 의 시간과 비교하는 코드를 만들기
    !this.time ? (this.time = t) : null;

    const now = t - this.time;
    //fps 시간과 비교해서 그 시간에 도달했을때만 프레임을 증가시킨다.
    if (now > this.fpsTime) {
      this.time = t;
      this.curFrame += 1;
      this.curFrame === this.totalFrame ? (this.curFrame = 0) : null;
    }

    this.animate(ctx, dots);
  }

  animate(ctx, dots) {
    this.x -= this.speed;
    const closest = this.getY(this.x, dots);
    this.y = closest.y;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(closest.rotation);
    ctx.fillStyle = '#000000';
    ctx.drawImage(
      this.img,
      this.imgWidth * this.curFrame,
      0,
      this.imgWidth,
      this.imgHeight,
      -this.sheepWidthHalf,
      -this.sheepHeight + 20,
      this.sheepWidth,
      this.sheepHeight
    );
    ctx.restore(); // restore 해서 저장했던 캔버스를 복귀시켜주기
  }

  getY(x, dots) {
    for (let i = 0; i < dots.length; i++) {
      if (x >= dots[i].x1 && x <= dots[i].x3) {
        return this.getY2(x, dots[i]);
      }
    }

    return {
      y: 0,
      rotation: 0,
    };
  }

  getY2(x, dot) {
    const total = 200;
    const { x1, x2, x3, y1, y2, y3 } = dot;
    let pt = this.getPointOnQuad(x1, y1, x2, y2, x3, y3, 0);
    let prevX = pt.x;
    for (let i = 0; i < total; i++) {
      const t = i / total;
      pt = this.getPointOnQuad(x1, y1, x2, y2, x3, y3, t);
      if (x >= prevX && x <= pt.x) {
        return pt;
      }
      prevX = pt.x;
    }
    return pt;
  }

  getQuadValue(p0, p1, p2, t) {
    return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
  }

  getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
    const tx = this.quadTangent(x1, x2, x3, t);
    const ty = this.quadTangent(y1, y2, y3, t);
    const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;
    return {
      x: this.getQuadValue(x1, x2, x3, t),
      y: this.getQuadValue(y1, y2, y3, t),
      rotation,
    };
  }

  quadTangent(a, b, c, t) {
    return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
  }
}
