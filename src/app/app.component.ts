import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  gridData = Array(10000).fill(0).map(i => 0);

  running = false;
  steps = 0;
  fps = 0;
  avgFps: any = 0;
  posistions = [-101,-100,-99,-1,1,99,100,101];

  constructor() {
  }

  toggle(age, index) {
    this.gridData[index] = age?0:1;
  }

  step() {
    let oldData = this.gridData.slice();
    for(let i = 0,len = this.gridData.length;i < len;i++){
      let alive = this.checkLife(i,oldData);
      if(oldData[i]){
        if(alive){
          if(oldData[i] < 4){
            var age = oldData[i] + 1;
            this.gridData[i] = age;
          }
        }else{
          this.gridData[i] = 0;
        }
      }else{
        if(alive){
          this.gridData[i] = 1;
        }
      }
    }
    ++this.steps;
  }

  checkLife(index,data) {
    let neighbors = 0;
    for(let j = 0, lenj = this.posistions.length; j < lenj; j++){
      if(data[index + this.posistions[j]]){
        neighbors++;
        if(neighbors === 4){
          j = lenj;
        }
      }
    }
    switch(neighbors){
      case 2:
        return data[index];
      case 3:
        return 1;
      default:
        return 0;
    }
  }

  run(){
    this.running = true;
    let frames = 0;
    let totalFrames = 0;
    let timeStart = new Date().getTime();

    let fpsCounter = setInterval(() => {
      totalFrames += frames;
      this.fps = frames;
      let timeNow = new Date().getTime();
      this.avgFps = (totalFrames/((timeNow - timeStart)/1000)).toFixed(2);
      frames = 0;
      if(!this.running){
        clearInterval(fpsCounter);
      }
    },1000);
    const frame = () => {
      if(this.running){
        frames++;
        this.step();
        setTimeout(() => {
          frame();
        },0);
      }
    }
    frame();
  }

  stop(){
    this.running = false;
  }

  placeRandom(){
    this.gridData.forEach((cell,index) => {
      if(Math.random() < 0.2){
        this.gridData[index] = 1;
      }
    });
  }

  reset(){
    this.gridData = Array(10000).fill(0).map(i => 0);
    this.steps = 0;
    this.fps = 0;
  }

  trackByFn(i) {
    return i;
  }
}
