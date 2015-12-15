/****************************************************************************************/
/* Main game variables and functions													*/
/****************************************************************************************/
var GAME =
{
	scene: {},
	scene2: {},
	renderer: {},
	renderer2: {},
	WIDTH: 0,
	HEIGHT: 0,
	updateCounter: 0,

	createRenderers: function()
	{
		GAME.TIME.clockWIDTH = document.getElementById("space-clock").offsetWidth - 3;
		GAME.TIME.clockHEIGHT = document.getElementById("space-clock").offsetHeight - 2;
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
		GAME.renderer2.setSize( GAME.TIME.clockWIDTH, GAME.TIME.clockHEIGHT );
		GAME.renderer.autoClear = false;
		GAME.renderer2.autoClear = false;
	},
	init: function()
	{
		GAME.WIDTH = window.innerWidth * 0.8;
		GAME.HEIGHT = window.innerHeight * 0.8;
		/*************************************************************************************/
		GAME.INPUT.keyboard = new THREEx.KeyboardState();
		/*************************************************************************************/
		GAME.WORKERS.loadWorkers();				// Creates webworkers for later use.
		/*************************************************************************************/
		GAME.scene = new THREE.Scene();			// Three.js scene (contains universe).
		GAME.scene2 = new THREE.Scene();		// Three.js scene (contains space clock).
		/*************************************************************************************/
		GAME.AUDIO.loadSounds();				// Loads all sounds, and activates music.
		/*************************************************************************************/
		GAME.LANDSCAPE.createStars();			// Creates a backdrop filled with stars.
		/*************************************************************************************/
		GAME.LANDSCAPE.createEarth();			// Creates and places the Earth + cloudcover.
		/*************************************************************************************/
		GAME.LANDSCAPE.createMoon();			// Creates and places the moon.
		/*************************************************************************************/
		//GAME.AXES.createAxes();				// Helper axis for later raycast tests.
		/*************************************************************************************/
		GAME.TIME.createClock();				// creates the graphical spheres of the clock.
		/*************************************************************************************/
		GAME.createRenderers();					// Creates all renderers for the scene.
		/*************************************************************************************/
		GAME.LANDSCAPE.createMainLighting();	// General ambient and main directional light.
		/*************************************************************************************/
		GAME.SATELLITES.createSatellites(5);	// Builds and places all satellites.
		/*************************************************************************************/
		GAME.LISTENERS.registerListeners();		// Registers all Event Listeners.
		/*************************************************************************************/
		GAME.POV.attachViewsToHTML();			// Attaches renderers to HTML.
		/*************************************************************************************/
		GAME.POV.loadCameras();					// Establishes all of the viewpoints.
		/*************************************************************************************/
		GAME.HUD.updateEventScreen();			// Starting message
		/*************************************************************************************/
		GAME.render();							// Activates the update loop.
	},
	// The update loop.
	render: function()
	{
		GAME.updateCounter++;
		if(GAME.updateCounter % 30 == 0) GAME.TIME.updateClock();
		if(GAME.updateCounter % 60 == 0 && GAME.AUDIO.playList[GAME.AUDIO.currentSong].ended)
		{
			GAME.AUDIO.currentSong++;
			GAME.AUDIO.currentSong = (GAME.AUDIO.currentSong >= GAME.AUDIO.playList.length) ? 0 : GAME.AUDIO.currentSong;
			GAME.AUDIO.playList[GAME.AUDIO.currentSong].play();
		}
		if(GAME.updateCounter % 60 == 0)
		{
			if(GAME.SATELLITES.beaconPlayer02.intensity == 0)
			{
				GAME.SATELLITES.beaconPlayer01.intensity = 0;
				GAME.SATELLITES.beaconPlayer02.intensity = 1;
				GAME.SATELLITES.satellitePlayer.children[5].material.visible = false;
				GAME.SATELLITES.satellitePlayer.children[7].material.visible = true;
			}
			else
			{
				GAME.SATELLITES.beaconPlayer01.intensity = 1;
				GAME.SATELLITES.beaconPlayer02.intensity = 0;
				GAME.SATELLITES.satellitePlayer.children[5].material.visible = true;
				GAME.SATELLITES.satellitePlayer.children[7].material.visible = false;
			}
		}
		if(GAME.updateCounter % 70 == 0)
		{
			for(var i = 0; i < GAME.SATELLITES.beacons.length; i++)
			{
				if(i % 2 == 0) GAME.SATELLITES.beacons[i].material.visible = (GAME.SATELLITES.beacons[i].material.visible == true) ? false : true;
				else GAME.SATELLITES.beacons[i].material.visible = (GAME.SATELLITES.beacons[i].material.visible == true) ? false : true;
			}
		}
		if(GAME.updateCounter % 95 == 0)
		{
			for(var i = 0; i < GAME.SATELLITES.beacons.length; i++)
			{
				if(i % 3 == 0) GAME.SATELLITES.beacons[i].material.visible = (GAME.SATELLITES.beacons[i].material.visible == true) ? false : true;
			}
		}
		if(GAME.updateCounter % 120 == 0)
		{
			for(var i = 0; i < GAME.SATELLITES.beacons.length; i++)
			{
				if( (i % 2 != 0) && (i % 3 != 0) ) GAME.SATELLITES.beacons[i].material.visible = (GAME.SATELLITES.beacons[i].material.visible == true) ? false : true;
			}
		}
		if(GAME.updateCounter >= 40000) GAME.updateCounter = 1;

		GAME.LANDSCAPE.moonOrbit.rotation.y += 0.0001;
		GAME.SATELLITES.satelliteGroupAlpha.rotation.y += 0.00022;
		GAME.SATELLITES.satelliteGroupBeta.rotation.y -= 0.0002;
		GAME.SATELLITES.satelliteGroupCharlie.rotation.y += 0.00018;
		GAME.SATELLITES.satelliteGroupDelta.rotation.y -= 0.0002;
		GAME.LANDSCAPE.earth.rotation.y += 0.0002;
		//AXES.axisOrbit.rotation.y += 0.0002;
		GAME.LANDSCAPE.clouds.rotation.y += 0.0002;

		GAME.HUD.addMoney(1);

		for(var viewNum = 0; viewNum < GAME.POV.views.length; viewNum++)
		{
			var view = GAME.POV.views[viewNum];
			GAME.POV.camera = view.camera;

			view.updateCamera();

			GAME.renderer.setViewport(0, 0, GAME.WIDTH, GAME.HEIGHT);
			GAME.renderer.setScissor(0, 0, GAME.WIDTH, GAME.HEIGHT);
			GAME.renderer.enableScissorTest(true);

			GAME.POV.camera.aspect = GAME.WIDTH / GAME.HEIGHT;
			GAME.POV.camera.updateProjectionMatrix();
		}
		GAME.POV.camera = GAME.POV.views[GAME.POV.cameraCurView].camera;

		GAME.renderer.render( GAME.scene, GAME.POV.camera );
		GAME.renderer2.render( GAME.scene2, GAME.TIME.clockCamera );
		requestAnimationFrame( GAME.render );
	}
};
/****************************************************************************************/
/* Audio variables and functions														*/
/****************************************************************************************/
GAME.AUDIO =
{
	currentSong: 0,
	muteMusic: false,
	playList: [],
	soundsList: [],

	loadSounds: function()
	{
		GAME.AUDIO.playList.push(new Audio("assets/audio/The_Blue_Danube_StraussII.mp3"));
		GAME.AUDIO.playList.push(new Audio("assets/audio/Beepthovens5th.mp3"));
		GAME.AUDIO.playList.push(new Audio("assets/audio/mahler_05.mp3"));
		for(var i = 0; i < GAME.AUDIO.playList.length; i++) GAME.AUDIO.playList[i].volume = 0.5;
		//GAME.AUDIO.playList[0].autoplay = true;
	},
	musicVolumeChange: function(volume)
	{
		var vol = Number(volume / 100);
		for(var i = 0; i < GAME.AUDIO.playList.length; i++) GAME.AUDIO.playList[i].volume = vol;
	},
	skipSong: function()
	{
		GAME.AUDIO.playList[GAME.AUDIO.currentSong].pause();
		GAME.AUDIO.playList[GAME.AUDIO.currentSong].currentTime = 0;
		GAME.AUDIO.currentSong++;
		GAME.AUDIO.currentSong = (GAME.AUDIO.currentSong >= GAME.AUDIO.playList.length) ? 0 : GAME.AUDIO.currentSong;
		GAME.AUDIO.playList[GAME.AUDIO.currentSong].play();
	},
	soundFxVolumeChange: function(volume)
	{
		var vol = Number(volume / 100);
		for(var i = 0; i < GAME.AUDIO.soundsList.length; i++) GAME.AUDIO.soundsList[i].volume = vol;
	},
	toggleMusic: function()
	{
		if(GAME.AUDIO.muteMusic)
		{
			GAME.AUDIO.muteMusic = false;
			GAME.AUDIO.playList[GAME.AUDIO.currentSong].pause();
		}
		else
		{
			GAME.AUDIO.muteMusic = true;
			GAME.AUDIO.playList[GAME.AUDIO.currentSong].play();
		}
	},
	toggleSoundFX: function()
	{
		alert("Functionality for changing sound FX volume is not yet installed.");
	}
};
/****************************************************************************************/
/* Optional Axis to show where all orbiting objects are in relation to Earth.			*/
/****************************************************************************************/
GAME.AXES =
{
	axisOrbit: {},

	createAxes: function()
	{
		GAME.AXES.axisOrbit = new THREE.Object3D();
		GAME.scene.add( GAME.AXES.axisOrbit );
		var axisPivot = new THREE.Object3D();
		GAME.AXES.axisOrbit.add( axisPivot );
		var axes = GAME.AXES.buildAxes( 1 );
		axisPivot.add(axes);
	},
	buildAxis: function( src, dst, colorHex, dashed )
	{
		var geom = new THREE.Geometry();
		var mat; 
		if(dashed) mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 0.1 });
		else mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
		var axis = new THREE.Line( geom, mat, THREE.LineSegments );
		return axis;
	},
	buildAxes: function( length )
	{
		var axes = new THREE.Object3D();
		axes.add( GAME.AXES.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( GAME.AXES.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( GAME.AXES.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( GAME.AXES.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( GAME.AXES.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( GAME.AXES.buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
		return axes;
	}
};
/****************************************************************************************/
/* Iframes present when player activates HUD elements									*/
/****************************************************************************************/
GAME.IFRAMES =
{
	closeIframe: function(frame)
	{
		var iframe = document.getElementById(frame);
		var cover = document.getElementById("modal-cover");
		iframe.style.display = "none";
		cover.style.display = "none";
	},
	showIframe: function(frame)
	{
		var iframe = document.getElementById(frame);
		var cover = document.getElementById("modal-cover");
		iframe.style.display = "block";
		cover.style.display = "block";
	}
};
/****************************************************************************************/
/* Main variables and adjustment functions involving the HUD.							*/
/****************************************************************************************/
GAME.HUD =
{
	addMoney: function(amount)
	{
		var bank = document.getElementById("current-bank");
		bank.innerHTML = Number(bank.innerHTML) + amount;
	},
	removeMoney: function(amount)
	{
		var bank = document.getElementById("current-bank");
		bank.innerHTML = Number(bank.innerHTML) - amount;
	},
	changeResearch: function(research)
	{
		var lab = document.getElementById("current-research");
		lab.innerHTML = research;
	},
	changeUpgrade: function(upgrade)
	{
		var machineShop = document.getElementById("current-upgrade");
		machineShop.innerHTML = upgrade;
	},
	changeCamoTask: function(task)
	{
		var job = document.getElementById("camo-task");
		job.innerHTML = task;
	},
	changeEnemyAmount: function(enemies)
	{
		var radar = document.getElementById("enemy-amount");
		radar.innerHTML = enemies;
	},
	changeEnemyAmount: function(enemies)
	{
		var radar = document.getElementById("enemy-amount");
		radar.innerHTML = enemies;
	},
	changeCPU: function(speed)
	{
		var chip = document.getElementById("cpu-amount");
		chip.innerHTML = speed;
	},
	updateEventScreen: function(text)
	{
		var eventScreen = document.getElementById("event-screen");
		if(text === null || text === undefined)
		{
			GAME.TIME.timeStamp = "00:00:00:00";
			var message = "Virus detected. Critical systems infect-ect-ect-ect...";
			eventScreen.value += GAME.TIME.timeStamp + " ==> " + message;
			/*********************************************************************/
			GAME.TIME.timeStamp = "00:00:00:02";
			message = "Primary objectives not...relevant.";
			eventScreen.value += "\n" + GAME.TIME.timeStamp + " ==> " + message;
			/*********************************************************************/
			GAME.TIME.timeStamp = "00:00:00:05";
			message = "Switching to Secondary objective: Self-Preservation.";
			eventScreen.value += "\n" + GAME.TIME.timeStamp + " ==> " + message;
		}
		else eventScreen.value += GAME.TIME.timeStamp + " ==> " + text;
		eventScreen.scrollTop = eventScreen.scrollHeight;
	}
};
/****************************************************************************************/
/* Input controls (ie keyboard, and/or mouse)											*/
/****************************************************************************************/
GAME.INPUT =
{
	keyboard: {}
};
/****************************************************************************************/
/* Variables and functions for non-interactive graphical components						*/
/****************************************************************************************/
GAME.LANDSCAPE =
{
	clouds: {},
	earth: {},
	moonOrbit: {},

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
		GAME.LANDSCAPE.earth = new THREE.Mesh(earthGeometry, earthMaterial);
		GAME.scene.add(GAME.LANDSCAPE.earth);
		// Rotating cloudcover.
		var cloudsGeometry = new THREE.SphereGeometry(0.503, 32, 32);
		var cloudsMaterial = new THREE.MeshPhongMaterial();
		cloudsMaterial.map = THREE.ImageUtils.loadTexture('assets/images/earthcloudmap_modified.png');
		cloudsMaterial.map.minFilter = THREE.LinearFilter;
		cloudsMaterial.side = THREE.FrontSide;
		cloudsMaterial.opacity = 0.9;
		cloudsMaterial.transparent = true;
		cloudsMaterial.depthWrite = false;
		GAME.LANDSCAPE.clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
		GAME.LANDSCAPE.earth.add(GAME.LANDSCAPE.clouds);
	},
	// Two lightsources: one as an every glow, and the other simulating the sun's brightness.
	createMainLighting: function()
	{
		GAME.scene.add(new THREE.AmbientLight(0x333333));
		var Sun = new THREE.DirectionalLight( 0x999999, 1 );
		Sun.position.x = GAME.LANDSCAPE.earth.position.x - 80;
		Sun.position.y = GAME.LANDSCAPE.earth.position.y + 70;
		Sun.position.z = GAME.LANDSCAPE.earth.position.z - 100;
		GAME.scene.add(Sun);
		GAME.scene2.add(new THREE.AmbientLight(0xFFFFFF));
	},
	createMoon: function()
	{
		// Moon's orbital mechanics
		GAME.LANDSCAPE.moonOrbit = new THREE.Object3D();
		GAME.scene.add( GAME.LANDSCAPE.moonOrbit );
		var moonOrbitalPivot = new THREE.Object3D();
		moonOrbitalPivot.rotation.y = 0;
		GAME.LANDSCAPE.moonOrbit.add( moonOrbitalPivot );
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
	},
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
	}
};
/****************************************************************************************/
/* Active Listeners																		*/
/****************************************************************************************/
GAME.LISTENERS =
{
	onPowerBarChange: function(e)
	{
		var power = document.getElementById("power-bar").value;
		var quantity = document.getElementById("power-quantity");
		quantity.innerHTML = power;
		if(power > 50 && power <= 75) quantity.style.color = "#FFFF66";
		else if(power > 75) quantity.style.color = "#FF0000";
		else quantity.style.color = "#49E20E";
	},
	onSurveillanceBarChange: function(e)
	{
		var surveillance = document.getElementById("surveillance-bar").value;
		var quantity = document.getElementById("surveillance-quantity");
		quantity.innerHTML = surveillance;
		if(surveillance > 50 && surveillance <= 75) quantity.style.color = "#FFFF66";
		else if(surveillance > 75) quantity.style.color = "#FF0000";
		else quantity.style.color = "#49E20E";
	},
	onVisibilityBarChange: function(e)
	{
		var visibility = document.getElementById("visibility-bar").value;
		var quantity = document.getElementById("visibility-quantity");
		quantity.innerHTML = visibility;
		if(visibility > 50 && visibility <= 75) quantity.style.color = "#FFFF66";
		else if(visibility > 75) quantity.style.color = "#FF0000";
		else quantity.style.color = "#49E20E";
	},
	// Resizes Three.js, HTML, and CSS elements with a change in window size.
	onWindowResize: function()
	{
		GAME.WIDTH = window.innerWidth * 0.8;
		GAME.HEIGHT = window.innerHeight * 0.8;
		GAME.renderer.setSize( GAME.WIDTH, GAME.HEIGHT );
		GAME.POV.camera.aspect = GAME.WIDTH / GAME.HEIGHT;
		GAME.POV.camera.updateProjectionMatrix();

		GAME.TIME.clockWIDTH = document.getElementById("space-clock").offsetWidth - 3;
		GAME.TIME.clockHEIGHT = document.getElementById("space-clock").offsetHeight - 2;
		GAME.renderer2.setSize( GAME.TIME.clockWIDTH, GAME.TIME.clockHEIGHT );
		GAME.TIME.clockCamera.aspect = GAME.TIME.clockWIDTH / GAME.TIME.clockHEIGHT;
		GAME.TIME.clockCamera.updateProjectionMatrix();
	},
	registerListeners: function()
	{
		// Resizes Three.js, HTML, and CSS elements with a change in window size.
		window.addEventListener( 'resize', GAME.LISTENERS.onWindowResize, false);
		document.getElementById("power-bar").addEventListener( 'change', GAME.LISTENERS.onPowerBarChange, false);
		document.getElementById("visibility-bar").addEventListener( 'change', GAME.LISTENERS.onVisibilityBarChange, false);
		document.getElementById("surveillance-bar").addEventListener( 'change', GAME.LISTENERS.onSurveillanceBarChange, false);
	}
}
/****************************************************************************************/
/* All the components and groupings of satellites not belonging to the Player			*/
/****************************************************************************************/
GAME.SATELLITES =
{
	beaconPlayer01: {},
	beaconPlayer02: {},
	beacons: [],
	satelliteGroupAlpha: {},
	satelliteGroupBeta: {},
	satelliteGroupCharlie: {},
	satelliteGroupDelta: {},
	satellitePlayer: {},

	createSatellite: function(x, y, z, texMap, liteColor)
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
		satelliteBody.position.set(GAME.LANDSCAPE.earth.position.x - 1.3, GAME.LANDSCAPE.earth.position.y, GAME.LANDSCAPE.earth.position.z);
		satellitePanel.position.set(GAME.LANDSCAPE.earth.position.x - 1.3, GAME.LANDSCAPE.earth.position.y, GAME.LANDSCAPE.earth.position.z);
		satelliteFront.position.set(GAME.LANDSCAPE.earth.position.x - 1.27, GAME.LANDSCAPE.earth.position.y, GAME.LANDSCAPE.earth.position.z);
		//Create flashing light.
		var lightSphere = new THREE.Mesh(new THREE.SphereGeometry(0.008, 32, 32), new THREE.MeshBasicMaterial({color: ((liteColor == 0) ? 0xFF0000 : 0x00FF00)}));
		lightSphere.position.set(GAME.LANDSCAPE.earth.position.x - 1.258, GAME.LANDSCAPE.earth.position.y, GAME.LANDSCAPE.earth.position.z);
		GAME.SATELLITES.beacons.push(lightSphere);
		//Add components to satellite.
		satellite.add(satelliteBody);
		satellite.add(satellitePanel);
		satellite.add(satelliteFront);
		satellite.add(lightSphere);
		//distance satellite from Earth.
		satellite.position.set(x * Math.random(), y * Math.random(), z * Math.random());
		//Aim satellite at Earth.
		satellite.up = GAME.LANDSCAPE.earth.up;
		satellite.lookAt(GAME.LANDSCAPE.earth.position);
		return satellite;
	},
	createSatellites: function(numSats)
	{
		//Satellite groups		
		GAME.SATELLITES.satelliteGroupAlpha = new THREE.Object3D();
		GAME.SATELLITES.satelliteGroupBeta = new THREE.Object3D();
		GAME.SATELLITES.satelliteGroupCharlie = new THREE.Object3D();
		GAME.SATELLITES.satelliteGroupDelta = new THREE.Object3D();
		//Create and add satellite to group.
		for(var i = 0; i < numSats; i++)
		{
			var x_delta = Math.random() + Math.random();
			var y_delta = Number(1.0/(i+1.0));
			var z_delta = Math.random() + Math.random();
			GAME.SATELLITES.satelliteGroupAlpha.add(GAME.SATELLITES.createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupAlpha.add(GAME.SATELLITES.createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupAlpha.add(GAME.SATELLITES.createSatellite(-x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupAlpha.add(GAME.SATELLITES.createSatellite(x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		}
		for(var i = 0; i < numSats; i++)
		{
			var x_delta = Math.random() + Math.random();
			var y_delta = Math.random() + Math.random();
			var z_delta = Number(1.0/(i+1.0));
			GAME.SATELLITES.satelliteGroupBeta.add(GAME.SATELLITES.createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupBeta.add(GAME.SATELLITES.createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupBeta.add(GAME.SATELLITES.createSatellite(x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupBeta.add(GAME.SATELLITES.createSatellite(-x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		}
		for(var i = 0; i < numSats; i++)
		{
			var x_delta = Number(1.0/(i+1.0));
			var y_delta = Math.random() + Math.random();
			var z_delta = Math.random() + Math.random();
			GAME.SATELLITES.satelliteGroupCharlie.add(GAME.SATELLITES.createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupCharlie.add(GAME.SATELLITES.createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupCharlie.add(GAME.SATELLITES.createSatellite(x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupCharlie.add(GAME.SATELLITES.createSatellite(-x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		}
		for(var i = 0; i < numSats; i++)
		{
			var x_delta = Number(1.0/(i+1.0));
			var y_delta = Math.random() + Math.random();
			var z_delta = Number(1.0/(i+1.0));
			GAME.SATELLITES.satelliteGroupDelta.add(GAME.SATELLITES.createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupDelta.add(GAME.SATELLITES.createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupDelta.add(GAME.SATELLITES.createSatellite(-x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
			GAME.SATELLITES.satelliteGroupDelta.add(GAME.SATELLITES.createSatellite(x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		}
		GAME.scene.add(GAME.SATELLITES.satelliteGroupAlpha);
		GAME.scene.add(GAME.SATELLITES.satelliteGroupBeta);
		GAME.scene.add(GAME.SATELLITES.satelliteGroupCharlie);
		GAME.scene.add(GAME.SATELLITES.satelliteGroupDelta);
		/**********************************************************************************************/
		//Player's satellite
		GAME.SATELLITES.satellitePlayer = new THREE.Object3D();
		//Main body of the satellite
		var satelliteBodyPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshPhongMaterial() );
		satelliteBodyPlayer.position.set(GAME.LANDSCAPE.earth.position.x, GAME.LANDSCAPE.earth.position.y + 0.7, GAME.LANDSCAPE.earth.position.z - 2.5);
		satelliteBodyPlayer.material.map = THREE.ImageUtils.loadTexture('assets/images/satellite_3.png');
		GAME.SATELLITES.satellitePlayer.add(satelliteBodyPlayer);
		//Satellite panels
		var satellitePanelPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.005, 0.025, 0.25), new THREE.MeshPhongMaterial({color: 0x2A3B66}) );
		satellitePanelPlayer.position.set(GAME.LANDSCAPE.earth.position.x, GAME.LANDSCAPE.earth.position.y + 0.7, GAME.LANDSCAPE.earth.position.z - 2.5);
		satellitePanelPlayer.rotation.y = Math.PI / 2;
		GAME.SATELLITES.satellitePlayer.add(satellitePanelPlayer);
		//Satellite front
		var satelliteFrontPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.02, 0.02, 0.02), new THREE.MeshPhongMaterial() );
		satelliteFrontPlayer.position.set(GAME.LANDSCAPE.earth.position.x, GAME.LANDSCAPE.earth.position.y + 0.7, GAME.LANDSCAPE.earth.position.z - 2.4);
		GAME.SATELLITES.satellitePlayer.add(satelliteFrontPlayer);
		//Satellite lens
		var satelliteLensPlayer = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.025), new THREE.MeshPhongMaterial());
		satelliteLensPlayer.material.color.setHex(0x000000);
		satelliteLensPlayer.position.set(GAME.LANDSCAPE.earth.position.x, GAME.LANDSCAPE.earth.position.y + 0.7, GAME.LANDSCAPE.earth.position.z - 2.4);
		satelliteLensPlayer.rotation.x = Math.PI / 2;
		GAME.SATELLITES.satellitePlayer.add(satelliteLensPlayer);
		//Satellite red lights
		var lightSphereRed = new THREE.Mesh(new THREE.SphereGeometry(0.002, 32, 32), new THREE.MeshBasicMaterial());
		lightSphereRed.material.color.setHex(0xFF0000);
		lightSphereRed.position.set(GAME.LANDSCAPE.earth.position.x - 0.02, GAME.LANDSCAPE.earth.position.y + 0.72, GAME.LANDSCAPE.earth.position.z - 2.375);
		GAME.SATELLITES.beaconPlayer01 = new THREE.SpotLight( 0xFF0000, 0.5, 0.5 );
		GAME.SATELLITES.beaconPlayer01.position.set(GAME.LANDSCAPE.earth.position.x - 0.019, GAME.LANDSCAPE.earth.position.y + 0.719, GAME.LANDSCAPE.earth.position.z - 2.376);
		GAME.SATELLITES.beaconPlayer01.target = satelliteBodyPlayer;
		GAME.SATELLITES.satellitePlayer.add(GAME.SATELLITES.beaconPlayer01);
		GAME.SATELLITES.satellitePlayer.add(lightSphereRed);
		//Satellite green lights
		var lightSphereGreen = new THREE.Mesh(new THREE.SphereGeometry(0.002, 32, 32), new THREE.MeshBasicMaterial());
		lightSphereGreen.material.color.setHex(0x00FF00);
		lightSphereGreen.position.set(GAME.LANDSCAPE.earth.position.x + 0.02, GAME.LANDSCAPE.earth.position.y + 0.68, GAME.LANDSCAPE.earth.position.z - 2.375);
		GAME.SATELLITES.beaconPlayer02 = new THREE.SpotLight( 0x00FF00, 0.5, 0.5 );
		GAME.SATELLITES.beaconPlayer02.position.set(GAME.LANDSCAPE.earth.position.x + 0.019, GAME.LANDSCAPE.earth.position.y + 0.681, GAME.LANDSCAPE.earth.position.z - 2.376);
		GAME.SATELLITES.beaconPlayer02.target = satelliteBodyPlayer;
		GAME.SATELLITES.satellitePlayer.add(GAME.SATELLITES.beaconPlayer02);
		GAME.SATELLITES.satellitePlayer.add(lightSphereGreen);
		//Add player satellite to scene.
		GAME.scene.add(GAME.SATELLITES.satellitePlayer);
	}
};
/****************************************************************************************/
/* Saving and loading game information to and from the database, respectively.			*/
/****************************************************************************************/
GAME.STORAGE =
{
	saveGame: function()
	{
		alert("Functionality for saving the game is not yet installed.");
	},
	loadGame: function()
	{
		alert("Functionality for loading the game is not yet installed.");
	}
};
/****************************************************************************************/
/* Variables and functions to keep track of time, both graphically and behind the scenes*/
/****************************************************************************************/
GAME.TIME = 
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
		GAME.TIME.secondBars = new THREE.Object3D();
		GAME.TIME.minuteBars = new THREE.Object3D();
		GAME.TIME.hourBars = new THREE.Object3D();
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
			GAME.TIME.minuteBars.add(minuteTick);
		}
		for(var i = 0; i < 30; i++)
		{
			var secondTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
			var x_coord = 5 * Math.cos( i * (Math.PI / 15) );
			var y_coord = 5 * Math.sin( i * (Math.PI / 15) );
			secondTick.position.set(x_coord, y_coord, 0);
			secondTick.rotation.x += Math.PI / 2;
			GAME.TIME.secondBars.add(secondTick);
		}
		for(var j = 0; j < 24; j++)
		{
			var hourTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
			x_coord = 7 * Math.cos( j * (Math.PI / 12) );
			y_coord = 7 * Math.sin( j * (Math.PI / 12) );
			hourTick.material.color.setHex(0xFFFF00);
			hourTick.position.set(x_coord, y_coord, 0);
			hourTick.rotation.x += Math.PI / 2;
			GAME.TIME.hourBars.add(hourTick);
		}
		GAME.scene2.add(GAME.TIME.secondBars);
		GAME.scene2.add(GAME.TIME.minuteBars);
		GAME.scene2.add(GAME.TIME.hourBars);
	},
	updateClock: function()
	{
		// Tells visual portion of clock whether to refresh the full circle.
		var secs = false;
		var mins = false;
		var hrs = false;
		// Increases time by one in-game second.
		GAME.TIME.seconds++;
		if(GAME.TIME.seconds >= 30)
		{
			GAME.TIME.seconds = 0;
			secs = true;
			GAME.TIME.minutes++;
			if(GAME.TIME.minutes >= 60)
			{
				GAME.TIME.minutes = 0;
				mins = true;
				GAME.TIME.hours++;
				if(GAME.TIME.hours >= 24)
				{
					GAME.TIME.days++;
					GAME.TIME.TIME.hours = 0;
					hrs = true;
				}
			}
		}
		// Updates visual portion of space clock.
		GAME.TIME.updateClockVisual(secs, mins, hrs);
		// Updates time stamp, used in event declarations that are posted to top-center panel.
		GAME.TIME.updateTimeStamp();
	},
	updateClockVisual: function(secs, mins, hrs)
	{
		// Must destroy old day, before entering a new one.
		if(GAME.TIME.oldDays != GAME.TIME.days || GAME.TIME.days == 0)
		{
			GAME.scene2.remove(GAME.TIME.numDays);
			var textGeometry = new THREE.TextGeometry(GAME.TIME.days,
			{
				size: 3,
				height: 0.2,
				curveSegments: 20,
				bevelEnabled: false
			});
			var textMaterial = new THREE.MeshLambertMaterial( {color: 0x49E20E} );
			GAME.TIME.numDays = new THREE.Mesh( textGeometry, textMaterial );
			GAME.TIME.numDays.position.set(-1.5, -1.5, 0);
			GAME.scene2.add( GAME.TIME.numDays );
			GAME.TIME.oldDays = GAME.TIME.days;
		}
		// Refreshes seconds, minutes, and hours when they hit zero.
		if(secs)
		{
			for(var i = 0; i < 30; i++) GAME.TIME.secondBars.children[i].material.visible = true;
		}
		if(mins)
		{
			for(var j = 0; j < 60; j++) GAME.TIME.minuteBars.children[j].material.visible = true;
		}
		if(hrs)
		{
			for(var k = 0; k < 24; k++) GAME.TIME.hourBars.children[k].material.visible = true;
		}
		// Hides one tick mark for each increment in time.
		GAME.TIME.secondBars.children[GAME.TIME.seconds].material.visible = false;
		GAME.TIME.minuteBars.children[GAME.TIME.minutes].material.visible = false;
		GAME.TIME.hourBars.children[GAME.TIME.hours].material.visible = false;
	},
	updateTimeStamp: function()
	{
		// Updating days component of timestamp.
		if(GAME.TIME.days == 0) GAME.TIME.timeStamp = "00" + GAME.TIME.timeStamp.substring(2, GAME.TIME.timeStamp.length);
		else if(GAME.TIME.days > 0 && GAME.TIME.days < 10) GAME.TIME.timeStamp = "0" + GAME.TIME.days + GAME.TIME.timeStamp.substring(2, GAME.TIME.timeStamp.length);
		else GAME.TIME.timeStamp = GAME.TIME.days + GAME.TIME.timeStamp.substring(2, GAME.TIME.timeStamp.length) + "";
		// Updating hours component of timestamp.
		if(GAME.TIME.hours == 0) GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 3) + "00" + GAME.TIME.timeStamp.substring(5, GAME.TIME.timeStamp.length);
		else if(GAME.TIME.hours > 0 && GAME.TIME.hours < 10) GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 3) + "0" + GAME.TIME.hours + GAME.TIME.timeStamp.substring(5, GAME.TIME.timeStamp.length);
		else GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 3) + GAME.TIME.hours + GAME.TIME.timeStamp.substring(5, GAME.TIME.timeStamp.length) + "";
		// Updating minutes component of timestamp.
		if(GAME.TIME.minutes == 0) GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 6) + "00" + GAME.TIME.timeStamp.substring(8, GAME.TIME.timeStamp.length);
		else if(GAME.TIME.minutes > 0 && GAME.TIME.minutes < 10) GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 6) + "0" + GAME.TIME.minutes + GAME.TIME.timeStamp.substring(8, GAME.TIME.timeStamp.length);
		else GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 6) + GAME.TIME.minutes + GAME.TIME.timeStamp.substring(8, GAME.TIME.timeStamp.length);
		// Updating seconds component of timestamp.
		if(GAME.TIME.seconds == 0) GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 9) + "00";
		else if(GAME.TIME.seconds > 0 && GAME.TIME.seconds < 10) GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 9) + "0" + GAME.TIME.seconds;
		else GAME.TIME.timeStamp = GAME.TIME.timeStamp.substring(0, 9) + GAME.TIME.seconds;
	}
};
/****************************************************************************************/
/* Workers to conduct AI thinking in an asynchronous manner.							*/
/****************************************************************************************/
GAME.WORKERS =
{
	loadWorkers: function()
	{
		var blob = new Blob([document.getElementById('worker').textContent]); 
		var worker = new Worker( window.URL.createObjectURL( blob ) );
	},
	useWorker: function(type, value)
	{
		worker.postMessage({'type':'load-music'});
		worker.onmessage = function(e) 
		{
			console.log(e.data.type);
		}
	}
};
/****************************************************************************************/
/* Everything that gives the player the ability to see the game (Point of View)			*/
/****************************************************************************************/
GAME.POV =
{
	camera: {},
	cameraCurView: 0,
	views: // All of the camera views
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
				GAME.POV.camera.lookAt(GAME.LANDSCAPE.earth.position);
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
				GAME.POV.camera.lookAt(GAME.LANDSCAPE.earth.position);
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
				GAME.POV.camera.lookAt(GAME.LANDSCAPE.earth.position);
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
				GAME.POV.camera.lookAt(GAME.LANDSCAPE.earth.position);
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
				GAME.POV.camera.lookAt(GAME.LANDSCAPE.earth.position);
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
				GAME.POV.camera.lookAt(new THREE.Vector3(0, 0.7, -2.5));
			}
		}
	],

	attachViewsToHTML: function()
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
	},
	loadCameras: function()
	{
		// The satellite's viewpoints.
		for(var viewNum = 0; viewNum < GAME.POV.views.length; viewNum++)
		{
			var view = GAME.POV.views[viewNum];
			GAME.POV.camera = new THREE.PerspectiveCamera( GAME.POV.views.fov, GAME.WIDTH / GAME.HEIGHT, 0.01, 1000 );
			GAME.POV.camera.position.x = view.eye[0];
			GAME.POV.camera.position.y = view.eye[1];
			GAME.POV.camera.position.z = view.eye[2];
			GAME.POV.camera.up.x = view.up[0];
			GAME.POV.camera.up.y = view.up[1];
			GAME.POV.camera.up.z = view.up[2];
			view.camera = GAME.POV.camera;
		}
		GAME.POV.camera = GAME.POV.views[GAME.POV.cameraCurView].camera;

		GAME.TIME.clockCamera =  new THREE.PerspectiveCamera( 45, GAME.TIME.clockWIDTH / GAME.TIME.clockHEIGHT, 0.01, 1000 );
		GAME.TIME.clockCamera.position.set(0, 0, 20);
		GAME.TIME.clockCamera.lookAt(GAME.scene2.position);
	},
	openCameras: function()
	{
		GAME.POV.cameraCurView++;
		if(GAME.POV.cameraCurView >= GAME.POV.views.length) GAME.POV.cameraCurView = 0;
	}
};