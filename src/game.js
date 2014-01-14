

Game = {
  board: Hnefatafl.init(),
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
    Game.update();
    
  },

  update: function() {
    for(var x = 0; x < Game.grid.width; x++) {
      for(var y = 0; y < Game.grid.height; y++) {
        var entity = Crafty.e(Game.board.get(x,y).rep()).at(x,y);
        console.log(entity);
      }
    }
  },
}
