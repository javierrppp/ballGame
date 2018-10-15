cc.Class({
    extends: cc.Component,

    properties: {
        //撞击声
        tanyitan_sound: {
            type: cc.AudioClip,
            default: null
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.audioEngine.playEffect(this.tanyitan_sound, false);
    },

    // update (dt) {},
});
