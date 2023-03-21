import * as me from './../melonjs.module.js';
import game from './../game.js';

class PlayerEntity extends me.Entity {
    constructor(x, y, settings) {
        // call the constructor
        super(x, y , settings);

        // set a "player object" type
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.body.gravityScale = 0.4;

        // player can exit the viewport (jumping, falling into a hole, etc.)
        this.alwaysUpdate = true;

        // walking & jumping speed
        this.body.setMaxVelocity(6, 25);
        this.body.setFriction(0.4, 0);
//        this.body.force = new me.Vector2d(0,0);
        this.dying = false;

        this.multipleJump = 1;

        // set the viewport to follow this renderable on both axis, and enable damping
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH, 0.1);

        // enable keyboard
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.X,     "jump", true);
        me.input.bindKey(me.input.KEY.UP,    "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.DOWN,  "down");

        me.input.bindKey(me.input.KEY.A,     "left");
        me.input.bindKey(me.input.KEY.D,     "right");
        me.input.bindKey(me.input.KEY.W,     "jump", true);
        me.input.bindKey(me.input.KEY.S,     "down");

        //me.input.registerPointerEvent("pointerdown", this, this.onCollision.bind(this));
        //me.input.bindPointer(me.input.pointer.RIGHT, me.input.KEY.LEFT);

        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_1}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_2}, me.input.KEY.UP);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.DOWN}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_3}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.FACE_4}, me.input.KEY.DOWN);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.LEFT}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type: "buttons", code: me.input.GAMEPAD.BUTTONS.RIGHT}, me.input.KEY.RIGHT);

        // map axes
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: -0.5}, me.input.KEY.LEFT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LX, threshold: 0.5}, me.input.KEY.RIGHT);
        me.input.bindGamepad(0, {type:"axes", code: me.input.GAMEPAD.AXES.LY, threshold: -0.5}, me.input.KEY.UP);

        // set a renderable
        this.renderable = game.texture.createAnimationFromName([
            "die/die00.png", "die/die01.png", "die/die02.png",
            "die/die03.png", "die/die04.png", "die/die05.png",
            "die/die06.png", "die/die07.png", "die/die08.png",
            "die/die09.png", 
            "idle/idle00.png", "idle/idle01.png",
            "idle/idle02.png", "idle/idle03.png", "idle/idle04.png",
            "idle/idle05.png", "idle/idle06.png", "idle/idle07.png",
            "idle/idle08.png", "idle/idle09.png", "idle/idle10.png",
            "idle/idle11.png", "idle/idle12.png", "idle/idle13.png",
            "idle/idle14.png", "idle/idle15.png", "idle/idle16.png",
            "idle/idle17.png", "idle/idle18.png", "idle/idle19.png",
            "idle/idle20.png", "idle/idle21.png", "idle/idle22.png",
            "idle/idle23.png", "idle/idle24.png", 
            "jump/jump00.png", "jump/jump01.png",
            "jump/jump02.png", "jump/jump03.png", "jump/jump04.png",
            "jump/jump05.png", "jump/jump06.png", "jump/jump07.png",
            "jump/jump08.png", "jump/jump09.png", "jump/jump10.png",
            "jump/jump11.png", "jump/jump12.png", "jump/jump13.png",
            "jump/jump14.png", 
            "run/run00.png", "run/run01.png",
            "run/run02.png", "run/run03.png", "run/run04.png",
            "run/run05.png", "run/run06.png", "run/run07.png",
            "run/run08.png", "run/run09.png", "run/run10.png",
            "run/run11.png", "run/run12.png", "run/run13.png",
            "run/run14.png", 
            "thump/thump00.png", "thump/thump01.png",
            "thump/thump02.png", "thump/thump03.png", "thump/thump04.png",
            "thump/thump05.png", "thump/thump06.png", "thump/thump07.png",
            "thump/thump08.png", "thump/thump09.png", "thump/thump10.png",
            "thump/thump11.png", "thump/thump12.png", "thump/thump13.png",
            "thump/thump14.png", 
            "walk/walk00.png", "walk/walk01.png",
            "walk/walk02.png", "walk/walk03.png", "walk/walk04.png",
            "walk/walk05.png", "walk/walk06.png", "walk/walk07.png",
            "walk/walk08.png", "walk/walk09.png", "walk/walk10.png",
            "walk/walk11.png", "walk/walk12.png", "walk/walk13.png",
            "walk/walk14.png"
            
        ]);

        //define a die an1mation
        this.renderable.addAnimation ("die",  [{ name: "die/die00.png", delay: 50 },
                                                { name: "die/die01.png", delay: 50 },
                                                { name: "die/die02.png", delay: 50 },
                                                { name: "die/die03.png", delay: 50 },
                                                { name: "die/die04.png", delay: 50 },
                                                { name: "die/die05.png", delay: 50 },
                                                { name: "die/die06.png", delay: 50 },
                                                { name: "die/die07.png", delay: 50 },
                                                { name: "die/die08.png", delay: 50 },
                                                { name: "die/die09.png", delay: 50 }]);

        //define an idle an1mation
        this.renderable.addAnimation ("idle",  [{ name: "idle/idle00.png", delay: 50 },
                                                { name: "idle/idle01.png", delay: 50 },
                                                { name: "idle/idle02.png", delay: 50 },
                                                { name: "idle/idle03.png", delay: 50 },
                                                { name: "idle/idle04.png", delay: 50 },
                                                { name: "idle/idle05.png", delay: 50 },
                                                { name: "idle/idle06.png", delay: 50 },
                                                { name: "idle/idle07.png", delay: 50 },
                                                { name: "idle/idle08.png", delay: 50 },
                                                { name: "idle/idle09.png", delay: 50 },
                                                { name: "idle/idle10.png", delay: 50 },
                                                { name: "idle/idle11.png", delay: 50 },
                                                { name: "idle/idle12.png", delay: 50 },
                                                { name: "idle/idle13.png", delay: 50 },
                                                { name: "idle/idle14.png", delay: 50 },
                                                { name: "idle/idle15.png", delay: 50 },
                                                { name: "idle/idle16.png", delay: 50 },
                                                { name: "idle/idle17.png", delay: 50 },
                                                { name: "idle/idle18.png", delay: 50 },
                                                { name: "idle/idle19.png", delay: 50 },
                                                { name: "idle/idle20.png", delay: 50 },
                                                { name: "idle/idle21.png", delay: 50 },
                                                { name: "idle/idle22.png", delay: 50 },
                                                { name: "idle/idle23.png", delay: 50 },
                                                { name: "idle/idle24.png", delay: 50 }]);

        //define an run an1mation
        this.renderable.addAnimation ("run",  [{ name: "run/run00.png", delay: 50 },
                                                { name: "run/run01.png", delay: 50 },
                                                { name: "run/run02.png", delay: 50 },
                                                { name: "run/run03.png", delay: 50 },
                                                { name: "run/run04.png", delay: 50 },
                                                { name: "run/run05.png", delay: 50 },
                                                { name: "run/run06.png", delay: 50 },
                                                { name: "run/run07.png", delay: 50 },
                                                { name: "run/run08.png", delay: 50 },
                                                { name: "run/run09.png", delay: 50 },
                                                { name: "run/run10.png", delay: 50 },
                                                { name: "run/run11.png", delay: 50 },
                                                { name: "run/run12.png", delay: 50 },
                                                { name: "run/run13.png", delay: 50 },
                                                { name: "run/run14.png", delay: 50 }]);

        //define an walk an1mation
        this.renderable.addAnimation ("walk",  [{ name: "walk/walk00.png", delay: 50 },
                                                { name: "walk/walk01.png", delay: 50 },
                                                { name: "walk/walk02.png", delay: 50 },
                                                { name: "walk/walk03.png", delay: 50 },
                                                { name: "walk/walk04.png", delay: 50 },
                                                { name: "walk/walk05.png", delay: 50 },
                                                { name: "walk/walk06.png", delay: 50 },
                                                { name: "walk/walk07.png", delay: 50 },
                                                { name: "walk/walk08.png", delay: 50 },
                                                { name: "walk/walk09.png", delay: 50 },
                                                { name: "walk/walk10.png", delay: 50 },
                                                { name: "walk/walk11.png", delay: 50 },
                                                { name: "walk/walk12.png", delay: 50 },
                                                { name: "walk/walk13.png", delay: 50 },
                                                { name: "walk/walk14.png", delay: 50 }
                                                ]);

        //define an jump an1mation
        this.renderable.addAnimation ("jump",  [{ name: "jump/jump00.png", delay: 50 },
                                                { name: "jump/jump01.png", delay: 50 },
                                                { name: "jump/jump02.png", delay: 50 },
                                                { name: "jump/jump03.png", delay: 50 },
                                                { name: "jump/jump04.png", delay: 50 },
                                                { name: "jump/jump05.png", delay: 50 },
                                                { name: "jump/jump06.png", delay: 50 },
                                                { name: "jump/jump07.png", delay: 50 },
                                                { name: "jump/jump08.png", delay: 50 },
                                                { name: "jump/jump09.png", delay: 50 },
                                                { name: "jump/jump10.png", delay: 50 },
                                                { name: "jump/jump11.png", delay: 50 },
                                                { name: "jump/jump12.png", delay: 50 },
                                                { name: "jump/jump13.png", delay: 50 },
                                                { name: "jump/jump14.png", delay: 50 }]);

        //define an thump an1mation
        this.renderable.addAnimation ("thump",  [{ name: "thump/thump00.png", delay: 50 },
                                                { name: "thump/thump01.png", delay: 50 },
                                                { name: "thump/thump02.png", delay: 50 },
                                                { name: "thump/thump03.png", delay: 50 },
                                                { name: "thump/thump04.png", delay: 50 },
                                                { name: "thump/thump05.png", delay: 50 },
                                                { name: "thump/thump06.png", delay: 50 },
                                                { name: "thump/thump07.png", delay: 50 },
                                                { name: "thump/thump08.png", delay: 50 },
                                                { name: "thump/thump09.png", delay: 50 },
                                                { name: "thump/thump10.png", delay: 50 },
                                                { name: "thump/thump11.png", delay: 50 },
                                                { name: "thump/thump12.png", delay: 50 },
                                                { name: "thump/thump13.png", delay: 50 },
                                                { name: "thump/thump14.png", delay: 50 }]);


        // set as default
        this.renderable.setCurrentAnimation("thump");

        // set the renderable position to bottom center
        this.anchorPoint.set(0.5, 0.5);
    }

    /**
     ** update the force applied
     */
    update(dt) {
        if (game.data.health <= 0) {
            me.state.change(me.state.GAMEOVER);
            return true;
        }
        
        if (me.input.isKeyPressed("left"))    {
            this.body.force.x = -this.body.maxVel.x;
            this.renderable.flipX(true);
            if (!this.body.jumping && !(this.renderable.current.name == "run")) {this.renderable.setCurrentAnimation("run");}
        } else if (me.input.isKeyPressed("right")) {
            this.body.force.x = this.body.maxVel.x;
            this.renderable.flipX(false);
            if (!this.body.jumping && !(this.renderable.current.name == "run")) {this.renderable.setCurrentAnimation("run");}
        }

        if (me.input.isKeyPressed("jump") && (this.body.vel.y <= 0)) {
            this.body.jumping = true;
            this.renderable.setCurrentAnimation("jump");
            if (this.multipleJump <= 2) {
                // easy "math" for double jump
                this.body.force.y = -this.body.maxVel.y * this.multipleJump++;
                me.audio.stop("jump");
                me.audio.play("jump", false);
            }
        } else {
            if (!this.body.falling && !this.body.jumping) {
                // reset the multipleJump flag if on the ground
                this.multipleJump = 1;
            }
            else if (this.body.falling && this.multipleJump < 2) {
                // reset the multipleJump flag if falling
                this.multipleJump = 2;
            }
        }

        // check if we fell into a hole
        if (!this.inViewport && (this.pos.y > me.video.renderer.getHeight())) {
            // if yes reset the game
            if (this.renderable.current.name != "die") {
                game.data.health = (game.data.health - 1);
                if (game.data.health <= 0) {
                    me.state.change(me.state.GAMEOVER);
                    return true;
                }
            }
            this.renderable.setCurrentAnimation("die");
            me.game.world.removeChild(this);
            game.data.score = game.data.previousScore || 0;
//            me.game.viewport.fadeIn("#fff", 150, function(){
                me.audio.play("die", false);
                me.level.reload();
  //              me.game.viewport.fadeOut("#fff", 150);
   //         });
            return true;
        }

       if (this.renderable && this.body && this.body.vel.x == 0 && this.body.vel.y == 0) {
          if (this.renderable.current && !(this.renderable.current.name == "idle") && !(this.renderable.current.name == "thump")) {
            if (Math.random() > 0.5) {
               this.renderable.setCurrentAnimation("idle");
            } else {
                this.renderable.setCurrentAnimation("thump");
            }
          }
        }

        super.update(dt);
        return true; //false;
    }



    /**
     * collision handler
     */
    onCollision(response, other) {
        switch (other.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed("down") &&
                        // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                        // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }

                // Custom collision response for slopes
                else if (other.type === "slope") {
                    // Always adjust the collision response upward
                    response.overlapV.y = Math.abs(response.overlap);
                    response.overlapV.x = 0;

                    // Respond to the slope (it is solid)
                    return true;
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if (!other.isMovingEnemy) {
                    // spike or any other fixed danger
                    this.body.vel.y -= this.body.maxVel.y * me.timer.tick;
                    this.hurt();
                }
                else {
                    // a regular moving enemy entity
                    if ((response.overlapV.y > 0) && this.body.falling) {
                        // jump
                        this.body.vel.y -= this.body.maxVel.y * 1.5 * me.timer.tick;
                    }
                    else {
                        this.hurt();
                    }
                    // Not solid
                    return false;
                }
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }

    /**
     * ouch
     */
    hurt() {
        var sprite = this.renderable;
//        game.data.health = (game.data.health -1) || 15;
        if (!sprite.isFlickering()) {

            // tint to red and flicker
            sprite.tint.setColor(255, 192, 192);
            sprite.flicker(750, function () {
                // clear the tint once the flickering effect is over
                sprite.tint.setColor(255, 255, 255);
            });

            // flash the screen
            me.game.viewport.fadeIn("#FFFFFF", 75);
            me.audio.play("die", false);
        }
    }
};

export default PlayerEntity;
