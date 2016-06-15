var apps = [];

function refreshApps() {
	var request = $.ajax({
		type : "GET",
		url : "/services/applications",
		dataType : 'json',
		async : false,
		username : 'ravello@ravello.com',
		password : 'ravello'
	});

	request.done(function(result) {
		apps = [];
		parseApps(result);
	});

	request.fail(function(jqXHR, textStatus) {
		alert("Request failed: " + textStatus);
	});
}

function getAppIdByName(name) {
	for (i = 0; i < apps.length; i++) {
		var app = apps[i];
		if (name === app.name) {
			return app.id;
		}
	}
	throw "failed to find application named " + name;
}

function asyncRenameApp(id, name) {
	var request = $.ajax({
		type : "GET",
		url : "/services/applications/" + id,
		dataType : 'json',
		username : 'ravello@ravello.com',
		password : 'ravello'
	});
	request.done(function(fullApp) {
		console.log('result:', fullApp);
		fullApp.name = name;
		updateApp(id, fullApp);
	});

	request.fail(function(jqXHR, textStatus) {
		alert("Request failed: " + textStatus);
	});
}

function updateApp(id, fullApp) {
	var request = $.ajax({
		type : "PUT",
		url : "/services/applications/" + id,
		data: JSON.stringify(fullApp),
		dataType : 'json',
		contentType: 'application/json',
		username : 'ravello@ravello.com',
		password : 'ravello'
	});
	request.done(function(result) {
		setTimeout(refreshAndDrawApps, 0);
	});

	request.fail(function(jqXHR, textStatus) {
		alert("Request failed: " + textStatus);
	});
}

$(document).ready(function() {
	refreshAndDrawApps();
	registerNoneAppActions();
});

function refreshAndDrawApps() {
	refreshApps();
	drawApps(apps);
	registerAppActions();
}

function parseApps(fullApps) {
	for (i = 0; i < fullApps.length; i++) {
		var fullApp = fullApps[i];
		var app = { 
				name: formatName(fullApp.name), 
				owner: fullApp.owner,
				created: formatDate(fullApp.creationTime),
				status: getStatusFromApp(fullApp),
				id: fullApp.id
		};
		apps.push(app);
	}
}

function formatName(name) {
	return name.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');
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

function drawApps(appsToDraw) {
	clearTableLines();
	var tableContent = $('.table-content');
	for (i = 0; i < appsToDraw.length; i++) {
		var app = appsToDraw[i];
		var action = getAction(app.status);
		var statusClass = getStatusClass(app.status);
		var appLine = $('<div class="table-line clearfix"></div>');
		appLine.append('<div class="column column-name">' + app.name + '</div>');
		appLine.append('<div class="column column-status ' + statusClass + '">' + app.status + '</div>');
		appLine.append('<div class="column">'+
							'<div class="btn rename-btn">Rename</div>' +
					   '</div>');
		appLine.append('<div class="column">' +
							'<div class="info">info</div>' +
					   '</div>' + 
				       '<div class="column column-control">' + 
				       		'<div class="btn control-btn">' + action + '</div>' +
				       '</div>');
		appLine.append('<div class="column column-owner">' + app.owner + '</div>');
		appLine.append('<div class="column column-created">' + app.created + '</div>');
		tableContent.append(appLine);
	}
}

function clearTableLines() {
	var tableLines = $('.table-content .table-line');
	tableLines.remove();
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

function registerAppActions() {
	var controlButtons = $('.control-btn');
	controlButtons.click(function() {
		appAction($(this));
	});
	$('.app-info-dialog').dialog({ autoOpen: false });
	$('.info').click(function() {
		appInfo($( this ));
	});
	$('.filter-apps input').keyup(function (e){
		 if (e.keyCode === 13) {
			 filterApps($(this));
		 }
	});
	$('.app-rename-dialog').dialog({ autoOpen: false });
	var renameBtn = $('.rename-btn');
	renameBtn.click(function() {
		showRenameDialog($(this));
	});
}

function registerNoneAppActions() {
	var refreshBtn = $('.refresh-apps-btn');
	refreshBtn.click(function() {
		refreshAndDrawApps();
	});
	var renameOkBtn = $('.rename-app-ok-btn');
	renameOkBtn.click(function() {
		console.log("onclick");
		renameApp($(this));
	});
}

function renameApp(element) {
	var dialogElem = $('.app-rename-dialog');
	var oldName = dialogElem.attr('data-old-name');
	console.log(oldName);
	var newName = $('.input.rename-app').val();
	var id = getAppIdByName(oldName);
	asyncRenameApp(id, newName);
	dialogElem.dialog("close");
}

function showRenameDialog(element) {
	var nameElement = element.parent().prev().prev();
	var appName = nameElement.text();
	for (i = 0; i < apps.length; i++) {
		var app = apps[i];
		if (app.name === appName) {
			var appRenameElem = $('.app-rename-dialog');
			appRenameElem.dialog("open");
			appRenameElem.attr('data-old-name', appName);
		}
	}
}

function filterApps(filterElem) {
	var filter = filterElem.val();
	if (!filter) {
		return;
	}
	var filteredApps = [];
	for (i = 0; i < apps.length; i++) {
		var app = apps[i];
		var appName = app.name;
		if (appName.indexOf(filter) != -1) {
			filteredApps.push(app);
		}
	}
	drawApps(filteredApps);
	registerAppActions();
}

function appAction(element) {
	var statusElement = element.parent().prev().prev().prev();
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
	var tableLine = element.parent().parent();
	var statusElement = $(tableLine).find('.column-status');
	var nameElement = $(tableLine).find('.column-name');
	var info = "Application " + nameElement.text() + " is " + statusElement.text();
	var appInfoElem = $('.app-info-dialog');
	appInfoElem.text(info);
	appInfoElem.dialog("open");
}