(function () {
    'use strict';

    class EffectAutoDestroy extends Laya.Script {

        constructor() { 
            super(); 
        }
        
        onAwake(){
            Laya.stage.timerOnce(2000,this,function(){ this.owner.destroy(); });
        }
    }

    class MoleController extends Laya.Script {

        constructor() { 
            super(); 

            this.isUp = false;
            this.isDown = false;
        }

        onAwake(){
            this.cachedPosition = this.owner.transform.localPosition.clone();
            this.offset = new Laya.Vector3(0,1.5,0);
            this.topPosition = new Laya.Vector3(0,0,0);
            Laya.Vector3.add(this.cachedPosition,this.offset,this.topPosition);
            this.randomUp();
        }


        onUpdate()
        {
            if(this.isUp)
            {
                this.owner.transform.translate(new Laya.Vector3(0,0.1,0));
                if(this.owner.transform.localPosition.y > this.topPosition.y)
                {
                    this.isUp = false;
                    this.owner.transform.localPosition = this.topPosition;

                    Laya.stage.timerOnce(1000,this,function(){this.isDown = true;});
                }
            }

            if(this.isDown)
            {
                this.owner.transform.translate(new Laya.Vector3(0,-0.1,0));
                if(this.owner.transform.localPosition.y <= this.cachedPosition.y)
                {
                    this.isDown = false;
                    this.owner.transform.localPosition = this.cachedPosition;
                    this.randomUp();
                }
            }
        }

        randomUp(){
            var value = Math.random();
            Laya.stage.timerOnce( value * 6000 ,this,function(){ this.isUp = true;});
        }

        IsValidPosition(){
            return this.owner.transform.localPosition.y >= this.topPosition.y - 0.5
        }

        Knock(){
            this.owner.transform.localPosition = this.cachedPosition;
            this.isUp = false;
            this.isDown = false;
        }
    }

    class HummerController extends Laya.Script {

        constructor() { 
            super(); 
        }

        initialize( camera , loadScene ,prefab ){
            this.camera = camera;
            this.scene = loadScene;
            this.physicsSimulation = this.scene.physicsSimulation;
            this.effectPrefab = prefab;
        }

        onAwake(){
            this.ray = new Laya.Ray(new Laya.Vector3(),new Laya.Vector3());
            this.hitResult = new Laya.HitResult();
        
            Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onMouseDown);
        }

        onMouseDown(){
            var point = new Laya.Vector2(Laya.stage.mouseX,Laya.stage.mouseY);
            this.camera.viewportPointToRay( point , this.ray);

            var ret = this.physicsSimulation.rayCast(this.ray,this.hitResult);
            if( ret )
            {
                var owner = this.hitResult.collider.owner;
                var script = owner.getComponent(MoleController);
                if( script.IsValidPosition() )
                {
                    this.targetPos = owner.transform.position;
                    this.owner.transform.position = new Laya.Vector3(this.targetPos.x,7,this.targetPos.z);
                    var props = { localPositionX:this.targetPos.x,localPositionY:0.35,localPositionZ:this.targetPos.z};
                    var handle = Laya.Handler.create(this,this.onHummerKnockDone);
                    Laya.Tween.to(this.owner.transform,props,100,Laya.Ease.linearIn,handle,0,true,true);
                }
            }

        }

        onHummerKnockDone(){
            var owner = this.hitResult.collider.owner;
            owner.getComponent(MoleController).Knock();

            var temp = Laya.Sprite3D.instantiate(this.effectPrefab,this.scene);
            temp.addComponent(EffectAutoDestroy);
            temp.transform.position = this.targetPos;

            Laya.stage.event("SCORE_ADD");


            this.targetPos = owner.transform.position;
            var props = { localPositionX:this.targetPos.x,localPositionY:7,localPositionZ:this.targetPos.z};
            Laya.Tween.to(this.owner.transform,props,100,Laya.Ease.linearIn,null,0,true,true);
        }



    }

    class GameRoot extends Laya.Script{
        constructor(){
            super();
        }

        onAwake(){
            Laya.Scene3D.load("res/scene/LayaScene_main/Conventional/main.ls",Laya.Handler.create(this,this.onLoadSceneFinish));
        }

        onLoadSceneFinish( loadScene )
        {
            loadScene.zOrder = -1;
            console.log("Scene Load Finish ... ");
            Laya.stage.addChild(loadScene);

            var directionLight = loadScene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));

            var moles = loadScene.getChildByName("Moles");
            for( var i = 0 ; i < moles.numChildren;++i)
            {
                moles.getChildAt(i).addComponent(MoleController);
            }

            var effect = loadScene.getChildByName("Particle");
            var effectPrefab = Laya.Sprite3D.instantiate(effect);
            effect.active = false;

            var hummerController = loadScene.getChildByName("Hummer").addComponent(HummerController);
            var camera = loadScene.getChildByName("Main Camera");
            hummerController.initialize( camera , loadScene , effectPrefab );

            
        }
    }

    class UIController extends Laya.Script {

        constructor() { 
            super(); 
            /** @prop { name :txt_Score , tips:"积分", type:Node , default:null }*/
            this.txt_Score = null;
            /** @prop { name :timer , tips:"倒计时",type:Node}*/
            this.obj_timer;
            /** @prop { name :button retry , tips:"重试",type:Node}*/
            this.btn_retry;
            /** @prop { name :gameover , tips:"结束面板",type:Node}*/
            this.gameover;
        }


        addScore(){
            this.score++;
            this.txt_Score.text = "Score:" + this.score;
        }

        
        onAwake(){
            this.score = 0;
            Laya.stage.on("SCORE_ADD",this,this.addScore);

        }
        
        
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("script/GameRoot.js",GameRoot);
    		reg("script/UIController.js",UIController);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "GameRoot.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
//# sourceMappingURL=bundle.js.map
