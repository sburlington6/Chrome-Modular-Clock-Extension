chrome.storage.sync.get(function(data) {
	//console.log(data.modback);
	var theme = data.theme;	
	
	
	
	
	if (tryParseJSON(data.modback))
	{
		var display = JSON.parse(data.modback)['display'];
		if (display == 'true')
		{
			var background=true;
		}
		else
		{
			var background=false;
		}
	}
	
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
	
	function setTheme(theme)
	{
		console.log(theme);
		if (theme == 'blue')
		{
			var bodyBackground = '#008FB2';
			var linkColor = '#99EBFF';
			if (background == true)
			{
				var moduleBackground = '#003D4C';
			}
			var moduleText = '#19D1FF';
			
			var imgColor = moduleBackground;
		}
		else if (theme == 'gray')
		{
			var bodyBackground = '#555555';
			var linkColor = '#ffffff';
			if (background == true)
			{
				var moduleBackground = '#222222';
			}
			var moduleText = '#cccccc';
			
			var imgColor = moduleBackground;
		}
		else if (theme == 'blueWhite')
		{
			var bodyBackground = '#008FB2';
			var linkColor = '#99EBFF';
			if (background == true)
			{
				var moduleBackground = '#003D4C';
			}
			var moduleText = '#ffffff';
			
			var imgColor = moduleText;
		}
		else if (theme == 'custom')
		{
		console.log($('#moduleBackground').val());
			var bodyBackground = $('#bodyBackground').val();
			var linkColor = $('#linkColor').val();
			if (background == true)
			{
				var moduleBackground = $('#moduleBackground').val();
			}
			var moduleText = $('#moduleText').val();
			
			var imgColor = moduleText;
		}
		
		
		if (background == true)
		{
			var borderSize='3px';
			var borderTpye='dashed';
			var borderColor=moduleText;
			
			var boxShadowSize='0px 0px 0px 5px ';
			var boxShadowColor=moduleBackground;
		}
		else
		{
			var borderSize='none';
			var borderTpye='';
			var borderColor='';
			
			var boxShadowSize='none';
			var boxShadowColor='';
		}
		
		$('body').css({
			'background': bodyBackground
		});
		$('a:link').css({
			'color': linkColor
		});
		$('#time, #topSites,#apps,#rss').css({
			'background': moduleBackground,
			'color': moduleText,
			'border': borderSize+' '+borderTpye+' '+borderColor,
			'box-shadow': boxShadowSize+' '+boxShadowColor,
			'-webkit-box-shadow': boxShadowSize+' '+boxShadowColor,
			'-moz-box-shadow': boxShadowSize+' '+boxShadowColor,
		});
	};
	
			
$( document ).ready(function() {
	
//var theme = 'gray';
	setTheme(theme);
	
	$('#colorSubmit').click(function(){
		setTheme(theme);
	});
	
	
//**********************************************************************
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		
		var currentPixelsI = null;
		var currentPixelsGear = null;
		var currentPixelsOnt = null;
		
		var originalPixelsI = null;
		var originalPixelsGear = null;
		var originalPixelsOnt = null;
		
		
		function HexToRGB(Hex)
		{
			var Long = parseInt(Hex.replace(/^#/, ""), 16);
			return {
				R: (Long >>> 16) & 0xff,
				G: (Long >>> 8) & 0xff,
				B: Long & 0xff
			};
		}
		
		function changeColor(image,color)
		{
			//ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (image == 'gear')
			{
				currentPixels = currentPixelsGear;
				originalPixels = originalPixelsGear;
				var set = $("#gear");
			}
			else if (image == 'i')
			{
				currentPixels = currentPixelsI;
				originalPixels = originalPixelsI;
				var set = $("#i");
			}
			else if (image == 'ont')
			{
				currentPixels = currentPixelsOnt;
				originalPixels = originalPixelsOnt;
				var set = $("#ont");
			}
			
			if(!originalPixels) return; // Check if image has loaded
			//var newColor = HexToRGB(document.getElementById("color").value);
			var newColor = HexToRGB(color);
			
			for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
			{
				if(currentPixels.data[I + 3] > 0)
				{
					currentPixels.data[I] = originalPixels.data[I] / 255 * newColor.R;
					currentPixels.data[I + 1] = originalPixels.data[I + 1] / 255 * newColor.G;
					currentPixels.data[I + 2] = originalPixels.data[I + 2] / 255 * newColor.B;
				}
			}
			
			ctx.putImageData(currentPixels, 0, 0);
			//mug.src = canvas.toDataURL("image/png");
			set.attr("src",canvas.toDataURL("image/png"));
		}
		
		function getPixels(image)
		{
		console.log('get pixels');
		/*
			if (image == 'gear')
			{
				//var img = $("#gear")[0];
				var img=document.getElementById("gear");
				//img = $("#gear").attr("src");
				//console.log('test');
				//console.log(img);
				canvas.width = img.width;
				canvas.height = img.height;
				//ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
				ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
				originalPixelsGear = ctx.getImageData(0, 0, img.width, img.height);
				currentPixelsGear = ctx.getImageData(0, 0, img.width, img.height);
				//console.log(originalPixels['data']['900']);
				//console.log(currentPixels['data']['900']);
				img.onload = null;
				//console.log('gear loaded');
				//console.log(originalPixelsGear);
			}
			
			else if (image == 'i')
			{
				var img=document.getElementById("i");
				//console.log(i);
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
				originalPixelsI = ctx.getImageData(0, 0, img.width, img.height);
				currentPixelsI = ctx.getImageData(0, 0, img.width, img.height);
				img.onload = null;
				//console.log('i loaded');
				//console.log(originalPixelsI);
			}
			
			else if (image == 'ont')
			{
				var img=document.getElementById("ont");
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
				originalPixelsOnt = ctx.getImageData(0, 0, img.width, img.height);
				currentPixelsOnt = ctx.getImageData(0, 0, img.width, img.height);
				img.onload = null;
				//console.log('ont loaded');
				//console.log(originalPixelsOnt);
			}
			*/
			
				var img=document.getElementById(image);
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
				originalPixelsOnt = ctx.getImageData(0, 0, img.width, img.height);
				currentPixelsOnt = ctx.getImageData(0, 0, img.width, img.height);
				img.onload = null;
				console.log(image+' loaded');
				//console.log(originalPixelsOnt);
		}
//**********************************************************************


var imgColor = '#000000';

$("#gear").one('load',function() {
  console.log('loaded');
  getPixels('gear');
	changeColor('gear',imgColor);
});
$("#i").one('load',function() {

  console.log('loaded');
  getPixels('i');
	changeColor('i',imgColor);
});
$("#defapps").one('load',function() {
  console.log('loaded');
  getPixels('defapps');
	changeColor('defapps',imgColor);
});
	
//***********************************************************************
	
	
	
	

			//console.log(theme)
	});
	
	
});

