var BATTLE = {
	WIDTH: 640,
	HEIGHT: 360,
	canvas: null,
	scene: null,
	json: {},
	thing: {},
	text: {},

	MAXUNITS: 4,
	white: [],
	black: [],

	drag: null,

	input: {
		up: false,
		down: false,
		left: false,
		right: false,
		menu: false
	}
};
function LOAD(json) {
	var data = json;
	var name = data.name || "anonymous";
	BATTLE.json[name] = data;
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
var TO_RADIANS = Math.PI / 180;
var requestAnimationFrame = (window.requestAnimationFrame ||
							 window.mozRequestAnimationFrame ||
							 window.webkitRequestAnimationFrame ||
							 window.msRequestAnimationFrame || function(cb) {
								 setTimeout(cb, 10, new Date());
							 });

function tick(scene, time) {
//	BATTLE.thing.black.$.sword.rotate = (Math.sin(time / 200) * 90);
//	BATTLE.thing.white.$.sword.rotate = (Math.cos(time / 200) * 10);
	["black", "white"].every(function(team) {
		BATTLE[team].every(function(fighter) {
			if(time % (fighter.rest + fighter.swing) < fighter.rest) {
				// rest phase
				fighter.obj.$.sword.scale = 0.2;
				fighter.obj.$.sword.rotate = 0;
			} else {
				// swing phase
				fighter.obj.$.sword.scale = 1;
			}
			return true;
		});
		return true;
	});
}

function start() {
	BATTLE.scene = new penduinSCENE(BATTLE.canvas, BATTLE.WIDTH, BATTLE.HEIGHT,
									tick);
	BATTLE.scene.setBG("#888");
	BATTLE.scene.showFPS(true);

/*
	BATTLE.scene.addOBJ(BATTLE.thing.white);
	BATTLE.thing.white.x = BATTLE.WIDTH * 1 / 8;
	BATTLE.thing.white.y = BATTLE.HEIGHT * 7 /8;

	BATTLE.scene.addOBJ(BATTLE.thing.black);
	BATTLE.thing.black.x = BATTLE.WIDTH * 7 / 8;
	BATTLE.thing.black.y = BATTLE.HEIGHT * 1 / 8;
*/

	BATTLE.scene.addOBJ(BATTLE.thing.whitecastle);
	BATTLE.thing.whitecastle.x = BATTLE.WIDTH * 1 / 8;
	BATTLE.thing.whitecastle.y = BATTLE.HEIGHT * 7 /8;

	BATTLE.scene.addOBJ(BATTLE.thing.blackcastle);
	BATTLE.thing.blackcastle.x = BATTLE.WIDTH * 7 / 8;
	BATTLE.thing.blackcastle.y = BATTLE.HEIGHT * 1 / 8;

	BATTLE.scene.addOBJ(BATTLE.thing.aim);
/*
	BATTLE.text.lvl = new penduinTEXT("wave x", 30, "white", 0.5, 1, true);
	BATTLE.text.level = new penduinTEXT("title", 40, "white", 0.5, 0, true);
	BATTLE.text.lvl.setVisible(false);
	BATTLE.text.level.setVisible(false);
	BATTLE.text.lvl.x = BATTLE.text.level.x = BATTLE.WIDTH / 2;
	BATTLE.text.lvl.y = BATTLE.text.level.y = BATTLE.HEIGHT / 2;
	BATTLE.scene.addTEXT(BATTLE.text.lvl);
	BATTLE.scene.addTEXT(BATTLE.text.level);

	BATTLE.text.score = new penduinTEXT("00000000", 20, "white", 0.5, 0, true);
	BATTLE.text.score.setVisible(true);
	BATTLE.text.score.x = BATTLE.WIDTH / 2;
	BATTLE.text.score.y = 4;
	BATTLE.scene.addTEXT(BATTLE.text.score);

	BATTLE.text.chain = new penduinTEXT("1x CHAIN", 15, "#ff0", 0.5, 1, true);
	BATTLE.text.chain.setVisible(false);
	BATTLE.scene.addTEXT(BATTLE.text.chain);

	BATTLE.text.points = new penduinTEXT("0", 15, "white", 0.5, 0, true);
	BATTLE.text.points.setVisible(false);
	BATTLE.scene.addTEXT(BATTLE.text.points);
	*/
}

function create(team) {
	if(BATTLE[team].length >= BATTLE.MAXUNITS) {
		console.log("nope! too many");
		return;
	}
	var obj = JSON.parse(JSON.stringify(BATTLE.json[team]));
	obj.name = null;
	obj.scene = null;
	console.log(obj);
	obj = new penduinOBJ(obj, function() {
		obj.$.dot.rotate = Math.random() * 360;
		BATTLE[team].push({
			rest: Math.random() * 4000,
			swing: Math.random() * 500,
			obj: obj
		});
		BATTLE.scene.addOBJ(obj);
		obj.x = BATTLE.thing[team + "castle"].x + (Math.random() * 20 - 10);
		obj.y = BATTLE.thing[team + "castle"].y + 10 + (Math.random() * 20 - 10);
	});
}

function mousedown(e) {
	var scale = BATTLE.scene.getScale();
	var dx = 0;
	var dy = 0;

	["black", "white"].every(function(team) {
		// on a fighter?
		BATTLE[team].every(function(fighter, idx) {
			dx = BATTLE.thing.aim.x - fighter.obj.x;
			dy = BATTLE.thing.aim.y - fighter.obj.y;
			if(dx > -25 && dx < 25 && dy > -25 && dy < 25) {
				console.log(team + " fighter " + idx);
				BATTLE.drag = fighter;
				return false;
			}
			return true;
		});

		if(BATTLE.drag) {
			return false;
		}

		//on a castle?
		dx = BATTLE.thing.aim.x - BATTLE.thing[team + "castle"].x;
		dy = BATTLE.thing.aim.y - BATTLE.thing[team + "castle"].y;
		if(dx > -25 && dx < 25 && dy > -25 && dy < 25) {
			console.log(team + " castle");
			create(team);
			return false;
		}
		return true;
	});

	e.preventDefault();
	return false;
}
function mouseup(e) {
	BATTLE.drag = null;
}

window.addEventListener("load", function() {
	BATTLE.canvas = document.querySelector("#display");

	BATTLE.canvas.addEventListener("mousemove", function(e) {
		if(!BATTLE.thing.aim) {
			return;
		}
		var scale = BATTLE.scene.getScale();
		BATTLE.thing.aim.x = (e.clientX - e.target.offsetLeft) / scale;
		BATTLE.thing.aim.y = (e.clientY - e.target.offsetTop) / scale;

		if(BATTLE.drag) {
			BATTLE.drag.obj.x = BATTLE.thing.aim.x;
			BATTLE.drag.obj.y = BATTLE.thing.aim.y - 1;
		}
	});
	BATTLE.canvas.addEventListener("mousedown", mousedown);
	BATTLE.canvas.addEventListener("mouseup", mouseup);
	BATTLE.canvas.addEventListener("mouseout", mouseup);

	var cbs = [];
	// load object armatures
	Object.keys(BATTLE.json).every(function(key) {
		cbs.push(function(cb) {
			BATTLE.thing[key] = new penduinOBJ(BATTLE.json[key], cb);
			return true;
		});
		return true;
	});
	combineCallbacks(cbs, null, start);
});

function handlekey(event, down) {
	switch(event.keyCode) {
	case 38:  //up
	case 104: //num8
	case 87:  //w
		BATTLE.input.up = down;
		break;
	case 40:  //down
	case 98:  //num2
	case 83:  //s
		BATTLE.input.down = down;
		break;
	case 37:  //left
	case 100: //num4
	case 65:  //a
		BATTLE.input.left = down;
		break;
	case 39:  //right
	case 102: //num6
	case 68:  //d
		BATTLE.input.right = down;
		break;
	case 32:  //space
//		BATTLE.input.restart = down;
		BATTLE.input.menu = down;
		break;
	case 27:  //esc
		BATTLE.input.menu = down;
		break;
	case 61:  //+
	case 107: //num+
		if(down) {
			score();
			BATTLE.victory = 1;
		}
		break;
	case 109: //num-
	case 173: //-
		if(down) {
			score();
			BATTLE.level -= 2;
			BATTLE.victory = 1;
		}
		break;
	default:
		return;
		break;
	}
	event.preventDefault();
};
window.addEventListener("keydown", function(e) {
	handlekey(e, true);
});
window.addEventListener("keyup", function(e) {
	handlekey(e, false);
});

window.addEventListener("selectstart", function(e) {
	e.preventDefault();
	return false;
});
window.addEventListener("dblclick", function(e) {
});
