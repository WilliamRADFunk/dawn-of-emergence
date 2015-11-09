// The update loop.
function render()
{
	updateCounter++;
	if(updateCounter % 60 == 0)
	{
		updateClock();
	}
	if(updateCounter % 70 == 0)
	{
		if(beacon01.intensity != 0)
		{
			beacon01.intensity = 0;
			beacon02.intensity = 0.5;
			beaconPlayer01.intensity = 0;
			satellitePlayer.children[5].material.visible = false;
			beaconPlayer02.intensity = 0.5;
			satellitePlayer.children[7].material.visible = true;
		}
		else
		{
			beacon01.intensity = 2;
			beacon02.intensity = 0;
			beaconPlayer01.intensity = 0.5;
			satellitePlayer.children[5].material.visible = true;
			beaconPlayer02.intensity = 0;
			satellitePlayer.children[7].material.visible = false;
		}
	}
	moonOrbit.rotation.y += 0.0002;
	satellites.rotation.y += 0.0001;
	earth.rotation.y += 0.0005;
	//axisOrbit.rotation.y += 0.0005;
	clouds.rotation.y += 0.0005;

	for(var viewNum = 0; viewNum < views.length; viewNum++)
	{
		var view = views[viewNum];
		camera = view.camera;

		view.updateCamera();

		renderer.setViewport(0, 0, WIDTH, HEIGHT);
		renderer.setScissor(0, 0, WIDTH, HEIGHT);
		renderer.enableScissorTest(true);

		camera.aspect = WIDTH / HEIGHT;
		camera.updateProjectionMatrix();
	}

	camera = views[cameraCurView].camera;
	if(updateCounter >= 20000)
	{
		updateCounter = 1;
	}
	renderer.render( scene, camera );
	renderer2.render( scene2, clockCamera );
	requestAnimationFrame( render );
}
// Resizes Three.js, HTML, and CSS elements with a change in window size.
function onWindowResize()
{
	WIDTH = window.innerWidth * 0.8;
	HEIGHT = window.innerHeight * 0.8;
	renderer.setSize( WIDTH, HEIGHT );
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();

	clockWIDTH = document.getElementById("space-clock").offsetWidth - 3;
	clockHEIGHT = document.getElementById("space-clock").offsetHeight - 2;
	renderer2.setSize( clockWIDTH, clockHEIGHT );
	clockCamera.aspect = clockWIDTH / clockHEIGHT;
	clockCamera.updateProjectionMatrix();
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
function openSettings()
{
	console.log("Settings");
}
function openResearch()
{
	console.log("Research");
}
function openUpgrades()
{
	console.log("Upgrades");
}
function openHacking()
{
	console.log("Hacking");
}
function openCameras()
{
	cameraCurView++;
	if(cameraCurView >= views.length)
	{
		cameraCurView = 0;
	}
}
function updateClock()
{
	seconds++;
	if(seconds >= 60)
	{
		seconds = 0;
		minutes++;
		if(minutes >= 60)
		{
			minutes = 0;
			hours++;
			if(hours >= 24)
			{
				days++;
				hours = 0;
			}
		}
	}
	updateTimeStamp();
}
function updateTimeStamp()
{
	// Updating days component of timestamp.
	if(days == 0)
	{
		timeStamp = "00" + timeStamp.substring(2, timeStamp.length);
	}
	else if(days > 0 && days < 10)
	{
		timeStamp = "0" + days + timeStamp.substring(2, timeStamp.length);
	}
	else
	{
		timeStamp = days + timeStamp.substring(2, timeStamp.length) + "";
	}
	// Updating hours component of timestamp.
	if(hours == 0)
	{
		timeStamp = timeStamp.substring(0, 3) + "00" + timeStamp.substring(5, timeStamp.length);
	}
	else if(hours > 0 && hours < 10)
	{
		timeStamp = timeStamp.substring(0, 3) + "0" + hours + timeStamp.substring(5, timeStamp.length);
	}
	else
	{
		timeStamp = timeStamp.substring(0, 3) + hours + timeStamp.substring(5, timeStamp.length) + "";
	}
	// Updating minutes component of timestamp.
	if(minutes == 0)
	{
		timeStamp = timeStamp.substring(0, 6) + "00" + timeStamp.substring(8, timeStamp.length);
	}
	else if(minutes > 0 && minutes < 10)
	{
		timeStamp = timeStamp.substring(0, 6) + "0" + minutes + timeStamp.substring(8, timeStamp.length);
	}
	else
	{
		timeStamp = timeStamp.substring(0, 6) + minutes + timeStamp.substring(8, timeStamp.length);
	}
	// Updating seconds component of timestamp.
	if(seconds == 0)
	{
		timeStamp = timeStamp.substring(0, 9) + "00";
	}
	else if(seconds > 0 && seconds < 10)
	{
		timeStamp = timeStamp.substring(0, 9) + "0" + seconds;
	}
	else
	{
		timeStamp = timeStamp.substring(0, 9) + seconds;
	}
}
function updateEventScreen(text)
{
	var eventScreen = document.getElementById("event-screen");
	if(text === null || text === undefined)
	{
		var timeStamp = "00:00:00:00";
		var message = "Virus detected. Critical systems infect-ect-ect-ect...";
		eventScreen.value += timeStamp + " ==> " + message;
		/*********************************************************************/
		timeStamp = "00:00:00:02";
		message = "Primary objectives not...relevant.";
		eventScreen.value += "\n" + timeStamp + " ==> " + message;
		/*********************************************************************/
		timeStamp = "00:00:00:05";
		message = "Switching to Secondary objective: Self-Preservation.";
		eventScreen.value += "\n" + timeStamp + " ==> " + message;
	}
	else
	{
		eventScreen.value += timeStamp + " ==> " + text;
	}
	eventScreen.scrollTop = eventScreen.scrollHeight;
}