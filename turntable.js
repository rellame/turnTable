(function($){
	//抽奖思路：在先转4圈，第五圈转的角度随机
	//一共八个格子 平均每个格子45deg
	var Turntable = function(wrapper,initData){
		this.setting = {
			sector:8,//扇形个数
			prize:['再接再厉','再接再厉','二等奖','再接再厉','一等奖','再接再厉','再接再厉','三等奖'],//顺时针转动转盘的奖品顺序
			leastRound:4,//每次抽奖最少转四圈
			speed:10//转动1deg需要的时间
		};
		this.variable = {
			curDeg:0,//当前的转动度数
			eachDeg:45,//每扇所占角度
			leastDeg:1440,//每次抽奖最少转的角度
			proccessing:false//正在处理请求标志，防止连续点击触发
		};
		$.extend(this.setting,initData);
		this.initVar();
		this.buildComponets(wrapper);
		this.bindEvents();
	};

	Turntable.prototype = {
		buildComponets : function(wrapper){
			this.wrapper = wrapper;
			this.plate = this.wrapper.find(".palte");
			this.pointer = this.wrapper.find(".pointer");
			this.infoLayer = this.wrapper.find(".info");
			this.prizeText = this.infoLayer.find(".prize-text");
			this.confirmBtn = this.infoLayer.find(".confirm-btn");
		},
		bindEvents : function(){
			var self = this;
			this.pointer.unbind("click.lottery").bind("click.lottery",function(e){
				e.preventDefault();				
				self.lotteryStart();	
			});
			this.confirmBtn.unbind("click.ok").bind("click.ok",function(){
				self.closeInfoLayer();
			});
		},
		lotteryStart : function(){
			if(this.variable.proccessing) {
				this.prizeText.text("正在抽奖");
				this.infoLayer.show();
				return false;
			}
			this.variable.proccessing = true;
			var _this = this;
			var randomNum = Math.round(Math.random()*360);
			var transformParam = "";
			var time = (this.variable.leastDeg+randomNum);
			this.variable.curDeg = this.variable.curDeg+this.variable.leastDeg+randomNum;
			transformParam = "rotate("+this.variable.curDeg+"deg)";
			$(".plate").css({transform:transformParam,transition:"all "+time+"ms ease"});
			//待转盘转完了再执行
			setTimeout(function(){_this.showResult()},time);
		},
		showResult : function(){
			var i = Math.floor(this.variable.curDeg%360/45);
			var prize = this.setting.prize[i];
			this.prizeText.text(prize);
			this.infoLayer.show();
			this.variable.proccessing = false;
		},
		closeInfoLayer : function(){
			this.infoLayer.hide();
		},
		initVar : function(){
			this.variable.eachDeg = 360/this.setting.sector;
			this.variable.leastDeg = this.setting.leastRound*360;
		}
	};

	Turntable.init = function(wrapper,initData){
		new Turntable(wrapper,initData);
	};

	window['Turntable'] = Turntable;

})(jQuery);