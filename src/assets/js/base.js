(function(){
	startup();
})();


const onoff = document.getElementById('onoff');
const speak = document.getElementById('speak');
const vol 	= document.getElementById('vol');
const disp 	= document.getElementById('innerdisp');
const step 	= 22.5;
const ONOFF_FACTOR = 10;
const MAX_MHZ = 75;
const MIN_MHZ = 45;


var tev = { //touchevent
	startX:false,
	startY:false,
	currentX:false,
	currentY:false
};

let rotaOnoff = 1, 
rotaVol = 12, 
mhz = 45,
khz = 0,
btnState = 1,
pState = 1,
pChannel = 1,
pMhz = MIN_MHZ,
pKhz = 0,
c1 = localStorage.getItem('ch1_mhz');

// initiate the localstorage if necessary
if(!c1){
    for(let i = 1; i < 15; i++){
        localStorage.setItem('ch'+i+'_mhz', MIN_MHZ);
        localStorage.setItem('ch'+i+'_khz', 0);
    }
}
localStorage.setItem('h_mhz', 0);
localStorage.setItem('h_khz', 0);

onoff.style.transform 	= 'rotate(' + ((rotaOnoff + ONOFF_FACTOR) * step) + 'deg)';
vol.style.transform 	= 'rotate(' + (rotaVol * step) + 'deg)';
speak.style.transform 	= 'rotate(' +  90 + 'deg)';


function onOffMove(direction){
	btnState = 1;
	pState = 1;
	pChannel = 1;
	if(direction > 0){
		rotaOnoff--;
		if(rotaOnoff < 1){
			rotaOnoff = 16;
		}
	} else {
		rotaOnoff++;
		if(rotaOnoff > 16){
			rotaOnoff = 1;
		}
	}
	onoff.style.transform = 'rotate(' + ((rotaOnoff + ONOFF_FACTOR) * step) + 'deg)';
	if(rotaOnoff === 1){
		//todo unset temp
		innerdisp.innerText = "";
	} else if(rotaOnoff === 2){
		innerdisp.innerText = "no Fr";
	} else if (rotaOnoff > 2 && rotaOnoff < 15){
		console.log(rotaOnoff);
		innerdisp.innerText = localStorage.getItem('ch'+(rotaOnoff-2)+'_mhz') + "." + formatKhz(localStorage.getItem('ch'+(rotaOnoff-2)+'_khz'));		
	} else if (rotaOnoff == 15){
		// todo check if temp is set
		innerdisp.innerText = "no Fr";		
	} else if (rotaOnoff == 16){
		// todo start blink
		innerdisp.innerText = "ch 1";		
	}
}

function onSpeak(){
	if(rotaOnoff == 16){
		if(btnState == 1){
			btnState = 2;
			if(pChannel == 13){
				innerdisp.innerText = localStorage.getItem('h_mhz') + "." + formatKhz(localStorage.getItem('h_khz'));
			} else {
				innerdisp.innerText = localStorage.getItem('ch'+pChannel+'_mhz') + "." + formatKhz(localStorage.getItem('ch'+pChannel+'_khz'));
			}

		} else if (btnState == 2){
			btnState = 3;
		} else if (btnState == 3){
			btnState = 1;
			innerdisp.innerText = "ch " + pChannel;
		}
	}
}

function volMove(direction) {
	let up = true;
	if(direction > 0){
		up = false;
		rotaVol--;
		if(rotaVol < 1){
			rotaVol = 16;
		}
	} else {
		rotaVol++;
		if(rotaVol > 16){
			rotaVol = 1;
		}
	}
	// proggen
	if(rotaOnoff == 16){
		let itid = 'ch' + pState;
		if(pState == 13){
			itid = 'h';
		}
		if(btnState == 1){
			if(up){
				pState++;
			} else {
				pState--;
			}
	
			if(pState > 13){
				pState = 13
			}
	
			if(pState < 1){
				pState = 1;
			}
			let chDisp = 1;
			if(pState == 13){
				chDisp = 'H'
			} else {
				chDisp = pState;
			}

			pChannel = pState;
			innerdisp.innerText = 'ch ' + chDisp;
		} else if(btnState == 2){
			let currentMhz = parseInt(localStorage.getItem(itid +'_mhz'));
			if(up){
				if((currentMhz+1) > MAX_MHZ){
				} else {
					currentMhz++;
					localStorage.setItem(itid +'_mhz', currentMhz);
				}
			} else {
				if((currentMhz-1) < MIN_MHZ){
				} else {
					currentMhz--;
					localStorage.setItem(itid +'_mhz', currentMhz);
				}
			}
			innerdisp.innerText = currentMhz + "." + formatKhz(localStorage.getItem(itid+'_khz'));
		} else if(btnState == 3){
			let currentMhz = parseInt(localStorage.getItem(itid +'_mhz'));
			let currentKhz = parseInt(localStorage.getItem(itid +'_khz'));
			if(up){
				if((currentKhz+26) > 999){
				} else {
					currentKhz += 25;
					localStorage.setItem(itid +'_khz', currentKhz);
				}
			} else {
				if((currentKhz-26) < 0){
				} else {
					currentKhz -= 25;
					localStorage.setItem(itid +'_khz', currentKhz);
				}
			}
			innerdisp.innerText = currentMhz + "." + formatKhz(currentKhz);
		}
	}
	vol.style.transform = 'rotate(' + ((rotaVol + ONOFF_FACTOR)* step) + 'deg)';
}

function handleStart(e){
	if(e.target.id == "speak"){
		onSpeak();
		return;
	}
	tev.startX = tev.currentX = e.targetTouches[0].clientX;
	tev.startY = tev.currentY = e.targetTouches[0].clientY;
}

function handleMove(e){
	let direction = 1;
	if(Math.abs(tev.currentY -  e.targetTouches[0].clientY) < 10){
		return;
	}
	if(e.targetTouches[0].clientY-tev.currentY < 0){
		direction = -1;
	}
	tev.currentY = e.targetTouches[0].clientY;
	if(e.target.id == "onoff"){
		onOffMove(direction);
	}
	if(e.target.id == "vol"){
		volMove(direction);
	}
}

function startup() {
	const el = document.getElementById('two');
	el.addEventListener('touchstart', handleStart);
	el.addEventListener('touchmove', handleMove);
	
	document.addEventListener('mousewheel', function(ev){
		if(ev.target.id == "onoff"){
			onOffMove(ev.wheelDelta);
		}
		if(ev.target.id == "vol"){
			volMove(ev.wheelDelta);
		}
	});

	if(!(('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0))){
		document.addEventListener('click',handleStart);
	}
  }

  
/**
 * Helper function to format the khz to 3 chars
 * @param {int} n 
 * @returns 
 */
function formatKhz(n){
    if(n<10){
        return '00' + n;
    } else if (n<100){
        return '0' + n;
    } else {
        return '' +  n;
    }
}