class Button extends EventEmitter{
  click(){
    console.log('Button clicked');
    this.emit('click');
  }
  mouseover(){
    console.log('Mouse over button');
    this.emit('mouseover');
  }
  
}