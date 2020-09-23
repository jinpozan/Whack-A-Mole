export default class MoleController extends Laya.Script {

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
        Laya.stage.timerOnce( value * 8000 ,this,function(){ this.isUp = true;});
    }

    IsValidPosition(){
        return this.owner.transform.localPosition.y >= this.topPosition.y - 0.5
    }
}