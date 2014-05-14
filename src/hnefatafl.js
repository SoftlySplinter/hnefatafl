var canvas = null;

var tSize = 40;
var borderSize = tSize;
var iSize = tSize/10;

function Tile(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size
  this.isDirty = true;
  this.entities = new Array();
}

Tile.prototype.render = function(ctx) {
  if(!this.isDirty) {
    return;
  }

  ctx.fillStyle = '#ae9471';
  ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
  ctx.fillStyle = '#000000';

  ctx.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);

  ctx.beginPath();
  ctx.moveTo(this.x * this.size , this.y * this.size );
  ctx.lineTo(this.x * this.size , this.y * this.size  + iSize);
  ctx.lineTo(this.x * this.size  + iSize, this.y * this.size );
  ctx.fill(); 
  
  ctx.beginPath();
  ctx.moveTo(this.x * this.size + this.size , this.y * this.size );
  ctx.lineTo(this.x * this.size + this.size , this.y * this.size  + iSize);
  ctx.lineTo(this.x * this.size + this.size  - iSize, this.y * this.size );
  ctx.fill(); 
  
  ctx.beginPath();
  ctx.moveTo(this.x * this.size , this.y * this.size + this.size );
  ctx.lineTo(this.x * this.size , this.y * this.size + this.size  - iSize);
  ctx.lineTo(this.x * this.size  + iSize, this.y * this.size + this.size );
  ctx.fill(); 
  
  ctx.beginPath();
  ctx.moveTo(this.x * this.size + this.size , this.y * this.size + this.size );
  ctx.lineTo(this.x * this.size + this.size , this.y * this.size + this.size  - iSize);
  ctx.lineTo(this.x * this.size + this.size  - iSize, this.y * this.size + this.size );
  ctx.fill(); 

  this.isDirty = false;

  this.entities.forEach(function(elem) { elem.render(ctx); });
}

function Entity(x, y) {
  this.x = x;
  this.y = y;
  this.isDirty = true;
}

Entity.prototype.render = function(ctx) {
  if(!this.isDirty) {
    return;
  }
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(this.x * tSize, this.y * tSize, tSize, tSize);
  this.isDirty = false;
}

function Board() {
  this.width = 11;
  this.height = 11;
  this.tiles = new Array();
  this.ctx = canvas.getContext('2d');

  for(i = 0; i < this.width; i++) {
    for(j = 0; j < this.height; j++) {
      this.tiles[i + j * 11] = (new Tile(i, j, tSize));
    }
  }

  this.tempEntity = new Entity(0, 0);
  this.tiles[0].entities.push(this.tempEntity);

  console.log(this.tiles);
}

Board.prototype.render = function() {
  this.tiles.forEach(function(elem) { elem.render(this.ctx) }, this);

  // TODO This is just a trippy example :-)
  this.move(this.tempEntity.x, this.tempEntity.y, (this.tempEntity.x + 1) % 11,
this.tempEntity.x >= 10 ? (this.tempEntity.y + 1) % 11 : this.tempEntity.y);
}

Board.prototype.move = function(x1, y1, x2, y2) {
  from = this.tiles[x1 + y1 * 11];
  to = this.tiles[x2 + y2 * 11];
  entity = from.entities.pop();
  entity.x = x2;
  entity.y = y2;

  to.entities.push(entity);

  from.isDirty = true;
  entity.isDirty = true;
  to.isDirty = true;
}

function init() {
  canvas = document.getElementById("game");
  canvas.width = 11 * tSize;
  canvas.height = 11 * tSize;
  board = new Board();
  setInterval(function() {
    board.render();
  }, 33)
}


