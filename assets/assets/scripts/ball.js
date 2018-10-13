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
        game: {
            default: null,
            type: cc.Node,
        }
    },
    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);  
    },
    // LIFE-CYCLE CALLBACKS:
    onKeyDown (event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.node.getComponent(cc.RigidBody).active = false;
                this.node.setPosition(this.node.getPosition().x, this.node.getPosition().y + 20);
                break;
            case cc.macro.KEY.d:
                this.node.getComponent(cc.RigidBody).active = true;
        }
    },
    onKeyUp (event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },
    // onLoad () {},
    update: function (dt) {
        
    },
    onBeginContact(contact, self, other) {
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
            var move1 = cc.moveTo(0.6, this.node.getPosition().x, 760);
            var move2 = cc.moveTo(0.3, 0, 760);
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
                var move2 = cc.moveTo(0.4, 700, 760);
                var move3 = cc.moveTo(0.2, 0, 760);
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

    // update (dt) {},
});
