//get list of chrome topsites******************************************************
function buildPopupDom(mostVisitedURLs) {
	$('#topSites').append('<table id="topSitesTable"></table>');
	var row ='<tr><td>';
	for (var i = 1; i < mostVisitedURLs.length; i++) 
	{
		
		row += '<a href="'+mostVisitedURLs[i-1].url+'"><img width="25px" height="25px" src="chrome://favicon/' + mostVisitedURLs[i-1].url +'" alt="'+mostVisitedURLs[i-1].title+'" class="useTipsy" title="'+mostVisitedURLs[i-1].title.substring(0,20)+'..."></a>';
			
		if (i%9 == 0)
		{
			row += '</td></tr><tr><td>';
		}
		
		//$('#topSites').append('<a href="'+mostVisitedURLs[i].url+'"><img width="25px" height="25px" src="chrome://favicon/' + mostVisitedURLs[i].url +'" alt="'+mostVisitedURLs[i].title+'" class="useTipsy" title="'+mostVisitedURLs[i].title.substring(0,20)+'..."></a>');
	}
	row += '</td></tr>';
			//console.log(row);
		$('#topSitesTable').append(row);
			//console.log(row);
	$('.useTipsy').tipsy({fade: true,delayIn: 500, gravity: 's'});
}

//get list of chrome apps******************************************************
function getApps(apps) {
	$('#apps').append('<table id="appsTable"></table>');
	var row ='<tr>';
	var count = 1;
	for (var i = 0; i < apps.length; i++) 
	{
		if (apps[i].type == "hosted_app" || apps[i].type == "packaged_app" || apps[i].type == "legacy_packaged_app")
		{
			//row += '<td><a id="'+apps[i].id+'" class="app useTipsy" title="'+apps[i].description+'" href="#"><img width="100" height="100" src="'+apps[i].icons[apps[i].icons.length -1].url+'"><br/>'+apps[i].shortName+'</a></td>';
			row += '<td><a id="'+apps[i].id+'" class="app" href="#"><img class="useTipsy" title="'+apps[i].shortName+'" width="100" height="100" src="'+apps[i].icons[apps[i].icons.length -1].url+'"></a></td>';
			
			if (count %4 == 0)
			{
				row += '</tr><tr>';
			}
			count++;
		}
	}
		row += '</tr>';
		$('#appsTable').append(row);
	
	$('.useTipsy').tipsy({fade: true,delayIn: 500, gravity: 's'});
	
	$('.app').click(function(){
		//console.log(this.id);
		chrome.management.launchApp(this.id)
	});
}




$( document ).ready(function() {


$('#rss').rssfeed('http://feeds.reuters.com/reuters/oddlyEnoughNews', {
    limit: 5
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
      ui.placeholder.css({'height':$(ui.item).css('height'),'width':$(ui.item).css('width')});
    }
    });
	
	//$( "#modules" ).sortable();
    //$( "#modules" ).disableSelection();
    //$( "body" ).disableSelection();

	 $('.columns li').resizable({
      grid: 100,
	  //aspectRatio: true,
	 // maxHeight: 250,
      maxWidth: 1000,
     // minHeight: 150,
      minWidth: 100
    });

	chrome.topSites.get(buildPopupDom);
	chrome.management.getAll(getApps);

	//get saved chrome data for displaying the elements
	getData('time');
	getData('ampm');
	getData('seconds');
	getData('date');
	getData('topSites');
	getData('apps');
	getData('buttons');
	
	//start the clock
    startTime(0);
	
	//make time resize to fit the screen
	$("#time").fitText(10);
	
	
	$('#history').click(function(){
        chrome.tabs.update({
            url:'chrome://history/'
        });
        return false;
    });
	
	
	$('#defapps').click(function(){
        chrome.tabs.update({
            url:'chrome://apps/'
        });
        return false;
    });
	
	$('#i').click(function(){
		$('#dim').css({'display': 'table'});
		$('#info').css({
			'display': 'table-cell',
			'vertical-align': 'middle',
			'text-align': 'center'
		});
	});
	
	$('#gear').click(function(){
		$('#dim').css({'display': 'table'});
		$('#settings').css({
			'display': 'table-cell',
			'vertical-align': 'middle',
			'text-align': 'center'
		});
	});
	
	$('#infoClose').click(function(){
		$('#dim').hide();
		$('#info').hide();
	});
	
	$('#dim').click(function(e){
		if (e.target.id === "info" || e.target.id === "settings")
		{
			$('#dim').children().hide();
			$('#dim').hide();
		}
	});
		
	//log storage changes to console
	chrome.storage.onChanged.addListener(function(changes, namespace) 
	{
		for (key in changes) 
		{
			var storageChange = changes[key];
			console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
		}
	});
	
	
	
	
});


function getData(key)
{
	chrome.storage.sync.get(key,function(data) {
			
		if (tryParseJSON(data[key]))
		{
			//console.log(data);
			var display = JSON.parse(data[key])['display'];
			//console.log(JSON.parse(data[key])['display']);
			//console.log(value['display']);
			//$('#'+key).css('display',data[key])
			$('#'+key).css('display',display)
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

function startTime(zone)
{
	var dayname = new Array ("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	var monthname = new Array ("January","February","March","April","May","June","July","August","September","October","November","December" );
	var today=new Date();
	var hours=(today.getHours()+zone);
	var minutes=today.getMinutes();
	var seconds=today.getSeconds();
	
	// add a zero in front of numbers<10
	hours = ((hours > 12) ? hours - 12 : hours)
	hours = ((hours == 0) ? hours + 12 : hours)
	
	var timeValue  = ((hours < 10) ? "0" : "") + hours +((minutes < 10) ? ":0" : ":") + minutes;
	//timeValue  += ((minutes < 10) ? ":0" : ":") + minutes
	seconds  = ((seconds < 10) ? ":0" : ":") + seconds;
	var ampm = ((today.getHours()+zone) >= 12) ? " PM" : " AM";
	
	$('#clock').html(timeValue);
	$('#seconds').html(seconds);
	$('#ampm').html(ampm);
	$('#date').html(dayname[today.getDay()]+", "+monthname[today.getMonth()]+" "+today.getDate()+", "+today.getFullYear());
	
	setTimeout(function(){startTime(zone)},1000);
}

