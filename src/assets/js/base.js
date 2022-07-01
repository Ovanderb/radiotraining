const MAX_MHZ = 75;
const MIN_MHZ = 45;
let c1 = localStorage.getItem('ch1_mhz');
if(!c1){
    for(let i = 2; i < 15; i++){
        localStorage.setItem('ch'+i+'_mhz', MIN_MHZ);
        localStorage.setItem('ch'+i+'_khz', 0);
    }
}
localStorage.setItem('h_mhz', 0);
localStorage.setItem('h_khz', 0);

function formatKhz(n){
    if(n<10){
        return '00' + n;
    } else if (n<100){
        return '0' + n;
    } else {
        return '' +  n;
    }
}


const onoff = document.getElementById('onoff');
const speak = document.getElementById('speak');
const vol = document.getElementById('vol');
const disp = document.getElementById('innerdisp');
const step = 22.5, ONOFF_FACTOR = 10;
let rotaOnoff = 1, 
rotaVol = 12, 
mhz = 45,
khz = 0,
btnState = 1,
pState = 1,
pChannel = 1,
pMhz = MIN_MHZ,
pKhz = 0;

onoff.style.transform = 'rotate(' + ((rotaOnoff + ONOFF_FACTOR) * step) + 'deg)';
vol.style.transform = 'rotate(' + (rotaVol * step) + 'deg)';
speak.style.transform = 'rotate(' +  90 + 'deg)';
document.addEventListener('mousewheel', function(ev){
	if(ev.target.id == "onoff"){
		btnState = 1;
		pState = 1;
		pChannel = 1;
		if(ev.wheelDelta > 0){
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
		console.log(rotaOnoff);
		onoff.style.transform = 'rotate(' + ((rotaOnoff + ONOFF_FACTOR) * step) + 'deg)';
		if(rotaOnoff === 1 || rotaOnoff == 26){
			innerdisp.innerText = "";
		} else if(rotaOnoff === 2){
			innerdisp.innerText = "no Fr";
		} else if (rotaOnoff > 2 && rotaOnoff < 15){
			innerdisp.innerText = localStorage.getItem('ch'+rotaOnoff+'_mhz') + "." + formatKhz(localStorage.getItem('ch'+rotaOnoff+'_khz'));		
		} else if (rotaOnoff == 15){
			innerdisp.innerText = "no Fr";		
		} else if (rotaOnoff == 16){
			// todo start blink
			innerdisp.innerText = "ch 1";		
		}
	}
	if(ev.target.id == "vol"){
		let up = true;
		if(ev.wheelDelta > 0){
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
			if(up){
				pState++;
			} else {
				pState--;
			}

			if(pState > 13){
				pState = 13
			}

			if(pState < 2){
				pState = 2;
			}

			let itid = 'ch' + pState;
			if(pState == 13){
				itid = 'h';
			}

			if(btnState == 1){
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
						currentMhz++;
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
					if((currentKhz-26) < MIN_MHZ){
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
});

document.addEventListener('click',function(ev){
	if(ev.target.id == "speak"){
		if(rotaOnoff == 16){
			if(btnState == 1){
				if(pChannel == 13){
					innerdisp.innerText = localStorage.getItem('h_mhz') + "." + formatKhz(localStorage.getItem('h_khz'));
				} else {
					innerdisp.innerText = localStorage.getItem('ch'+pChannel+'_mhz') + "." + formatKhz(localStorage.getItem('ch'+pChannel+'_khz'));
				}
				btnState = 2;
			} else if (btnState == 2){
				btnState = 3;
			} else if (btnState == 3){
				btnState = 1;
			}
		}
	}
});