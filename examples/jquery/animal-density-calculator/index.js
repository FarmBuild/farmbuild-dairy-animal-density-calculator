 //initialize jQuery tooltip
 $( function() {	
    $( document ).tooltip();
  } );
  
//Other hours are stored infront of the paddock_hour array
	var OTHER_AREA_COUNT = 4;
	
	var decimalPrecision = farmbuild.examples.animaldensitycalculator.decimalPrecision;

		PADDOCK_LIST=[{paddockId:'Paddock1', area:4}, {paddockId:'Paddock2',area: 2},{paddockId:'Paddock3',area:5},{paddockId:'Paddock4',area:4},{paddockId:'Paddock5',area:10},{paddockId:'Paddock6',area:0.5},{paddockId:'Paddock7',area:1}];
var paddocks_hour = [];

 var season_id=1;
  $( function() {
    $( "#start_date" ).datepicker({
      changeMonth: true,
      changeYear: true,
	  dateFormat: "MM d, yy"
    });
	$( "#end_date" ).datepicker({
      changeMonth: true,
      changeYear: true,
	  dateFormat: "MM d, yy"
    });
  } );
  
  
   $( ".seasons" ).accordion({
        header: "> div > h3",
        collapsible: true,
        active: false,
        autoHeight: false,
        autoActivate: true
    });
	
	
	var season_header = "<p><h4>Number of Cows: <input type='number' id='numberofCows'>&nbsp;<button title='Number of cows in this season'>?</button></p>Daily Hours Break Down <br><br> <table><tr><td>Laneway:</td> <td> <input name='lanewayHours' id='lanewayHours' type='number' />hrs/day</td>"+ " <td>&nbsp&nbsp&nbsp&nbsp</td><td> Lane way (animal-hour):<label id='lanewayAnimalHours'></label>&nbsp;<button title='Enter daily hours spent in laneway; animal hours is calculated when Calculate Paddock Hours button pressed'>?</button></td></tr>"+
	"<tr><td>Dairy Sheds:</td><td><input name='dairyshedsHours' id='dairyshedsHours' type='number'/>hrs/day</td>"+ " <td>&nbsp&nbsp&nbsp&nbsp</td><td> Dairysheds (animal-hour):<label id='dairyshedsAnimalHours'></label>&nbsp;<button title='Enter daily hours spent in dairy shed; animal hours is calculated when Calculate Paddock Hours button pressed'>?</button></td></tr>"+
	"<tr><td>Holding Yards:</td><td><input name='holdingyardsHours' id='holdingyardsHours' type='number'/>hrs/day</td>"+"<td>&nbsp&nbsp&nbsp&nbsp</td> <td> Holding Yards (animal-hour):<label id='holdingyardsAnimalHours'></label>&nbsp;<button title='Enter daily hours spent in holding yards; animal hours is calculated when Calculate Paddock Hours button pressed'>?</button></td></tr>"+
	"<tr><td>Feed Pads:</td><td><input name='feedpadsHours' id='feedpadsHours' type='number' />hrs/day</td><td>&nbsp&nbsp&nbsp&nbsp</td><td> Feed Pads (animal-hour):<label id='feedpadsAnimalHours'></label>&nbsp;<button title='Enter daily hours spent in feedpad; animal hours is when Calculate Paddock Hours button pressed'>?</button></td></tr></table></h4>";
	
	var season_body = "<table id='PaddockHourTable' class='table table-striped table-hover'>"+ 
					"<tr>"+ 
					    "<th>Paddock</th>"+
						"<th>Visitation Index (0-10)&nbsp;<button title='Assign a number between 0-10 representing frequency of visit of cows 10 being the highest for current paddock, the weighted average of visitation index is used in animal density calculation'>?</button></th>"+
                        "<th>Hours Spent</th>"+                        
                        "<th></th>"+
                    "</tr>"+
                    "<tr class='form-input'>"+
                        "<td>"+
                            "<select name='PaddockSelect'  id='PaddockSelect' class='form-control' onchange='SetHoursSpentVal()'>"+
                                "<option value='default'>Select Paddock</option>"+
                            "</select>"+
                        "</td>"+
                        "<td></td>"+
                        "<td>"+
                            "<button type='button' class='btn btn-primary' id='calcPaddockHours'>"+
                                "<i class='icon fa fa-plus'></i>"+
                                "Calculate Paddock Hours"+
                            "</button>"+
                        "</td>"+
                    "</tr>"+                    
                "</table>";
	

//if Laneway selected, calculate laneway area, hoursspent - laneway is the last entry in PADDOCK_LIST
function SetHoursSpentVal(){
    
	var targetId = event.target.id;
	var table_id = $(event.target).closest('table').attr('id');
	var accordion_index = table_id.replace("PaddockHourTable","");		

	var paddock_id = $("#PaddockSelect"+accordion_index+' :selected').val();	
	
	var season_id = "Season"+accordion_index;
	
	paddocks_hour[season_id].push(
		{	
		paddockId:paddock_id,
		paddockArea:PADDOCK_LIST[paddock_id.replace("Paddock","")-1].area, //area of the paddock selected
		hours:0
		}
	);


	$("#"+table_id).append('<tr><td>'+paddock_id+'</td>'+"<td><input name='visitIndex' id='visitIndex"+accordion_index+paddock_id+"'"+" type='number' min='0' max='10' class='form-control'/></td>"+'<td>'+"<div id='hoursSpent"+accordion_index+paddock_id+"'></div>"+'</td><td><button type="button" class="btn btn-link" id="deleteRow"  > Remove</button></td></tr>');
	$("#PaddockSelect"+accordion_index).val('default');
	$("#hoursSpent"+accordion_index).val("");

}
function validateSeasonInputs(numofcows,lanewayhours,dairyshedshours,holdingyardshours,feedpadshours ){
 var n = Math.floor(Number(numofcows));
 var errormsg="";
    if(!(String(n) === numofcows && n >= 0)){
		errormsg = errormsg.concat("Cow number should be positive integer. "); 
	};
	if(isNaN(lanewayhours) || isNaN(dairyshedshours) || isNaN(holdingyardshours) || isNaN(feedpadshours)){
		errormsg = errormsg.concat("Please check laneway, dairy sheds, holdingyards and feedpads hours are numbers and not empty. "); 
	}
	else{
		if(parseFloat(lanewayhours)<0 && parseFloat(lanewayhours) >24.0){
		errormsg = errormsg.concat("Laneway hours should be between 0 and 24. "); 
		}
		if(parseFloat(dairyshedshours)<0 && parseFloat(dairyshedshours) >24.0){
		errormsg = errormsg.concat( "Dairy sheds hours should be between 0 and 24. "); 
		}
		if(parseFloat(holdingyardshours)<0 && parseFloat(holdingyardshours) >24.0){
		errormsg = errormsg.concat("Holding yards hours should be between 0 and 24. "); 
		}
		if(parseFloat(feedpadshours)<0 && parseFloat(feedpadshours) >24.0){
		errormsg = errormsg.concat("Feed pad hours should be between 0 and 24. "); 
		}
	}
	
	if(parseFloat(lanewayhours)+parseFloat(dairyshedshours)+parseFloat(holdingyardshours)+parseFloat(feedpadshours)>24.0){
	    errormsg = errormsg.concat("Sum of laneway, dairy sheds, holding yards and feed pad hours should be less than 24. "); 
	}
	
	return errormsg;
 }	
//this function adds paddock selected and hours to the list and into paddocks_hour array
$("body").on("click", "#calcPaddockHours", function(e){				
	var table_id = $(this).closest('table').attr('id');
	var accordion_index = table_id.replace("PaddockHourTable","");
	
	var season_id = "Season"+accordion_index;
	
	var hours_spent = $("#hoursSpent"+accordion_index).val();
	var TotalVI = 0.0;
	var NumOfPaddock = paddocks_hour[season_id].length;
	
	
	
	//calculate sum of visitation index
	for(i=OTHER_AREA_COUNT; i< paddocks_hour[season_id].length; i++){
	    var paddockid = paddocks_hour[season_id][i].paddockId;		
	    TotalVI+=parseFloat($("#visitIndex"+accordion_index+paddockid).val());
	}
	//show hours
	var total_hours_id = '#TotalHours' + accordion_index;							
	var TotalHours = $(total_hours_id).val();
	var lanewayhours=0.0;var dairyshedshours = 0.0; var holdingyardshours=0.0; var feedpadshours = 0.0;
	
	lanewayhours=parseFloat($("#lanewayHours"+accordion_index).val());	
	dairyshedshours = parseFloat($("#dairyshedsHours"+accordion_index).val());
	holdingyardshours=parseFloat($("#holdingyardsHours"+accordion_index).val());
	feedpadshours = parseFloat($("#feedpadsHours"+accordion_index).val());
	var errmsg = validateSeasonInputs($("#numberofCows"+accordion_index).val(), lanewayhours,dairyshedshours,holdingyardshours,feedpadshours);
	
if( errmsg==""){
	//add animal hours in other areas
	$("#lanewayAnimalHours"+accordion_index).text(TotalHours*lanewayhours * $("#numberofCows"+accordion_index).val() / 24 );
	$("#dairyshedsAnimalHours"+accordion_index).text(TotalHours*dairyshedshours * $("#numberofCows"+accordion_index).val() / 24 );
	$("#holdingyardsAnimalHours"+accordion_index).text(TotalHours*holdingyardshours * $("#numberofCows"+accordion_index).val() / 24 );
	$("#feedpadsAnimalHours"+accordion_index).text(TotalHours*feedpadshours * $("#numberofCows"+accordion_index).val() / 24 );
    //store other hours in paddocks hour array (first four)
	 paddocks_hour[season_id][0].hours = TotalHours*lanewayhours /24 ;
	 paddocks_hour[season_id][1].hours = TotalHours*dairyshedshours /24 ;
	 paddocks_hour[season_id][2].hours = TotalHours*holdingyardshours /24 ;
	 paddocks_hour[season_id][3].hours = TotalHours*feedpadshours /24 ;
	
	var OtherHours_pcent = (lanewayhours + dairyshedshours + holdingyardshours + feedpadshours)/24;	
	var PaddockHours_pcent = (1 - OtherHours_pcent);
    
	for(i=OTHER_AREA_COUNT; i< paddocks_hour[season_id].length; i++){
	    var paddockid = paddocks_hour[season_id][i].paddockId;		
		var paddockhours = TotalHours*PaddockHours_pcent*$("#visitIndex"+accordion_index+paddockid).val()/TotalVI;	    	    
		 $("#hoursSpent"+accordion_index+paddockid).text(parseFloat(paddockhours).toFixed(decimalPrecision));
		 paddocks_hour[season_id][i].hours =paddockhours;
	}
}else{//display error msg in bootstrap modal dialog
	
	$("#modalmsg").html(errmsg);
    $("#myModal").modal('toggle');
}	
	
 });
 
//this function is used to remove a row of paddock hours added
	$("body").on("click", "#deleteRow", function(e){	
		
		var index = $(this).closest('tr').index()-2; // = table row index - 2 to exclude two top rows
		
		var table_id = $(this).closest('table').attr('id');
		var accordion_index = table_id.replace("PaddockHourTable","");
		var seasonId = "Season"+accordion_index;
		
		if(index > -1) {
			$(this).closest('tr').remove(); //remove the table row
			paddocks_hour[seasonId].splice(OTHER_AREA_COUNT+index, 1); //remove from entry from Season array
			console.log(paddocks_hour);
		}
		
	}); 
 function validateSeason(startdate, enddate){
	return (enddate>startdate);
 }
 
  $('#add_season').click( function() {
        var start_date = $("#start_date").datepicker("getDate");
		var end_date = $("#end_date").datepicker("getDate");
		
	if(validateSeason(start_date, end_date)){	
		var total_hours = (end_date - start_date)/3600000;
		var local_season_body=season_body;
		var local_season_header = season_header;
        local_season_body = local_season_body.replace(/PaddockHourTable/g,"PaddockHourTable"+season_id);
		local_season_body = local_season_body.replace(/PaddockSelect/g,"PaddockSelect"+season_id);
		local_season_body = local_season_body.replace(/hoursSpent/g,"hoursSpent"+season_id);
		
		local_season_header = local_season_header.replace(/numberofCows/g,"numberofCows"+season_id);
		local_season_header = local_season_header.replace(/lanewayHours/g,"lanewayHours"+season_id);
		local_season_header = local_season_header.replace(/dairyshedsHours/g,"dairyshedsHours"+season_id);
		local_season_header = local_season_header.replace(/holdingyardsHours/g,"holdingyardsHours"+season_id);
		local_season_header = local_season_header.replace(/feedpadsHours/g,"feedpadsHours"+season_id);
		
		//laneway etc animal hour storage html element(number of cow * hours)
		local_season_header = local_season_header.replace(/lanewayAnimalHours/g,"lanewayAnimalHours"+season_id);
		local_season_header = local_season_header.replace(/dairyshedsAnimalHours/g,"dairyshedsAnimalHours"+season_id);
		local_season_header = local_season_header.replace(/holdingyardsAnimalHours/g,"holdingyardsAnimalHours"+season_id);
		local_season_header = local_season_header.replace(/feedpadsAnimalHours/g,"feedpadsAnimalHours"+season_id);		
		
        var newDiv = "<div><h3>Season"+season_id+"</h3><div>"+local_season_header+"Start date:"+$("#start_date").val()+"&emsp; End date:"+$("#end_date").val()+"&emsp; Total hours: <input type='text' id='TotalHours"+season_id+"' value="+total_hours+">"+local_season_body+"</div></div>";
        $('.seasons').append(newDiv);		
		
        $('.seasons').accordion("refresh");        		
		
	
	var paddocksel = $("#PaddockSelect"+season_id);

	for(var i=0; i<PADDOCK_LIST.length; i++){
		//add select options
		paddocksel
        .append($("<option></option>")
        .attr("value",PADDOCK_LIST[i].paddockId)
        .text(PADDOCK_LIST[i].paddockId)); 
	}
	paddocks_hour["Season"+season_id]=new Array(); //create an array for newly created season
	
	//Push four locations laneway, dairyshed, holdingyard and feedpad
	paddocks_hour["Season"+season_id].push(
		{	
		paddockId:'laneway',
		paddockArea:1, //area of the paddock selected
		hours:0
		},
		{	
		paddockId:'dairyshed',
		paddockArea:1, //area of the paddock selected
		hours:0
		},
		{	
		paddockId:'holdingyard',
		paddockArea:1, //area of the paddock selected
		hours:0
		},
		{	
		paddockId:'feedpad',
		paddockArea:1, //area of the paddock selected
		hours:0
		}
	);
	season_id++;
	$("#start_date").val("");
	$("#end_date").val("");
	}else alert("End date should be later than start date, please choose dates in correct order");
	
    });

	var density_table = "<table id='DensityTable' class='table table-striped table-hover'>"+ 
					"<tr>"+ 
					    "<th>Paddock</th>"+
                        "<th>Area</th>"+
						"<th>Hours</th>"+		
						"<th>Density (animal-hour/ha)</th>"+
                        			
                    "</tr>"+                                     
                "</table>";
	//calculates and displays animal density data
	$('#calculateDensity').click(function(){
	     var tmp_density_tbl = density_table;
		 
		 var seasonId;	 
		 
		 
		 $('#density_data_div').html("");		 
		
		var numofseason = Object.keys(paddocks_hour).length; //?it works as an object but not an array
	for(s=1; s<=numofseason; s++){
	    seasonId="Season"+s;
		tmp_density_tbl = density_table; //intialize season table
		$('#density_data_div').append("<h3>Data for "+seasonId+"</h3>");
		tmp_density_tbl = tmp_density_tbl.replace(/DensityTable/g,"DensityTable"+seasonId);
		var paddocks_used_this_season = paddocks_hour[seasonId].length; 
		var herd_size = $("#numberofCows"+s).val(); 
		var numofcows = herd_size/paddocks_used_this_season;

		for(i=0; i<paddocks_hour[seasonId].length; i++){
		 tmp_density_tbl = tmp_density_tbl.replace("</table>",'<tr><td>'+paddocks_hour[seasonId][i].paddockId+'</td><td>'+paddocks_hour[seasonId][i].paddockArea+'</td><td>'+parseFloat(paddocks_hour[seasonId][i].hours).toFixed(decimalPrecision)+'</td><td>'+parseFloat((numofcows*paddocks_hour[seasonId][i].hours)/paddocks_hour[seasonId][i].paddockArea).toFixed(decimalPrecision)+'</td></tr></table>');		 
		 }
		$('#density_data_div').append(tmp_density_tbl);
		} //end outer for loop
		
		var summary = CalculateSummary();
		tmp_density_tbl = density_table; //intialize season table
		tmp_density_tbl = tmp_density_tbl.replace(/DensityTable/g,"SummaryTable");
		$('#density_data_div').append("<h3>Yearly Summary:</h3>");
		for (var key in summary) {
			tmp_density_tbl = tmp_density_tbl.replace("</table>",'<tr><td>'+key+'</td><td>'+summary[key].area+'</td><td>'+parseFloat(summary[key].hours).toFixed(decimalPrecision)+'</td><td>'+parseFloat(summary[key].density).toFixed(decimalPrecision)+'</td></tr></table>');		
		}
		$('#density_data_div').append(tmp_density_tbl);
	});
	function CalculateSummary(){
		var summary = [];
		
		
		var numofseason = Object.keys(paddocks_hour).length; //?it works as an object but not an array
	for(s=1; s<=numofseason; s++){
	    seasonId="Season"+s;
		var herd_size = $("#numberofCows"+s).val(); 		
		var paddocks_used_this_season = paddocks_hour[seasonId].length; 
		numofcows = herd_size/paddocks_used_this_season;
		//create new object for this season for holding summary of : Area, Hours, Density
		 
		for(i=0; i<paddocks_hour[seasonId].length; i++){
		 var paddockId = paddocks_hour[seasonId][i].paddockId;
		 if(typeof(summary[paddockId]) == "undefined")  summary[paddockId] ={area:0, hours:0, density:0};
			summary[paddockId].area = paddocks_hour[seasonId][i].paddockArea; 
			summary[paddockId].hours+=Number(paddocks_hour[seasonId][i].hours)
			summary[paddockId].density+=(numofcows*paddocks_hour[seasonId][i].hours)/paddocks_hour[seasonId][i].paddockArea;		 
		 }
		
		} //end outer for loop
		return summary;
	}
