var controlButtons = $('.control-btn');
controlButtons.click(function() {
	appAction($( this ));
});

var infoLinks = $('.info');
infoLinks.click(function() {
	appInfo($( this ));
});

function appAction(element) {
	var statusElement = element.parent().prev().prev().prev()
	var currentStatus = statusElement.text();
	if (currentStatus === 'Stopped') {
		statusElement.text('Running');
		statusElement.removeClass('status-stopped').addClass('status-running');
		element.text('Stop');
	} else if (currentStatus === 'Running') {
		statusElement.text('Stopped');
		statusElement.removeClass('status-running').addClass('status-stopped');
		element.text('Start');
	} else if (currentStatus === 'Error') {
		statusElement.text('Error');
		element.css('color', 'gray');
	}
}

function appInfo(element) {
	var nameElement = element.parent().prev().prev().prev();
	var statusElement = element.parent().prev().prev();
	alert("Application " + nameElement.text() + " is " + statusElement.text());
}

