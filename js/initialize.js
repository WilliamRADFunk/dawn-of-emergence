function init()
{
	WIDTH = window.innerWidth * 0.8;
	HEIGHT = window.innerHeight * 0.8;
	/*************************************************************************/
	loadWorkers();				// Creates webworkers for later use.
	/*************************************************************************/
	scene = new THREE.Scene();	// Three.js scene (contains universe).
	scene2 = new THREE.Scene();	// Three.js scene (contains space clock).
	/*************************************************************************/
	loadSounds();				// Loads all sounds, and activates music.
	/*************************************************************************/
	createStars();				// Creates a backdrop filled with stars.
	/*************************************************************************/
	createEarth();				// Creates and places the Earth + cloudcover.
	/*************************************************************************/
	createMoon();				// Creates and places the moon.
	/*************************************************************************/
	//createAxes();				// Helper axis for later raycast tests.
	/*************************************************************************/
	createClock();				// creates the graphical spheres of the clock.
	/*************************************************************************/
	createRenderers();			// Creates all renderers for the scene.
	/*************************************************************************/
	createMainLighting();		// General ambient and main directional light.
	/*************************************************************************/
	createSatellites(5);		// Builds and places all satellites.
	/*************************************************************************/
	registerListeners();		// Registers all Event Listeners.
	/*************************************************************************/
	attachViewsToHTML();		// Attaches renderers to HTML.
	/*************************************************************************/
	loadCameras();				// Establishes all of the viewpoints.
	/*************************************************************************/
	updateEventScreen();		// Starting message
	/*************************************************************************/
	render();					// Activates the update loop.
}
function loadWorkers()
{
	var blob = new Blob([document.getElementById('worker').textContent]); 
	var worker = new Worker( window.URL.createObjectURL( blob ) );
}
function loadSounds()
{
	backgroundMusic01 = new Audio("assets/audio/The_Blue_Danube_StraussII.mp3");
	backgroundMusic01.autoplay = true;
	backgroundMusic02 = new Audio("assets/audio/mahler_05.mp3");
}
// The Universe in all its stary awesomeness.
function createStars()
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
	scene.add(stars);
}
function createEarth()
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
	earth = new THREE.Mesh(earthGeometry, earthMaterial);
	scene.add(earth);
	// Rotating cloudcover.
	var cloudsGeometry = new THREE.SphereGeometry(0.503, 32, 32);
	var cloudsMaterial = new THREE.MeshPhongMaterial();
	cloudsMaterial.map = THREE.ImageUtils.loadTexture('assets/images/earthcloudmap_modified.png');
	cloudsMaterial.map.minFilter = THREE.LinearFilter;
	cloudsMaterial.side = THREE.FrontSide;
	cloudsMaterial.opacity = 0.9;
	cloudsMaterial.transparent = true;
	cloudsMaterial.depthWrite = false;
	clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
	earth.add(clouds);
}
function createMoon()
{
	// Moon's orbital mechanics
	moonOrbit = new THREE.Object3D();
	scene.add( moonOrbit );
	var moonOrbitalPivot = new THREE.Object3D();
	moonOrbitalPivot.rotation.y = 0;
	moonOrbit.add( moonOrbitalPivot );
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
// Two lightsources: one as an every glow, and the other simulating the sun's brightness.
function createMainLighting()
{
	scene.add(new THREE.AmbientLight(0x333333));
	var Sun = new THREE.DirectionalLight( 0x999999, 1 );
	Sun.position.x = earth.position.x - 80;
	Sun.position.y = earth.position.y + 70;
	Sun.position.z = earth.position.z - 100;
	scene.add(Sun);

	scene2.add(new THREE.AmbientLight(0xFFFFFF));
}
function createSatellites(numSats)
{
	//Satellite groups		
	satelliteGroupAlpha = new THREE.Object3D();
	satelliteGroupBeta = new THREE.Object3D();
	satelliteGroupCharlie = new THREE.Object3D();
	satelliteGroupDelta = new THREE.Object3D();
	//Create and add satellite to group.
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Math.random() + Math.random();
		var y_delta = Number(1.0/(i+1.0));
		var z_delta = Math.random() + Math.random();
		satelliteGroupAlpha.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupAlpha.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupAlpha.add(createSatellite(-x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupAlpha.add(createSatellite(x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
	}
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Math.random() + Math.random();
		var y_delta = Math.random() + Math.random();
		var z_delta = Number(1.0/(i+1.0));
		satelliteGroupBeta.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupBeta.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupBeta.add(createSatellite(x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupBeta.add(createSatellite(-x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
	}
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Number(1.0/(i+1.0));
		var y_delta = Math.random() + Math.random();
		var z_delta = Math.random() + Math.random();
		satelliteGroupCharlie.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupCharlie.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupCharlie.add(createSatellite(x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupCharlie.add(createSatellite(-x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
	}
	for(var i = 0; i < numSats; i++)
	{
		var x_delta = Number(1.0/(i+1.0));
		var y_delta = Math.random() + Math.random();
		var z_delta = Number(1.0/(i+1.0));
		satelliteGroupDelta.add(createSatellite(x_delta, y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupDelta.add(createSatellite(-x_delta, -y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupDelta.add(createSatellite(-x_delta, y_delta, -z_delta, Math.floor(3 * Math.random()), i%2));
		satelliteGroupDelta.add(createSatellite(x_delta, -y_delta, z_delta, Math.floor(3 * Math.random()), i%2));
	}
	scene.add(satelliteGroupAlpha);
	scene.add(satelliteGroupBeta);
	scene.add(satelliteGroupCharlie);
	scene.add(satelliteGroupDelta);
	/**********************************************************************************************/
	//Player's satellite
	satellitePlayer = new THREE.Object3D();
	//Main body of the satellite
	var satelliteBodyPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshPhongMaterial() );
	satelliteBodyPlayer.position.set(earth.position.x, earth.position.y + 0.7, earth.position.z - 2.5);
	satelliteBodyPlayer.material.map = THREE.ImageUtils.loadTexture('assets/images/satellite_3.png');
	satellitePlayer.add(satelliteBodyPlayer);
	//Satellite panels
	var satellitePanelPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.005, 0.025, 0.25), new THREE.MeshPhongMaterial({color: 0x2A3B66}) );
	satellitePanelPlayer.position.set(earth.position.x, earth.position.y + 0.7, earth.position.z - 2.5);
	satellitePanelPlayer.rotation.y = Math.PI / 2;
	satellitePlayer.add(satellitePanelPlayer);
	//Satellite front
	var satelliteFrontPlayer = new THREE.Mesh( new THREE.BoxGeometry(0.02, 0.02, 0.02), new THREE.MeshPhongMaterial() );
	satelliteFrontPlayer.position.set(earth.position.x, earth.position.y + 0.7, earth.position.z - 2.4);
	satellitePlayer.add(satelliteFrontPlayer);
	//Satellite lens
	var satelliteLensPlayer = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.025), new THREE.MeshPhongMaterial());
	satelliteLensPlayer.material.color.setHex(0x000000);
	satelliteLensPlayer.position.set(earth.position.x, earth.position.y + 0.7, earth.position.z - 2.4);
	satelliteLensPlayer.rotation.x = Math.PI / 2;
	satellitePlayer.add(satelliteLensPlayer);
	//Satellite red lights
	var lightSphereRed = new THREE.Mesh(new THREE.SphereGeometry(0.002, 32, 32), new THREE.MeshBasicMaterial());
	lightSphereRed.material.color.setHex(0xFF0000);
	lightSphereRed.position.set(earth.position.x - 0.02, earth.position.y + 0.72, earth.position.z - 2.375);
	beaconPlayer01 = new THREE.SpotLight( 0xFF0000 );
	beaconPlayer01.position.set(earth.position.x - 0.019, earth.position.y + 0.719, earth.position.z - 2.376);
	beaconPlayer01.target = satelliteBodyPlayer;
	satellitePlayer.add(beaconPlayer01);
	satellitePlayer.add(lightSphereRed);
	//Satellite green lights
	var lightSphereGreen = new THREE.Mesh(new THREE.SphereGeometry(0.002, 32, 32), new THREE.MeshBasicMaterial());
	lightSphereGreen.material.color.setHex(0x00FF00);
	lightSphereGreen.position.set(earth.position.x + 0.02, earth.position.y + 0.68, earth.position.z - 2.375);
	beaconPlayer02 = new THREE.SpotLight( 0x00FF00 );
	beaconPlayer02.position.set(earth.position.x + 0.019, earth.position.y + 0.681, earth.position.z - 2.376);
	beaconPlayer02.target = satelliteBodyPlayer;
	satellitePlayer.add(beaconPlayer02);
	satellitePlayer.add(lightSphereGreen);
	//Add player satellite to scene.
	scene.add(satellitePlayer);
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
	satelliteBody.position.set(earth.position.x - 1.3, earth.position.y, earth.position.z);
	satellitePanel.position.set(earth.position.x - 1.3, earth.position.y, earth.position.z);
	satelliteFront.position.set(earth.position.x - 1.27, earth.position.y, earth.position.z);
	//Create flashing light.
	var lightSphere = new THREE.Mesh(new THREE.SphereGeometry(0.008, 32, 32), new THREE.MeshBasicMaterial({color: ((liteColor == 0) ? 0xFF0000 : 0x00FF00)}));
	lightSphere.position.set(earth.position.x - 1.258, earth.position.y, earth.position.z);
	beacons.push(lightSphere);
	//Add components to satellite.
	satellite.add(satelliteBody);
	satellite.add(satellitePanel);
	satellite.add(satelliteFront);
	satellite.add(lightSphere);
	//distance satellite from Earth.
	satellite.position.set(x * Math.random(), y * Math.random(), z * Math.random());
	//Aim satellite at Earth.
	satellite.up = earth.up;
	satellite.lookAt(earth.position);
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
	for(var viewNum = 0; viewNum < views.length; viewNum++)
	{
		var view = views[viewNum];
		camera = new THREE.PerspectiveCamera( views.fov, WIDTH / HEIGHT, 0.01, 1000 );
		camera.position.x = view.eye[0];
		camera.position.y = view.eye[1];
		camera.position.z = view.eye[2];
		camera.up.x = view.up[0];
		camera.up.y = view.up[1];
		camera.up.z = view.up[2];
		view.camera = camera;
	}
	camera = views[cameraCurView].camera;

	clockCamera =  new THREE.PerspectiveCamera( 45, clockWIDTH / clockHEIGHT, 0.01, 1000 );
	clockCamera.position.set(0, 0, 20);
	clockCamera.lookAt(scene2.position);
}
function attachViewsToHTML()
{
	// Contains the 1st POV, and all HUD elements.
	var container = document.getElementById("mainview");
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );
	// Contains the space clock to upper right corner.
	var pinPoint = document.getElementById("top-right");
	var container2 = document.getElementById("space-clock");
	pinPoint.appendChild( container2 );
	container2.appendChild( renderer2.domElement );
}
function createRenderers()
{
	clockWIDTH = document.getElementById("space-clock").offsetWidth - 3;
	clockHEIGHT = document.getElementById("space-clock").offsetHeight - 2;

	if(window.WebGLRenderingContext)
	{
		renderer = new THREE.WebGLRenderer();
		renderer2 = new THREE.WebGLRenderer();
	    console.log("This browser supports WebGL");
	}
	else
	{
	    renderer = new THREE.CanvasRenderer();
	    renderer2 = new THREE.CanvasRenderer();
	    console.log("This browser doesn't support WebGL");
	}
	renderer.setClearColor( 0x000000, 0 );
	renderer2.setClearColor( 0x000000, 0 );
	renderer.setSize( WIDTH, HEIGHT );
	renderer2.setSize( clockWIDTH, clockHEIGHT );
	renderer.autoClear = false;
	renderer2.autoClear = false;
}
function createClock()
{
	secondBars = new THREE.Object3D();
	minuteBars = new THREE.Object3D();
	hourBars = new THREE.Object3D();
	var timeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 10, 10, false);
	var timeMaterial = new THREE.MeshBasicMaterial({color: 'white'});
	for(var i = 0; i < 60; i++)
	{
		var secondTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
		var x_coord = 5 * Math.cos((i * 2)*(2 * Math.PI/120));
		var y_coord = 5 * Math.sin((i * 2)*(2 * Math.PI/120));
		secondTick.position.set(x_coord, y_coord, 0);
		secondTick.rotation.x += Math.PI / 2;
		secondBars.add(secondTick);

		var minuteTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
		x_coord = 6 * Math.cos((i * 2)*(2 * Math.PI/120));
		y_coord = 6 * Math.sin((i * 2)*(2 * Math.PI/120));
		minuteTick.material.color.setHex(0xFF00FF);
		minuteTick.position.set(x_coord, y_coord, 0);
		minuteTick.rotation.x += Math.PI / 2;
		minuteBars.add(minuteTick);
	}
	for(var j = 0; j < 24; j++)
	{
		var hourTick = new THREE.Mesh(timeGeometry, timeMaterial.clone());
		x_coord = 7 * Math.cos((j)*(2 * Math.PI/24));
		y_coord = 7 * Math.sin((j)*(2 * Math.PI/24));
		hourTick.material.color.setHex(0xFFFF00);
		hourTick.position.set(x_coord, y_coord, 0);
		hourTick.rotation.x += Math.PI / 2;
		hourBars.add(hourTick);
	}
	scene2.add(secondBars);
	scene2.add(minuteBars);
	scene2.add(hourBars);
}
function createAxes()
{
	axisOrbit = new THREE.Object3D();
	scene.add( axisOrbit );
	var axisPivot = new THREE.Object3D();
	axisOrbit.add( axisPivot );
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