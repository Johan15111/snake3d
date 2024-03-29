class Snake {
    constructor(x, y, size) {
        this.body = [];
        this.size = size || 10;
        this.spacing = 3;
        this.xdir = 0;
        this.ydir = 0;
        this.slowness = 13;
        this.allowMoving = true;

        // Snap to grid
        x = round(x / (this.size+this.spacing)) * (this.size+this.spacing);
        y = round(y / (this.size+this.spacing)) * (this.size+this.spacing);

        this.body.push(createVector(x, y, 0));
    }

    moveLeft() {
        this.xdir = -1;
        this.ydir = 0;
    }

    moveRight() {
        this.xdir = 1;
        this.ydir = 0;
    }

    moveUp() {
        this.ydir = -1;
        this.xdir = 0;
    }
    
    moveDown() {
        this.ydir = 1;
        this.xdir = 0;
    }

    length() {
        return this.body.length;
    }

    grow() {
        let head = this.getHead()
        this.body.push(createVector(
            head.x + (this.size * this.xdir) + (this.spacing * this.xdir), 
            head.y + (this.size * this.ydir) + (this.spacing * this.ydir),
            0));

        this.slowness = constrain(this.slowness-0.5, 1, this.slowness);
    }

    isEating(food) {
        let dist = this.getDistance(this.getHead(), food.x, food.y, food.size);
        return dist <= this.size*0.5;
    }

    isInBody(x, y, size) {
        
        for(let i=0; i<this.body.length-2; i++) {
            let dist = this.getDistance(this.body[i], x, y, size);
            if(dist <= this.size*0.5) {
                return true;
            }
        }
        return false;
    }

    move() {
        let head = this.getHead();
        this.body.push(createVector(
            head.x + (this.size * this.xdir) + (this.spacing * this.xdir), 
            head.y + (this.size * this.ydir) + (this.spacing * this.ydir),
            0
        ));
        this.body.shift();
    }

    getHead() {
        return this.body[this.body.length - 1];
    }

    getTail() {
        return this.body[0];
    }

    getDistance(element, x, y, size) {
        return abs((element.x + this.size)/2 - (x+size)/2) + abs((element.y + this.size)/2 - (y+size)/2);
    }

    stop() {
        this.allowMoving = false;
    }

    update() {
        if(this.allowMoving && (frameCount % floor(this.slowness)) == 0) {
            this.move();
        }
    }

    render() {
        noStroke();
        ambientLight(100);
      
        // Renderizar la cabeza en color rojo
        let head = this.getHead();
        push();
        translate(head.x, head.y, this.size / 2);
        ambientMaterial(253, 86, 106); // Color rojo
        box(this.size);
        pop();
      
        // Renderizar el resto del cuerpo en color negro
        ambientMaterial(0); // Color negro
        for (let i = 0; i < this.body.length - 1; i++) {
          let bodyPart = this.body[i];
          push();
          translate(bodyPart.x, bodyPart.y, this.size / 2);
          box(this.size);
          pop();
        }
    }

}