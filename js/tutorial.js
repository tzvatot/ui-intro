var controlButtons = document.getElementsByClassName('control-btn');
for (var i = 0; i < controlButtons.length; i++) {
	var btn = controlButtons[i];
	btn.addEventListener("click", function() {
		appAction(this);
	});
}

function appAction(element) {
	var statusElement = element.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
	var currentStatus = statusElement.textContent;
	if (currentStatus === 'Stopped') {
		statusElement.innerHTML = 'Running';
		statusElement.style.color = 'green';
		element.innerHTML = 'Stop';
	} else if (currentStatus === 'Running') {
		statusElement.innerHTML = 'Stopped';
		statusElement.style.color = 'orange';
		element.innerHTML = 'Start';
	} else if (currentStatus === 'Error') {
		statusElement.innerHTML = 'Error';
		element.style.color = 'gray';
	}
}

