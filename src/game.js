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



Game = {
  grid: {
    width: 11,
    height: 11,
    tile: {
      width: 25,
      height: 25
    }
  },

  width: function() {
    return this.grid.width * this.grid.tile.width;
  },

  height: function() {
    return this.grid.height * this.grid.tile.height;
  },

  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('green');

    for(var x = 0; x < Game.grid.width; x++) {
      for(var y = 0; y < Game.grid.height; y++) {
        Crafty.e(Game.conv(initial[x].charAt(y))).at(x,y)
      }
    }
  },

  conv: function(c) {
    switch(c) {
    case 'w': return 'WhiteHunn';
    case 'b': return 'BlackHunn';
    case 'k': return 'King';
    case 'C': return 'Castle';
    default: return 'Empty';
    }
  }
}
