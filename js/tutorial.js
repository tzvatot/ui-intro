var apps = [
    {
    	name: 'app1',
    	status: 'Running',
    	owner: 'Elad',
    	created: '1/1/2016'
    },
    {
    	name: 'app2',
    	status: 'Error',
    	owner: 'Noam',
    	created: '1/1/2011'
    },
    {
    	name: 'app3',
    	status: 'Stopped',
    	owner: 'Yaniv',
    	created: '1/1/2012'
    },
    {
    	name: 'app4',
    	status: 'Running',
    	owner: 'Ben',
    	created: '1/1/2013'
    }
];

$(document).ready(function() {
	drawApps();
	registerActions();
});

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