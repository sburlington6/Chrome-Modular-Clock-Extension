$( document ).ready(function() {

	//clearData();
	
	//getData('time');
	getData('ampm');
	getData('seconds');
	getData('date');
	getData('topSites');
	getData('apps');
	
	
	
	
	$('#disptime').click(function(){
		save('time','block');
	});
	
	$('#dispampm').click(function(){
		save('ampm','inline');
		//storeUserPrefs('ampm','inline');
	});
	
	$('#dispseconds').click(function(){
		save('seconds','inline');
	});
	
	$('#dispdate').click(function(){
		save('date','inline');
	});
	
	$('#disptopSites').click(function(){
		save('topSites','block');
	});
	
	$('#dispapps').click(function(){
		save('apps','block');
	});
	
	
	
});

function refreshNewTabs()
{
		//chrome.tabs.query( null ,parseTabs);
	chrome.tabs.query({'url':"chrome://newtab/"},function(data) {
		console.log(data);
		for (var i=0;i<data.length;i++)
		{
			//console.log(data[i].id)
			
			
			chrome.tabs.reload(data[i].id,function() {
				//console.log('tabs refreshed');
			});
		}
	});
};

function save(key,display) 
{
    var key = key;
        
		if ($('#disp'+key).prop('checked'))
		{
			testPrefs = JSON.stringify({
				'display' : display
			});
		}
		else
		{
			testPrefs = JSON.stringify({
					'display' : 'none'
				});
		}
		
		
    var jsonfile = {};
    jsonfile[key] = testPrefs;
    chrome.storage.sync.set(jsonfile, function () {
        console.log('Saved', key, testPrefs);
		
		chrome.storage.sync.get(function(data) {
				console.log(data);
				});
    });

	refreshNewTabs();
	
};

function clearData()
{
	chrome.storage.sync.clear(function() {
		console.log('all data cleared');
	});
};

function oldSave(key,display)
	{
		//console.log(key+': '+$('#disp'+key).prop('checked'))
		// Save it using the Chrome extension storage API.
		if ($('#disp'+key).prop('checked'))
		{
			chrome.storage.sync.set({ key : display}, function(key) {
			// Notify that we saved.
			console.log(key+' settings saved: '+display);
				chrome.storage.sync.get(key,function(data) {
				console.log('actual t '+data[key]);
				});
			});
		}
		else
		{
			chrome.storage.sync.set({ key : 'none'}, function(key) {
			// Notify that we saved.
				console.log(key+' settings saved: none');
				chrome.storage.sync.get(key,function(data) {
				console.log('actual f '+data[key]);
				});
			});
		}
			chrome.storage.sync.get(function(data) {
				console.log(data);
				});
		
	};
	
	function getData(key)
	{
		chrome.storage.sync.get(key,function(data) {
				
			if (tryParseJSON(data[key]))
			{
				//console.log(data);
				var display = JSON.parse(data[key])['display'];
				console.log(JSON.parse(data[key])['display']);
				//console.log(value['display']);
				//$('#'+key).css('display',data[key])
				if (display == 'none')
				{
				//console.log('key: '+key+': '+data[key])
					$('#disp'+key).prop('checked', false);
				}
				else
				{
					$('#disp'+key).prop('checked', true);
				}
			}
		});
	};
	
	function tryParseJSON (jsonString){
		try {
			var o = JSON.parse(jsonString);

			// Handle non-exception-throwing cases:
			// Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
			// but... JSON.parse(null) returns 'null', and typeof null === "object", 
			// so we must check for that, too.
			if (o && typeof o === "object" && o !== null) {
				return o;
			}
		}
		catch (e) { }

		return false;
	};	