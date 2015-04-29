LOAD({
	"name": "sperm",
	"scale": 0.34,
	"above": [
		{
			"name": "head",
			"image": "image/spermhead.png",
			"pivot": {
				"x": 128,
				"y": 128
			},
			"rotate": 0,
			"scale": 0.2,
			"alpha": 1,
			"offset": {
				"x": 0,
				"y": 0
			},
			"below": [
				{
					"name": "tail1",
					"image": "image/spermtail.png",
					"pivot": {
						"x": 128,
						"y": 32
					},
					"rotate": 0,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 128,
						"y": 230
					},
					"below": [
						{
							"name": "tail2",
							"image": "image/spermtail.png",
							"pivot": {
								"x": 128,
								"y": 32
							},
							"rotate": 0,
							"scale": 0.5,
							"alpha": 1,
							"offset": {
								"x": 128,
								"y": 252
							},
							"below": [
								{
									"name": "tail3",
									"image": "image/spermtail.png",
									"pivot": {
										"x": 128,
										"y": 32
									},
									"rotate": 0,
									"scale": 0.5,
									"alpha": 1,
									"offset": {
										"x": 128,
										"y": 252
									}
								}
							]
						}
					]
				}
			]
		}
	],
	"below": [
	],
	"pose": {}
});
