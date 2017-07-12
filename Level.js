function Level (){
  this.sprites = [];
  this.shots = [];
  this.builds = [];
  this.inimigos = 3;
  this.builds_n = 4;
  this.score = 0;
}

Level.prototype.init = function () {
  for (var i = 0; i < this.inimigos; i++) {
    var inimigo = new Sprite();
    inimigo.x = Math.floor((Math.random() * 500) + 120);
    inimigo.y = -19;
    inimigo.width = 32;
    inimigo.height = 32;
    inimigo.radius = 12;
    inimigo.angle = -90;
    var dir = parseInt((Math.random()*100)+1);
    console.log(dir);
    if(dir % 2  == 0) {
      console.log("par");
      dir = 1;
    }
    else {
      dir = -1;
      console.log("impar");
    }
    inimigo.angle = inimigo.angle + dir*((Math.random()*30)+1);
    inimigo.am = -10;
    inimigo.imgkey = "enemy";
    this.sprites.push(inimigo);
  }

 for (var i = 0; i < this.builds_n; i++) {

    var build = new Sprite();
    build.x = 80+150*(i);
    build.y = 370;
    build.width = 104;
    build.angle = -90;
    build.height = 96;
    build.am = 00;
    build.imgkey = "build";
    this.builds.push(build);
 }
};

Level.prototype.mover = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].mover(dt);
    }
    for (var i = this.shots.length-1;i>=0; i--) {
      this.shots[i].mover(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }
};

Level.prototype.moverAng = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].moverAng(dt);
    }
    for (var i = this.shots.length-1; i >= 0; i--) {
      this.shots[i].moverAng(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }
};

Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }
    for (var i = 0; i < this.builds.length; i++) {
      this.shots[i].desenhar(ctx);
    }

};
Level.prototype.desenharImg = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenharImg(ctx, this.imageLib.images[this.sprites[i].imgkey]);
    }

    for (var i = 0; i < this.builds.length; i++) {
      this.builds[i].desenharImg(ctx, this.imageLib.images[this.builds[i].imgkey]);
    }

    for (var i = 0; i < this.shots.length; i++) {
      this.shots[i].desenharImg(ctx, this.imageLib.images[this.shots[i].imgkey]);
    }
};

Level.prototype.colidiuCom = function (alvo, resolveColisao) {
    for (var i = 0; i < this.sprites.length; i++) {
      if(this.sprites[i].colidiuCom(alvo)){
        resolveColisao(this.sprites[i], alvo);
      }
    }
};

Level.prototype.perseguir = function (alvo, dt) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].perseguir(alvo,dt);
  }
};

Level.prototype.fire = function (alvo, audiolib, key, vol){
  if(alvo.cooldown>0) return;
  var tiro = new Sprite();
  tiro.x = alvo.x;
  tiro.y = alvo.y;
  tiro.angle = alvo.angle;
  tiro.am = 120;
  tiro.width = 13;
  tiro.height = 13;
  tiro.imgkey = "shot";
  this.shots.push(tiro);
  alvo.cooldown = 1;
  if(audiolib && key) audiolib.play(key,vol);
}

Level.prototype.resetEnemy = function(key) {

    this.sprites[key].x = Math.floor((Math.random() * 500) + 120);
    this.sprites[key].y = -19;
    this.sprites[key].vx = 0;
    this.sprites[key].vy = 0;
    this.sprites[key].angle = -90;
    var dir = parseInt((Math.random()*100)+1);
    if(dir % 2  == 0) {
      dir = 1;
    }
    else {
      dir = -1;
    }
    this.sprites[key].angle = this.sprites[key].angle + dir*((Math.random()*30)+1);
    this.sprites[key].am = -10;  
}

Level.prototype.colidiuComTiros = function(al, key){
  for(var i = this.shots.length-1; i>=0; i--){

    this.colidiuCom(this.shots[i],
      (
        function(that)
        {
          return function(alvo){
            alvo.color = "green";
            that.shots.splice(i,1);
            x = that.sprites.indexOf(alvo);
            that.sprites[x].x = Math.floor((Math.random() * 500) + 120);
            that.sprites[x].y = -19;
            that.sprites[x].vx = 0;
            that.sprites[x].vy = 0;
            that.sprites[x].angle = -90;
            that.score = that.score + 1;
            var dir = parseInt((Math.random()*100)+1);
            if(dir % 2  == 0) {
              dir = 1;
            }
            else {
              dir = -1;
            }
            that.sprites[x].angle = that.sprites[x].angle + dir*((Math.random()*30)+1);
            that.sprites[x].am = -10;  
            if(al&&key) al.play(key);
          }
        }
      )(this));
  }
}


//
