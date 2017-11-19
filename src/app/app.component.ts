import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  gridData = Array(10000).fill(0).map((i) => {return {ant: false, pheromone: {}}; });

  running = false;
  steps = 0;
  fps = 0;
  avgFps: any = 0;
  positions = [-101, -100, -99, -1, 1, 99, 100, 101];
  ants = [];
  antId = 1;

  constructor() {
  }

  placeAnt(index) {
    console.log(this.gridData[index].ant);
      if (!this.gridData[index].ant) {
        this.gridData[index].ant = true;
        this.ants.push({position: index, id: this.antId++});
      } else {
        this.ants.splice(this.findAntAtGridIndex(index), 1);
        this.gridData[index].ant = false;
      }
      console.log(this.gridData[index]);
      console.log(this.ants);
  }

  findAntAtGridIndex(index) {
    return this.ants.findIndex((ant) => {
      return ant.position === index;
    });
  }

  step() {
    console.log('step');
    this.producePheromone();
    this.moveAnts();
  }

  producePheromone() {
    this.ants.forEach((ant) => {
      if (!this.gridData[ant.position].pheromone[ant.id]) {
        this.gridData[ant.position].pheromone[ant.id] = 0;
      }
      this.gridData[ant.position].pheromone[ant.id] += 1;
      this.positions.forEach((position) => {
        const pos = ant.position + position;
        if (pos >= 0 && pos <= 10000) {
          if (!this.gridData[pos].pheromone[ant.id]) {
            this.gridData[pos].pheromone[ant.id] = 0;
          }
          this.gridData[pos].pheromone[ant.id] += 0.5;
        }
      });
    });
  }

  moveAnts() {
    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }
    this.ants.forEach((ant) => {
      let moveTo = null;
      let moveToValue = -Infinity;
      shuffle(this.positions);
      this.positions.forEach((position) => {
        const pos = ant.position + position;
        if (pos >= 0 && pos <= 10000) {
          let posValue = -Infinity;
          if (!this.gridData[pos].ant) {
            posValue = (this.gridData[pos].pheromone['total'] - 2 * this.gridData[pos].pheromone[ant.id])
          }
          if (posValue > moveToValue) {
            moveToValue = posValue;
            moveTo = pos;
          }
        }
      });
      if (moveToValue > -Infinity) {
        this.gridData[ant.position].ant = false;
        this.gridData[moveTo].ant = true;
        ant.position = moveTo;
      }
    });
  }

  getPher(cell) {
    const total = Object.keys(cell.pheromone).map((key => cell.pheromone[key])).reduce((a, b) => {
      return a + b;
    }, 0);
    cell.pheromone['total'] = total;
    return total;
  }

  // toggle(age, index) {
  //   if (this.gridData[index].ant) {
  //     this.gridData[index].ant
  //   }
  //   this.gridData[index] = age ? 0 : 1;
  // }
  //
  // step() {
  //   const oldData = this.gridData.slice();
  //   for (let i = 0, len = this.gridData.length; i < len; i++){
  //     const alive = this.checkLife(i, oldData);
  //     if (oldData[i]){
  //       if (alive){
  //         if (oldData[i] < 4){
  //           const age = oldData[i] + 1;
  //           this.gridData[i] = age;
  //         }
  //       }else{
  //         this.gridData[i] = 0;
  //       }
  //     }else{
  //       if (alive){
  //         this.gridData[i] = 1;
  //       }
  //     }
  //   }
  //   ++this.steps;
  // }
  //
  // checkLife(index, data) {
  //   let neighbors = 0;
  //   for (let j = 0, lenj = this.posistions.length; j < lenj; j++){
  //     if (data[index + this.posistions[j]]){
  //       neighbors++;
  //       if (neighbors === 4){
  //         j = lenj;
  //       }
  //     }
  //   }
  //   switch (neighbors){
  //     case 2:
  //       return data[index];
  //     case 3:
  //       return 1;
  //     default:
  //       return 0;
  //   }
  // }
  //
  run() {
    this.running = true;
    let frames = 0;
    let totalFrames = 0;
    const timeStart = new Date().getTime();
    const fpsCounter = setInterval(() => {
      totalFrames += frames;
      this.fps = frames;
      const timeNow = new Date().getTime();
      this.avgFps = (totalFrames / ((timeNow - timeStart) / 1000)).toFixed(2);
      frames = 0;
      if (!this.running) {
        clearInterval(fpsCounter);
      }
    }, 1000);
    const frame = () => {
      if (this.running) {
        frames++;
        this.step();
        setTimeout(() => {
          frame();
        }, 0);
      }
    };
    frame();
  }

  stop() {
    this.running = false;
  }

  placeRandom() {
    this.gridData.forEach((cell, index) => {
      if (Math.random() < 0.01) {
        this.gridData[index].ant = true;
        this.ants.push({position: index, id: this.antId++});
      }
    });
  }

  reset() {
    this.gridData = Array(10000).fill(0).map((i) => {return {ant: false, pheromone: {}}; });
    this.steps = 0;
    this.fps = 0;
  }

  trackByFn(i) {
    return i;
  }
}
