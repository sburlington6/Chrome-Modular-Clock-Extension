$( document ).ready(function() {

	//clearData();
	
	//getData('time');
	getData('ampm');
	getData('seconds');
	getData('date');
	getData('topSites');
	getData('apps');
	getData('buttons');
	
	//gets module background info
	getData('modback');
	
	
	
	
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
	
	$('#dispbuttons').click(function(){
		save('buttons','block');
	});
	
	getTheme();
	
	$('#themeSelector').change(function() {
		//console.log('theme changed');
		//console.log($("#themeSelector").val());
		saveTheme($("#themeSelector").val())
		refreshNewTabs();
	});
	
	$('#dispmodback').click(function(){
		save('modback','true');
	});
	
	
		//$( "#modules1, #modules2" ).sortable({
	$('.columns').sortable({
	  // $(ui.item) is the item that is being dragged
      
	  //the dashed line where it is dropped
	  placeholder: "ui-state-highlight",
	  //lists to drag between
	  connectWith: ".columns",
	  //save the changes
	  update: function(event, ui) {
            var newOrder = $(this).sortable('toArray').toString();
           console.log(newOrder);
		   //$.get('saveSortable.php', {order:newOrder});
        },
		//modify the placeholder
		start: function (e, ui) { 
      // modify ui.placeholder however you like
	  //console.log($(ui.item).css('height'));
      ui.placeholder.css({'height':$(ui.item).css('height')});
    }
    });
	
	//$( "#modules" ).sortable();
    //$( "#modules" ).disableSelection();
    $( "body" ).disableSelection();
	
	
	
	
});

function refreshNewTabs()
{
		//chrome.tabs.query( null ,parseTabs);
	chrome.tabs.query({'url':"chrome://newtab/"},function(data) {
		//console.log(data);
		for (var i=0;i<data.length;i++)
		{
			//console.log(data[i].id)
			
			
			chrome.tabs.reload(data[i].id,function() {
				//console.log('tabs refreshed');
			});
		}
	});
};

function saveTheme(theme)
{
	chrome.storage.sync.set({ 'theme' : theme}, function () {
        console.log('Saved Theme: ', theme);
		
		//chrome.storage.sync.get('theme',function(data) {
		//	console.log(data.theme);
		//});
    });
};

function getTheme()
{
	chrome.storage.sync.get('theme',function(data) {
			//console.log(data.theme);
			$("#themeSelector").val(data.theme);
		});
}

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
		refreshNewTabs();
		console.log('all chrome.storage.sync data cleared');
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
			console.log(data);
			if (tryParseJSON(data[key]))
			{
				//console.log(data);
				var display = JSON.parse(data[key])['display'];
				//console.log(JSON.parse(data[key])['display']);
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
			else if (key == 'modback')
			{
				$('#disp'+key).prop('checked', false);
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