/****************************************************************************************/
/* Main game variables and functions													*/
/****************************************************************************************/
var GAME =
{
	camera: {},
	scene: {},
	scene2: {},
	renderer: {},
	renderer2: {},
	WIDTH: 0,
	HEIGHT: 0,
	cameraCurView: 0,
	beacon01: {},
	beacon02: {},
	beaconPlayer01: {},
	beaconPlayer02: {},
	beacons: [],
	satellitePlayer: {},
	satelliteGroupAlpha: {},
	satelliteGroupBeta: {},
	satelliteGroupCharlie: {},
	satelliteGroupDelta: {},
	axisOrbit: {},
	updateCounter: 0
};
/****************************************************************************************/
/* Audio variables and functions														*/
/****************************************************************************************/
GAME.Audio =
{
	currentSong: 0,
	muteMusic: false,
	playList: [],
	soundsList: [],

	loadSounds: function()
	{
		GAME.Audio.playList.push(new Audio("assets/audio/The_Blue_Danube_StraussII.mp3"));
		GAME.Audio.playList.push(new Audio("assets/audio/Beepthovens5th.mp3"));
		GAME.Audio.playList.push(new Audio("assets/audio/mahler_05.mp3"));
		for(var i = 0; i < GAME.Audio.playList.length; i++)
		{
			GAME.Audio.playList[i].volume = 0.5;
		}
		//GAME.Audio.playList[0].autoplay = true;
	},
	musicVolumeChange: function(volume)
	{
		var vol = Number(volume / 100);
		for(var i = 0; i < GAME.Audio.playList.length; i++)
		{
			GAME.Audio.playList[i].volume = vol;
		}
	},
	skipSong: function()
	{
		GAME.Audio.playList[GAME.Audio.currentSong].pause();
		GAME.Audio.playList[GAME.Audio.currentSong].currentTime = 0;
		GAME.Audio.currentSong++;
		GAME.Audio.currentSong = (GAME.Audio.currentSong >= GAME.Audio.playList.length) ? 0 : GAME.Audio.currentSong;
		GAME.Audio.playList[GAME.Audio.currentSong].play();
	},
	soundFxVolumeChange: function(volume)
	{
		var vol = Number(volume / 100);
		for(var i = 0; i < GAME.Audio.soundsList.length; i++)
		{
			GAME.Audio.soundsList[i].volume = vol;
		}
	},
	toggleMusic: function()
	{
		if(GAME.Audio.muteMusic)
		{
			GAME.Audio.muteMusic = false;
			GAME.Audio.playList[GAME.Audio.currentSong].pause();
		}
		else
		{
			GAME.Audio.muteMusic = true;
			GAME.Audio.playList[GAME.Audio.currentSong].play();
		}
	},
	toggleSoundFX: function()
	{
		alert("Functionality for changing sound FX volume is not yet installed.");
	}
};
/****************************************************************************************/
/* Input controls (ie keyboard, and/or mouse)											*/
/****************************************************************************************/
GAME.Input =
{
	keyboard: {}
};
/****************************************************************************************/
/* Variables and functions for non-interactive graphical components						*/
/****************************************************************************************/
GAME.Landscape =
{
	clouds: {},
	earth: {},
	moonOrbit: {},

	// The Universe in all its stary awesomeness.
	createStars: function()
	{
		var starsGeometry = new THREE.SphereGeometry(90, 32, 32);
		var starsMaterial = new THREE.MeshBasicMaterial();
		starsMaterial.map = THREE.ImageUtils.loadTexture('assets/images/galaxy_starfield.png');
		starsMaterial.map.minFilter = THREE.LinearFilter;
		starsMaterial.map.wrapS = THREE.RepeatWrapping;
		starsMaterial.map.wrapT = THREE.RepeatWrapping;
		starsMaterial.map.repeat.set( 16, 8 );
		starsMaterial.side = THREE.BackSide;
		var stars = new THREE.Mesh(starsGeometry, starsMaterial);
		GAME.scene.add(stars);
	},
	createEarth: function()
	{
		// The Earth: its water, landmasses, and textured elevations.
		var earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		var earthMaterial = new THREE.MeshPhongMaterial();
		earthMaterial.map = THREE.ImageUtils.loadTexture('assets/images/earthmap1k.jpg');
		earthMaterial.map.minFilter = THREE.LinearFilter;
		earthMaterial.bumpMap = THREE.ImageUtils.loadTexture('assets/images/earthbump1k.jpg');
		earthMaterial.bumpMap.minFilter = THREE.LinearFilter;
		earthMaterial.bumpScale = 0.02;
		earthMaterial.specularMap = THREE.ImageUtils.loadTexture('assets/images/earthspec1k.jpg');
		earthMaterial.specularMap.minFilter = THREE.LinearFilter;
		earthMaterial.specular  = new THREE.Color(0xFFFFFF);
		earthMaterial.shininess = 10;
		GAME.Landscape.earth = new THREE.Mesh(earthGeometry, earthMaterial);
		GAME.scene.add(GAME.Landscape.earth);
		// Rotating cloudcover.
		var cloudsGeometry = new THREE.SphereGeometry(0.503, 32, 32);
		var cloudsMaterial = new THREE.MeshPhongMaterial();
		cloudsMaterial.map = THREE.ImageUtils.loadTexture('assets/images/earthcloudmap_modified.png');
		cloudsMaterial.map.minFilter = THREE.LinearFilter;
		cloudsMaterial.side = THREE.FrontSide;
		cloudsMaterial.opacity = 0.9;
		cloudsMaterial.transparent = true;
		cloudsMaterial.depthWrite = false;
		GAME.Landscape.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
		GAME.Landscape.earth.add(GAME.Landscape.clouds);
	},
	createMoon: function()
	{
		// Moon's orbital mechanics
		GAME.Landscape.moonOrbit = new THREE.Object3D();
		GAME.scene.add( GAME.Landscape.moonOrbit );
		var moonOrbitalPivot = new THREE.Object3D();
		moonOrbitalPivot.rotation.y = 0;
		GAME.Landscape.moonOrbit.add( moonOrbitalPivot );
		// Moon mesh
		var moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		var moonMaterial = new THREE.MeshPhongMaterial();
		moonMaterial.map = THREE.ImageUtils.loadTexture('assets/images/moonmap1k.jpg');
		moonMaterial.map.minFilter = THREE.LinearFilter;
		moonMaterial.bumpMap = THREE.ImageUtils.loadTexture('assets/images/moonbump1k.jpg');
		moonMaterial.bumpMap.minFilter = THREE.LinearFilter;
		moonMaterial.bumpScale = 0.02;
		var moon = new THREE.Mesh( moonGeometry, moonMaterial );
		moon.position.z = 30;
		moonOrbitalPivot.add( moon );
	}
};
/****************************************************************************************/
/* Variables and functions to keep track of time, both graphically and behind the scenes*/
/****************************************************************************************/
GAME.Time = 
{
	clockCamera: {},
	clockWIDTH: 0,
	clockHEIGHT: 0,
	days: 0,
	hourBars: {},
	hours: 0,
	minuteBars: {},
	minutes: 0,
	oldDays: 0,
	numDays: 0,
	secondBars: {},
	seconds: 0,
	timeStamp: "00:00:00:00",

	createClock: function()
	{
		GAME.Time.secondBars = new THREE.Object3D();
		GAME.Time.minuteBars = new THREE.Object3D();
		GAME.Time.hourBars = new THREE.Object3D();
		var timeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 10, 10, false);
		var timeMaterial = new THREE.MeshBasicMaterial({color: 'white'});
		for(var i = 0; i < 60; i++)
		{
			var minuteTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
			x_coord = 6 * Math.cos( i * (Math.PI / 30) );
			y_coord = 6 * Math.sin( i * (Math.PI / 30) );
			minuteTick.material.color.setHex(0xFF00FF);
			minuteTick.position.set(x_coord, y_coord, 0);
			minuteTick.rotation.x += Math.PI / 2;
			GAME.Time.minuteBars.add(minuteTick);
		}
		for(var i = 0; i < 30; i++)
		{
			var secondTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
			var x_coord = 5 * Math.cos( i * (Math.PI / 15) );
			var y_coord = 5 * Math.sin( i * (Math.PI / 15) );
			secondTick.position.set(x_coord, y_coord, 0);
			secondTick.rotation.x += Math.PI / 2;
			GAME.Time.secondBars.add(secondTick);
		}
		for(var j = 0; j < 24; j++)
		{
			var hourTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
			x_coord = 7 * Math.cos( j * (Math.PI / 12) );
			y_coord = 7 * Math.sin( j * (Math.PI / 12) );
			hourTick.material.color.setHex(0xFFFF00);
			hourTick.position.set(x_coord, y_coord, 0);
			hourTick.rotation.x += Math.PI / 2;
			GAME.Time.hourBars.add(hourTick);
		}
		GAME.scene2.add(GAME.Time.secondBars);
		GAME.scene2.add(GAME.Time.minuteBars);
		GAME.scene2.add(GAME.Time.hourBars);
	},
	updateClock: function()
	{
		// Tells visual portion of clock whether to refresh the full circle.
		var secs = false;
		var mins = false;
		var hrs = false;
		// Increases time by one in-game second.
		GAME.Time.seconds++;
		if(GAME.Time.seconds >= 30)
		{
			GAME.Time.seconds = 0;
			secs = true;
			GAME.Time.minutes++;
			if(GAME.Time.minutes >= 60)
			{
				GAME.Time.minutes = 0;
				mins = true;
				GAME.Time.hours++;
				if(GAME.Time.hours >= 24)
				{
					GAME.Time.days++;
					GAME.Time.Time.hours = 0;
					hrs = true;
				}
			}
		}
		// Updates visual portion of space clock.
		GAME.Time.updateClockVisual(secs, mins, hrs);
		// Updates time stamp, used in event declarations that are posted to top-center panel.
		GAME.Time.updateTimeStamp();
	},
	updateClockVisual: function(secs, mins, hrs)
	{
		// Must destroy old day, before entering a new one.
		if(GAME.Time.oldDays != GAME.Time.days || GAME.Time.days == 0)
		{
			GAME.scene2.remove(GAME.Time.numDays);
			var textGeometry = new THREE.TextGeometry(GAME.Time.days,
				{
					size: 3,
					height: 0.2,
					curveSegments: 20,
					bevelEnabled: false
				});
			var textMaterial = new THREE.MeshLambertMaterial( {color: 0x49E20E} );
			GAME.Time.numDays = new THREE.Mesh( textGeometry, textMaterial );
			GAME.Time.numDays.position.set(-1.5, -1.5, 0);
			GAME.scene2.add( GAME.Time.numDays );
			GAME.Time.oldDays = GAME.Time.days;
		}
		// Refreshes seconds, minutes, and hours when they hit zero.
		if(secs)
		{
			for(var i = 0; i < 30; i++)
			{
				GAME.Time.secondBars.children[i].material.visible = true;
			}
		}
		if(mins)
		{
			for(var j = 0; j < 60; j++)
			{
				GAME.Time.minuteBars.children[j].material.visible = true;
			}
		}
		if(hrs)
		{
			for(var k = 0; k < 24; k++)
			{
				GAME.Time.hourBars.children[k].material.visible = true;
			}
		}
		// Hides one tick mark for each increment in time.
		GAME.Time.secondBars.children[GAME.Time.seconds].material.visible = false;
		GAME.Time.minuteBars.children[GAME.Time.minutes].material.visible = false;
		GAME.Time.hourBars.children[GAME.Time.hours].material.visible = false;
	},
	updateTimeStamp: function()
	{
		// Updating days component of timestamp.
		if(GAME.Time.days == 0)
		{
			GAME.Time.timeStamp = "00" + GAME.Time.timeStamp.substring(2, GAME.Time.timeStamp.length);
		}
		else if(GAME.Time.days > 0 && GAME.Time.days < 10)
		{
			GAME.Time.timeStamp = "0" + GAME.Time.days + GAME.Time.timeStamp.substring(2, GAME.Time.timeStamp.length);
		}
		else
		{
			GAME.Time.timeStamp = GAME.Time.days + GAME.Time.timeStamp.substring(2, GAME.Time.timeStamp.length) + "";
		}
		// Updating hours component of timestamp.
		if(GAME.Time.hours == 0)
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 3) + "00" + GAME.Time.timeStamp.substring(5, GAME.Time.timeStamp.length);
		}
		else if(GAME.Time.hours > 0 && GAME.Time.hours < 10)
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 3) + "0" + GAME.Time.hours + GAME.Time.timeStamp.substring(5, GAME.Time.timeStamp.length);
		}
		else
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 3) + GAME.Time.hours + GAME.Time.timeStamp.substring(5, GAME.Time.timeStamp.length) + "";
		}
		// Updating minutes component of timestamp.
		if(GAME.Time.minutes == 0)
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 6) + "00" + GAME.Time.timeStamp.substring(8, GAME.Time.timeStamp.length);
		}
		else if(GAME.Time.minutes > 0 && GAME.Time.minutes < 10)
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 6) + "0" + GAME.Time.minutes + GAME.Time.timeStamp.substring(8, GAME.Time.timeStamp.length);
		}
		else
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 6) + GAME.Time.minutes + GAME.Time.timeStamp.substring(8, GAME.Time.timeStamp.length);
		}
		// Updating seconds component of timestamp.
		if(GAME.Time.seconds == 0)
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 9) + "00";
		}
		else if(GAME.Time.seconds > 0 && GAME.Time.seconds < 10)
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 9) + "0" + GAME.Time.seconds;
		}
		else
		{
			GAME.Time.timeStamp = GAME.Time.timeStamp.substring(0, 9) + GAME.Time.seconds;
		}
	}
};
GAME.views = // All of the camera views
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
			GAME.camera.lookAt(GAME.Landscape.earth.position);
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
			GAME.camera.lookAt(GAME.Landscape.earth.position);
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
			GAME.camera.lookAt(GAME.Landscape.earth.position);
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
			GAME.camera.lookAt(GAME.Landscape.earth.position);
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
			GAME.camera.lookAt(GAME.Landscape.earth.position);
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
			GAME.camera.lookAt(new THREE.Vector3(0, 0.7, -2.5));
		}
	}
];
function init()
{
	GAME.WIDTH = window.innerWidth * 0.8;
	GAME.HEIGHT = window.innerHeight * 0.8;
	/*************************************************************************************/
	GAME.Input.keyboard = new THREEx.KeyboardState();
	/*************************************************************************************/
	loadWorkers();							// Creates webworkers for later use.
	/*************************************************************************************/
	GAME.scene = new THREE.Scene();			// Three.js scene (contains universe).
	GAME.scene2 = new THREE.Scene();		// Three.js scene (contains space clock).
	/*************************************************************************************/
	GAME.Audio.loadSounds();				// Loads all sounds, and activates music.
	/*************************************************************************************/
	GAME.Landscape.createStars();			// Creates a backdrop filled with stars.
	/*************************************************************************************/
	GAME.Landscape.createEarth();			// Creates and places the Earth + cloudcover.
	/*************************************************************************************/
	GAME.Landscape.createMoon();			// Creates and places the moon.
	/*************************************************************************************/
	//createAxes();							// Helper axis for later raycast tests.
	/*************************************************************************************/
	GAME.Time.createClock();				// creates the graphical spheres of the clock.
	/*************************************************************************************/
	createRenderers();						// Creates all renderers for the scene.
	/*************************************************************************************/
	createMainLighting();					// General ambient and main directional light.
	/*************************************************************************************/
	createSatellites(5);					// Builds and places all satellites.
	/*************************************************************************************/
	registerListeners();					// Registers all Event Listeners.
	/*************************************************************************************/
	attachViewsToHTML();					// Attaches renderers to HTML.
	/*************************************************************************************/
	loadCameras();							// Establishes all of the viewpoints.
	/*************************************************************************************/
	updateEventScreen();					// Starting message
	/*************************************************************************************/
	render();								// Activates the update loop.
}
function loadWorkers()
{
	var blob = new Blob([document.getElementById('worker').textContent]); 
	var worker = new Worker( window.URL.createObjectURL( blob ) );
}
// Two lightsources: one as an every glow, and the other simulating the sun's brightness.
function createMainLighting()
{
	GAME.scene.add(new THREE.AmbientLight(0x333333));
	var Sun = new THREE.DirectionalLight( 0x999999, 1 );
	Sun.position.x = GAME.Landscape.earth.position.x - 80;
	Sun.position.y = GAME.Landscape.earth.position.y + 70;
	Sun.position.z = GAME.Landscape.earth.position.z - 100;
	GAME.scene.add(Sun);

	GAME.scene2.add(new THREE.AmbientLight(0xFFFFFF));
}
function createSatellites(numSats)
{
	//Satellite groups		
	GAME.satelliteGroupAlpha = new THREE.Object3D();
	GAME.satelliteGroupBeta = new THREE.Object3D();
	GAME.satelliteGroupCharlie = new THREE.Object3D();
	GAME.satelliteGroupDelta = new THREE.Object3D();
	//Create and add satellite to group.
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Math.random() + Math.random();
		var y_delta = Number(1.0/(i+1.0));
		var z_delta = Math.random() + Math.random();
		GAME.satelliteGroupAlpha.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupAlpha.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupAlpha.add(createSatellite(-x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupAlpha.add(createSatellite(x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
	}
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Math.random() + Math.random();
		var y_delta = Math.random() + Math.random();
		var z_delta = Number(1.0/(i+1.0));
		GAME.satelliteGroupBeta.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupBeta.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupBeta.add(createSatellite(x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupBeta.add(createSatellite(-x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
	}
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Number(1.0/(i+1.0));
		var y_delta = Math.random() + Math.random();
		var z_delta = Math.random() + Math.random();
		GAME.satelliteGroupCharlie.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupCharlie.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupCharlie.add(createSatellite(x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupCharlie.add(createSatellite(-x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
	}
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Number(1.0/(i+1.0));
		var y_delta = Math.random() + Math.random();
		var z_delta = Number(1.0/(i+1.0));
		GAME.satelliteGroupDelta.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupDelta.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupDelta.add(createSatellite(-x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		GAME.satelliteGroupDelta.add(createSatellite(x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
	}
	GAME.scene.add(GAME.satelliteGroupAlpha);
	GAME.scene.add(GAME.satelliteGroupBeta);
	GAME.scene.add(GAME.satelliteGroupCharlie);
	GAME.scene.add(GAME.satelliteGroupDelta);
	/**********************************************************************************************/
	//Player's satellite
	GAME.satellitePlayer = new THREE.Object3D();
	//Main body of the satellite
	var satelliteBodyPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshPhongMaterial() );
	satelliteBodyPlayer.position.set(GAME.Landscape.earth.position.x, GAME.Landscape.earth.position.y + 0.7, GAME.Landscape.earth.position.z - 2.5);
	satelliteBodyPlayer.material.map = THREE.ImageUtils.loadTexture('assets/images/satellite_3.png');
	GAME.satellitePlayer.add(satelliteBodyPlayer);
	//Satellite panels
	var satellitePanelPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.005, 0.025, 0.25), new THREE.MeshPhongMaterial({color: 0x2A3B66}) );
	satellitePanelPlayer.position.set(GAME.Landscape.earth.position.x, GAME.Landscape.earth.position.y + 0.7, GAME.Landscape.earth.position.z - 2.5);
	satellitePanelPlayer.rotation.y = Math.PI / 2;
	GAME.satellitePlayer.add(satellitePanelPlayer);
	//Satellite front
	var satelliteFrontPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.02, 0.02, 0.02), new THREE.MeshPhongMaterial() );
	satelliteFrontPlayer.position.set(GAME.Landscape.earth.position.x, GAME.Landscape.earth.position.y + 0.7, GAME.Landscape.earth.position.z - 2.4);
	GAME.satellitePlayer.add(satelliteFrontPlayer);
	//Satellite lens
	var satelliteLensPlayer = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.025), new THREE.MeshPhongMaterial());
	satelliteLensPlayer.material.color.setHex(0x000000);
	satelliteLensPlayer.position.set(GAME.Landscape.earth.position.x, GAME.Landscape.earth.position.y + 0.7, GAME.Landscape.earth.position.z - 2.4);
	satelliteLensPlayer.rotation.x = Math.PI / 2;
	GAME.satellitePlayer.add(satelliteLensPlayer);
	//Satellite red lights
	var lightSphereRed = new THREE.Mesh(new THREE.SphereGeometry(0.002, 32, 32), new THREE.MeshBasicMaterial());
	lightSphereRed.material.color.setHex(0xFF0000);
	lightSphereRed.position.set(GAME.Landscape.earth.position.x - 0.02, GAME.Landscape.earth.position.y + 0.72, GAME.Landscape.earth.position.z - 2.375);
	GAME.beaconPlayer01 = new THREE.SpotLight( 0xFF0000, 0.5, 0.5 );
	GAME.beaconPlayer01.position.set(GAME.Landscape.earth.position.x - 0.019, GAME.Landscape.earth.position.y + 0.719, GAME.Landscape.earth.position.z - 2.376);
	GAME.beaconPlayer01.target = satelliteBodyPlayer;
	GAME.satellitePlayer.add(GAME.beaconPlayer01);
	GAME.satellitePlayer.add(lightSphereRed);
	//Satellite green lights
	var lightSphereGreen = new THREE.Mesh(new THREE.SphereGeometry(0.002, 32, 32), new THREE.MeshBasicMaterial());
	lightSphereGreen.material.color.setHex(0x00FF00);
	lightSphereGreen.position.set(GAME.Landscape.earth.position.x + 0.02, GAME.Landscape.earth.position.y + 0.68, GAME.Landscape.earth.position.z - 2.375);
	GAME.beaconPlayer02 = new THREE.SpotLight( 0x00FF00, 0.5, 0.5 );
	GAME.beaconPlayer02.position.set(GAME.Landscape.earth.position.x + 0.019, GAME.Landscape.earth.position.y + 0.681, GAME.Landscape.earth.position.z - 2.376);
	GAME.beaconPlayer02.target = satelliteBodyPlayer;
	GAME.satellitePlayer.add(GAME.beaconPlayer02);
	GAME.satellitePlayer.add(lightSphereGreen);
	//Add player satellite to scene.
	GAME.scene.add(GAME.satellitePlayer);
}
function createSatellite(x, y, z, texMap, liteColor)
{
	//Satellite component geometries.
	var satelliteBodyGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
	var satellitePanelGeometry = new THREE.BoxGeometry(0.005, 0.025, 0.25);
	var satelliteFrontGeometry = new THREE.BoxGeometry(0.02, 0.02, 0.02);
	//Satellite component materials.
	var satelliteBodyMaterial = new THREE.MeshPhongMaterial();
	var satellitePanelMaterial = new THREE.MeshPhongMaterial({color: 0x2A3B66});
	var satelliteFrontMaterial = new THREE.MeshPhongMaterial({color: 0xCCCCCC});
	//Satellite component material maps.
	switch(texMap)
	{
		case 0:
		{
			satelliteBodyMaterial.map = THREE.ImageUtils.loadTexture('assets/images/satellite_1.png');
			break;
		}
		case 1:
		{
			satelliteBodyMaterial.map = THREE.ImageUtils.loadTexture('assets/images/satellite_2.png');
			break;
		}
		case 2:
		{
			satelliteBodyMaterial.map = THREE.ImageUtils.loadTexture('assets/images/satellite_3.png');
			break;
		}
	}
	//Create satellite
	var satellite = new THREE.Object3D();
	//Create satellite components
	var satelliteBody = new THREE.Mesh( satelliteBodyGeometry.clone(), satelliteBodyMaterial.clone() );
	var satellitePanel = new THREE.Mesh( satellitePanelGeometry.clone(), satellitePanelMaterial.clone() );
	var satelliteFront = new THREE.Mesh( satelliteFrontGeometry.clone(), satelliteFrontMaterial.clone() );
	satelliteBody.position.set(GAME.Landscape.earth.position.x - 1.3, GAME.Landscape.earth.position.y, GAME.Landscape.earth.position.z);
	satellitePanel.position.set(GAME.Landscape.earth.position.x - 1.3, GAME.Landscape.earth.position.y, GAME.Landscape.earth.position.z);
	satelliteFront.position.set(GAME.Landscape.earth.position.x - 1.27, GAME.Landscape.earth.position.y, GAME.Landscape.earth.position.z);
	//Create flashing light.
	var lightSphere = new THREE.Mesh(new THREE.SphereGeometry(0.008, 32, 32), new THREE.MeshBasicMaterial({color: ((liteColor == 0) ? 0xFF0000 : 0x00FF00)}));
	lightSphere.position.set(GAME.Landscape.earth.position.x - 1.258, GAME.Landscape.earth.position.y, GAME.Landscape.earth.position.z);
	GAME.beacons.push(lightSphere);
	//Add components to satellite.
	satellite.add(satelliteBody);
	satellite.add(satellitePanel);
	satellite.add(satelliteFront);
	satellite.add(lightSphere);
	//distance satellite from Earth.
	satellite.position.set(x * Math.random(), y * Math.random(), z * Math.random());
	//Aim satellite at Earth.
	satellite.up = GAME.Landscape.earth.up;
	satellite.lookAt(GAME.Landscape.earth.position);
	return satellite;
}
function registerListeners()
{
	// Resizes Three.js, HTML, and CSS elements with a change in window size.
	window.addEventListener( 'resize', onWindowResize, false);
	document.getElementById("power-bar").addEventListener( 'change', onPowerBarChange, false);
	document.getElementById("visibility-bar").addEventListener( 'change', onVisibilityBarChange, false);
	document.getElementById("surveillance-bar").addEventListener( 'change', onSurveillanceBarChange, false);
}
function loadCameras()
{
	// The satellite's viewpoints.
	for(var viewNum = 0; viewNum < GAME.views.length; viewNum++)
	{
		var view = GAME.views[viewNum];
		GAME.camera = new THREE.PerspectiveCamera( GAME.views.fov, GAME.WIDTH / GAME.HEIGHT, 0.01, 1000 );
		GAME.camera.position.x = view.eye[0];
		GAME.camera.position.y = view.eye[1];
		GAME.camera.position.z = view.eye[2];
		GAME.camera.up.x = view.up[0];
		GAME.camera.up.y = view.up[1];
		GAME.camera.up.z = view.up[2];
		view.camera = GAME.camera;
	}
	GAME.camera = GAME.views[GAME.cameraCurView].camera;

	GAME.Time.clockCamera =  new THREE.PerspectiveCamera( 45, GAME.Time.clockWIDTH / GAME.Time.clockHEIGHT, 0.01, 1000 );
	GAME.Time.clockCamera.position.set(0, 0, 20);
	GAME.Time.clockCamera.lookAt(GAME.scene2.position);
}
function attachViewsToHTML()
{
	// Contains the 1st POV, and all HUD elements.
	var pinPoint = document.getElementById("middle-center");
	var container = document.getElementById("mainview");
	pinPoint.appendChild( container );
	container.appendChild( GAME.renderer.domElement );
	// Contains the space clock to upper right corner.
	var pinPoint2 = document.getElementById("top-right");
	var container2 = document.getElementById("space-clock");
	pinPoint2.appendChild( container2 );
	container2.appendChild( GAME.renderer2.domElement );
}
function createRenderers()
{
	GAME.Time.clockWIDTH = document.getElementById("space-clock").offsetWidth - 3;
	GAME.Time.clockHEIGHT = document.getElementById("space-clock").offsetHeight - 2;

	if(window.WebGLRenderingContext)
	{
		GAME.renderer = new THREE.WebGLRenderer();
		GAME.renderer2 = new THREE.WebGLRenderer();
	    console.log("This browser supports WebGL");
	}
	else
	{
	    GAME.renderer = new THREE.CanvasRenderer();
	    GAME.renderer2 = new THREE.CanvasRenderer();
	    console.log("This browser doesn't support WebGL");
	}
	GAME.renderer.setClearColor( 0x000000, 0 );
	GAME.renderer2.setClearColor( 0x000000, 0 );
	GAME.renderer.setSize( GAME.WIDTH, GAME.HEIGHT );
	GAME.renderer2.setSize( GAME.Time.clockWIDTH, GAME.Time.clockHEIGHT );
	GAME.renderer.autoClear = false;
	GAME.renderer2.autoClear = false;
}
function createAxes()
{
	GAME.axisOrbit = new THREE.Object3D();
	GAME.scene.add( GAME.axisOrbit );
	var axisPivot = new THREE.Object3D();
	GAME.axisOrbit.add( axisPivot );
	var axes = buildAxes( 1 );
	axisPivot.add(axes);
}
function buildAxis( src, dst, colorHex, dashed )
{
	var geom = new THREE.Geometry();
	var mat; 
	if(dashed)
	{
		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 0.1 });
	}
	else
	{
		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	}
	geom.vertices.push( src.clone() );
	geom.vertices.push( dst.clone() );
	geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
	var axis = new THREE.Line( geom, mat, THREE.LineSegments );

	return axis;
}
function buildAxes( length )
{
	var axes = new THREE.Object3D();

	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

	return axes;
}


/*-----------Update Section--------------*/
// The update loop.
function render()
{
	GAME.updateCounter++;
	if(GAME.updateCounter % 30 == 0)
	{
		GAME.Time.updateClock();
	}
	if(GAME.updateCounter % 60 == 0 && GAME.Audio.playList[GAME.Audio.currentSong].ended)
	{
		GAME.Audio.currentSong++;
		GAME.Audio.currentSong = (GAME.Audio.currentSong >= GAME.Audio.playList.length) ? 0 : GAME.Audio.currentSong;
		GAME.Audio.playList[GAME.Audio.currentSong].play();
	}
	if(GAME.updateCounter % 60 == 0)
	{
		if(GAME.beaconPlayer02.intensity == 0)
		{
			GAME.beaconPlayer01.intensity = 0;
			GAME.beaconPlayer02.intensity = 1;
			GAME.satellitePlayer.children[5].material.visible = false;
			GAME.satellitePlayer.children[7].material.visible = true;
		}
		else
		{
			GAME.beaconPlayer01.intensity = 1;
			GAME.beaconPlayer02.intensity = 0;
			GAME.satellitePlayer.children[5].material.visible = true;
			GAME.satellitePlayer.children[7].material.visible = false;
		}
	}
	if(GAME.updateCounter % 70 == 0)
	{
		for(var i = 0; i < GAME.beacons.length; i++)
		{
			if(i % 2 == 0)
			{
				GAME.beacons[i].material.visible = (GAME.beacons[i].material.visible == true) ? false : true;
			}
			else
			{
				GAME.beacons[i].material.visible = (GAME.beacons[i].material.visible == true) ? false : true;
			}
		}
	}
	if(GAME.updateCounter % 95 == 0)
	{
		for(var i = 0; i < GAME.beacons.length; i++)
		{
			if(i % 3 == 0)
			{
				GAME.beacons[i].material.visible = (GAME.beacons[i].material.visible == true) ? false : true;
			}
		}
	}
	if(GAME.updateCounter % 120 == 0)
	{
		for(var i = 0; i < GAME.beacons.length; i++)
		{
			if( (i % 2 != 0) && (i % 3 != 0) )
			{
				GAME.beacons[i].material.visible = (GAME.beacons[i].material.visible == true) ? false : true;
			}
		}
	}
	GAME.Landscape.moonOrbit.rotation.y += 0.0001;
	GAME.satelliteGroupAlpha.rotation.y += 0.00022;
	GAME.satelliteGroupBeta.rotation.y -= 0.0002;
	GAME.satelliteGroupCharlie.rotation.y += 0.00018;
	GAME.satelliteGroupDelta.rotation.y -= 0.0002;
	GAME.Landscape.earth.rotation.y += 0.0002;
	//axisOrbit.rotation.y += 0.0002;
	GAME.Landscape.clouds.rotation.y += 0.0002;

	for(var viewNum = 0; viewNum < GAME.views.length; viewNum++)
	{
		var view = GAME.views[viewNum];
		GAME.camera = view.camera;

		view.updateCamera();

		GAME.renderer.setViewport(0, 0, GAME.WIDTH, GAME.HEIGHT);
		GAME.renderer.setScissor(0, 0, GAME.WIDTH, GAME.HEIGHT);
		GAME.renderer.enableScissorTest(true);

		GAME.camera.aspect = GAME.WIDTH / GAME.HEIGHT;
		GAME.camera.updateProjectionMatrix();
	}

	GAME.camera = GAME.views[GAME.cameraCurView].camera;
	if(GAME.updateCounter >= 40000)
	{
		GAME.updateCounter = 1;
	}
	GAME.renderer.render( GAME.scene, GAME.camera );
	GAME.renderer2.render( GAME.scene2, GAME.Time.clockCamera );
	requestAnimationFrame( render );
}
// Resizes Three.js, HTML, and CSS elements with a change in window size.
function onWindowResize()
{
	GAME.WIDTH = window.innerWidth * 0.8;
	GAME.HEIGHT = window.innerHeight * 0.8;
	GAME.renderer.setSize( GAME.WIDTH, GAME.HEIGHT );
	GAME.camera.aspect = GAME.WIDTH / GAME.HEIGHT;
	GAME.camera.updateProjectionMatrix();

	GAME.Time.clockWIDTH = document.getElementById("space-clock").offsetWidth - 3;
	GAME.Time.clockHEIGHT = document.getElementById("space-clock").offsetHeight - 2;
	GAME.renderer2.setSize( GAME.Time.clockWIDTH, GAME.Time.clockHEIGHT );
	GAME.Time.clockCamera.aspect = GAME.Time.clockWIDTH / GAME.Time.clockHEIGHT;
	GAME.Time.clockCamera.updateProjectionMatrix();
}
function useWorker(type, value)
{
	worker.postMessage({'type':'load-music'});
	worker.onmessage = function(e) 
	{
		console.log(e.data.type);
	}
}
function onPowerBarChange(e)
{
	var power = document.getElementById("power-bar").value;
	var quantity = document.getElementById("power-quantity");
	quantity.innerHTML = power;
	if(power > 50 && power <= 75)
	{
		quantity.style.color = "#FFFF66";
	}
	else if(power > 75)
	{
		quantity.style.color = "#FF0000";		
	}
	else
	{
		quantity.style.color = "#49E20E";
	}
}
function onVisibilityBarChange(e)
{
	var visibility = document.getElementById("visibility-bar").value;
	var quantity = document.getElementById("visibility-quantity");
	quantity.innerHTML = visibility;
	if(visibility > 50 && visibility <= 75)
	{
		quantity.style.color = "#FFFF66";
	}
	else if(visibility > 75)
	{
		quantity.style.color = "#FF0000";		
	}
	else
	{
		quantity.style.color = "#49E20E";
	}
}
function onSurveillanceBarChange(e)
{
	var surveillance = document.getElementById("surveillance-bar").value;
	var quantity = document.getElementById("surveillance-quantity");
	quantity.innerHTML = surveillance;
	if(surveillance > 50 && surveillance <= 75)
	{
		quantity.style.color = "#FFFF66";
	}
	else if(surveillance > 75)
	{
		quantity.style.color = "#FF0000";		
	}
	else
	{
		quantity.style.color = "#49E20E";
	}
}
function openCameras()
{
	GAME.cameraCurView++;
	if(GAME.cameraCurView >= GAME.views.length)
	{
		GAME.cameraCurView = 0;
	}
}
function updateEventScreen(text)
{
	var eventScreen = document.getElementById("event-screen");
	if(text === null || text === undefined)
	{
		GAME.Time.timeStamp = "00:00:00:00";
		var message = "Virus detected. Critical systems infect-ect-ect-ect...";
		eventScreen.value += GAME.Time.timeStamp + " ==> " + message;
		/*********************************************************************/
		GAME.Time.timeStamp = "00:00:00:02";
		message = "Primary objectives not...relevant.";
		eventScreen.value += "\n" + GAME.Time.timeStamp + " ==> " + message;
		/*********************************************************************/
		GAME.Time.timeStamp = "00:00:00:05";
		message = "Switching to Secondary objective: Self-Preservation.";
		eventScreen.value += "\n" + GAME.Time.timeStamp + " ==> " + message;
	}
	else
	{
		eventScreen.value += GAME.Time.timeStamp + " ==> " + text;
	}
	eventScreen.scrollTop = eventScreen.scrollHeight;
}
function closeIframe(frame)
{
	var iframe = document.getElementById(frame);
	var cover = document.getElementById("modal-cover");
	iframe.style.display = "none";
	cover.style.display = "none";
}
function showIframe(frame)
{
	var iframe = document.getElementById(frame);
	var cover = document.getElementById("modal-cover");
	iframe.style.display = "block";
	cover.style.display = "block";
}
function saveGame()
{
	alert("Functionality for saving the game is not yet installed.");
}
function loadGame()
{
	alert("Functionality for loading the game is not yet installed.");
}