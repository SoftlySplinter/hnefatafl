// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.grid.tile.width,
      h: Game.grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.grid.tile.width, y: this.y/Game.grid.tile.height }
    } else {
      this.attr({ x: x * Game.grid.tile.width, y: y * Game.grid.tile.height });
      return this;
    }
  }
});
 
// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
  init: function() {
    this.requires('2D, Canvas, Grid');
  },
});

Crafty.c('BlackHunn', {
  init: function() {
    this.requires('Actor, Color').color('rgb(0,0,0)');
  }
});

Crafty.c('WhiteHunn', {
  init: function() {
    this.requires('Actor, Color').color('rgb(255,255,255)');
  }
});

Crafty.c('King', {
  init: function() {
    this.requires('Actor, Color').color('rgb(200,200,200)')
  }
});

Crafty.c('Castle', {
  init: function() {
    this.requires('Actor, Color').color('rgb(200,200,200)')
  }
});

Crafty.c('Empty', {
  init: function() {
    this.requires('Actor')
  }
});
