var camera;
var scene;
var renderer;
var WIDTH;
var HEIGHT;
var views;
var cameraCurView = 0;
var earth;
var clouds;
var beacon01, beacon02, beaconPlayer01, beaconPlayer02;
var satellites, satellitePlayer;
var keyboard = new THREEx.KeyboardState();
var moonOrbit;
var axisOrbit;
var updateCounter = 0;
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