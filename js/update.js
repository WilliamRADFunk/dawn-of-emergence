// The update loop.
function render()
{
	updateCounter++;
	if(updateCounter % 30 == 0)
	{
		updateClock();
	}
	if(updateCounter % 60 == 0 && playList[currentSong].ended)
	{
		currentSong++;
		currentSong = (currentSong >= playList.length) ? 0 : currentSong;
		playList[currentSong].play();
	}
	if(updateCounter % 60 == 0)
	{
		if(beaconPlayer02.intensity == 0)
		{
			beaconPlayer01.intensity = 0;
			beaconPlayer02.intensity = 1;
			satellitePlayer.children[5].material.visible = false;
			satellitePlayer.children[7].material.visible = true;
		}
		else
		{
			beaconPlayer01.intensity = 1;
			beaconPlayer02.intensity = 0;
			satellitePlayer.children[5].material.visible = true;
			satellitePlayer.children[7].material.visible = false;
		}
	}
	if(updateCounter % 70 == 0)
	{
		for(var i = 0; i < beacons.length; i++)
		{
			if(i % 2 == 0)
			{
				beacons[i].material.visible = (beacons[i].material.visible == true) ? false : true;
			}
			else
			{
				beacons[i].material.visible = (beacons[i].material.visible == true) ? false : true;
			}
		}
	}
	if(updateCounter % 95 == 0)
	{
		for(var i = 0; i < beacons.length; i++)
		{
			if(i % 3 == 0)
			{
				beacons[i].material.visible = (beacons[i].material.visible == true) ? false : true;
			}
		}
	}
	if(updateCounter % 120 == 0)
	{
		for(var i = 0; i < beacons.length; i++)
		{
			if( (i % 2 != 0) && (i % 3 != 0) )
			{
				beacons[i].material.visible = (beacons[i].material.visible == true) ? false : true;
			}
		}
	}
	moonOrbit.rotation.y += 0.0001;
	satelliteGroupAlpha.rotation.y += 0.00022;
	satelliteGroupBeta.rotation.y -= 0.0002;
	satelliteGroupCharlie.rotation.y += 0.00018;
	satelliteGroupDelta.rotation.y -= 0.0002;
	earth.rotation.y += 0.0002;
	//axisOrbit.rotation.y += 0.0002;
	clouds.rotation.y += 0.0002;

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
	if(updateCounter >= 40000)
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
	// Tells visual portion of clock whether to refresh the full circle.
	var secs = false;
	var mins = false;
	var hrs = false;
	// Increases time by one in-game second.
	seconds++;
	if(seconds >= 30)
	{
		seconds = 0;
		secs = true;
		minutes++;
		if(minutes >= 60)
		{
			minutes = 0;
			mins = true;
			hours++;
			if(hours >= 24)
			{
				days++;
				hours = 0;
				hrs = true;
			}
		}
	}
	// Updates visual portion of space clock.
	updateClockVisual(secs, mins, hrs);
	// Updates time stamp, used in event declarations that are posted to top-center panel.
	updateTimeStamp();
}
function updateClockVisual(secs, mins, hrs)
{
	// Must destroy old day, before entering a new one.
	if(oldDays != days || days == 0)
	{
		scene2.remove(numDays);
		var textGeometry = new THREE.TextGeometry(days,
			{
				size: 3,
				height: 0.2,
				curveSegments: 20,
				bevelEnabled: false
			});
		var textMaterial = new THREE.MeshLambertMaterial( {color: 0x49E20E} );
		numDays = new THREE.Mesh( textGeometry, textMaterial );
		numDays.position.set(-1.5, -1.5, 0);
		scene2.add( numDays );
		oldDays = days;
	}
	// Refreshes seconds, minutes, and hours when they hit zero.
	if(secs)
	{
		for(var i = 0; i < 30; i++)
		{
			secondBars.children[i].material.visible = true;
		}
	}
	if(mins)
	{
		for(var j = 0; j < 60; j++)
		{
			minuteBars.children[j].material.visible = true;
		}
	}
	if(hrs)
	{
		for(var k = 0; k < 24; k++)
		{
			hourBars.children[k].material.visible = true;
		}
	}
	// Hides one tick mark for each increment in time.
	secondBars.children[seconds].material.visible = false;
	minuteBars.children[minutes].material.visible = false;
	hourBars.children[hours].material.visible = false;
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
function toggleMusic()
{
	if(muteMusic)
	{
		muteMusic = false;
		playList[currentSong].pause();
	}
	else
	{
		muteMusic = true;
		playList[currentSong].play();
	}
}
function toggleSoundFX()
{
	alert("Functionality for changing sound FX volume is not yet installed.");
}
function skipSong()
{
	playList[currentSong].pause();
	playList[currentSong].currentTime = 0;
	currentSong++;
	currentSong = (currentSong >= playList.length) ? 0 : currentSong;
	playList[currentSong].play();
}
function musicVolumeChange(volume)
{
	var vol = Number(volume / 100);
	for(var i = 0; i < playList.length; i++)
	{
		playList[i].volume = vol;
	}
}
function soundFxVolumeChange(value)
{
	var vol = Number(volume / 100);
	for(var i = 0; i < soundsList.length; i++)
	{
		soundsList[i].volume = vol;
	}
}
function saveGame()
{
	alert("Functionality for saving the game is not yet installed.");
}
function loadGame()
{
	alert("Functionality for loading the game is not yet installed.");
}