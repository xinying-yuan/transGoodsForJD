var procenter = getProCenter();
var centers = {};
var cargolinks = {};
var procolors = {};
//创建svg
var width = 800;
var height = 610;
var background = "#020814";
var svg = graph(width, height);//地图主体
var svg2 = leftSvg();	//left svg		
var province = psvg();

var gmap = svg.append("g")
	.attr("id", "map")
	.attr("stroke", "#00bcd4")
	.attr("stroke-width", 1);
var mline = svg.append("g")
	.attr("id", "moveto")
	.attr("stroke", "#FFF")
	.attr("stroke-width", 1.5)
	.attr("fill", "#FFF");
var circles = svg.append("g")
	.attr("id", "cg")
	.attr("storke", "#fff")
	.attr("stroke-width", 1);
var button = svg.append("g")
	.attr("id", "button")
	.attr("stroke", "white")
	.attr("stroke-width", 1)
	.attr("fill", "white");

var tg = svg.append("g")
	.attr("id", "titlegroup")
	.attr("stroke", "white")
	.attr("stroke-width", 1)
	.attr("fill", "white");

var detail_map = province.append("g")
	.attr("id", "detail_map")
	.attr("stroke", "white")
	.attr("stroke-width", 1);
//创建投影函数 经纬度不能够直接用于绘图，必须与c上面的坐标进行转换
mapdata = [];
var projection = d3.geo.mercator()
	.center([105, 39])  // 指定投影中心，注意[]中的是经纬度
	.scale(670)
	.translate([width / 2, height / 2]);
var path = d3.geo.path().projection(projection);
var china = d3.json('./data/china.json', function (error, data) {
	//初始化
	init();
	mapdata = data.features;
	// 绘制地图
	gmap.selectAll("path")
		.data(mapdata)
		.enter()
		.append("path")
		.attr("fill", background)
		.attr("d", path)
		.on("mouseover", function (d, i) {
			d3.select(this)
				.attr("fill", "#1957f5")
				// .attr("fill","#ff5722")
				.attr("fill-opacity", 0.2);
		})
		.on("mouseout", function (d, i) {
			d3.select(this)
				.attr("fill", background)
				.attr("fill-opacity", 1);
				console.log("down to next node");
		})
		.on("click", function (d, i) {
			var res=pageType();
			console.log(res);
			refreshMap(d.properties.name,res);
			d3.select("#opro").text(d.properties.name);
			console.log("down to next dom");
		});
	//先绘制大地图，然后绘制省行政中心 这样才能够保证行政中心不被遮挡住
	d3.csv("./data/capital.csv", function (data) {
		clearCircles();
		for (var i = 0; i < data.length; i++) {
			centers[data[i].name] = { "x": data[i].x, "y": data[i].y };
			var itempro = projection([data[i].x, data[i].y]);
			drawCircle(itempro[0], itempro[1], "#fdb462", data[i].pro, 0, 0);
		}
	});
});
var csv = d3.dsv(",", "text/csv;charset=GB2312");
// inpro,incity,outpro,outcity,cargo
csv("./data/data-transition.csv", function (data) {
	
	for (var i = 0; i < data.length; i++) {

		var obj = {
			"exp": {},
			"imp": {}
		};

		//字典序列 含有 exp 和 imp两项内容
		if (cargolinks[data[i].outpro] == null) {
			// console.log("init name");
			//先省对省出口可视化
			cargolinks[data[i].outpro] = obj;
		}
		if (cargolinks[data[i].inpro] == null) {
			// console.log("init2 name");
			cargolinks[data[i].inpro] = obj;
		}
		if (cargolinks[data[i].outpro].exp[data[i].inpro] == null) {
			cargolinks[data[i].outpro].exp[data[i].inpro] = parseFloat(data[i].cargo);
		} else {
			//已经存储过了 直接使用cargo相加
			var item = cargolinks[data[i].outpro].exp[data[i].inpro];
			cargolinks[data[i].outpro].exp[data[i].inpro] = parseFloat(item) + parseFloat(data[i].cargo);
		}

		if (cargolinks[data[i].inpro].imp[data[i].outpro] == null) {
			cargolinks[data[i].inpro].imp[data[i].outpro] = parseFloat(data[i].cargo);
		} else {
			var item = cargolinks[data[i].inpro].imp[data[i].outpro];
			cargolinks[data[i].inpro].imp[data[i].outpro] = parseFloat(item) + parseFloat(data[i].cargo);
		}
	}
});


var scale = d3.scale.linear();
scale.domain([0, 1000, 2000])
	.range([0, 1, 0]);
var start = Date.now();

d3.timer(function () {
	var s1 = scale((Date.now() - start) % 2000);
	gmap.selectAll("circle.province")
		.attr("stroke-opacity", s1);

	gmap.selectAll("circle.cirout")
		.attr("stroke-opacity", s1);

});