interface IKineOptions {
  xMax: number;
  yMax: number;
  acceleration: number;
  initialVelocity: number;
  angle: number; // 0-90
}

class Kine {
  board: string[][];
  yMax: number;
  acceleration: number;
  initialXVel: number;
  initialYVel: number;
  ticksElapsed: number;

  constructor({ xMax, yMax, acceleration, initialVelocity, angle }: IKineOptions) {
    this.board = Array(yMax).fill(Array(xMax).fill(' '));
    this.acceleration = acceleration;
    this.initialYVel = initialVelocity * Math.sin(angle * (Math.PI / 180));
    this.initialXVel = initialVelocity * Math.cos(angle * (Math.PI / 180));
    this.ticksElapsed = 0;
    this.yMax = yMax;
  }

  start(): void {
    const i = setInterval(() => {
      console.clear();
      try {
        console.log(this.stringify(this.tick()));
      } catch (err) {
        clearInterval(i);
      }
    }, 250);
  }

  tick(): string[][] {
    const board = JSON.parse(JSON.stringify(this.board));
    const pos = this.calculatePosition(this.ticksElapsed);
    let t = Number(this.ticksElapsed);
    // frames
    while (t > 0) {
      const pos = this.calculatePosition(t);
      board[Math.round(pos[1])][Math.round(pos[0])] = '.';
      t -= 0.25;
    }
    board[Math.round(pos[1])][Math.round(pos[0])] = 'X';
    this.ticksElapsed += 0.25;
    return board;
  }

  calculatePosition(ticksElapsed: number): [number, number] {
    const x = this.initialXVel * ticksElapsed; // linear, bc no air resistance
    const y = this.initialYVel * ticksElapsed + 0.5 * this.acceleration * ticksElapsed ** 2;

    return [x, this.yMax - y - 1];
  }

  stringify(board: string[][]): string {
    return board.map((row: string[]) => row.join('')).join('\n');
  }
}

const kine = new Kine({ xMax: 225, yMax: 50, acceleration: -1, initialVelocity: 15, angle: 35 });

kine.start();
