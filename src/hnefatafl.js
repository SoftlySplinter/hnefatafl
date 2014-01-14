var initial = ["C  bbbbb  C", 
               "     b     ",
               "           ",
               "b    w    b",
               "b   www   b",
               "bb wwkww bb",
               "b   www   b",
               "b    w    b",
               "           ",
               "     b     ",
               "C  bbbbb  C"]

function Piece(x, y) {
  this.x = x;
  this.y = y;
}

Piece.prototype.rep = function() {
  return "Empty";
};

Piece.prototype.legal_moves = function() {
  legal = [];
  for(var x = this.x + 1; x < Hnefatafl.w; x++) {
    if(Hnefatafl.get(x, this.y).rep() !== 'Empty') break;
    legal.push({x: x, y: this.y});
  }
  for(var x = this.x - 1; x >= 0; x--) {
    if(Hnefatafl.get(x, this.y).rep() !== 'Empty') break;
    legal.push({x: x, y: this.y});
  }
  for(var y = this.y + 1; x < Hnefatafl.h; y++) {
    if(Hnefatafl.get(this.x, y).rep() !== 'Empty') break;
    legal.push({x: this.x, y: y});
  }
  for(var y = this.y - 1; y >= 0; y--) {
    if(Hnefatafl.get(this.x, y).rep() !== 'Empty') break;
    legal.push({x: this.x, y: y});
  }
  return legal;
};

function Hunn(colour, x, y) {
  this.colour = colour;
  Piece.call(this, x, y);
}

Hunn.prototype = new Piece(null, null);
Hunn.prototype.constructor = Hunn;
Hunn.prototype.rep = function() {
  if(this.colour === 'w') return 'WhiteHunn';
  if(this.colour === 'b') return 'BlackHunn';
  return 'Empty';
}

function King(x, y) {
  this.colour = 'w';
  Piece.call(this, x, y);
}

King.prototype = new Piece(null, null);
King.prototype.constructor = King;
King.prototype.rep = function() {
  return 'King';
}

Hnefatafl = {
  board: [],
  w: 11,
  h: 11,

  init: function() {
    for(var x = 0; x < this.w; x++) {
      var row = []
      for(var y = 0; y < this.h; y++) {
        var piece = initial[x].charAt(y);
        row.push(this.create(piece, x, y));
      }
      this.board.push(row);
    }
    return this;
  },

  create: function(piece, x, y) {
    switch(piece) {
    case 'w':
    case 'b':
      return new Hunn(piece, x, y);
    case 'k':
      return new King(x, y);
    default:
      return null;
    }
  },

  get: function(x, y) {
    var piece = this.board[x][y];
    if(piece == null) piece = new Piece(x,y);
    return piece;
  }

  
};
