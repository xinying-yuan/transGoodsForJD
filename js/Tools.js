var rankings={};
var colors={};	
var outprovince;//globa variable
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
var getProColor=function(cityname){
	
	for(var i=0;i<rankings.length;i++){
		if(rankings[i].incity==cityname){
			return colors[i];
		}
	}
	//黑色的区域表示
	return "#e5f5e0";//否则的话返回纯绿色
}
var querySelect=function(inpro,outpro,mapdata,x,y){
			$.ajax({
				  type:"post",
					url:"/getcityrank",
					data:{
						"inpro":inpro,
						"outpro":outpro
					},
					async:true,
					dataType:"json",
					success:function(data){
						rankings=data;
					  colors=colorsArray2(rankings);
						console.log(colors);
						drawDetailMap(mapdata,x,y);
					},
					error:function(err){
						console.log("error"+err.message);
					}
			});
		}
var getlinecolor=function(key,line){
	var r=0;
	var g=0;
	var b=0;

	var tem=d3.scale.linear();
	    tem.domain([0,1])
			   .range([0,1]);
				 // r=tem(key);
				 // g=tem(key);
				 b=tem(key);
	var color="rgb("+r+","+g+","+b+")";
	return color;
}
var drawCurveLine=function(mline,startpoint,endpoint,key,outpro,lines){
	       //为前5名设置线的宽度为2
				 var key=parseInt(key);
				// console.log("key"+key);
				console.log(endpoint);
				 var width=1;
				 var color="";
				 var ratio=0;
				 var baohedu=1;
				 ratio=parseFloat(key/lines);
				 var radius=140*(Math.PI/180);
				 //console.log(ratio);
				 var tem=HSVtoRGB(radius,baohedu,1-ratio);
				 // color="rgb("+tem.r+","+tem.g+","+tem.b+")";
				 
				  if(Math.abs(ratio)<=parseFloat(0.20)){
						width=3.5;
						var tem=HSVtoRGB(radius,baohedu,1);
						// color="rgb("+tem.r+","+tem.g+","+tem.b+")";
						color="#fc4e2a";
					}else if(parseFloat(0.20)<ratio&&ratio<=parseFloat(0.5)){
						//console.log("second");
						width=3.5;
						var tem=HSVtoRGB(radius,baohedu,0.7);
						// color="rgb("+tem.r+","+tem.g+","+tem.b+")";
						color="#fd8d3c";
					}else if(parseFloat(0.5)<ratio&&ratio<=parseFloat(0.8)){
						//console.log("third");
						width=3.5;
						var tem=HSVtoRGB(radius,baohedu,0.5);
						// color="rgb("+tem.r+","+tem.g+","+tem.b+")";
						color="#feb24c";
					}else{
						//console.log("fourth");
						width=3.5;
						var tem=HSVtoRGB(radius,baohedu,0.3);
						// color="rgb("+tem.r+","+tem.g+","+tem.b+")";
						color="#fed976";
					}
					drawCircle(endpoint[0],endpoint[1],color);
					width=1;
	        outprovince=outpro;
				  var qx=0.5*(endpoint[0]-startpoint[0]);
					var qy=0*(Math.abs(startpoint[1]-endpoint[1]));
					var endx=endpoint[0]-startpoint[0];
					var endy=endpoint[1]-startpoint[1];
					
					// console.log(color);
					var temid="tem"+key;
					//d使用小写的q代表的是相对坐标
					var d="M "+startpoint[0]+","+startpoint[1]+" q "+qx+","+qy+" "+endx+","+endy;
				   mline.append("path")
					    .attr("class","line")
							.attr("id",temid)
							.attr("d",d)
							.attr("fill","transparent")
							.attr("stroke",color)
							.attr("stroke-width",width);



           width=0;
					 color="";
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
 						 .attr("stroke","#cb181d")
// 					 .attr("stroke-width",1)
						 .text(text);
					
					
			}
var graph=function(){
	var width=900;
	var height=700;
	var background="#020814"; 
	var svg=d3.select("body div.fxmap")
				.append("svg")
				.attr("stroke","#00bcd4")
				.attr("width",width)
				.attr("height",height)
				.attr("right","0")
				.style("background",background);
    return svg;				
}		
var leftSvg=function(){
	var width=500;
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
var drawDetailMap=function(data,x,y){
	
	var cities=[];
	for(var i=0;i<data.length;i++){
		cities.push(
		{
			"lat":data[i].properties.cp[0],
			"log":data[i].properties.cp[1],
			"name":data[i].properties.name
		}
		);
	}
	var item=parseInt(data.length/2);
	var centerpoint=getCenterPoint(cities);
	var scaletime=getScaleTimes(cities);
	
	var dp =
	d3.geo.mercator()
	.center([centerpoint[0].lat,centerpoint[0].log])
	.scale(scaletime)
	.translate([x, y]);
	
	var dpath = d3.geo.path().projection(dp);
	   //绘制地图
	detail_map.selectAll("path")
				.data(data)
				.enter()
				.append("path")
				.attr("fill",function(d,i){
					return getProColor(d.properties.name);
				})
				.attr("d",dpath)
				.on("mouseover",function(){
					d3.select(this).attr("class","orange");
				})
				.on("mouseout",function(){
					d3.select(this).attr("class","");
				});
	  //在地图上面标注市信息
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
						return "#ea9c1b";
					});	 
			location.append("text")
					.text(function(d){
						return d.name;
					})
					.attr("fill",function(d,i){
						return "pink";
					})
					.attr("text-anchor","middle")
					.attr("font-family","sans-setif")
					.attr("font-size","10px")
					.attr("font-weight","250")
					.on("mouseover",function(d){
						//字体放大
					d3.select(this).attr("font-size","20px")
													.attr("font-weight","bold")
													.attr("fill","black");
					})
					.on("mouseout",function(){
						d3.select(this).attr("font-size","10px")
													.attr("font-weight","250")
													.attr("fill","#ea9c1b");
				});
					
	}			
var drawLeft=function(dataset,container){
var width=500,
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
						var yalias=175;
						var xalias=250;
						//显示到具体的市级单位 以市级单位的第一个区为中心绘制具体地图
						if(d3.select(this).attr("id")=="钓鱼岛"){
							//直接显示钓鱼岛的tcargo是多少
							alert("钓鱼岛地图尚未完备，请选看其余省份");
							}
						  //台湾
							if(d3.select(this).attr("id")=="台湾"){
								alert("数据库未提供准确的省市分布数据");
							}
						if(d3.select(this).attr("id")=="江西"){
							yalias=100;
							}
						if(d3.select(this).attr("id")=="黑龙江"){
								yalias=200;
							}
							if(d3.select(this).attr("id")=="青海"){
								xalias=300;
							}
							if(d3.select(this).attr("id")=="重庆"){
								xalias=200;
							}
						var pname=getPinyin(d3.select(this).attr("id"));
						var chinese=d3.select(this).attr("id");
						var path="./data/local/"+pname+".json";
					  var mapdata=[];
						//清除掉之前显示的detail地图
					  province.selectAll(".info").remove();
						detail_map.selectAll("*").remove();
						
						d3.json(path,function(error,data){
							//根据货运量绘制地图 以及着色
							if(error){
								console.log(error);
							}
						  mapdata=data.features;
							querySelect(chinese,outprovince,mapdata,xalias,yalias);
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
									.attr("province",function(d){
										return d.pro;
									})
									.attr("class","pointer")
									.attr("fill","white")
									.attr("x",20)
									.attr("y",function(d){return d.position*barSpacing+barHeight*(2/3)})
                  .text(function(d){
										var text="";
										if(d.pro=="钓鱼岛"||d.pro=="台湾"){
											text=parseInt(parseInt(d.position)+1)+" "+d.pro+"  "+(d.tcargo+"").substr(0,5);
											}
											else{
											text=parseInt(parseInt(d.position)+1)+" "+d.pro+"  "+(d.tcargo+"").substr(0,5);
											}
										return text;
										})
									.on('click',function(d){
											//redraw map in the left bottom
											var yalias=175;
											var xalias=250;
											//显示到具体的市级单位 以市级单位的第一个区为中心绘制具体地图
											if(d3.select(this).attr("province")=="钓鱼岛"){
												//直接显示钓鱼岛的tcargo是多少
												alert("钓鱼岛地图尚未完备，请选看其余省份");
												return;
												}
												//台湾
												if(d3.select(this).attr("province")=="台湾"){
													alert("数据库未提供准确的省市分布数据");
													return ;
												}
											if(d3.select(this).attr("province")=="江西"){
												yalias=100;
												}
											if(d3.select(this).attr("province")=="黑龙江"){
													yalias=200;
												}
												if(d3.select(this).attr("province")=="青海"){
													xalias=300;
												}
												if(d3.select(this).attr("province")=="重庆"){
													xalias=200;
												}
											var pname=getPinyin(d3.select(this).attr("province"));
											var chinese=d3.select(this).attr("province");
											var path="./data/local/"+pname+".json";
											var mapdata=[];
											//清除掉之前显示的detail地图
											province.selectAll(".info").remove();
											detail_map.selectAll("*").remove();
											
											d3.json(path,function(error,data){
												//根据货运量绘制地图 以及着色
												if(error){
													console.log(error);
												}
												mapdata=data.features;
												querySelect(chinese,outprovince,mapdata,xalias,yalias);
										  });			
														
														
                    });
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
	center.push(
	{
		"lat":parseFloat(sum1/size),
		"log":parseFloat(sum2/size)
	}
	);
	return center;
}
var getScaleTimes=function(array){
	//console.log(array);
	var times=27;
	//判断是否是重庆
	if(array[1].name=="奉节县"){
		//是重庆地区
		times=42;
		}
		if(array[1].name=="和田地区"){
			times=33;
		}
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
	var time2=parseInt(320/disy);
	return  time1<time2?times*time1:times*time2;
}
