import * as me from './../melonjs.module.js';
import game from './../game.js';
/**
 * a basic control to toggle fullscreen on/off
 */
class FSControl extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: game.texture,
            region : "shadedDark30.png"
        });
        this.setOpacity(0.75);
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.75);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (!me.device.isFullscreen()) {
            me.device.requestFullscreen();
        } else {
            me.device.exitFullscreen();
        }
        return false;
    }
};

/**
 * a basic control to toggle fullscreen on/off
 */
class AudioControl extends me.UISpriteElement {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: game.texture,
            region : "shadedDark13.png" // ON by default
        });
        this.setOpacity(0.75);
        this.isMute = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.75);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (this.isMute) {
            me.audio.unmuteAll();
            this.setRegion(game.texture.getRegion("shadedDark13.png"));
            this.isMute = false;
        } else {
            me.audio.muteAll();
            this.setRegion(game.texture.getRegion("shadedDark15.png"));
            this.isMute = true;
        }
        return false;
    }
};


class Heart extends me.Sprite {
    constructor(settings) {
        settings.image = settings.image || game.texture;
        settings.region = "4.png";
        settings.frameheight  = settings.frameheight || 64;
        settings.framewidth = settings.framewidth || 64;
        super(273+(settings.position*64), 112, settings);
        this.position = settings.position;
        this.quarter = 4;
        //this.shapes = [new me.Rect(0, 0, settings.framewidth || 64, settings.frameheight|| 64)] // coins are 35x35
    }

    update( dt) {
      game.data.health = game.data.health || 16;
      if (game.data.health >= (this.position*4)) {
          if (this.quarter != 4) {
            this.setRegion(game.texture.getRegion('4.png'));
            this.quarter = 4;
            this.isDirty = true;
          }
      } else
      if (game.data.health <= ((this.position-1)*4)) {
          if (this.quarter != 0) {
              this.setRegion(game.texture.getRegion('0.png'));
              this.quarter = 0;
              this.isDirty = true;
          }
      } else
      if ((game.data.health+4) % (this.position*4) == 3) {
          if (this.quarter != 3) {
                this.setRegion(game.texture.getRegion('3.png'));
                this.quarter = 3;
                this.isDirty = true;
          }
        } else
        if ((game.data.health+4) % (this.position*4) == 2) {
          if (this.quarter != 2) {
                this.setRegion(game.texture.getRegion('2.png'));
                this.quarter = 2;
                this.isDirty = true;
          }
        } else
        if ((game.data.health+4) % (this.position*4) == 1) {
          if (this.quarter != 1) {
            this.setRegion(game.texture.getRegion('1.png'));
            this.quarter = 1;
            this.isDirty = true;
          }
        }
      }
}

/**
 * a basic HUD item to display score
 */
class ScoreItem extends me.BitmapText {
    /**
     * constructor
     */
    constructor(x, y) {
        // call the super constructor
        super(
            x,
            y,
            {
                font : "Dimbo",
                size: 4,
                fillStyle: "purple",//new me.Color(230,230,250),
                textAlign : "right",
                textBaseline : "bottom",
                text : "0"
            }
        );

        this.relative = new me.Vector2d(me.game.viewport.width-x, me.game.viewport.height-y);

        // local copy of the global score
        this.score = -1;

        // recalculate the object position if the canvas is resize
        me.event.on(me.event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(Math.min(4000,w - 300), 200);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            this.setText(this.score);
            this.isDirty = true;
        }
        return super.update(dt);
    }
};

/**
 * a HUD container and child items
 */
class UIContainer extends me.Container {

    constructor() {
        // call the constructor
        super();

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        var scoreBox = new ScoreItem(Math.min(4000,me.game.viewport.width - 300), 200);
        this.addChild(scoreBox);  // me.game.viewport.width - 300  // me.game.viewport.width*0.95

        // add our audio control object
        this.addChild(new AudioControl(72, 112));

        if (!me.device.isMobile) {
            // add our fullscreen control object
            this.addChild(new FSControl(72 + 10 + 96, 112));
        }
        //this.addChild(new HealthContainer());
        for (var x=1; x<=4; x++) {
            this.addChild(new Heart({position: x, quarter : 0 }))
        }
    }
};

export default UIContainer;
