cc.Class({
    extends: cc.Component,

    properties: {
        num: 0,
        layer: 0,
        type: 0,
        shaking: false,
        //抖动强度
        strength: {
            default: 7,
            type: cc.number,
        },
        //抖动次数
        shake_num: {
            default: 15,
            type: cc.number,
        },
        text: {
            default: null,
            type: cc.Label,
        },
        game: {
            default: null,
            type: cc.Node,
        }
    },

    onBeginContact(contact, self, other) {
        this.num -= 1;
        if (this.num == 0)
        {
            this.game.getComponent("Game").destroyObject(1, this.node);
        }
        else
        {
            this.shake();
        }
        this.game.getComponent("Game").score += 1;
        this.game.getComponent("Game").score_label.string = "score: " + this.game.getComponent("Game").score;
        this.text.string = this.num;
    },
    //一个bug： 为何在Game.js里面调用该函数的时候，并不一定会指向该点？
    shake: function() {
        // set a flag when key pressed
            console.log("shake node:" + this.num);
        if (this.shaking == false)
        {
            this.shaking = true;
            var initial_x = this.node.getPosition().x;
            var initial_y = this.node.getPosition().y;
            var sequence = [];
            for (var i = 0; i < this.shake_num; i++)
            {
                var randx = Math.ceil(Math.random() * 2 * this.strength - this.strength);
                var randy = Math.ceil(Math.random() * 2 * this.strength - this.strength);
                sequence.push(cc.moveTo(0.02, initial_x + randx, initial_y + randy));
            }
            sequence.push(cc.moveTo(0.02, initial_x, initial_y));
            var _this = this;
            sequence.push(cc.callFunc(function(){_this.shaking = false;}));
            this.node.runAction(cc.sequence(sequence));
            //this.node.runAction(cc.sequence([cc.shake(0.2, 300, 300), cc.callFunc(function(){_this.shaking = false;})]));
        }
    },
});
