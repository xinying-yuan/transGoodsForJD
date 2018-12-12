var getProCenter=function(){
	//province,center
	var array={};
	array["安徽"]="合肥";
	array["北京"]="海淀";
	array["重庆"]="渝中";
	array["福建"]="福州";
	array["甘肃"]="兰州";
	array["广东"]="广州";
	array["广西"]="南宁";
	array["贵州"]="贵阳";
	array["海南"]="海口";
	array["河北"]="保定";
	array["黑龙江"]="哈尔滨";
	array["河南"]="郑州";
	array["香港"]="九龙";
	array["湖北"]="武汉";
	array["湖南"]="长沙";
	array["江苏"]="南京";
	array["江西"]="南昌";
	array["吉林"]="长春";
	array["辽宁"]="沈阳";
	array["内蒙古"]="呼和浩特";
	array["宁夏"]="银川";
	array["青海"]="西宁";
	array["山西"]="太原";
	array["陕西"]="西安";
	array["山东"]="济南";
	array["四川"]="成都";
	array["台湾"]="高雄";
	array["上海"]="黄埔";
	array["天津"]="天津";
	array["新疆"]="乌鲁木齐";
	array["西藏"]="拉萨";
	array["云南"]="昆明";
	array["浙江"]="杭州";
	array["港澳"]="港澳";
	return array;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
var getPinyin=function(name){
	var res="";
	switch(name){
	case "重庆":
	     res="chongqing";
		 break;
    case "海南":
	     res="hainan";
		 break;
	case "广东":
	     res="guangdong";
		 break;
	case "上海":
		 res="shanghai";
		 break;
	case "内蒙古":
		 res="neimenggu";
		 break;
    case "河南":
		 res="henan";
		 break;
	case "甘肃":
		 res="gansu";
		 break;
	case "广西":
	     res="guangxi";
		 break;
	case "山东":
	      res="shandong";
		  break;
	case "安徽":
		  res="anhui";
		  break;
	case "天津":
		  res="tianjin";
		  break;
	case "辽宁":
		  res="liaoning";
		  break;
	case "云南":
		  res="yunnan";
		  break;
	case "山西":
		  res="shan1xi";
		  break;
	case "黑龙江":
		  res="heilongjiang";
		  break;
	case "北京":
		  res="beijing";
		  break;
	case "河北":
		  res="hebei";
		  break;
	case "港澳":
		  res="macau";
		  break;
    case "宁夏":
		  res="ningxia";
		  break;
	case "青海":
		  res="qinghai";
		  break;
	case "四川":
		  res="sichuan";
		  break;
	case "广东":
		  res="guangdong";
		  break;
	case "陕西":
		   res="shan3xi";
		   break;
	case "吉林":
		   res="jilin";
		   break;
	case "浙江":
		   res="zhejiang";
		   break;
	case "西藏":
		   res="xizang";
		   break;
	case "新疆":
		   res="xinjiang";
		   break;
	case "台湾":
		   res="taiwan";
		   break;
	case "青海":
		   res="qinghai";
		   break;
	case "江西":
		   res="jiangxi";
		   break;
	case "湖南":
		   res="hunan";
		   break;
	case "湖北":
		   res="hubei";
		   break;
	case "贵州":
		   res="guizhou";
		   break;
	case "福建":
		   res="fujian";
		   break;
	case "北京":
		   res="beijing";
		   break; 
	case "江苏":
				res="jiangsu";
				break;			
		  }
  //港澳按照澳门来处理了~
	return res;	  
}

var colorsArray=function(data){
	//使用d3放缩函数实现colors数组的动态生成
	var r=0;
	var g=0;
	var b=0;
	
  var colorscale=d3.scale.linear();
			colorscale.domain([0,parseFloat(data[0].ranking)])
			          // .range([150,20]);
					  .range([0,7]);
	var colors=[];
	for(var i=0;i<data.length;i++){
		g=colorscale(parseFloat(data[i].ranking))
		colors.push('rgb('+r+','+g+','+b+')');
	}
	//存储十种颜色 颜色深度依次递减
	return colors;
	
	}
	
var colorsArray2 = function(data) {
	let input = ['#c7e9c0','#a1d99b','#74c476','#41ab5d','#238b45','#006d2c','#00441b'];
	//let input = ['white','black'];
	console.log(data[0]);
	var colorscale=d3.scale.linear();
        colorscale.domain([0,parseFloat(data[0].ranking)])
			// .range([150,20]);
			.range([0,6]);
			
	var colors=[];
	for(var i=0;i<data.length;i++) {
	   if(input[parseInt(colorscale(parseFloat(data[i].ranking)))] === undefined) {
		 colors.push(input[0]);
	   } else {
		   colors.push(input[parseInt(colorscale(parseFloat(data[i].ranking)))]);
	   }
	  
	}
	return colors;
}
	