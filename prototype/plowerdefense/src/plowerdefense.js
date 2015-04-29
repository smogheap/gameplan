var PD = {
	WIDTH: 840,
	HEIGHT: 480,
	canvas: null,
	scene: null,
	json: {},
	thing: {},
	sperms: []
};
function LOAD(json) {
	var data = json;
	var name = data.name || "anonymous";
	PD.json[name] = data;
}
function combineCallbacks(cbList, resultsVary, cb) {
	var results = [];
	var res = [];
	var uniq = [];
	while(results.length < cbList.length) {
		results.push(null);
	}

	cbList.every(function(callback, idx) {
		return callback(function(val) {
			res.push(val);
			results[idx] = val;
			if(uniq.indexOf(val) < 0) {
				uniq.push(val);
			}
			if(res.length === cbList.length) {
				if(uniq.length === 1) {
					cb(uniq[0], results);
				} else if(uniq.length > 1) {
					cb(resultsVary, results);
				} else {
					cb(null, results);
				}
			}
		});
	});
}
var requestAnimationFrame = (window.requestAnimationFrame ||
							 window.mozRequestAnimationFrame ||
							 window.webkitRequestAnimationFrame ||
							 window.msRequestAnimationFrame || function(cb) {
								 setTimeout(cb, 10, new Date());
							 });

function tick(scene, time) {
	PD.thing.sperm.$.head.rotate = Math.sin(time / 100) * 5;
	PD.thing.sperm.$.tail1.rotate = Math.sin(time / 100) * -40;
	PD.thing.sperm.$.tail2.rotate = Math.cos(time / 100) * 40;
	PD.thing.sperm.$.tail3.rotate = Math.sin(time / 100) * 40;

	PD.sperms[0].y--;
	if(PD.sperms[0].y < 0) {
		PD.sperms[0].y = PD.HEIGHT;
	}
	PD.sperms[1].x++;
	if(PD.sperms[1].x > PD.WIDTH) {
		PD.sperms[1].x = 0;
	}
	PD.sperms[2].y++;
	if(PD.sperms[2].y > PD.HEIGHT) {
		PD.sperms[2].y = 0;
	}
	PD.sperms[3].x--;
	if(PD.sperms[3].x < 0) {
		PD.sperms[3].x = PD.WIDTH;
	}
}

function start() {
	PD.scene = new penduinSCENE(PD.canvas,
								PD.WIDTH, PD.HEIGHT,
								tick, 60, 60, true);
	PD.scene.setBG("#211");
//	PD.scene.showFPS(true);
	PD.scene.addOBJ(PD.thing.sperm);
	PD.sperms = [
		{
			x: 100,
			y: 100,
			rotate: 0
		},
		{
			x: 200,
			y: 200,
			rotate: 90
		},
		{
			x: 300,
			y: 300,
			rotate: 180
		},
		{
			x: 400,
			y: 400,
			rotate: 270
		}
	];
	PD.thing.sperm.setInstances(PD.sperms);
	PD.thing.sperm.x = PD.WIDTH / 2;
	PD.thing.sperm.y = PD.HEIGHT / 2;
}

window.addEventListener("load", function() {
	PD.canvas = document.querySelector("#display");
	var cbs = [];

	// load object armatures
	Object.keys(PD.json).every(function(key) {
		cbs.push(function(cb) {
			PD.thing[key] = new penduinOBJ(PD.json[key], cb);
			return true;
		});
		return true;
	});

	combineCallbacks(cbs, null, start);
});
