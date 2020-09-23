export default class UIController extends Laya.Script {

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