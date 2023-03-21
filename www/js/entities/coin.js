import * as me from './../melonjs.module.js';
import game from './../game.js';

export class Decor extends me.Entity {

    constructor(x, y, settings) {
        settings.region = settings.image;
        settings.image = game.decor;
        super(x, y, settings);
        this.body.gravityScale = 0;
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    }

    // add a onResetEvent to enable object recycling
    onResetEvent() {
        // gotta do something here...
        this.setShape(this.pos.x, this.pos.y, this.width, this.height);
    }

}

export class CoinEntity extends me.Collectable {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y,
            Object.assign({
                image: game.texture,
                region : settings.image,
                shapes :[new me.Rect(0, 0, settings.framewidth || 256, settings.frameheight|| 256)] // coins are 35x35
            })
        );
    }

    // add a onResetEvent to enable object recycling
    onResetEvent(x, y, settings) {
//        this.shift(x, y);
        // only check for collision against player
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    }

    /**
     * collision handling
     */
    onCollision(/*response*/) {

        // do something when collide
        me.audio.play("cling", false);
        // give some score
        game.data.score += 250;

        //avoid further collision and delete it
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        me.game.world.removeChild(this);

        return false;
    }
};

const chestArray = ["blueChest.png","goldChest.png","redChest.png","turqChest.png","greenChest.png"];

export class ChestEntity extends me.Collectable {

    /**
     * constructor
     */
    constructor(x, y, settings) {
        // call the super constructor
        super(x, y,
            Object.assign({
                image: game.decor,
                region : "sml_chest_closed.png",
//                shapes :[new me.Rect(0, 0, settings.framewidth || 256, settings.frameheight|| 254)]
            })
        );
        this.anchorPoint.set(0, 0);
        this.opened = false;
    }

    // add a onResetEvent to enable object recycling
    onResetEvent(x, y, settings) {
//        this.shift(x, y);
        this.opened = false;
        // only check for collision against player
        this.setRegion(game.decor.getRegion("sml_chest_closed.png"));
        this.anchorPoint.set(0, 0);
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    }

    /**
     * collision handling
     */
    onCollision(/*response*/) {
        if (!this.opened) {
            // do something when collide
            me.audio.play("cling", false);
            // give some score
            game.data.score += 250;

            //avoid further collision and delete it
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            this.opened = true;
            var egg = Math.floor(Math.random()*5);

            this.setRegion(game.decor.getRegion(chestArray[egg]));
            this.anchorPoint.set(0, 0);

            //me.game.world.removeChild(this);
        }
        return false;
    }

    onResetEvent(x, y, settings) {
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    }

};
