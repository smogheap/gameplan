var PD = {
	WIDTH: 840,
	HEIGHT: 480,
	canvas: null,
	scene: null,
	json: {},
	thing: {},
	sperms: [],
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

function tick(scene, time) {
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
		console.log(PD.oldangle, PD.thing.egg.$.cell.rotate);
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
/*
	if(PD.input.up) {
		if(PD.input.left || PD.input.right) {
			PD.thing.egg.y -= 3;
		} else {
			PD.thing.egg.y -= 4;
		}
	}
	if(PD.input.down) {
		if(PD.input.left || PD.input.right) {
			PD.thing.egg.y += 3;
		} else {
			PD.thing.egg.y += 4;
		}
	}
	if(PD.input.left) {
		if(PD.input.up || PD.input.down) {
			PD.thing.egg.x -= 3;
		} else {
			PD.thing.egg.x -= 4;
		}
	}
	if(PD.input.right) {
		if(PD.input.up || PD.input.down) {
			PD.thing.egg.x += 3;
		} else {
			PD.thing.egg.x += 4;
		}
	}
*/

	// animate sperms
	PD.thing.sperm.$.head.rotate = 90 + (Math.sin(time / 100) * 5);
	PD.thing.sperm.$.tail1.rotate = Math.sin(time / 100) * -40;
	PD.thing.sperm.$.tail2.rotate = Math.cos(time / 100) * 40;
	PD.thing.sperm.$.tail3.rotate = Math.sin(time / 100) * 40;

	var dx = 0;
	var dy = 0;

	// move sperms
	PD.sperms.every(function(sperm) {

		// idiot, swims erratically
		//sperm.rotate += (Math.random() - 0.5) * 10;

		// orbit
		//dx = sperm.x - PD.thing.egg.x;
		//dy = sperm.y - PD.thing.egg.y;
		//sperm.rotate = Math.atan2(dx, dy) / (Math.PI / -180);

		// perfect chase
		dx = PD.thing.egg.x - sperm.x;
		dy = PD.thing.egg.y - sperm.y;
		sperm.rotate = (Math.atan2(-dx, dy) / TO_RADIANS) + 90;

		move(sperm, sperm.rotate, sperm.speed);

		if(sperm.y < 0) {
			sperm.y = PD.HEIGHT;
		}
		if(sperm.x > PD.WIDTH) {
			sperm.x = 0;
		}
		if(sperm.y > PD.HEIGHT) {
			sperm.y = 0;
		}
		if(sperm.x < 0) {
			sperm.x = PD.WIDTH;
		}

		return true;
	});
/*
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
*/
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
	PD.sperms = [
		{
			x: 100,
			y: 100,
			rotate: 0,
			speed: 1,
		},
		{
			x: 200,
			y: 200,
			rotate: 90,
			speed: 1.5
		},
		{
			x: 300,
			y: 300,
			rotate: 180,
			speed: 0.5,
		},
		{
			x: 400,
			y: 400,
			rotate: 270,
			speed: 0.9
		}
	];
	PD.thing.sperm.setInstances(PD.sperms);

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
	PD.canvas.addEventListener("click", function(e) {
		if(!PD.thing.aim) {
			return;
		}
		if(PD.shot.length > 2) {
		}
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
