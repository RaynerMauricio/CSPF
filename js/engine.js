var bins;

function calculateCSPF(bins){

	window.bins = bins;
	temp = range(21,50);

	//fracBins = [0.055,	0.076,	0.091,	0.108,	0.116,	0.118,	0.116,	0.1,	0.083,	0.066,	0.041,	0.019,	0.006,	0.003,	0.002];
	
	// ####################
		
	var pFull35 = parseFloat(document.getElementById('powerfull').value);
	var pHalf35 = parseFloat(document.getElementById('powerhalf').value);
	var phiFull35 = parseFloat(document.getElementById('capacityfull').value);
	var phiHalf35 = parseFloat(document.getElementById('capacityhalf').value);

	// ####################
	phiFull29 = phiFull35*1.077;
	pFull29 = pFull35*0.914;
	phiHalf29 = phiHalf35*1.077;
	pHalf29 = pHalf35*0.914;
	cd = 0.25;
	t0 = 20;
	t100 = 35;

	// ####################

	tb = ((20/(35-20))+(phiFull35/phiFull35)*(1+(phiFull29/phiFull35-1)*35/(35-29)))/(1/(35-20)+phiFull35/phiFull35*((phiFull29/phiFull35-1)/(35-29)));
	tc = ((20/(35-20))+(phiHalf35/phiFull35)*(1+(phiHalf29/phiHalf35-1)*35/(35-29)))/(1/(35-20)+phiHalf35/phiFull35*((phiHalf29/phiHalf35-1)/(35-29)));
	phiFul_tb = phiFull35+(phiFull29-phiFull35)*(35-tb)/(35-29);
	phiHaf_tc = phiHalf35+(phiHalf29-phiHalf35)*(35-tc)/(35-29);
	pFul_tb = pFull35+(pFull29-pFull35)*(35-tb)/(35-29);
	pHaf_tc = pHalf35+(pHalf29-pHalf35)*(35-tc)/(35-29);
	EERful_tb = phiFul_tb/pFul_tb;
	EERhaf_tc = phiHaf_tc/pHaf_tc;

	// ####################

	capacity =  function(phi_35, phi_29, tj){
	  // for full, half and min capacities
	  phi_tj = phi_35 + ((phi_29 - phi_35)/(35-29))*(35-tj);
	  return phi_tj
	};

	power =  function(p_35, p_29, tj){
	  // for full, half and min powers
	  p_tj = p_35 + ((p_29 - p_35)/(35-29))*(35-tj);
	  return p_tj
	};

	coolingLoad = function(phiFull_t100, tj, t0, t100){
	  // t0 = 20 celsius degree and t100 = 35 celsius degree
	  lc_tj = phiFull_t100*(tj-t0)/(t100-t0);
	  return lc_tj
	};

	var phiFull = Array(temp.length);
	var phiHalf = Array(temp.length);
	var pFull = Array(temp.length);
	var pHalf = Array(temp.length);
	var lc = Array(temp.length);
	for(var i in temp){
	  phiFull[i] = capacity(phiFull35, phiFull29, temp[i]);
	  phiHalf[i] = capacity(phiHalf35, phiHalf29, temp[i]);
	  pFull[i] = capacity(pFull35, pFull29, temp[i]);
	  pHalf[i] = capacity(pHalf35, pHalf29, temp[i]);
	  lc[i] = coolingLoad(phiFull35, temp[i], t0, t100);
	};

	var p = Array(temp.length);
	for(var i in temp){
	  if (lc[i] <= phiHalf[i]) {
		p[i] = pHalf[i]
	  } else if (lc[i] <= phiFull[i]) {
		p[i] = lc[i]/(EERhaf_tc+(temp[i]-tc)*(EERful_tb-EERhaf_tc)/(tb-tc))
	  } else {
		p[i] = pFull[i]
	  }
	}

	var x = Array(temp.length);
	for(var i in temp){
	  if (temp[i] <= 0) {
		x[i] = 0
	  } else if (temp[i] <= phiFull[i]) {
		x[i] = lc[i]/phiHalf[i]
	  } else {
		x[i] = 1
	  }
	}

	var xhalf = Array(temp.length);
	for(var i in temp){
	  xhalf[i] = (phiFull[i]-lc[i])/(phiFull[i]-phiHalf[i])
	}

	var fpl = Array(temp.length);
	for(var i in temp){
	  if (lc[i] <= phiHalf[i]) {
		fpl[i] = 1 - 0.25*(1-x[i])
	  } else {
		fpl[i] = 1
	  }
	}

	var lcst = Array(temp.length);
	for(var i in temp){
	  if (lc[i] <= phiFull[i]) {
		lcst[i] = lc[i]*bins[i]
	  } else {
		lcst[i] = phiFull[i]*bins[i]
	  }
	}

	var ccse = Array(temp.length);
	for(var i in temp){
	  if (lc[i] <= phiHalf[i]) {
		ccse[i] = x[i]*pHalf[i]*bins[i]/fpl[i]
	  } else {
		ccse[i] = p[i]*bins[i]
	  }
	}

	var eert = Array(temp.length);
	for (var i=0; i < ccse.length; i++){
		eert[i] =lcst[i]/ccse[i];
	}

	function sum(total, num) {
	  return total + num;
	}

	cstlFinal = lcst.reduce(sum, 0)
	ccseFinal= ccse.reduce(sum, 0)
	CSPF = cstlFinal/ccseFinal

	document.getElementById("resultado").innerHTML = "The CSPF is " + String(CSPF.toFixed(2));
	
	graph();

}

function main(){
	calculateBins(contents);
	calculateCSPF(temperatureBins);
}

window.onload = function what(){

	document.getElementById('inputGroupFile01').addEventListener('change', read_epw, false);
	
};
