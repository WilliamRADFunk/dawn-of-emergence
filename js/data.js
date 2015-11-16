var camera, clockCamera;
var scene;
var renderer, renderer2;
var WIDTH;
var HEIGHT;
var clockWIDTH;
var clockHEIGHT;
var playList = [];
var currentSong = 0;
var muteMusic = false;
var soundsList = [];
var views;
var cameraCurView = 0;
var earth;
var clouds;
var beacon01, beacon02, beaconPlayer01, beaconPlayer02, beacons = [];
var satellites, satellitePlayer;
var satelliteGroupAlpha, satelliteGroupBeta, satelliteGroupCharlie, satelliteGroupDelta;
var keyboard;
var moonOrbit;
var axisOrbit;
var updateCounter = 0;
var seconds = 0;
var minutes = 0;
var hours = 0;
var days = 0;
var oldDays = 0;
var numDays = 0;
var secondBars;
var minuteBars;
var hoursBars;
var timeStamp = "00:00:00:00";
var	views =					// All of the camera views
	[	
		{
			left: 0,
			bottom: 0,
			width: 0.5,
			height: 1.0,
			eye: [0, 0.7, -2.35],
			up: [0, 1, 0],
			fov: 45,
			updateCamera: function ()
			{
				camera.lookAt(earth.position);
			}
		},
		{
			left: 0,
			bottom: 0,
			width: 0.5,
			height: 1.0,
			eye: [0, 0, -0.9],
			up: [0, 1, 0],
			fov: 45,
			updateCamera: function ()
			{
				camera.lookAt(earth.position);
			}
		},
		{
			left: 0,
			bottom: 0,
			width: 0.5,
			height: 1.0,
			eye: [0, 0.8, -0.3],
			up: [0, 1, 0],
			fov: 45,
			updateCamera: function ()
			{
				camera.lookAt(earth.position);
			}
		},
		{
			left: 0,
			bottom: 0,
			width: 0.5,
			height: 1.0,
			eye: [0, -0.5, -0.8],
			up: [0, 1, 0],
			fov: 45,
			updateCamera: function ()
			{
				camera.lookAt(earth.position);
			}
		},
		{
			// The satellite's viewpoint.
			left: 0,
			bottom: 0,
			width: 0.5,
			height: 1.0,
			eye: [0, 0.7, -12.5],
			up: [0, 1, 0],
			fov: 45,
			updateCamera: function ()
			{
				camera.lookAt(earth.position);
			}
		},
		{
			left: 0,
			bottom: 0,
			width: 0.5,
			height: 1.0,
			eye: [0, 0.7, -2.0],
			up: [0, 1, 0],
			fov: 45,
			updateCamera: function ()
			{
				camera.lookAt(new THREE.Vector3(0, 0.7, -2.5));
			}
		}
	];