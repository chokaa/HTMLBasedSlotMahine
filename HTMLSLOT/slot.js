const FRUITS_PER_REEL = 12;
const NUMBER_OF_WHEELS = 5;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / FRUITS_PER_REEL ) ); 
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 150;


var winningArray = [];

function createElements () {
	var rings = document.getElementById('slot');

	for (var i = 0; i < NUMBER_OF_WHEELS; i ++) {
		var ring = document.createElement('div');
		ring.id = `ring${i}`;
		ring.className = `ring`;
		rings.append(ring);
	}
}



function createFruits (ring) {
	
	var fruitAngle = 360 / FRUITS_PER_REEL;


	for (var i = 0; i < FRUITS_PER_REEL; i ++) {
		var fruit = document.createElement('img');
		
		fruit.className = 'fruit';

		// compute and assign the transform for this fruit
		var transform = 'rotateX(' + ( fruitAngle * i-33) + 'deg) translateZ(' + REEL_RADIUS + 'px)';

		fruit.style.transform = transform;

		fruit.src="images/icon"+i.toString()+'.png';

		fruit.slotValue = i;
		// add the fruit to the row
		ring.append(fruit);
	}
}

function random() {
	// generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
	return Math.floor(Math.random()*(FRUITS_PER_REEL));
}

function spin(timer) {

	var rings = document.getElementById('slot');


	for(let i = 0; i < NUMBER_OF_WHEELS; i ++) {
		$('#ring'+i)
		.css('animation','')
		.attr('class','ring');
	}

	var fruitAngle = 360 / FRUITS_PER_REEL;


	//set new random fruits and fill winning array with arrays of elements
	for(var i = 0; i < NUMBER_OF_WHEELS; i ++) {

		var ringValueArray = [];

		var childNodes = rings.children[i];

		while (childNodes.firstChild) {
		    childNodes.removeChild(childNodes.firstChild);
		}

		for (var j = 0; j < FRUITS_PER_REEL; j ++) {
			
			var fruit = document.createElement('img');
			
			var randomIndex = random();

			fruit.className = 'fruit';

			var transform = 'rotateX(' + ( fruitAngle * j-33) + 'deg) translateZ(' + REEL_RADIUS + 'px)';

			fruit.style.transform = transform;

			fruit.src="images/icon"+randomIndex.toString()+'.png';

			ringValueArray.push(randomIndex);
			// add the fruit to the row
			childNodes.append(fruit);
		}
		winningArray.push(ringValueArray);
	}




	setTimeout(function(){
		for(var i = 0; i < NUMBER_OF_WHEELS; i ++) {
			$('#ring'+i)
			.css('animation','back-spin '+timer.toString()+'s, spin'+ ' ' + (timer + i*0.5) + 's')
			.attr('class','ring spin');
		}
	},100)




	calculateIncome(timer);

}

function calculateIncome(timer){

	var income=0;

	for(var i=0;i<winningArray.length;i++){

		var currentArrayValue = winningArray[i][0];
		var dontAdd=0;

		for(var j=0;j<3;j++)
			if(currentArrayValue!=winningArray[i][j])
				dontAdd =1;

		if(!dontAdd)
			income+=currentArrayValue;

	}
	//we are only checking 3 elements, which are in the middle of slot
	for(var i=0;i<3;i++){

		var currentArrayValue = winningArray[i][0];
		var dontAdd=0;

		for(var j=0;j<3;j++)
			if(currentArrayValue!=winningArray[j][i])
				dontAdd =1;

		if(!dontAdd)
			income+=currentArrayValue;


	}


	winningArray.length=0;


	setTimeout(function(){
		
		var credit = parseInt($('#credit').val())+income;

		$('#credit').val(credit);

		$('#winnerPaid').val(income);

	},timer+Math.floor(timer+NUMBER_OF_WHEELS/2)*1000);

}

$(document).ready(function() {

	createElements();
	// initiate fruit 
 	for(let i = 0; i < NUMBER_OF_WHEELS; i++)
 		createFruits($('#ring'+i.toString()));

 	$('#credit').val(5000);


 	$('#bet').val(5);

 	$('#winnerPaid').val(0);

 	// hook start button
 	$('#spin').on('click',function(){

 	var bet = parseInt($('#bet').val());
 	var credit = parseInt($('#credit').val());

 	$('#winnerPaid').val(0);
 
	 	if(bet>0 && credit>0){
	 		
	 		credit-=bet;
	 		$('#credit').val(credit);

	 		var timer = 1;
	 		spin(timer);
		}

 	});

 	$('#betMax').on('click',function(){

 		$('#bet').val( $('#credit').val() );

 	})

	$('#betOne').on('click',function(){

 	var credit = parseInt($('#credit').val());
 	var bet = parseInt($('#bet').val());
 	
 	if(credit<bet)
 		$('#bet').val(credit);
 	else if(credit>0)
 		$('#bet').val(5);
 	})

 });