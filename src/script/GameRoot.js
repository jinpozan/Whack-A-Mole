import HummerController from "./HummerController";
import MoleController from "./MoleController";


export default class GameRoot extends Laya.Script{
    constructor(){
        super();
    }

    onAwake(){
        Laya.Scene3D.load("res/scene/LayaScene_main/Conventional/main.ls",Laya.Handler.create(this,this.onLoadSceneFinish));
    }

    onLoadSceneFinish( loadScene )
    {
        console.log("Scene Load Finish ... ")
        Laya.stage.addChild(loadScene);

        var directionLight = loadScene.addChild(new Laya.DirectionLight());
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));

        var moles = loadScene.getChildByName("Moles");
        for( var i = 0 ; i < moles.numChildren;++i)
        {
            moles.getChildAt(i).addComponent(MoleController);
        }

        var hummerController = loadScene.getChildByName("Hummer").addComponent(HummerController);
        var camera = loadScene.getChildByName("Main Camera")
        hummerController.initialize( camera , loadScene );
    }
}