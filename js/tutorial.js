var apps = [];

var request = $.ajax({
    type: "GET",
    url: "/services/applications",
    dataType: 'json',
    async: false,
    username: 'ravello@ravello.com',
  	password: 'ravello'
});

request.done(function (result){
	parseApps(result); 
});

request.fail(function( jqXHR, textStatus ) {
	alert( "Request failed: " + textStatus );
});


$(document).ready(function() {
	drawApps();
	registerActions();
});

function parseApps(fullApps) {
	for (i = 0; i < fullApps.length; i++) {
		var fullApp = fullApps[i];
		var app = { 
				name: fullApp.name, 
				owner: fullApp.owner,
				created: formatDate(fullApp.creationTime),
				status: getStatusFromApp(fullApp)
		};
		apps.push(app);
	}
}

function formatDate(epoch) {
	return new Date(epoch).toLocaleDateString('en-GB', {  
	    day : 'numeric',
	    month : 'short',
	    year : 'numeric'
	}).split(' ').join('-');
}

function getStatusFromApp(fullApp) {
	var deployment = fullApp.deployment;
	if (typeof deployment != 'undefined') {
		var totalErrorVms = deployment.totalErrorVms;
		if (totalErrorVms > 0) {
			return 'Error';
		} else {
			var totalActiveVms = deployment.totalActiveVms;
			if (totalActiveVms > 0) {
				return 'Running';
			} else {
				return 'Stopped';
			}
		}
	} else {
		return 'Stopped';
	}
}

function drawApps() {
	var tableContent = $('.table-content');
	for (i = 0; i < apps.length; i++) {
		var app = apps[i];
		var action = getAction(app.status);
		var statusClass = getStatusClass(app.status);
		var appLine = $('<div class="table-line clearfix"></div>');
		appLine.append('<div class="column column-name">' + app.name + '</div>');
		appLine.append('<div class="column column-status ' + statusClass + '">' + app.status + '</div>');
		appLine.append('<div class="column"></div>');
		appLine.append('<div class="column">' +
							'<div class="info">info</div>' +
					   '</div>' + 
				       '<div class="column column-control">' + 
				       		'<div class="control-btn">' + action + '</div>' +
				       '</div>');
		appLine.append('<div class="column column-owner">' + app.owner + '</div>');
		appLine.append('<div class="column column-created">' + app.created + '</div>');
		tableContent.append(appLine);
	}
}

function getAction(status) {
	if (status === 'Running') {
		return 'Stop';
	} else if (status === 'Stopped') {
		return 'Start';
	} else {
		return 'Start';
	}
}

function getStatusClass(status) {
	return 'status-' + status.toLowerCase();;
}

function registerActions() {
	var controlButtons = $('.control-btn');
	controlButtons.click(function() {
		appAction($( this ));
	});
	
	$('.app-info-dialog').dialog({ autoOpen: false });
	$('.info').click(function() {
		appInfo($( this ));
	});
}


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
	var tableLine = element.parents().find('.table-line');
	var statusElement = $(tableLine).find('.column-status');
	var nameElement = $(tableLine).find('.column-name');
	var info = "Application " + nameElement.text() + " is " + statusElement.text();
	var appInfoElem = $('.app-info-dialog');
	appInfoElem.text(info);
	appInfoElem.dialog("open");
}