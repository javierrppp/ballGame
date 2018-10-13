
cc.Class({
    extends: cc.Component,

    properties: {
        game: {
            default: null,
            type: cc.Node,
        },
        type: 1,
        layer: 0,
    },
    onBeginContact(contact, self, other) {
        this.game.getComponent("Game").destroyObject(2, this.node);
        var ball = this.game.getComponent("Game").addABall(this.node.getPosition().x, this.node.getPosition().y);
        //var action = cc.moveTo(1, 0, 400);
        // var sequence = cc.sequence([action, cc.callFunc(function(target, data) {
        //     ball.getComponent(cc.RigidBody).active = true;
        //     ball.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, -1000); 
        //     ball.getComponent("ball")._active = false;
        //     ball.getComponent("ball").idole = false;
        // })]);
        ball.getComponent(cc.RigidBody).active = true;
        var rand_x = Math.ceil(Math.random() * 500 - 250);  //-250, 250
        ball.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(rand_x, 1000); 
        ball.getComponent("ball")._active = false;
        ball.getComponent("ball").idole = false;
        ball.getComponent("ball").speed_can_be_fixed = true;
        //ball.runAction(sequence);
    },

    start () {

    },

});
