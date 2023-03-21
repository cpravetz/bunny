import * as me from './../melonjs.module.js';
import game from './../game.js';

/**
 * An enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
class PathEnemyEntity extends me.Entity {
    /**
     * constructor
     */
    constructor(x, y, settings) {

        // save the area size defined in Tiled
        var width = settings.width || settings.framewidth || 256;

        // adjust the setting size to the sprite one
        settings.width = settings.framewidth || 256;
        settings.height = settings.frameheight || 256;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the super constructor
        super(x, y, settings);

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.endX   = x + width - settings.framewidth;
        this.pos.x  = x + width - settings.framewidth;

        // enemies are not impacted by gravity
        this.body.gravityScale = 0;

        this.walkLeft = false;

        // body walking & flying speed
        this.body.setMaxVelocity(settings.velX || 1, settings.velY || 0);

        // set a "enemyObject" type
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        // only check for collision against player and world shape
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT | me.collision.types.WORLD_SHAPE);

        // don't update the entities when out of the viewport
        this.alwaysUpdate = false;

        // a specific flag to recognize these enemies
        this.isMovingEnemy = true;

        // default tint for particles
        this.particleTint = "#FFF";
    }


    /**
     * manage the enemy movement
     */
    update(dt) {

        if (this.alive) {
            if (this.walkLeft === true)
                if (this.pos.x <= this.startX) {
                    // if reach start position
                    this.walkLeft = false;
                    this.renderable.flipX(false);
                } else {
                    this.body.force.x = -this.body.maxVel.x;
                }
            }

        if (this.walkLeft === false) {
            if (this.pos.x >= this.endX) {
                // if reach the end position
                this.walkLeft = true;
                this.renderable.flipX(true);
            } else {
                this.body.force.x = this.body.maxVel.x;
            }
        }

        // return true if we moved of if flickering
        return super.update(dt);
    }

    /**
     * collision handle
     */
    onCollision(response) {
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
            // make it dead
            this.alive = false;
            //avoid further collision and delete it
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            // make the body static
            this.body.setStatic(true);
            // set dead animation
            this.renderable.setCurrentAnimation("dead");

            var emitter = new me.ParticleEmitter(this.centerX, this.centerY, {
                width: this.width / 4,
                height : this.height / 4,
                tint: this.particleTint,
                totalParticles: 32,
                angle: 0,
                angleVariation: 6.283185307179586,
                maxLife: 5,
                speed: 3
            });

            me.game.world.addChild(emitter,this.pos.z);
            me.game.world.removeChild(this);
            emitter.burstParticles();

            // dead sfx
            me.audio.play("enemykill", false);
            // give some score
            game.data.score += 150;
        }
        return false;
    }
};

/**
 * A Walking enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
export class WalkingEnemyEntity extends PathEnemyEntity {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // super constructor
        super(x, y, settings);

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "bite/bite00.png", "bite/bite01.png", "bite/bite02.png",
            "bite/bite03.png", "bite/bite04.png", "bite/bite05.png",
            "bite/bite06.png", "bite/bite07.png", "bite/bite08.png",
            "bite/bite09.png", "bite/bite10.png", "bite/bite11.png",
            "die/snake_die00.png", "die/snake_die01.png", "die/snake_die02.png", "die/snake_die03.png",
            "slither/slither00.png", "slither/slither01.png", "slither/slither02.png",
            "slither/slither03.png", "slither/slither04.png", "slither/slither05.png",
            "slither/slither06.png", "slither/slither07.png", "slither/slither08.png",
            "slither/slither09.png", "slither/slither10.png", "slither/slither11.png"
        ]);

        // custom animation speed ?
        if (settings.animationspeed) {
            this.renderable.animationspeed = settings.animationspeed;
        }

        // walking animatin
        this.renderable.addAnimation ("walk", ["slither/slither00.png", "slither/slither01.png","slither/slither02.png",
                                              "slither/slither03.png", "slither/slither04.png", "slither/slither05.png",
                                              "slither/slither06.png", "slither/slither07.png", "slither/slither08.png",
                                              "slither/slither09.png", "slither/slither10.png", "slither/slither11.png"]);
        //attack
        this.renderable.addAnimation ("bite", ["bite/bite00.png", "bite/bite01.png","bite/bite02.png",
                                              "bite/bite03.png", "bite/bite04.png", "bite/bite05.png",
                                              "bite/bite06.png", "bite/bite07.png", "bite/bite08.png",
                                              "bite/bite09.png", "bite/bite10.png", "bite/bite11.png"]);
        // dead animation
        this.renderable.addAnimation ("dead", ["die/snake_die00.png", "die/snake_die01.png", "die/snake_die02.png", "die/snake_die03.png"]);  //TODO Need a dead Walking image

        // set default one
        this.renderable.setCurrentAnimation("walk");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.25);

        // particle tint matching the sprite color
        this.particleTint = "#FF35B8";

    }
};

/**
 * A Flying enemy entity
 * follow a horizontal path defined by the box size in Tiled
 */
export class FlyingEnemyEntity extends PathEnemyEntity {
    /**
     * constructor
     */
    constructor(x, y, settings) {
        // super constructor
        super(x, y, settings);

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "flap_wings_000.png", "flap_wings_001.png", "flap_wings_002.png",
            "flap_wings_003.png", "flap_wings_004.png", "flap_wings_005.png",
            "flap_wings_006.png", "flap_wings_007.png", "flap_wings_008.png",
            "flap_wings_009.png", 
            "rotate_head_000.png", "rotate_head_001.png", "rotate_head_002.png",
            "rotate_head_003.png", "rotate_head_004.png", "rotate_head_005.png",
            "rotate_head_006.png", "rotate_head_007.png", "rotate_head_008.png",
            "rotate_head_009.png"
        ]);

        // custom animation speed ?
        if (settings.animationspeed) {
            this.renderable.animationspeed = settings.animationspeed;
        }

        // walking animation
        this.renderable.addAnimation ("walk", [
            "flap_wings_000.png", "flap_wings_001.png", "flap_wings_002.png",
            "flap_wings_003.png", "flap_wings_004.png", "flap_wings_005.png",
            "flap_wings_006.png", "flap_wings_007.png", "flap_wings_008.png",
            "flap_wings_009.png",
        ]);
        // dead animation
        this.renderable.addAnimation ("dead", [
            "rotate_head_000.png", "rotate_head_001.png", "rotate_head_002.png",
            "rotate_head_003.png", "rotate_head_004.png", "rotate_head_005.png",
            "rotate_head_006.png", "rotate_head_007.png", "rotate_head_008.png",
            "rotate_head_009.png"
        ]);  //TODO Need melted Flying

        // set default one
        this.renderable.setCurrentAnimation("walk");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);

        // particle tint matching the sprite color
        this.particleTint = "#000000";

    }
};


//Add a Trigger that will show ads if we are running cordova
export class AdTrigger extends me.Trigger {
    
    constructor(x, y, settings) {
        super(x, y, settings);
	}
	
	triggerEvent() {
        game.data.previousScore = game.data.score || 0;
        var triggerSettings = this.getTriggerSettings();

        if (window.cktadmob) {
            if (window.cktadmob.readyToShow()) {
                window.cktadmob.ShowAnAd(()=> { level.load(triggerSettings.to, triggerSettings)});
            } else {
                if (window.cktadmob.adStatus != 'requested') {
                    window.cktadmob.GetAnAdReady();
                }
            }
        };

        if (triggerSettings.event === "level") {
            this.gotolevel = triggerSettings.to;
            // load a level
            //console.log("going to : ", to);
            if (this.fade && this.duration) {
                if (!this.fading) {
                    this.fading = true;
                    me.game.viewport.fadeIn(this.fade, this.duration,
                            this.onFadeComplete.bind(this));
                }
            } else {
                level.load(this.gotolevel, triggerSettings);
            }
        } else {
            throw new Error("Trigger invalid type");
        }
    }

    onResetEvent(args) {
        super.onResetEvent(args);
    }
};

    me.pool.register("me.AdTrigger", AdTrigger);
