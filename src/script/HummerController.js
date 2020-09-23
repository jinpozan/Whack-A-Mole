import MoleController from "./MoleController";

export default class HummerController extends Laya.Script {

    constructor() { 
        super(); 
    }

    initialize( camera , loadScene ){
        this.camera = camera;
        this.scene = loadScene;
        this.physicsSimulation = this.scene.physicsSimulation
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
                console.log(owner.name);
            }
        }

    }



}