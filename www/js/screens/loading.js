import * as me from './../melonjs.module.js';
import game from './../game.js';
import UIContainer from './../entities/HUD.js';

const spriteWidth = 1920;
const spriteHeight = 1080;

class LoadingScreen extends me.Stage {

        constructor(settings) {
            super();
            this.screenName = settings.name || 'loading';
        }

        onResetEvent() {

            var sprite = new me.Sprite (0,0,
                             {image:me.loader.getImage(this.screenName)} //'loading')}
                             );

            this.scaleX = (me.game.viewport.bounds.max.x - me.game.viewport.bounds.min.x) / spriteWidth;
            this.scaleY = (me.game.viewport.bounds.max.y - me.game.viewport.bounds.min.y)/ spriteHeight;
            sprite.scale(this.scaleX,this.scaleY);
            sprite.anchorPoint.set(0, 0);
            // title screen
            me.game.world.addChild(sprite, 1);
        }
};



export default LoadingScreen;


