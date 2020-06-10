// by AurekFonts

const onControlChange = (controlId, imageId) => {
  const value = document.getElementById(controlId).value;
  if ((value && !isNaN(value) && value >= -10 && value <= 10) || value === 0) {
    const valueCorrected = Math.floor(value);
    document.getElementById(controlId).value = valueCorrected;
    if (valueCorrected === 0) {
      return updateImage(imageId, 'sylop', 'card-reg');
    } else if (valueCorrected < 0) {
      return updateImage(imageId, valueCorrected, 'card-reg');
    } else if (valueCorrected > 0) {
      return updateImage(imageId, `+${valueCorrected}`, 'card-reg');
    }
    document.getElementById(controlId).value = null;
  }
  document.getElementById(controlId).value = null;
  return updateImage(imageId, 'back', 'card-reg optional');
}

const onControlSubmit = () => {
  const controlsArray = controlsToArray();
  console.log(controlsArray);
  console.log(score(controlsArray));
  displayScore(score(controlsArray));
}

const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{2})+(?!\d))/g, "-");
}

displayScore = (score) => {
  document.getElementById('name-line').innerHTML = score.name;
  document.getElementById('rank-line').innerHTML = numberWithCommas(score.rank);
}

const updateImage = (imageId, newImageName, className) => {
  document.getElementById(imageId).src = `assets/images/cards-small/${newImageName}.png`;
  document.getElementById(imageId).className = className;
}

const controlsToArray = () => {
  const controlsArrayUnfiltered = [
    parseInt(document.getElementById('control-0').value),
    parseInt(document.getElementById('control-1').value),
    parseInt(document.getElementById('control-2').value),
    parseInt(document.getElementById('control-3').value),
    parseInt(document.getElementById('control-4').value),
  ];
  const controlsArray = controlsArrayUnfiltered.filter((value) => {
    if (isNaN(value)) return false;
    return true;
  });
  return controlsArray;
};

const score = (hand) => {
  const score = {
    name: undefined,
    rank: '00000000000000000000',
    rankInt: 0,
  };

  if (hand.length < 2) {
    score.name = 'Not Enough Cards';
    return score;
  }

  if (hand.length > 5) {
    score.name = 'Too Many Cards';
    return score;
  }

  // const hand = hand.map(card => card.value);
  hand.sort((a, b) => (a-b));
  const sum = hand.reduce((currentSum, value) => currentSum + value, 0);

  const criteria = {
    isSabacc: sum === 0 ? 1 : 0,
    sabaccBonus: 0,
    pairBonus: 0,
    secondPairBonus: 0,
    runBonus: 0,
    nulhrekBonus: 48 - Math.abs(sum),
    isPositive: sum > 0 ? 1 : 0,
    numberOfCards: hand.length,
    positiveSum: hand.reduce((currentSum, value) => (value > 0) ? currentSum + value : currentSum, 0),
    highestPositiveCard: hand[hand.length - 1] > 0 ? hand[hand.length - 1] : 0,
  };
  
  if (criteria.isSabacc) {
    const sabaccValues = hand.map(card => Math.abs(card));
    const frequencies = sabaccValues.reduce((frequencyArray, value) => {
      frequencyArray[value] = frequencyArray[value] + 1;
      return frequencyArray;
    },
    [0,0,0,0,0,0,0,0,0,0,0]);

    const findRun = () => {
      for (let c = 3; c < frequencies.length; c++) {
        if (frequencies[c-3] === 1 && frequencies[c-2] === 1 && frequencies[c-1] === 1 && frequencies[c] === 1) {
          return c;
        }
      };
      return false;
    };

    if (JSON.stringify(frequencies) === '[2,0,0,0,0,0,0,0,0,0,0]') {
      score.name = `Pure Sabacc`;
      criteria.sabaccBonus = 15;
    } else if (JSON.stringify(frequencies) === '[1,0,0,0,0,0,0,0,0,0,4]') {
      score.name = `Full Sabacc`;
      criteria.sabaccBonus = 14;
    } else if (frequencies.indexOf(4) > 0 && frequencies[0] > 0) {
      score.name = `Fleet of ${frequencies.indexOf(4)}s`;
      criteria.sabaccBonus = 13;
      criteria.pairBonus = frequencies.indexOf(4);
    } else if (frequencies.indexOf(2) > 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0 && frequencies[0] > 0) {
      score.name = `Dual Power Coupling of ${frequencies.indexOf(2)}s & ${frequencies.indexOf(2, frequencies.indexOf(2) + 1)}s`;
      criteria.sabaccBonus = 12;
      criteria.pairBonus = frequencies.indexOf(2);
      criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
    } else if (frequencies.indexOf(2) > 0 && frequencies[0] > 0) {
      score.name = `Power Coupling (Yee-Haa) of ${frequencies.indexOf(2)}s`;
      criteria.sabaccBonus = 11;
      criteria.pairBonus = frequencies.indexOf(2);
      criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
    } else if (frequencies.indexOf(3) > 0 && frequencies.indexOf(2, frequencies.indexOf(3) + 1) > 0) {
      score.name = `Rhylet of ${frequencies.indexOf(3)}s & ${frequencies.indexOf(2, frequencies.indexOf(3) + 1)}s`
      criteria.sabaccBonus = 10;
      criteria.pairBonus = frequencies.indexOf(3);
      criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(3) + 1);
    } else if (JSON.stringify(frequencies) === '[0,0,0,0,0,0,0,1,1,1,1]') {
      score.name = `Straight Staves (${criteria.highestPositiveCard === 10 ? 10 : -10})`;
      criteria.sabaccBonus = 9;
    } else if (frequencies.indexOf(4) > 0) {
      score.name = `Squadron of ${frequencies.indexOf(4)}s`;
      criteria.sabaccBonus = 8;
      criteria.pairBonus = frequencies.indexOf(4);
    } else if (findRun()) {
      score.name = `Straight Khyron (${findRun()})`;
      criteria.sabaccBonus = 7;
      criteria.runBonus = 10 - findRun();
    } else if (JSON.stringify(frequencies) === '[0,1,1,1,1,0,0,0,0,0,1]') {
      score.name = `Wizard (Gee Whiz) (${criteria.highestPositiveCard === 10 ? 10 : -10})`;
      criteria.sabaccBonus = 6;
    } else if (frequencies.indexOf(3) > 0) {
      score.name = `Banthas Wild of ${frequencies.indexOf(3)}s`;
      criteria.sabaccBonus = 5;
      criteria.pairBonus = frequencies.indexOf(3);
    } else if (frequencies.indexOf(2) >= 0 && frequencies.indexOf(2, frequencies.indexOf(2) + 1) > 0){
      score.name = `Dual Pair Sabacc (${frequencies.indexOf(2)}s & ${frequencies.indexOf(2, frequencies.indexOf(2) + 1)}s)`;
      criteria.sabaccBonus = 4;
      criteria.pairBonus = frequencies.indexOf(2);
      criteria.secondPairBonus = frequencies.indexOf(2, frequencies.indexOf(2) + 1);
    } else if (frequencies.indexOf(2) >= 0) {
      score.name = `Single Pair Sabacc (${frequencies.indexOf(2)}s)`;
      criteria.sabaccBonus = 3;
      criteria.pairBonus = frequencies.indexOf(2);
    } else {
      score.name = `Sabacc (${criteria.positiveSum})`;
      criteria.sabaccBonus = 2;
    }
  } else if (!criteria.isSabacc) {
    score.name = `Nulhrek (${sum})`;
  }
  const twoDigits = (input) => {
    return input.toString().length === 2 ? input.toString() : '0' + input.toString()
  }

  score.rank = 
    twoDigits(criteria.isSabacc) +
    twoDigits(criteria.sabaccBonus) +
    twoDigits(criteria.pairBonus) +
    twoDigits(criteria.secondPairBonus) +
    twoDigits(criteria.runBonus) +
    twoDigits(criteria.nulhrekBonus) +
    twoDigits(criteria.isPositive) +
    twoDigits(criteria.numberOfCards) +
    twoDigits(criteria.positiveSum) +
    twoDigits(criteria.highestPositiveCard);

  score.rankInt = parseInt(score.rank);

  return score;
};
