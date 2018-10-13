cc.Class({
    extends: cc.Component,

    properties: {
        ballPrefab: {
            default: null,
            type: cc.Prefab,
        },
        wall: {
            default: null,
            type: cc.Node
        },
        obectPrefabA: {
            default: null,
            type: cc.Prefab
        },
        obectPrefabB: {
            default: null,
            type: cc.Prefab
        },
        obectPrefabC: {
            default: null,
            type: cc.Prefab
        },
        gameToolPrefab: {
            default: null,
            type: cc.Prefab
        },
        score_label: {
            default: null,
            type: cc.Label
        },
        ball_label: {
            default: null,
            type: cc.Label
        },
        //提示方向的东西
        hint: {
            default: null,
            type: cc.Node,
        },
        //出现道具的概率
        toolProb: {
            default: 0.5,
            type: cc.Float,
        },
        //检测卡住的临界系数
        epsilon: {
            default: 0.01,
            type: cc.Float,
        },
        //求求初始速度（或修正速度）
        v0: {
            default: 1000,
            type: cc.number,
        },
        level: 1,
        balls: [],
        ball_num: 0,
        objects: [],
        object_num: 0,
        can_update: false,
        score: 0,
        game_tools: [],
        hint_enable: false,     //是否可用红圈圈
    },
    onLoad: function () {
        //start的结算跟cocos2d-x不一样？
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("touch begin");
            return false;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log("touch move");
            if (this.hint_enable)
            {
                var dx = event.getLocation().x;
                var dy = event.getLocation().y;
                var pos = new cc.Vec2(dx, dy); 
                pos = this.node.convertToNodeSpaceAR(pos);
                dx = pos.x;
                dy = pos.y;
                var sx = this.balls[0].getPosition().x;
                var sy = this.balls[0].getPosition().y;
                var minus_x = dx - sx;
                var minus_y = dy - sy;
                var angle = Math.atan(minus_x / minus_y);
                if (minus_y > 0) angle = -angle;
                this.hint_angle = angle * 180 / Math.PI;
                this.hint.setRotation(this.hint_angle);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log("touch end");
            if (this.balls[0] !== null && this.balls[0].getComponent("ball")._active == true)
            {
                var dx = event.getLocation().x;
                var dy = event.getLocation().y;
                var pos = new cc.Vec2(dx, dy); 
                pos = this.node.convertToNodeSpaceAR(pos);
                dx = pos.x;
                dy = pos.y;
                var sx = this.balls[0].getPosition().x;
                var sy = this.balls[0].getPosition().y;
                var minus_x = dx - sx;
                var minus_y = dy - sy;
                //如果角度偏离，则纠正角度
                var angle = Math.atan(minus_x / minus_y);
                if (minus_y > 0) angle = -angle;
                var speed_x = - this.v0 * Math.sin(angle);
                var speed_y = - this.v0 * Math.cos(angle);
                this.shoot(this.balls[0], speed_x, speed_y);
                var _this = this;
                var balls = this.balls;
                // for (var i = 1; i < this.balls.length; i++)
                // {
                if (this.balls.length > 1) {
                    var i = 1;
                    var interval = setInterval(function(){
                        _this.ballReady(balls[i]);
                        _this.shoot(_this.balls[i], speed_x, speed_y);
                        i += 1;
                        if (_this.balls.length <= i)
                            clearInterval(interval);
                    }, 200);
                }
            }
            this.hint.runAction(cc.rotateTo(1, 0));
            this.hint_enable = false;
        }, this);
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;
        this.gameStart();
    },
    //游戏开始
    gameStart: function() {
        this.score = 0;
        this.addABall();
        this.ballReady(this.balls[0]);
        this.levelUp();
        this.levelUp();
        this.hint_enable = true;
    },
    //游戏结束
    gameOver: function() {
        console.log("game over");
    },
    //新增一个球
    addABall: function(pos_x = 0, pos_y = 1000) {
        var ball = cc.instantiate(this.ballPrefab);
        this.node.addChild(ball);
        ball.setPosition(pos_x, pos_y);
        ball.setScale(0.3);
        ball.getComponent(cc.RigidBody).active = false;
        ball.getComponent("ball").game = this.node;
        ball.getComponents(cc.PhysicsCircleCollider)[0].restitution = ball.getComponent("ball").thisRestitution;
        ball.getComponents(cc.PhysicsCircleCollider)[0].apply();
        this.balls.push(ball);
        this.ball_num += 1;
        this.ball_label.string = "balls: " + this.ball_num;
        return ball;
    },
    //重新设置球球的属性
    resetBalls: function() {
        this.balls.forEach(function(value,index,array){
            value.getComponent("ball")._active = false;
            value.getComponent("ball").collide_active = true;
            value.getComponent("ball").idole = true;
            value.getComponent("ball").speed_can_be_fixed = true;
            // value.getComponents(cc.PhysicsCircleCollider)[0].restitution = value.getComponent("ball").thisRestitution;
            // value.getComponents(cc.PhysicsCircleCollider)[0].apply();
        });
    },
    //进入准备状态
    ballReady: function(ball) {
        ball.getComponent(cc.RigidBody).active = false;
        // var action = cc.moveTo(0.3, 0, 500);
        // var sequence = cc.sequence([action, 
        //     cc.callFunc(function(target, data) {target.getComponent("ball")._active = true;}),
        // ]);
        // ball.runAction(sequence);
        ball.setPosition(0, 500);
        ball.getComponent("ball")._active = true;
        
        //this.firstBall.active = false;
    },
    //发射球球
    shoot: function(ball, speed_x, speed_y)
    {
        ball.getComponent(cc.RigidBody).active = true;
        ball.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(speed_x, speed_y); 
        ball.getComponent("ball")._active = false;
        ball.getComponent("ball").idole = false;
        ball.getComponent("ball").speed_can_be_fixed = true;
        
    },
    //更新方块，所有方块上移，并在最下面一行生成新的方块
    levelUp: function() {
        //console.log("length:" + this.objects.length);
        for(var i = 0; i < this.objects.length; i++)
        {
            this.objects[i].getComponent("object").layer += 1;
            //console.log("layer:" + this.objects[i].getComponent("object").layer)
            if (this.objects[i].getComponent("object").layer > 7)
            {
                this.gameOver();
                return;
            }
        }
        for(var i = 0; i < this.objects.length; i++)
        {
            //this.objects[i].setPosition(this.objects[i].getPosition().x, this.objects[i].getPosition().y + 120);
            var sequence = [cc.callFunc(function(){;})]
            sequence.push(cc.moveTo(0.3, this.objects[i].getPosition().x, this.objects[i].getPosition().y + 120));
            //抖动效果？？
            // if (this.objects[i].getComponent("object").layer == 7){
            //     var points = [];
            //     points.push(new cc.Vec2(this.objects[i].getPosition().x, this.objects[i].getPosition().y + 10));
            //     points.push(new cc.Vec2(this.objects[i].getPosition().x - 10, this.objects[i].getPosition().y));
            //     points.push(new cc.Vec2(this.objects[i].getPosition().x, this.objects[i].getPosition().y - 10));
            //     points.push(new cc.Vec2(this.objects[i].getPosition().x + 10, this.objects[i].getPosition().y));
            //     points.push(new cc.Vec2(this.objects[i].getPosition().x, this.objects[i].getPosition().y));
            //     sequence.push(cc.cardinalSplineTo(0.5, points, 0));
            // }
            this.objects[i].runAction(cc.sequence(sequence));
        }
        for(var i = 0; i < this.game_tools.length; i++)
        {
            this.game_tools[i].runAction(cc.moveTo(0.3, this.game_tools[i].getPosition().x, this.game_tools[i].getPosition().y + 120));
            this.game_tools[i].getComponent("game_tool").layer += 1;
            if (this.game_tools[i].getComponent("game_tool").layer > 7)
            {
                this.destroyObject(2, this.game_tools[i]);
            }
        }
        var new_objects = this.generateNewLevelobjects();
        //setTimeout(function(){
            var xs = [];
            new_objects.forEach(function(value,index,array){
                var rand_x = Math.floor(Math.random() * 660) - 330   //-330~330
                if (xs.length > 0)
                {
                    while(true)
                    {
                        var can_add = true;
                        xs.forEach(function(v,i,a){
                            if (Math.abs(rand_x - v) < 100)
                            {
                                can_add = false;
                                //break;
                            }
                        });
                        if (can_add) break;
                        else rand_x = Math.floor(Math.random() * 660) - 330;
                    }
                }
                value.runAction(cc.moveTo(0.3, value.getPosition().x, value.y + 120));
                //console.log("index:" + object_num + ", position.x:" + value.getPosition().x + ", position.y:" + value.getPosition().y);
                xs.push(rand_x);
                value.setPosition(rand_x, -480);
                });
        //},600);
        this.level += 1;
    },
    //在最底下生成一行方块
    generateNewLevelobjects: function() {
        var num = Math.random();
        if(num < 0.5) num = 1;
        else if(num < 0.8) num = 2;
        else num = 3;
        var os = [];
        for (var i = 0; i < num; i++)
        {
            var new_o = this.getNewObject(1);
            this.node.addChild(new_o);
            this.objects.push(new_o);
            os.push(new_o);
        }
        num = Math.random();
        if (num < this.toolProb){
            var tool = this.getNewObject(2);
            this.node.addChild(tool);
            this.game_tools.push(tool);
            os.push(tool);
        }
        return os;
    },
    //生成一个新的方块，type为1表示普通方块， type为2表示+1道具
    getNewObject: function(type) {
        var new_object;
        if (type == 1){
            var index = Math.floor(Math.random() * 3);
            switch(index){
                case 0: new_object = cc.instantiate(this.obectPrefabA); break;
                case 1: new_object = cc.instantiate(this.obectPrefabB); break;
                case 2: new_object = cc.instantiate(this.obectPrefabC); break;
                default:console.log("error!"); break;
            }
            new_object.getComponent("object").layer = 0;
            new_object.getComponent("object").game = this;
            var rand_rotation = Math.floor(Math.random() * 360) - 180   //-180~180
            var object_num = Math.floor(Math.random() * this.level * 5) + this.level * 5;
            new_object.getComponent("object").num = object_num;
            new_object.getComponent("object").text.string = object_num;
            new_object.getComponent("object").text.node.setRotation(-rand_rotation);
            new_object.setRotation(rand_rotation);
            //文字转回来
        }
        else if (type == 2)
        {
            new_object = cc.instantiate(this.gameToolPrefab);
            new_object.getComponent("game_tool").layer = 0;
            new_object.getComponent("game_tool").game = this;
        }
        return new_object;
    },
    //销毁对象
    destroyObject: function(type, object)
    {
        var i;
        if (type == 1){
            this.objects.forEach(function(value,index,array){
                if (value === object)
                {
                    i = index;
                }
            });
            object.destroy();
            this.objects.splice(i, 1);
        }
        else if (type == 2){
            this.game_tools.forEach(function(value,index,array){
                if (value === object)
                {
                    i = index;
                }
            });
            object.destroy();
            this.game_tools.splice(i, 1);
        }
    },
    //检查是否更新所有方块
    checkLevelUp: function()
    {
        
        var result = true;
        this.balls.forEach(function(value,index,array){
            if (value.getComponent("ball").idole == false)
                result = false;
        });
        if (result)
        {
            this.levelUp();
        } 
        return result;
    },
    //检查是否有球被卡住不动了
    checkBallAbnormal: function() {
        var epsilon = this.epsilon
        this.balls.forEach(function(value, index, array) {
            if (value.getComponent("ball").idole == false)
            {
                var linearVelocity = value.getComponent(cc.RigidBody).linearVelocity;
                if (linearVelocity.x < epsilon && linearVelocity.y < epsilon)
                {
                    value.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 300);
                }
            }
        });
    },
    fixSpeed: function()
    {
        var v0 = this.v0;
        this.balls.forEach(function(value, index, array) {
            if (value.getComponent("ball").idole == false && value.getComponent("ball").speed_can_be_fixed == true)
            {
                var linearVelocity = value.getComponent(cc.RigidBody).linearVelocity;
                var angle = Math.atan(linearVelocity.x / linearVelocity.y) 
                if (linearVelocity.y > 0) 
                {
                    var speed_x =  v0 * Math.sin(angle);
                    var speed_y =  v0 * Math.cos(angle);
                    value.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(speed_x, speed_y);
                }
                else{
                    var speed_x = - v0 * Math.sin(angle);
                    var speed_y = - v0 * Math.cos(angle);
                    value.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(speed_x, speed_y);
                }
            }
        });
    },
    update: function(dt)
    {
        //this.checkBallAbnormal();
        this.fixSpeed();
        if (this.can_update)
        {
            this.can_update = false;
            if (this.checkLevelUp())
            {
                this.resetBalls();
                this.ballReady(this.balls[0]);
                this.hint_enable = true;
            }
        }
    },
});
