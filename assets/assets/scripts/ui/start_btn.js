cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.director.loadScene("myGame");
        });
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            cc.director.loadScene("myGame");
        });
    },
    start () {

    },

    // update (dt) {},
});
