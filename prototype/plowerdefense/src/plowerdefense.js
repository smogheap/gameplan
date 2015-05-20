var PD = {
	WIDTH: 840,
	HEIGHT: 480,
	MAXSHOTS: 2,
	canvas: null,
	scene: null,
	json: {},
	thing: {},
	text: {},
	sperms: [],
	shots: [],
	input: {
		up: false,
		down: false,
		left: false,
		right: false,
		menu: false
	},
	speed: 0,
	oldangle: 0,
	level: null,
	startwave: 0,
	activesperm: 0,
	remaining: 0,
	spermspeed: 0,
	spermvary: 0,
	spermmeander: 0,
	spermorbit: 0,
	spermchase: 0,
	victory: 0,
	score: 0,
	chain: 0,
	showpoints: 0
};
var LEVELS = [
	{
		title: "Lock and load!",
		total: 10,
		active: 3,
		speed: 0.5,
		speedvary: 0.2,
		meander: 1,
		orbit: 0,
		chase: 0
	}, {
		title: "Come at me!",
		total: 10,
		active: 3,
		speed: 0.5,
		speedvary: 0.2,
		meander: 0,
		orbit: 0,
		chase: 1
	}, {
		title: "Time to get spanked!",
		total: 10,
		active: 5,
		speed: 1,
		speedvary: 0.5,
		meander: 0,
		orbit: 1,
		chase: 0
	}, {
		title: "You wanna piece?",
		total: 20,
		active: 1,
		speed: 3,
		speedvary: 0.5,
		meander: 0,
		orbit: 0,
		chase: 1
	}, {
		title: "You Suck!",
		total: 30,
		active: 10,
		speed: 2,
		speedvary: 0.5,
		meander: 0.2,
		orbit: 0.6,
		chase: 0.2
	}, {
		title: "Yo, hit me, bro!",
		total: 30
	}, {
		title: "LOL OMG NO HOMO!",
		total: 30
	}, {
		title: "Eat your protein!",
		total: 30
	}, {
		title: "Ladies first, asshole!",
		total: 30
	}, {
		title: "What up, bay-bee?",
		total: 30
	}, {
		title: "OMG that was the worst!",
		total: 50
	}, {
		title: "Tomorrow = Beer shits",
		total: 50
	}, {
		title: "Plan B",
		total: 50
	}, {
		title: "Thanks, guys!",
		total: 50
	}, {
		title: "Get off me, bro!",
		total: 50
	}, {
		title: "Your chocolate / my peanut butter!",
		total: 50
	}, {
		title: "Where's the beef??",
		total: 50
	}, {
		title: "You mean that's it?!",
		total: 50
	}, {
		title: "Oh...my...God!",
		total: 50
	}, {
		title: "Next!!!!",
		total: 50
	}, {
		title: "What's your name again?",
		total: 50
	}, {
		title: "Like a glove!",
		total: 50
	}, {
		title: "What...there's more???",
		total: 50
	}, {
		title: "We've all had worse.",
		total: 50
	}, {
		title: "You smell that?",
		total: 50
	}, {
		title: "Do that again!",
		total: 50
	}, {
		title: "That thing you like.",
		total: 50
	}, {
		title: "Now roll over.",
		total: 50
	}, {
		title: "Uh! I love you.",
		total: 50
	}, {
		title: "Thank you sir, may I have another?",
		total: 50
	}, {
		title: "Sorry, you startled me!",
		total: 50
	}, {
		title: "In the WHAT!?!?!?!",
		total: 50
	}, {
		title: "k thx cya bye",
		total: 50
	}, {
		title: "Aaaaaannnnd, dismount!",
		total: 50
	}, {
		title: "No, YOU taste it!",
		total: 50
	}, {
		title: "Whaddya mean, it slipped off??",
		total: 50
	}, {
		title: "Wrong hole, doofus!",
		total: 1000,
		active: 100,
		speed: 2
	}
];
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
var TO_RADIANS = Math.PI / 180;
var requestAnimationFrame = (window.requestAnimationFrame ||
							 window.mozRequestAnimationFrame ||
							 window.webkitRequestAnimationFrame ||
							 window.msRequestAnimationFrame || function(cb) {
								 setTimeout(cb, 10, new Date());
							 });

function move(thing, direction, speed) {
//	thing.x += speed;
	thing.x += speed * Math.cos(direction * TO_RADIANS);
	thing.y += speed * Math.sin(direction * TO_RADIANS);
}

function wrap(thing) {
	if(thing.y < 0) {
		thing.y = PD.HEIGHT;
	}
	if(thing.x > PD.WIDTH) {
		thing.x = 0;
	}
	if(thing.y > PD.HEIGHT) {
		thing.y = 0;
	}
	if(thing.x < 0) {
		thing.x = PD.WIDTH;
	}
}

function shoot() {
	var dx = PD.thing.aim.x - PD.thing.egg.x;
	var dy = PD.thing.aim.y - PD.thing.egg.y;
	PD.thing.shot.addInstances({
		x: PD.thing.egg.x,
		y: PD.thing.egg.y,
		rotate: (Math.atan2(-dx, dy) / TO_RADIANS) + 90,
		speed: 10,
	});
}

function score(points, x, y) {
	if(points) {
		if(PD.showpoints) {
			PD.chain++;
			PD.text.chain.setString((PD.chain + 1) + "x CHAIN");
			PD.text.chain.x = x || 0;
			PD.text.chain.y = y || 0;
			PD.text.chain.setVisible(true);
		} else {
			PD.chain = 0;
		}
		PD.showpoints = 60;  // frames 'til chain over
		if(PD.chain) {
			points *= (1 + PD.chain);
		}

		PD.text.points.setString("" + points);
		PD.text.points.x = x || 0;
		PD.text.points.y = y || 0;
		PD.text.points.setVisible(true);

		PD.score += points;
	} else {
		PD.score = 0;
	}
	var str = "" + PD.score;
	while(str.length < 8) {
		str = "0" + str;
	}
	PD.text.score.setString(str);
}

function loadlevel(lvl, time) {
	if(isNaN(lvl) || LEVELS.length < lvl) {
		console.log("invalid level '" + lvl + "', using 0");
		lvl = 0;
	} else if(lvl < 0) {
		console.log("invalid level'" + lvl + "', using final");
		lvl = LEVELS.length - 1;
	}
	PD.level = lvl;
	PD.text.lvl.setString("WAVE " + (lvl + 1));
	PD.text.level.setString(LEVELS[lvl].title);
	PD.text.lvl.setVisible(true);
	PD.text.level.setVisible(true);
	PD.sperms.splice(0, PD.sperms.length);
	PD.activesperm = 0;
	PD.remaining = LEVELS[lvl].total || 10;

	PD.spermspeed = LEVELS[lvl].speed || 1;
	PD.spermvary = LEVELS[lvl].speedvary || 0.5;
	PD.spermmeander = isNaN(LEVELS[lvl].meander) ? 0.4 : LEVELS[lvl].meander;
	PD.spermorbit = isNaN(LEVELS[lvl].orbit) ? 0.3 : LEVELS[lvl].orbit;
	PD.spermchase = isNaN(LEVELS[lvl].chase) ? 0.3 : LEVELS[lvl].chase;

	PD.startwave = time + 4000;
}

function tick(scene, time) {
	var delshot = -1;
	var delsperm = -1;
	var dx = 0;
	var dy = 0;

	if(PD.level === null) {
		loadlevel(0, time);
	}

	// victory flash and next level
	if(PD.victory) {
		if(Math.floor(PD.victory / 10) % 2) {
			PD.scene.setBG("#fff");
		} else {
			PD.scene.setBG("#211");
		}
		PD.victory--;
		if(!PD.victory) {
			PD.scene.setBG("#211");
			loadlevel(PD.level + 1, time);
		}
	}

	// start wave if it's time
	if(PD.startwave && time > PD.startwave) {
		PD.startwave = 0;
		PD.activesperm = LEVELS[PD.level].active || 4;
		PD.text.lvl.setVisible(false);
		PD.text.level.setVisible(false);
	}

	PD.thing.egg.$.cell.scale = 0.5 + (Math.sin(time / 200) * 0.02);
	PD.thing.egg.$.nucleus.scale = 0.4 + (Math.cos(time / 200) * 0.05);

	PD.oldangle = PD.thing.egg.$.cell.rotate || 0;
	if(PD.input.right && PD.input.down) {
		PD.thing.egg.$.cell.rotate = 45; // (PD.thing.egg.$.cell.rotate + 45) / 2;
	} else if(PD.input.down && PD.input.left) {
		PD.thing.egg.$.cell.rotate = 135; // (PD.thing.egg.$.cell.rotate + 135) / 2;
	} else if(PD.input.left && PD.input.up) {
		PD.thing.egg.$.cell.rotate = 225; // (PD.thing.egg.$.cell.rotate + 225) / 2;
	} else if(PD.input.up && PD.input.right) {
		PD.thing.egg.$.cell.rotate = 315; // (PD.thing.egg.$.cell.rotate + 315) / 2;
	} else if(PD.input.right) {
		PD.thing.egg.$.cell.rotate = 0; // (PD.thing.egg.$.cell.rotate + 0) / 2;
	} else if(PD.input.down) {
		PD.thing.egg.$.cell.rotate = 90; // (PD.thing.egg.$.cell.rotate + 90) / 2;
	} else if(PD.input.left) {
		PD.thing.egg.$.cell.rotate = 180; // (PD.thing.egg.$.cell.rotate + 180) / 2;
	} else if(PD.input.up) {
		PD.thing.egg.$.cell.rotate = 270; // (PD.thing.egg.$.cell.rotate + 270) / 2;
	}

	if(Math.abs(PD.oldangle - PD.thing.egg.$.cell.rotate) > 45  &&
	   Math.abs((PD.oldangle + 360) - (PD.thing.egg.$.cell.rotate)) > 45 &&
	   Math.abs((PD.oldangle) - (PD.thing.egg.$.cell.rotate + 360)) > 45) {
		PD.speed = 0;
	} else {
		if(PD.input.up || PD.input.down || PD.input.left || PD.input.right) {
			PD.speed += 0.2;
		} else {
			PD.speed -= 0.2;
		}
		PD.speed = Math.max(PD.speed, 0);
		PD.speed = Math.min(PD.speed, 5);
	}

	move(PD.thing.egg, PD.thing.egg.$.cell.rotate, PD.speed);
	wrap(PD.thing.egg);

	// move shots
	PD.shots.every(function(shot, idx) {
		move(shot, shot.rotate, shot.speed);

		if(shot.y < 0 || shot.x < 0 ||
		   shot.x > PD.WIDTH || shot.y > PD.HEIGHT) {
			delshot = idx;
		}

		PD.sperms.every(function(sperm, sidx) {
			if(Math.pow(sperm.x - shot.x, 2) + Math.pow(sperm.y - shot.y , 2) <
			   Math.pow(20, 2)) {
				delshot = idx;
				delsperm = sidx;
			}
			return true;
		});
		return true;
	});
	if(delshot >= 0) {
		PD.shots.splice(delshot, 1);
	}

	// animate sperms
	PD.thing.sperm.$.head.rotate = 90 + (Math.sin(time / 100) * 5);
	PD.thing.sperm.$.tail1.rotate = Math.sin(time / 100) * -40;
	PD.thing.sperm.$.tail2.rotate = Math.cos(time / 100) * 40;
	PD.thing.sperm.$.tail3.rotate = Math.sin(time / 100) * 40;

	var dx = 0;
	var dy = 0;

	// move sperms
	PD.sperms.every(function(sperm) {
		if(sperm.mode === 0) {
			// idiot, swims erratically
			sperm.rotate += (Math.random() - 0.5) * 10;
		} else if(sperm.mode === 1) {
			// orbit
			dx = sperm.x - PD.thing.egg.x;
			dy = sperm.y - PD.thing.egg.y;
			sperm.rotate = (Math.atan2(dx, dy) / -TO_RADIANS) - 45;
		} else if(sperm.mode === 2) {
			// perfect chase
			dx = PD.thing.egg.x - sperm.x;
			dy = PD.thing.egg.y - sperm.y;
			sperm.rotate = (Math.atan2(-dx, dy) / TO_RADIANS) + 90;
		} else {
			// undefined, sit and spin
			sperm.rotate += 10;
		}

		move(sperm, sperm.rotate, sperm.speed);
		wrap(sperm);

		return true;
	});
	if(delsperm >= 0) {
		score(10, PD.sperms[delsperm].x, PD.sperms[delsperm].y);
		PD.sperms.splice(delsperm, 1);
	}

	// send in more sperms
	if(PD.sperms.length < PD.activesperm && PD.remaining) {
		PD.remaining--;
		var x = Math.random() * PD.WIDTH;
		var y = Math.random() * PD.HEIGHT;
		var mode = 0;
		if(Math.random() < 0.5) {
			if(Math.random() < 0.5) {
				x = 0;
			} else {
				x = PD.WIDTH;
			}
		} else {
			if(Math.random() < 0.5) {
				y = 0;
			} else {
				y = PD.HEIGHT;
			}
		}

		mode = Math.random();
		if(mode > PD.spermmeander + PD.spermorbit) {
			mode = 2;
		} else if(mode > PD.spermmeander) {
			mode = 1;
		} else {
			mode = 0;
		}
		PD.sperms.push({
			x: x,
			y: y,
			rotate: Math.random() * 360,
			speed: (PD.spermspeed - PD.spermvary) +
					(Math.random() * PD.spermvary * 2),
			mode: mode
		});
	}
	if(!PD.victory && !PD.remaining && !PD.sperms.length) {
		PD.victory = 59;
	}
	if(PD.showpoints) {
		PD.showpoints--;
		if(!PD.showpoints) {
			PD.text.points.setVisible(false);
			PD.text.chain.setVisible(false);
		}
	}
}

function start() {
	PD.scene = new penduinSCENE(PD.canvas, PD.WIDTH, PD.HEIGHT, tick);
	PD.scene.setBG("#211");
	PD.scene.showFPS(true);
	PD.scene.setAutoOrder(false);

	PD.scene.addOBJ(PD.thing.egg);
	PD.thing.egg.x = PD.WIDTH / 2;
	PD.thing.egg.y = PD.HEIGHT / 2;
	PD.scene.addOBJ(PD.thing.sperm);
	PD.thing.sperm.setInstances(PD.sperms);

	PD.thing.shot.setInstances(PD.shots);
	PD.scene.addOBJ(PD.thing.shot);

	PD.scene.addOBJ(PD.thing.aim);

	PD.text.lvl = new penduinTEXT("wave x", 30, "white", 0.5, 1, true);
	PD.text.level = new penduinTEXT("title", 40, "white", 0.5, 0, true);
	PD.text.lvl.setVisible(false);
	PD.text.level.setVisible(false);
	PD.text.lvl.x = PD.text.level.x = PD.WIDTH / 2;
	PD.text.lvl.y = PD.text.level.y = PD.HEIGHT / 2;
	PD.scene.addTEXT(PD.text.lvl);
	PD.scene.addTEXT(PD.text.level);

	PD.text.score = new penduinTEXT("00000000", 20, "white", 0.5, 0, true);
	PD.text.score.setVisible(true);
	PD.text.score.x = PD.WIDTH / 2;
	PD.text.score.y = 4;
	PD.scene.addTEXT(PD.text.score);

	PD.text.chain = new penduinTEXT("1x CHAIN", 15, "#ff0", 0.5, 1, true);
	PD.text.chain.setVisible(false);
	PD.scene.addTEXT(PD.text.chain);

	PD.text.points = new penduinTEXT("0", 15, "white", 0.5, 0, true);
	PD.text.points.setVisible(false);
	PD.scene.addTEXT(PD.text.points);
}

window.addEventListener("load", function() {
	PD.canvas = document.querySelector("#display");

	PD.canvas.addEventListener("mousemove", function(e) {
		if(!PD.thing.aim) {
			return;
		}
		var scale = PD.scene.getScale();
		PD.thing.aim.x = (e.clientX - e.target.offsetLeft) / scale;
		PD.thing.aim.y = (e.clientY - e.target.offsetTop) / scale;
	});
	PD.canvas.addEventListener("mousedown", function(e) {
		if(PD.thing.aim && PD.shots.length <= PD.MAXSHOTS) {
			shoot();
		}
		e.preventDefault();
		return false;
	});

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

function handlekey(event, down) {
	switch(event.keyCode) {
	case 38:  //up
	case 104: //num8
	case 87:  //w
		PD.input.up = down;
		break;
	case 40:  //down
	case 98:  //num2
	case 83:  //s
		PD.input.down = down;
		break;
	case 37:  //left
	case 100: //num4
	case 65:  //a
		PD.input.left = down;
		break;
	case 39:  //right
	case 102: //num6
	case 68:  //d
		PD.input.right = down;
		break;
	case 32:  //space
//		PD.input.restart = down;
		PD.input.menu = down;
		break;
	case 27:  //esc
		PD.input.menu = down;
		break;
	case 61:  //+
	case 107: //num+
		if(down) {
			score();
			PD.victory = 1;
		}
		break;
	case 109: //num-
	case 173: //-
		if(down) {
			score();
			PD.level -= 2;
			PD.victory = 1;
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
