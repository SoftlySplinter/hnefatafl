var canvas = null;

var tSize = 40;
var iSize = tSize/10;

var defaultB = 
[
'c', ' ', ' ', 'b', 'b', 'b', 'b', 'b', ' ', ' ', 'c',
' ', ' ', ' ', ' ', ' ', 'b', ' ', ' ', ' ', ' ', ' ',
' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
'b', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', 'b',
'b', ' ', ' ', ' ', 'w', 'w', 'w', ' ', ' ', ' ', 'b',
'b', 'b', ' ', 'w', 'w', 'W', 'w', 'w', ' ', 'b', 'b',
'b', ' ', ' ', ' ', 'w', 'w', 'w', ' ', ' ', ' ', 'b',
'b', ' ', ' ', ' ', ' ', 'w', ' ', ' ', ' ', ' ', 'b',
' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
' ', ' ', ' ', ' ', ' ', 'b', ' ', ' ', ' ', ' ', ' ',
'c', ' ', ' ', 'b', 'b', 'b', 'b', 'b', ' ', ' ', 'c'
]

var board;

function Tile(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size
  this.isDirty = true;
  this.entities = new Array();
  this.overlay = 'rgba(0, 0, 0, 0)';
}

Tile.prototype.empty = function() {
  return this.entities.length == 0;
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

  ctx.fillStyle = this.overlay;
  ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
}

Tile.prototype.dirty = function() {
  this.isDirty = true;
  this.entities.forEach(function(elem) { elem.isDirty = true; });
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
  this.doRender(ctx);
  this.isDirty = false;
}

Entity.prototype.doRender = function(ctx) {
  console.error("Should be implemented by subclasses");
}

function Hunn(x, y, colour) {
  Entity.call(this, x, y);
  this.colour = colour;
}

Entity.prototype.validMoves = function(ctx) {
  return new Array();
}

Hunn.prototype = new Entity();
Hunn.prototype.constructor = Hunn;

Hunn.prototype.doRender = function(ctx) {
  switch(this.colour) {
  case 'w':
    ctx.fillStyle = 'rgb(255, 255, 255)';
    break;
  case 'b':
    ctx.fillStyle = 'rgb(0, 0, 0)';
    break;
  default:
    ctx.fillStyle = 'rgba(0, 0, 0, 255)'
  }
  ctx.fillRect(this.x * tSize + (tSize * 3 / 8), this.y * tSize + (tSize * 3 / 8), tSize / 4, tSize / 4);
}


Hunn.prototype.validMoves = function() {
  connected = function(tile, entity) {
    sX = Math.min(tile.x, entity.x + 1);
    eX = Math.max(tile.x, entity.x - 1);
    sY = Math.min(tile.y, entity.y + 1);
    eY = Math.max(tile.y, entity.y - 1);
    return board.tiles.filter(function(elem) { 
      return elem.x >= sX && elem.x <= eX && elem.y >= sY && elem.y <= eY; 
    }).every(function(elem) { return elem.empty() });
  }

  return board.tiles.filter(function(tile) {
    return (tile.x == this.x || tile.y == this.y) && connected(tile, this);
  }, this);
}

function King(x, y) {
  Hunn.call(this, x, y, 'w');
}

King.prototype = new Hunn();
King.prototype.constructor = King;

King.prototype.doRender = function(ctx) {
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(this.x * tSize + (tSize / 4), this.y * tSize + (tSize / 4), tSize / 2, tSize / 2);
}

function Castle(x, y) {
  Entity.call(this, x, y);
}

Castle.prototype = new Entity();
Castle.prototype.constructor = Castle;

Castle.prototype.doRender = function(ctx) {
  ctx.fillStyle = 'rgb(100, 100, 100)';
  ctx.fillRect(this.x * tSize + (tSize / 4), this.y * tSize + (tSize / 4), tSize / 2, tSize / 2);
}

function Board() {
  this.width = 11;
  this.height = 11;
  this.tiles = new Array();
  this.ctx = canvas.getContext('2d');
  this.selected = null;
  this.prevSelected = null;

  for(i = 0; i < this.width; i++) {
    for(j = 0; j < this.height; j++) {
      this.tiles[i + j * 11] = (new Tile(i, j, tSize));
      entity = null;
      switch(defaultB[i + j * 11]) {
      case 'w': // Fallthrough intended.
      case 'b':
        entity = new Hunn(i, j, defaultB[i + j * 11]);
        break;
      case 'W':
        entity = new King(i, j);
        break;
      case 'c':
        entity = new Castle(i, j);
        break;
      default:
        break;
      }

      if(entity != null) {
        this.tiles[i + j * 11].entities.push(entity);
      }
    }
  }
}

Board.prototype.tileAt = function(x, y) {
  return this.tiles[x + y * 11];
}

Board.prototype.render = function() {
  if(this.selected != this.prevSelected) {
    toHighlight = this.tiles;
    if(this.selected != null) {
      toHighlight = this.selected.entities[0].validMoves();
      toHighlight.push(this.selected);
    }
    this.prevSelected = this.selected;
    this.highlight(toHighlight);
  }

  this.tiles.forEach(function(elem) { elem.render(this.ctx) }, this);
}

Board.prototype.highlight = function(highlight) {
  this.tiles.forEach(function(tile) {
    if(highlight.indexOf(tile) != -1) {
      tile.overlay = 'rgba(0, 0, 0, 0.0)';
    } else {
      tile.overlay = 'rgba(0, 0, 0, 0.4)';
    }
    tile.dirty();
  }); 
}

Board.prototype.dirty = function() {
  this.tiles.forEach(function(tile) { tile.dirty() });
}

Board.prototype.control = function(e) {
  dim = canvas.getBoundingClientRect();
  x = Math.floor((e.x - dim.left) / tSize);
  y = Math.floor((e.y - dim.top) / tSize);

  this.select(x, y);
}

Board.prototype.select = function(x, y) {
  if(this.selected == null) {
    if(!this.tileAt(x, y).empty()) {
      this.selected = this.tileAt(x, y);
    }
    this.dirty();
    return;
  }

  if(this.selected.x == x && this.selected.y == y) {
    this.selected = null;
    return;
  }

  moves = this.selected.entities[0].validMoves();
  if(moves.some(function(elem) { return elem.x == x && elem.y == y; })) {
    this.move(this.selected.x, this.selected.y, x, y);
  }
  this.selected = null;
}

Board.prototype.move = function(x1, y1, x2, y2) {
  from = this.tileAt(x1, y1);
  to = this.tileAt(x2, y2);
  entity = from.entities.pop();

  if(entity == undefined) return;

  if(entity.validMoves().some(function(elem) {
    return elem.x == x2 && elem.y == y2;
  })) {
    entity.x = x2;
    entity.y = y2;

    to.entities.push(entity);

    from.isDirty = true;
    entity.isDirty = true;
    to.isDirty = true;
  } else {
    from.entities.push(entity);
  }
}


function init() {
  canvas = document.getElementById("game");
  tSize = Math.min((window.innerWidth - 10) / 11, (window.innerHeight - 10) / 11);
  iSize = tSize / 10;
  canvas.width = 11 * tSize;
  canvas.height = 11 * tSize;
  board = new Board();
  setInterval(function() { board.render() }, 33);

  canvas.addEventListener('click', function(e) {
    board.control(e);
  }, false);
}


