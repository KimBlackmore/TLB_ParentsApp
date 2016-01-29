/*
This version shows the last week's data in the chart.
It new data from the remote database once on load.

In the future will want to have options to view history in different time periods
- first go - reload data from database each time view history
- but that is not efficient so use the loca database
- and keep all retrieved data in live array but just chart the required subset.

 */

var walks = [];
var days = [];
var totalWalks = 0;

$(function() {
    $( "#datepicker" ).datepicker();
  //  $( "#datepicker" ).datepicker.formatDate( "dd-mm-yy" );
  //  $.datepicker.setDefaults({
  //showOn: "both",
  //buttonImageOnly: true,
  //buttonImage: "calendar.gif",
	//});


});


function recordDBWalks(n,d){
	year = d.substring(0,4);
	month = d.substring(5,7);
	day = d.substring(8,10);
	walkLabel = day + " " + monthName(month-1);
	days.push(walkLabel); 

	walks.push(n);
	totalWalks += ~~n;
}

function recordAppWalks(n,d){
	if(d===1){ //make date equal today
		var currentDate = new Date();
		day = currentDate.getDate()
		month = currentDate.getMonth()+1;
		year = currentDate.getFullYear();
	} else { //extract info from date passed
		year = d.substring(0,4);
		month = d.substring(5,7);
		day = d.substring(8,10)
	}
	//send new data to the database
	datenodash = year + "" + month+ ""+ day;
	postNum(n,~~datenodash);
	// ind out if already have an entry for this date in local array
	walkLabel = day + " " + monthName(month-1);
	i = days.indexOf(walkLabel);
	//alert("i " +i);
	if(i < 0 ){ 
		walks.push(n);
		days.push(walkLabel); 
		totalWalks += ~~n;
	}
	else{
		totalWalks += ~~n - walks[i];
		walks[i]= ~~n;
	}
}

function monthName(m){
	var month = new Array();
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";
	return month[m];
}

function resizeChart() {
    var chartCanvas = document.getElementById('chartCanvas');
    var chartRatio = 4/3;
    var newWidth = window.innerWidth;
    var headerHeight = newWidth/8;
    var newHeight = window.innerHeight - 200;

    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > chartRatio) {
        newWidth = newHeight * chartRatio;
       // alert("new Width "+ newWidth);
    } else {
        newHeight = newWidth / chartRatio;
       // alert("new Height " + newHeight);
    }
    
    chartCanvas.width = newWidth;
    chartCanvas.height = newHeight;
    chartCanvas.style.width = newWidth ;
    chartCanvas.style.height = newHeight ;
}

window.addEventListener('load', resizeChart, false);
window.addEventListener('resize', resizeChart, false);
window.addEventListener('orientationchange', resizeChart, false);

var lineChartData = {
	labels : days,
	datasets : [
		{
			label: "My Walks",
			fillColor : "rgba(79,34,98,0.2)",
			strokeColor : "rgba(79,34,98,1)",
			pointColor : "rgba(0,0,0,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(164,50,123,1)",
			data : walks
		}
	]
}
	
//$(document).on("pageshow","#home",function(){ - this does not work - gives points toal 0, and means chart doesn't work in history page
$(document).on("pageshow","#walkHistory",function(){
	var ctx = document.getElementById("chartCanvas").getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive: true
	});
	document.getElementById("showTotal").innerHTML = totalWalks;
});

$.ajax({ 
    type: "POST",
    // for now this gets the last week's worth of data but need to work out how to pass it a different date range
    url: "http://home.exetel.com.au/blackmores/TLB_KidsApp/getNums.php",
    dataType: "json",
  	data: {  //this bit is for sending data to the database
  	}
}).done(function( data ) {  
	$.each(data, function(index, element) { 
		//put each row of the retrieved data into a temporary array ready for charting
		recordDBWalks(element.Num,element.Label);
	});
}).fail(function() { 
 	//alert("Can't get history");
});

function postNum(n,d){
	//alert("in postNum: num "+n+" day "+d);
	$.ajax({ 
	    type: "POST",
	    url: "http://home.exetel.com.au/blackmores/TLB_KidsApp/postNum.php", 
	    data:{num:n, date:d} 
	}).done(function( data ) { 
		alert("I recorded the new number "+n);
	}).fail(function() {  
		alert("I failed to record the new number");
	});
};

/* try to make a selector list of just the dates in the most recent history chart
instead of giving a full date selector
But not working yet...

 function make_datelist(){
	alert("boop");
    var select = "<select id='w_daySelected'></select>";
    $('#w_dayOptions').html(select);
    alert(days.length);
    for(var i=0;i<days.name.length;i++){
        $('#w_dayOptions').append($("<option></option>")
         .attr("value",i)
         .text(days.name[i]));
    }
}

$(function(){
    make_w_day();
    $('#w_daySelected').change(function(){
        console.log($(this).val());
     });
});

here is a new line of text */


	

