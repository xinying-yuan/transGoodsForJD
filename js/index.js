var procenter=getProCenter();
var centers={};				
var cargolinks={};
//创建svg
var width=1000;
var height=700;
var background="#0b032d"; 
var svg=graph();//地图主体
var svg2=leftSvg();	//left svg		
var gmap = svg.append("g")
				.attr("id", "map")
				.attr("stroke", "white")
				.attr("stroke-width",1);
				
//mline的笔宽度和颜色待定 group
var mline =svg.append("g")
				.attr("id", "moveto")
				.attr("stroke", "#FFF")
				.attr("stroke-width", 1.5)
				.attr("fill","#FFF");
				
 var button =svg.append("g")
					.attr("id", "button")
					.attr("stroke", "white")
					.attr("stroke-width", 1)
					.attr("fill", "white");
					
					
//创建投影函数 经纬度不能够直接用于绘图，必须与c上面的坐标进行转换

var projection = d3.geo.equirectangular()
                            .center([465,395])  // 指定投影中心，注意[]中的是经纬度
                            .scale(height/0.9)
                            .translate([width / 2.1, height / 2]);
var path = d3.geo.path().projection(projection);

//创建marker标记，以便多个中点连线调用
//marker在这里的作用是为测试example创建城市圆点
var marker=svg.append("defs")
				.append("marker")
				.attr("id","pointer")
				.attr("viewBox","0 0 6 6")
				.attr("markerWidth","6")
				.attr("markerHeight","6")
				.attr("orient","auto")
				.attr("refX","6")
				.attr("refY","6");
				
				
  //绘制标记中心圆
	marker.append("circle")
				.attr("cx","3")
				.attr("cy","3")
				.attr("r","3")
				.attr("fill","white");
				
  //绘制标记外圆，之后再timer中添加闪烁效果
	marker.append("marker")
				.attr("id","markerC")
				.attr("cx","3")
				.attr("cy","3")
				.attr("r","5")
				.attr("fill-opacity","0")
				.attr("stroke-width","1")
				.attr("stroke","white");
				
        // 读取地图数据，并绘制中国地图
        mapdata = [];
        d3.json('./data/china.json', function(error, data){
            if (error)
                console.log(error);
            // 读取地图数据
            mapdata = data.features;
            // 绘制地图
            gmap.selectAll("path")
                .data(mapdata)
                .enter()
                .append("path")
				.attr("fill",background)
				.on("mouseover",function(d,i){
					   d3.select(this)
					  .attr("fill","#f79f24");
				})
				.on("mouseout",function(d,i){
					   d3.select(this)
					  .attr("fill",background);
				})
				.on("click",function(d,i){
					//console.log(cargolinks[d.properties.name]);
					var exp=cargolinks[d.properties.name].exp;
					//获取该省份的经纬度坐标
					var sx=centers[procenter[d.properties.name]].x;
					var sy=centers[procenter[d.properties.name]].y;
					//sort exp by sortFunction
					var key=0;
					//console.log(exp);
					//清除所有已经绘制的line 和text
					mline.selectAll(".line").remove();
					mline.selectAll(".text").remove();
					//清除已经有的svg2的部分
					svg2.selectAll("g").remove();
					
					var dexp=Object.keys(exp).sort(function(a,b){
						return exp[b]-exp[a];
					});
					//console.log(dexp);
					//create key:value for left svg data source
					var dataset=[];
					for(var keys in dexp )
          {
						dataset.push(
						{
						"pro":dexp[keys],
						"tcargo":exp[dexp[keys]],
						"position":key
						}
						);
						key++;
						var ex=centers[procenter[dexp[keys]]].x;
						var ey=centers[procenter[dexp[keys]]].y;
						drawCurveLine(mline,projection([sx,sy]),projection([ex,ey]),"#ffb4ac",1.5,"tem"+key);
					}					
					key =0;
					drawLeft(dataset,svg2);
				})
				.attr("d", path);
        });
		
		var drawCircle=function(x,y){		
			gmap.append("circle")
			     .attr("class","province")
			     .attr("cx",x)
				   .attr("cy",y)
				   .attr("r",4)
				   .attr("fill","yellow");
				 
			gmap.append("circle")
			     .attr("class","cirout")
				   .attr("cx",x)
				   .attr("cy",y)
				   .attr("r",7)
				   .attr("fill-opacity","0") ;
		}
		//read the center point (political center) for province and mark it
		d3.csv("./data/capital.csv", function(data) {
			for (var i = 0; i < data.length; i++) {
				centers[data[i].name]={"x":data[i].x,"y":data[i].y};
				var itempro=projection([data[i].x,data[i].y]);
				drawCircle(itempro[0],itempro[1]);
			}
		});
		
	  var csv=d3.dsv("," , "text/csv;charset=GB2312");
				// inpro,incity,outpro,outcity,cargo
				csv("./data/data-transition.csv",function(data){
					//console.log(data.length);
					for(var i=0;i<data.length;i++){
						
						var obj={
							"exp":{},
							"imp":{}
						};
						
						//字典序列 含有 exp 和 imp两项内容
						if(cargolinks[data[i].outpro]==null){
							// console.log("init name");
							//先省对省出口可视化
							cargolinks[data[i].outpro]=obj;
						}
					  if(cargolinks[data[i].inpro]==null){
							// console.log("init2 name");
							cargolinks[data[i].inpro]=obj;
						}
						
						// console.log(cargolinks[data[i].inpro]);
						if(cargolinks[data[i].outpro].exp[data[i].inpro]==null){
							cargolinks[data[i].outpro].exp[data[i].inpro]=parseFloat(data[i].cargo);
						}else{
							//已经存储过了 直接使用cargo相加
							var item=cargolinks[data[i].outpro].exp[data[i].inpro];
							cargolinks[data[i].outpro].exp[data[i].inpro]=parseFloat(item)+parseFloat(data[i].cargo);
						}
						
						if(cargolinks[data[i].inpro].imp[data[i].outpro]==null){
							cargolinks[data[i].inpro].imp[data[i].outpro]=parseFloat(data[i].cargo);
						}else{
							var item=cargolinks[data[i].inpro].imp[data[i].outpro];
							cargolinks[data[i].inpro].imp[data[i].outpro]= parseFloat(item)+parseFloat(data[i].cargo);
						}	
						
						
					}
				  console.log(cargolinks);
				});

	    	var scale = d3.scale.linear();
        scale.domain([0, 1000, 2000])
            .range([0, 1, 0]);
        var start = Date.now();
		
        d3.timer(function(){
            var s1 = scale((Date.now() - start)%2000);
            gmap.selectAll("circle.province")
                .attr("stroke-opacity", s1);
				
			      gmap.selectAll("circle.cirout")
				         .attr("stroke-opacity",s1);
				
        });