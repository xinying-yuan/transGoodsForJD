var rankings = {};//global variable city tcargo  降序排列
var colors = {};	//这里存储的是小地图的颜色块
var selectedProvince;//globa variable
var srsc = [];//specific rank for specific city [cityname,cityranking]
var psvg = function () {
	var width = 500;
	var height = 350;
	var svg3 = d3.select("body div.detail")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("border-radius", "5px");
	// .style("background-color","#c8d9eb");
	return svg3;
}
var getCityColor = function (cityname, leftcolor) {
	//如果colors中存有这个省份就返回color属性，否则的话返回指定的颜色值
	for (var i = 0; i < rankings.length; i++) {
		if (rankings[i].incity == cityname) {
			return colors[i];
		}
	}
	//黑色的区域表示
	return leftcolor;//否则返回指定的最浅的颜色值
}
var querySelect = function (inpro, outpro, mapdata, x, y) {
	$.ajax({
		type: "post",
		url: "/getcityrank",
		data: {
			"inpro": inpro,
			"outpro": outpro
		},
		async: true,
		dataType: "json",
		success: function (data) {
			rankings = data;
			// colors=colorsArray3(rankings); 返回色系是从深色到浅色 和 rankings对应
			colors = colorsArray3("rgb(253,208,162)", "rgb(217,72,1)", rankings.length);
			//console.log(colors);
			for (var keys in rankings) {
				srsc[rankings[keys].incity] = rankings[keys].ranking;
			}
			// console.log(srsc);
			drawDetailMap(mapdata, x, y);
		},
		error: function (err) {
			console.log("error" + err.message);
		}
	});
}
var getlinecolor = function (key, line) {
	var r = 0;
	var g = 0;
	var b = 0;

	var tem = d3.scale.linear();
	tem.domain([0, 1])
		.range([0, 1]);
	// r=tem(key);
	// g=tem(key);
	b = tem(key);
	var color = "rgb(" + r + "," + g + "," + b + ")";
	return color;
}
// 根据圆的半径进行缩放操作
var radiusScale = d3.scale.linear();
radiusScale.domain([0, 50])
	.range([4, 30]);
var drawCircle = function (x, y, color, proname, radius, order) {
	//为每一个圆点注册点击事件
	//根据 某个省份统计数据的大小来绘制终点圆形 以便注册点击事件
	var c_r;
	if (order == 0) {
		c_r = 4;
	} else {
		c_r = radiusScale(radius);
	}
	// console.log(proname+"proname");
	circles.append("circle")
		.attr("class", "pcircle")
		.attr("id", "c" + proname)
		.attr("cx", x)
		.attr("cy", y - 30)
		.attr("r", c_r)
		.attr("stroke", color)
		.attr("fill", color)
		.on("click", function (d) {
			//点击小圆点刷新地图显示从该省份出去的物流信息
			var id = d3.select(this).attr("id");
			id = id.substring(1, id.length);
			var res=pageType();
			refreshMap(id,res);
			d3.select("#opro").text(id);
			//console.log("click on circle");
		})
		.on("mouseover", function () {

			var g = circles.append("g")
				.attr("class", "textg")
				.attr("storke-width", "1");

			g.append("text")
				.attr("class", "temtext")
				.attr("x", x)
				.attr("y", y - 50)
				.attr("stroke", "white")
				.attr("fill", "white")
				.attr("font-size", "20px")
				.text(proname)
				.transition()
				.duration(100)
				.ease("linear")
				.attr("y", y - 30);


			g.append("text")
				.attr("class", "temtext")
				.attr("x", x)
				.attr("y", y - 50)
				.attr("stroke", "white")
				.attr("fill", "white")
				.attr("font-size", "20px")
				.text("进货量" + radius.toFixed(2))
				.transition()
				.duration(100)
				.ease("linear")
				.attr("y", y - 10);

		})
		.on("mouseout", function () {
			d3.selectAll(".textg").remove();
		})
		.transition()
		.duration(1200)
		.ease("elastic")
		.attr("cx", x)
		.attr("cy", y);

	var ordertext = circles.append("text")
		.attr("class", "text")
		.attr("x", x - 5)
		.attr("y", y)
		.attr("stroke-width", 1)
		.attr("stroke", "#d9d9d9");
	   ordertext.text("");
}

var drawCurveLine2 = function (mline, spoint, epoint, key, lines, tcargo,type) {
	//为前5名设置线的宽度为2
	//update province =spoint.pro
	var startpoint = {};
	var endpoint = {};
	if(type==0){
		startpoint = projection([parseFloat(spoint.x), parseFloat(spoint.y)]);
		endpoint = projection([parseFloat(epoint.x), parseFloat(epoint.y)]);
	
	}else{
		startpoint = projection([parseFloat(epoint.x), parseFloat(epoint.y)]);
		endpoint = projection([parseFloat(spoint.x), parseFloat(spoint.y)]);
	}
	var key = parseInt(key);
	var width = 1;
	var color = procolors[key - 1];
	var ratio = 0;
	ratio = parseFloat(key / lines);
	var radius = 140 * (Math.PI / 180);
	var temid = "tem" + key;
	//console.log(color);
	var text = temid.substring(3);
	var scale=0;
	if(type==0){
	drawCircle(endpoint[0], endpoint[1], color, epoint.pro, tcargo, parseInt(text));
	scale=0.5;
	}else{
	drawCircle(startpoint[0], startpoint[1], color, epoint.pro, tcargo, parseInt(text));
	scale=0.2;
	}
	var qx = scale* (endpoint[0] - startpoint[0]);
	var qy = 0* (Math.abs(startpoint[1] - endpoint[1]));
	var endx = endpoint[0] - startpoint[0];
	var endy = endpoint[1] - startpoint[1];
	//d使用小写的q代表的是相对坐标
	var d = "M " + startpoint[0] + "," + startpoint[1] + " q " + qx + "," + qy + " " + endx + "," + endy;
	mline.append("path")
		.attr("class", "line")
		.attr("id", temid)
		.attr("d", d)
		.attr("fill", "transparent")
		.attr("stroke", color)
		.attr("stroke-width", width)
		.on('mouseover',function(){
			console.log("mouseover it");
		}
		,true)
		.on('click',function(){
            console.log("click curveline");
		},true);
	var route = document.querySelector("#" + temid);
	var length = route.getTotalLength();
	//this code clear all the transition effect before this item 
	route.style.transition = route.style.webkitTransition = "none";

	//set up the starting positions
	route.style.strokeDasharray = length + " " + length;
	route.style.strokeDashoffset = length;

	//trigger a lyout so styles are calculated and the 
	//browser picks up the starting possition before animationg
	route.getBoundingClientRect();
	//define our transition
	route.style.transition = route.style.webkitTransition = "stroke-dashoffset 2s ease-in-out";

	route.style.strokeDashoffset = "0";
	width = 0;
	color = "";
}
var graph = function (width, height) {
	// var background="#020814"; 
	var background = "#020814";
	var svg = d3.select("body div.fxmap")
		.append("svg")
		.attr("stroke", "#00bcd4")
		.attr("width", width)
		.attr("height", height)
		.attr("right", "0")
		.style("background", background)
		.style("border-radius", "3px");
	return svg;
}
var leftSvg = function () {
	var width = 470;
	var height = 730;
	var svg2 = d3.select("body div.svg_box")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("background-color", "none")
		.style("opacity", "");

	return svg2;
}
var drawDetailMap = function (data, x, y) {
	var cities = [];
	for (var i = 0; i < data.length; i++) {
		cities.push(
			{
				"lat": data[i].properties.cp[0],
				"log": data[i].properties.cp[1],
				"name": data[i].properties.name
			}
		);
	}
	var item = parseInt(data.length / 2);
	var centerpoint = getCenterPoint(cities);
	var scaletime = getScaleTimes(cities);
	var dp =
		d3.geo.mercator()
			.center([centerpoint[0].lat, centerpoint[0].log])
			.scale(scaletime)
			.translate([x, y]);

	var dpath = d3.geo.path().projection(dp);
	detail_map.selectAll("path")
		.data(data)
		.enter()
		.append("path")
		.attr("fill", function (d, i) {
			return getCityColor(d.properties.name, "#7bccc4");
		})
		.attr("d", dpath)
		.on("mouseover", function () {
			d3.select(this).attr("class", "orange");
			// console.log("hover");
		})
		.on("mouseout", function () {
			d3.select(this).attr("class", "");
			// console.log("out");
		})
		.on('click', function () {
			// console.log("click");
		})
	//在地图上面标注市信息
	var location = province.selectAll("location")
		.data(cities)
		.enter()
		.append("g")
		.attr("class", "info")
		.attr("transform", function (d) {
			//计算标注点位置
			var coor = dp([d.lat, d.log]);
			return "translate(" + coor[0] + "," + coor[1] + ")";
		});

	location.append("circle")
		.attr("r", 3)
		.style("fill", function (d, i) {
			return "#ea9c1b";
		});
	location.append("text")
		.text(function (d) {
			return d.name;
		})
		.attr("fill", function (d, i) {
			return "#08306b";
		})
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-setif")
		.attr("font-size", "10px")
		.attr("font-weight", "250")
		.style("fill-opacity", 0)
		.on("mouseover", function (d) {
			var otext = d3.select(this).text();
			var ntext;

			if (srsc[otext] === undefined) {
				ntext = otext + ":0";
			} else {
				ntext = otext + ":" + srsc[otext].toFixed(2);
			}

			d3.select(this).attr("font-size", "20px")
				.attr("font-weight", "bold")
				.attr("fill", "black")
				.text(ntext)
				.style("fill-opacity", 1);

		})
		.on("mouseout", function () {
			var otext = d3.select(this).text();
			var ntext = otext.substring(0, otext.indexOf(":"));
			d3.select(this).attr("font-size", "10px")
				.attr("font-weight", "250")
				.attr("fill", "#ea9c1b")
				.text(ntext)
				.style("fill-opacity", 0);
		});
}
var refreshMap = function (proname,type) {
	//data表示从selectedprovince向外省出口的省份序列
	//imp表示向selectedprovince卖货的省份序列
	var data;
	if(type==0){
		data=cargolinks[proname].exp;
	}else if(type==1){
		data=cargolinks[proname].imp;
	}
	//获取该省份市中心
	var sx = centers[procenter[proname]].x;
	var sy = centers[procenter[proname]].y;
	//sort data by sortFunction
	var key = 0;
	mline.selectAll(".line").remove();
	mline.selectAll(".text").remove();
	//清除已经有的svg2的部分
	svg2.selectAll("g").remove();
	clearCircles();//清除原来地图上已经标注的省中心
	selectedProvince = proname;


	var ddata = Object.keys(data).sort(function (a, b) {
		return data[b] - data[a];
	});

	var dataset = [];
	procolors = colorsArray3("rgb(253,208,162)", "rgb(217,72,1)", ddata.length);
	var spoint = {
		"x": sx,
		"y": sy,
		"pro": proname
	}
	for (var keys in ddata) {
		dataset.push(
			{
				"pro": ddata[keys],
				"tcargo": data[ddata[keys]],
				"position": key
			});
		// .log(data[ddata[keys]]); 江苏有运往钓鱼岛的货物没法画出来
		key++;
		var ex = 0;
		var ey = 0;
		if (ddata[keys] == "钓鱼岛") {
			ex = 123.284;
			ey = 25.446;
		} else {
			// console.log(ddata[keys]);
			ex = centers[procenter[ddata[keys]]].x;
			ey = centers[procenter[ddata[keys]]].y;
		}

		var epoint = {
			"x": ex,
			"y": ey,
			"pro": ddata[keys]
		}
		
		drawCurveLine2(mline, spoint, epoint, key, ddata.length, dataset[keys].tcargo,type);
		
	}
	key = 0;
	drawRight(dataset, svg2);
}

var drawRight = function (dataset, container) {
	var width = 470,
		leftMargin = 10,
		topMargin = 0,
		rightMargin = 15,
		barHeight = 18,
		barGap = 4,
		tickGap = 5,
		tickHeight = 10,
		barSpacing = barHeight + barGap,
		translateText = "translate(" + leftMargin + "," + topMargin + ")";
	var x = d3.scale.linear()
		.domain([0, d3.max(dataset, function (element) { return element.tcargo })])
		.range([0, width]);
	var barGroup = container.append("g")
		.attr("transform", translateText)
		.attr("class", "bar");

	barGroup.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("class", "rect")
		.attr("id", function (d) { return d.pro })
		.attr("x", 0)
		.attr("y", function (d) { return d.position * barSpacing })
		.attr("width", function (d) { return x(d.tcargo) })
		.attr("height", barHeight)
		.attr("fill", function (d) {
			if (d.position <= 2) {
				return "#006d2c";
			} else if (d.position >= 25) {
				return "#f03b20";
			} else {
				return "#74c476"
			}
		})
		.on("click", function (d) {
			var yalias = 200;
			var xalias = 250;
			//显示到具体的市级单位 以市级单位的第一个区为中心绘制具体地图
			//选中左侧的circle元素，制作闪烁效果

			if (d3.select(this).attr("id") == "钓鱼岛") {
				//直接显示钓鱼岛的tcargo是多少
				alert("钓鱼岛地图尚未完备，请选看其余省份");
			}
			//台湾
			if (d3.select(this).attr("id") == "台湾") {
				alert("数据库未提供准确的省市分布数据");
			}
			if (d3.select(this).attr("id") == "港澳") {
				alert("数据库未提供准确的省市分布数据");
			}
			if (d3.select(this).attr("id") == "青海") {
				xalias = 300;
			}
			if (d3.select(this).attr("id") == "重庆") {
				xalias = 200;
			}
			if (d3.select(this).attr("id") == "新疆") {
				yalias = 190;
			}
			bling("c" + d3.select(this).attr("id"));
			var pname = getPinyin(d3.select(this).attr("id"));
			var chinese = d3.select(this).attr("id");
			var path = "./data/local/" + pname + ".json";
			var mapdata = [];
			//清除掉之前显示的detail地图
			province.selectAll(".info").remove();
			detail_map.selectAll("*").remove();

			d3.json(path, function (error, data) {
				//根据货运量绘制地图 以及着色
				if (error) {
					console.log(error);
				}
				mapdata = data.features;
				querySelect(chinese, selectedProvince, mapdata, xalias, yalias);
			});

		});

	var barLabelGroup = container.append("g")
		.attr("transform", translateText)
		.attr("class", "bar-label");

	barLabelGroup.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.style("stroke", "white")
		.attr("province", function (d) {
			return d.pro;
		})
		.attr("class", "pointer")
		.attr("fill", "white")
		.attr("x", 20)
		.attr("y", function (d) { return d.position * barSpacing + barHeight * (2 / 3) + 2 })
		.text(function (d) {
			var text = parseInt(parseInt(d.position) + 1) + " " + d.pro + "  " + d.tcargo.toFixed(2);
			return text;
		})
		.on('click', function (d) {
			//redraw map in the left bottom
			var yalias = 175;
			var xalias = 250;
			//显示到具体的市级单位 以市级单位的第一个区为中心绘制具体地图
			if (d3.select(this).attr("province") == "钓鱼岛") {
				//直接显示钓鱼岛的tcargo是多少
				alert("钓鱼岛地图尚未完备，请选看其余省份");
				return;
			}
			//台湾
			if (d3.select(this).attr("province") == "台湾") {
				alert("数据库未提供准确的省市分布数据");
				return;
			}
			if (d3.select(this).attr("province") == "港澳") {
				alert("数据库未提供准确的省市分布数据");
				return;
			}
			if (d3.select(this).attr("province") == "黑龙江") {
				yalias = 200;
			}
			if (d3.select(this).attr("province") == "青海") {
				xalias = 300;
			}
			if (d3.select(this).attr("province") == "重庆") {
				xalias = 200;
			}
			if (d3.select(this).attr("province") == "甘肃") {
				xalias = 320;
			}
			bling("c" + d3.select(this).attr("province"));
			var pname = getPinyin(d3.select(this).attr("province"));
			var chinese = d3.select(this).attr("province");
			var path = "./data/local/" + pname + ".json";
			var mapdata = [];
			//清除掉之前显示的detail地图
			province.selectAll(".info").remove();
			detail_map.selectAll("*").remove();

			d3.json(path, function (error, data) {
				//根据货运量绘制地图 以及着色
				if (error) {
					console.log(error);
				}
				mapdata = data.features;
				querySelect(chinese, selectedProvince, mapdata, xalias, yalias);
			});


		});
}
var getCenterPoint = function (array) {
	var center = [];
	var sum1 = 0;
	var sum2 = 0;
	var size = array.length;
	for (var i = 0; i < array.length; i++) {
		sum1 += parseFloat(array[i].lat);
		sum2 += parseFloat(array[i].log);
	}
	center.push(
		{
			"lat": parseFloat(sum1 / size),
			"log": parseFloat(sum2 / size)
		}
	);
	return center;
}
var getScaleTimes = function (array) {
	//console.log(array);
	var times = 27;
	//判断是否是重庆
	if (array[1].name == "奉节县") {
		//是重庆地区
		times = 42;
	}
	if (array[1].name == "和田地区") {
		times = 33;
	}
	var maxx = 0, minx = 10000, maxy = 0, miny = 10000;
	for (var i = 0; i < array.length; i++) {
		if (minx > array[i].lat) {
			minx = array[i].lat;
		}
		if (maxx < array[i].lat) {
			maxx = array[i].lat;
		}
		if (miny > array[i].log) {
			miny = array[i].log;
		}
		if (maxy < array[i].log) {
			maxy = array[i].log;
		}
	}
	var disx = maxx - minx;
	var disy = maxy - miny;
	var time1 = parseInt(500 / disx);
	var time2 = parseInt(320 / disy);
	return time1 < time2 ? times * time1 : times * time2;
}

var init = function () {
	tg.append("text")
		.attr("x", 10)
		.attr("y", 30)
		.style("font-size", "18px")
		.attr("stroke", "white")
		.attr("fill", "white")
		.text("售出省份:");

	tg.append("text")
		.attr("id", "opro")
		.attr("x", 95)
		.attr("y", 30)
		.style("font-size", "18px")
		.attr("stroke", "white")
		.attr("fill", "white")
		.text("");

	button.append("circle")
		.attr("id", "sh")
		.attr("cx", 400)
		.attr("cy", 30)
		.attr("r", 30)
		.attr("fill", "#7fcdbb")
		.style("border-radius", "100%");

	button.append("text")
		.text("上海")
		.attr("x", 380)
		.attr("y", 35)
		.style("font-size", "20px")
		.attr("fill", "white");
	button.on('mouseover', function () {
		d3.select("#sh").attr("r", 35)
			.attr("fill", "#f03b20");
	})
		.on("mouseout", function () {
			d3.select("#sh").attr("r", 30)
				.attr("fill", "#7fcdbb")
		})
		.on("click", function () {
			refreshMap("上海",pageType());
			d3.select("#opro").text("上海");
		});

	var item1 = province.append("g")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("id", "noninput");
	item1.append("rect")
		.attr("x", 10)
		.attr("y", 50)
		.attr("width", 20)
		.attr("height", 10)
		.attr("fill", "#7bccc4");
	item1.append("text")
		.attr("x", 50)
		.attr("y", 60)
		.attr("stroke", "black")
		.attr("fill", "black")
		.text("none");


	var item2 = province.append("g")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("id", "noninput");
	item2.append("rect")
		.attr("x", 10)
		.attr("y", 70)
		.attr("width", 20)
		.attr("height", 10)
		.attr("fill", "rgb(253,208,162)");
	item2.append("text")
		.attr("x", 50)
		.attr("y", 80)
		.attr("stroke", "black")
		.attr("fill", "black")
		.text("min");
	var item3 = province.append("g")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("id", "noninput");
	item3.append("rect")
		.attr("x", 10)
		.attr("y", 90)
		.attr("width", 20)
		.attr("height", 10)
		.attr("fill", "rgb(217,72,1)");
	item3.append("text")
		.attr("x", 50)
		.attr("y", 100)
		.attr("stroke", "black")
		.attr("fill", "black")
		.text("max");

}
var bling = function (itemid) {
	// 半径由大变小，颜色变成纯蓝色
	console.log(itemid);
	var ocolor = d3.select("#" + itemid).attr("fill");
	var r = d3.select("#" + itemid).attr("r");
	console.log("R" + r);
	d3.select("#" + itemid)
		.transition()
		.duration(500)
		.ease("linear")
		.attr("r", 1)
		.attr("fill", "red");


	d3.select("#" + itemid)
		.transition()
		.delay(500)
		.duration(800)
		.ease("linear")
		.attr("r", r)
		.attr("fill", ocolor);

	d3.select("#" + itemid)
		.transition()
		.delay(1300)
		.duration(500)
		.ease("linear")
		.attr("r", 1)
		.attr("fill", "red");

	d3.select("#" + itemid)
		.transition()
		.delay(1800)
		.duration(800)
		.ease("linear")
		.attr("r", r)
		.attr("fill", ocolor);
}
//judge the page from url
// index.html 0 index2.html 1
var pageType = function () {
	var name = window.location.href;

	if (name.indexOf("index2.html") >=0) {
		return 1;
	} else {
		return 0;
	}
	console.log("method ends");
}