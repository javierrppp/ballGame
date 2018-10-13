// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        num: 0,
        layer: 0,
        type: 0,
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
            console.log(this.game);
            this.game.getComponent("Game").destroyObject(1, this.node);
        }
        this.game.getComponent("Game").score += 1;
        this.game.getComponent("Game").score_label.string = "score: " + this.game.getComponent("Game").score;
        this.text.string = this.num;
    },
    start () {

    },
});
