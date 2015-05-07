var PD = {
	WIDTH: 840,
	HEIGHT: 480,
	MAXSHOTS: 2,
	canvas: null,
	scene: null,
	json: {},
	thing: {},
	activesperm: 4,
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
	oldangle: 0
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

function tick(scene, time) {
	var delshot = -1;
	var delsperm = -1;
	var dx = 0;
	var dy = 0;

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
			sperm.rotate = Math.atan2(dx, dy) / (Math.PI / -180);
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
		PD.sperms.splice(delsperm, 1);
	}

	// send in more sperms
	if(PD.sperms.length < PD.activesperm) {
		var x = Math.random() * PD.WIDTH;
		var y = Math.random() * PD.HEIGHT;
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
		PD.sperms.push({
			x: x,
			y: y,
			rotate: Math.random() * 360,
			speed: Math.random() + 0.5,
			mode: Math.floor(Math.random() * 3)
		});
	}
}

function start() {
	PD.scene = new penduinSCENE(PD.canvas, PD.WIDTH, PD.HEIGHT, tick);
	PD.scene.setBG("#211");
//	PD.scene.showFPS(true);
	PD.scene.setAutoOrder(false);

	PD.scene.addOBJ(PD.thing.egg);
	PD.thing.egg.x = PD.WIDTH / 2;
	PD.thing.egg.y = PD.HEIGHT / 2;
	PD.scene.addOBJ(PD.thing.sperm);
	PD.thing.sperm.setInstances(PD.sperms);
	PD.thing.shot.setInstances(PD.shots);

	PD.scene.addOBJ(PD.thing.shot);

	PD.scene.addOBJ(PD.thing.aim);
	PD.canvas.fireEvent
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
