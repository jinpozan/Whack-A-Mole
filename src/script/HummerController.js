import EffectAutoDestroy from "./EffectAutoDestroy";
import MoleController from "./MoleController";

export default class HummerController extends Laya.Script {

    constructor() { 
        super(); 
    }

    initialize( camera , loadScene ,prefab ){
        this.camera = camera;
        this.scene = loadScene;
        this.physicsSimulation = this.scene.physicsSimulation
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
            var owner = this.hitResult.collider.owner
            var script = owner.getComponent(MoleController);
            if( script.IsValidPosition() )
            {
                this.targetPos = owner.transform.position;
                this.owner.transform.position = new Laya.Vector3(this.targetPos.x,7,this.targetPos.z);
                var props = { localPositionX:this.targetPos.x,localPositionY:0.35,localPositionZ:this.targetPos.z}
                var handle = Laya.Handler.create(this,this.onHummerKnockDone)
                Laya.Tween.to(this.owner.transform,props,100,Laya.Ease.linearIn,handle,0,true,true);
            }
        }

    }

    onHummerKnockDone(){
        var owner = this.hitResult.collider.owner
        owner.getComponent(MoleController).Knock();

        var temp = Laya.Sprite3D.instantiate(this.effectPrefab,this.scene);
        temp.addComponent(EffectAutoDestroy);
        temp.transform.position = this.targetPos;

        Laya.stage.event("SCORE_ADD");


        this.targetPos = owner.transform.position;
        var props = { localPositionX:this.targetPos.x,localPositionY:7,localPositionZ:this.targetPos.z}
        Laya.Tween.to(this.owner.transform,props,100,Laya.Ease.linearIn,null,0,true,true);
    }



}