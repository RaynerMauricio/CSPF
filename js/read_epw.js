function range(start, end) {
    var total = [];

    if (!end) {
        end = start;
        start = 0;
    }

    for (var i = start; i < end; i += 1) {
        total.push(i);
    }

    return total;
}

function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}

function splitRows(contents){

  for(var i in contents){
    contents[i] = contents[i].split(',')
  }

  return contents

}

function filterBy(a, h, hF){

	var temperatureFiltered = [];
	var temperatureNonFiltered = [];

	for(let i in a){
		if (hF.includes(h[i])){
			temperatureFiltered.push(a[i])
		} else {
			temperatureNonFiltered.push(a[i])
		}
	}
	return [temperatureFiltered, temperatureNonFiltered]
}

function read_epw(event) {

  var file = event.target.files[0];
  window.file = file;

  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;

    contents = contents.split('\n');
    contents = contents.slice(8,contents.length-1);

    contents = splitRows(contents);
    contents = transpose(contents);
    contents[3] = contents[3].map(Number); // hour
    contents[6] = contents[6].map(Number).map(function (x) { return parseInt(x, 10);});  // dry bulb temperature
    contents[13] = contents[13].map(Number); // global horizontal radiation
    window.contents = contents
  }

  document.getElementById('textSelectEpw').innerText = document.getElementById("epwupload").files[0].name
  reader.readAsText(file);

}

function calculateBins(contents){

  operatingHours = document.getElementById('operatingHours').value
  window.operatingHours = operatingHours;

  var hourTemp;
	var tempTemp;
	var radTemp;

	hourTemp = contents[3];
	tempTemp = contents[6];
	radTemp = contents[13];

	if(operatingHours == 'night'){

		hourTemp = filterBy(hourTemp, radTemp, [0])[0]
		tempTemp = filterBy(tempTemp, radTemp, [0])[0]
		radTemp = filterBy(radTemp, radTemp, [0])[0]

	} else if(operatingHours == 'day'){

			hourTemp = filterBy(hourTemp, radTemp, [0])[1]
			tempTemp = filterBy(tempTemp, radTemp, [0])[1]
			radTemp = filterBy(radTemp, radTemp, [0])[1]

	}

  referenceBins = range(21,50)
  temperatureBins = Array(referenceBins.length).fill(0);

  for(var i in temperatureBins){

    realTemperature = tempTemp.filter(function(number) {return number == referenceBins[i]});
    temperatureBins[i] = realTemperature.length

    factor = (referenceBins[i]-20)/(33 - 20)

    if (factor > 1){
      factor = 1
    }

    temperatureBins[i] *= factor

   }

  //window.referenceBins = referenceBins
  //window.temperatureBins = temperatureBins.map(Math.round)

  return temperatureBins.map(Math.round)

}
