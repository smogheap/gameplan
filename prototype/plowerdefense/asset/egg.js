LOAD({
	"name": "egg",
	"scale": 0.34,
	"above": [
		{
			"name": "cell",
			"image": "image/eggcell.png",
			"pivot": {
				"x": 256,
				"y": 256
			},
			"rotate": 0,
			"scale": 0.5,
			"alpha": 1,
			"offset": {
				"x": 0,
				"y": 0
			},
			"above": [
				{
					"name": "nucleus",
					"image": "image/eggcell.png",
					"pivot": {
						"x": 256,
						"y": 256
					},
					"offset": {
						"x": 256,
						"y": 256
					},
					"rotate": 0,
					"scale": 0.4,
					"alpha": 1,
					"offset": {
						"x": 256,
						"y": 256
					}
				}
			]
		}
	],
	"below": [
	],
	"pose": {}
});
