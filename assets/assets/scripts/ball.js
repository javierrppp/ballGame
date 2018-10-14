cc.Class({
    extends: cc.Component,

    properties: {
        _active_: false,        //是否可以发射
        collide_active: true,  //防止重复调用碰撞检测函数
        speed_can_be_fixed: false,  //是否需要修正速度（碰到地面则更改为否）
        thisRestitution: {
            default: 0.5,
            type: cc.number,
        },
        idole: true,
        exception_time: 0,             //异常次数，如果x方向和y方向都为0则记一次
        exception_time_limit: 50,    //上限，如果x方向和y方向连续exception_time_limit次为0则判定为异常
        game: {
            default: null,
            type: cc.Node,
        }
    },
    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    // LIFE-CYCLE CALLBACKS:
    onKeyDown (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.node.getComponent(cc.RigidBody).active = false;
                break;
            case cc.macro.KEY.d:
                this.node.getComponent(cc.RigidBody).active = true;
        }
    },
    onBeginContact(contact, self, other) {
        var height = 1135;
        //如果撞的是地面
        //tag:1为左地面，2为右地面，3为外侧墙壁，4为最底面，5为最顶面
        if (other.tag == 1 || other.tag == 2 || other.tag == 4)
        {
            //让节点失去弹力
            var speed_x = other.tag == 1 ? -400 : 400;
            if (other.tag == 4) speed_x = 0;
            this.speed_can_be_fixed = false;
            if (this.node.getComponent(cc.RigidBody).linearVelocity.x !== speed_x)
            {
                contact.setRestitution(0);
                this.node.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(speed_x, 0);
                // var c = this.node.getComponents(cc.PhysicsCircleCollider)[0];
                // c.restitution = 0;
                // c.apply();
            }
        }
        if (other.tag == 3)
        {
            //this.idole = true;
            this.node.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            var move1 = cc.moveTo(0.6, this.node.getPosition().x, height);
            var move2 = cc.moveTo(0.3, 0, height);
            var sequence = cc.sequence([move1, move2]);
            this.node.runAction(sequence);
        }
        else if(other.tag == 4)
        {
            if (this.collide_active == true)
            {
                this.collide_active = false;
                this.node.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
                var move1 = cc.moveTo(0.4, 700, this.node.getPosition().y);
                var move2 = cc.moveTo(0.4, 700, height);
                var move3 = cc.moveTo(0.2, 0, height);
                var sequence = cc.sequence([move1, move2, move3]);
                this.node.runAction(sequence);
            }
        }
        else if(other.tag == 5 && this.idole == false)
        {
            this.idole = true;
            this.game.getComponent("Game").can_update = true;
        }
    },
});
