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
//本来想转化成为汉字的,但是下面的市级名称太多怕对应不过来.不转也能正常读取不过变成不是很规范

var colorsArray=function(){
	//存储10种颜色 降序排列
	var colors=[];
	colors.push("#030c44");
	colors.push("#040f58");
	colors.push("#071888");
	colors.push("#0a1ea4");
	colors.push("#0d25bf");
	colors.push("#122cd9");
	colors.push("#6b7def");
	colors.push("#8694ee");
	colors.push("#1fdbef");
	colors.push("#86e9f4");
	//存储十种颜色 颜色深度依次递减
	return colors;
	}
var drawCurveLine=function(mline,startpoint,endpoint,color,width,temid){
			  
				    var qx=0.5*(endpoint[0]-startpoint[0]);
					var qy=0*(Math.abs(startpoint[1]-endpoint[1]));
					var endx=endpoint[0]-startpoint[0];
					var endy=endpoint[1]-startpoint[1];
					//d使用小写的q代表的是相对坐标
					var d="M "+startpoint[0]+","+startpoint[1]+" q "+qx+","+qy+" "+endx+","+endy;
				    //console.log(d);
					
					
                    //使用三条线来实现追踪效果 待会再搞一下动画效果 ，逆天可爱有木有
				    mline.append("path")
					        .attr("class","line")
							.attr("id",temid)
							.attr("d",d)
							.attr("fill","transparent")
							.attr("stroke",color)
							.attr("stroke-width",2);
							
							
// 					mline.append("path")
// 							 .attr("class","line1")
// 							 .attr("d",d)
// 							 .attr("fill","transparent")
// 							 .attr("stroke","#ff2851")
// 							 .attr("stroke-width","2");
// 							 
// 					mline.append("path")
// 						 .attr("class","line2")
// 						 .attr("d",d)
// 						 .attr("fill","transparent")
// 						 .attr("stroke","#000000")
// 						 .attr("stroke-width","2");

					// var route=document.querySelector(".route");
					var route=document.querySelector("#"+temid);
					var length=route.getTotalLength();
					//this code clear all the transition effect before this item 
					route.style.transition=route.style.webkitTransition="none";
					
					//set up the starting positions
					route.style.strokeDasharray=length+" "+length;
					route.style.strokeDashoffset=length;
					
					//trigger a lyout so styles are calculated and the 
					//browser picks up the starting possition before animationg
					route.getBoundingClientRect();
					//define our transition
					route.style.transition=route.style.webkitTransition="stroke-dashoffset 2s ease-in-out";
					
					route.style.strokeDashoffset="0";
					
					//为每一个终点加上一个tip来提示出货量排序
					//绘制标签形状
					var text=temid.substring(3);
						 
					mline.append("text")
					   .attr("class","text")
						 .attr("x",endpoint[0]+10)
						 .attr("y",endpoint[1]+10)
						 .style("font-size","10px")
						 .attr("stroke","red")
						 .attr("stroke-width",0.5)
						 .text(text);
					
					
			}
var graph=function(){
	var width=900;
	var height=700;
	var background="#0b032d"; 
	var svg=d3.select("body div.fxmap")
				.append("svg")
				.attr("width",width)
				.attr("height",height)
				.attr("right","0")
				.style("background",background);
    return svg;				
}		
var leftSvg=function(){
	var width=350;
	var height=650;
	var svg2=d3.select("body div.prank")
				.append("svg")
				.attr("width",width)
				.attr("height",height)
				.style("background-color","#0b032d")
				.style("border-radius","10px")
				.style("opacity","1");
	return svg2;			
}	
		
		var width=500;
		var height=350;
var psvg=function(){
	var svg3=d3.select("body div.detail")
				.append("svg")
				.attr("width",width)
				.attr("height",height)
				.style("border-radius","5px")
				.style("background-color","#c8d9eb");
	return svg3;
}
var province=psvg();
var detail_map=province.append("g")
				.attr("id","detail_map")
				.attr("stroke","white")
				.attr("stroke-width",1);
var colors=colorsArray();						
var drawLeft=function(dataset,container){
	//pro:  , targo:
	var width=350,
	    leftMargin=0,
		topMargin=10,
		barHeight=15,
		barGap=4,
		tickGap=5,
		tickHeight=10,
		barSpacing=barHeight+barGap,
		translateText="translate("+leftMargin+","+topMargin+")";
		var x=d3.scale.linear()
	            .domain([0,d3.max(dataset,function(element){return element.tcargo})])
				      .range([0,width]);
		var barGroup=container.append("g")
			           .attr("transform",translateText)
							   .attr("class","bar");
			//前三名使用红色
			//中间使用浅红色					
							  
	        barGroup.selectAll("rect")
					.data(dataset)
					.enter()
					.append("rect")
					.attr("class","rect")
					.attr("id",function(d){return d.pro})
					.attr("x",0)
					.attr("y",function(d){return d.position*barSpacing})
					.attr("width",function(d){return x(d.tcargo)})
					.attr("height",barHeight)
					.attr("fill",function(d){ 
						if(d.position<=2){
							return "#a20e0e";
						}else if(d.position>=30){
							return "#e29c68";
						}
						else{
							return "#c85108";
						}
					})
					.on("click",function(d){
						//显示到具体的市级单位 以市级单位的第一个区为中心绘制具体地图
						var pname=getPinyin(d3.select(this).attr("id"));
						var path="./data/local/"+pname+".json";
						var mapdata=[];
						var cities=[];
						//清除掉之前显示的detail地图
					    province.selectAll(".info").remove();
						detail_map.selectAll("*").remove();
						d3.json(path,function(error,data){
							//绘制地图
							if(error){
								console.log(error);
							}
						    mapdata=data.features;
							
							for(var i=0;i<mapdata.length;i++){
								cities.push(
								{
									"lat":mapdata[i].properties.cp[0],
									"log":mapdata[i].properties.cp[1],
									"name":mapdata[i].properties.name
								}
								);
							}
							 var item=parseInt(mapdata.length/2);
							 var centerpoint=getCenterPoint(cities);
							 var scaletime=getScaleTimes(cities);
							 console.log(scaletime+"scaletime");
							 console.log(centerpoint+"centerpoint");
							 var dp =
							 d3.geo.mercator()
							.center([centerpoint[0].lat,centerpoint[0].log])
							.scale(scaletime)
							.translate([province.attr("width")/2, province.attr("height")/1.85]);
							
							var dpath = d3.geo.path().projection(dp);
							var color=d3.scale.category20();
							//"#add2c9"
							//在地图上面标记名称 并且根据货运量绘制不同的颜色
							detail_map.selectAll("path")
									.data(mapdata)
									.enter()
									.append("path")
									.attr("fill",function(d,i){
										return color(i);
									})
									.attr("d",dpath);
									
							var location=province.selectAll("location")
												 .data(cities)
												 .enter()
												 .append("g")
												 .attr("class","info")
												 .attr("transform",function(d){
													 //计算标注点位置
													 var coor=dp([d.lat,d.log]);
												   return "translate("+coor[0]+","+coor[1]+")";
												 });
												 
								location.append("circle")
										.attr("r",3)
										.style("fill",function(d,i){
											return "black";
										});	 
								location.append("text")
										.text(function(d){
											return d.name;
										})
										.attr("fill",function(d,i){
											return "black";
										})
										.attr("text-anchor","middle")
										.attr("font-family","sans-setif")
										.attr("font-size","10px")
										.attr("font-weight","250");
						});
						
					});
					
		   var barLabelGroup=container.append("g")
									.attr("transform",translateText)
									.attr("class","bar-label");
									
			barLabelGroup.selectAll("text")
									.data(dataset)
									.enter()
									.append("text")
									.style("stroke","white")
									.attr("fill","white")
									.attr("x",20)
									.attr("y",function(d){return d.position*barSpacing+barHeight*(2/3)})
                  .text(function(d){return d.pro+"   "+parseInt(parseInt(d.position)+1)});
		  
							  
}
var getCenterPoint=function(array){
	//Get the center point of an array 
	//decide the scale parameter dynamically
	var center=[];
	var sum1=0;
	var sum2=0;
	var size=array.length;
	for(var i=0;i<array.length;i++){
		sum1+=parseFloat(array[i].lat);
		sum2+=parseFloat(array[i].log);
	}
	console.log(sum1+"  "+sum2);
	center.push(
	{
		"lat":parseFloat(sum1/size),
		"log":parseFloat(sum2/size)
	}
	);
	console.log(center);
	return center;
}

var getScaleTimes=function(array){
	//width 500 height 350
	var maxx=0,minx=10000,maxy=0,miny=10000;
	for(var i=0;i<array.length;i++){
		if(minx>array[i].lat){
			minx=array[i].lat;
		}
		if(maxx<array[i].lat){
			maxx=array[i].lat;
		}
		if(miny>array[i].log){
			miny=array[i].log;
		}
		if(maxy<array[i].log){
			maxy=array[i].log;
		}
	}
	var disx=maxx-minx;
	var disy=maxy-miny;
	var time1=parseInt(500/disx);
	var time2=parseInt(350/disy);
	return  time1<time2?28*time1:28*time2;
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
		  breakk;
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