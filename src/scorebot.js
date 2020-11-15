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
  console.log(scoreHand(controlsArray));
  displayScore(scoreHand(controlsArray));
}

const onControlClear = () => {
  document.getElementById('control-0').value = null;
  document.getElementById('control-1').value = null;
  document.getElementById('control-2').value = null;
  document.getElementById('control-3').value = null;
  document.getElementById('control-4').value = null;

  updateImage('hand-0', 'back', 'card-reg optional');
  updateImage('hand-1', 'back', 'card-reg optional');
  updateImage('hand-2', 'back', 'card-reg optional');
  updateImage('hand-3', 'back', 'card-reg optional');
  updateImage('hand-4', 'back', 'card-reg optional');
}

displayScore = (score) => {
  document.getElementById('name-line').innerHTML = score.name;
  document.getElementById('rank-line').innerHTML = score.rank;
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

const scoreHand = (cardValues) => {
  const score = {
    rank: undefined,
    name: undefined
  };

  const criteria = {
    isSabacc: false,
    isPureSabacc: false,
    isFullSabacc: false,
    isFleet: false,
    isDualPowerCoupling: false,
    isPowerCoupling: false,
    isRhylet: false,
    isStraightStaves: false,
    isSquadron: false,
    isStraightKhyron: false,
    isWizard: false,
    isBanthasWild: false,
    isDualSabacc: false,
    isLoneSabacc: false,
  };

  if (
    !Array.isArray(cardValues) ||
    cardValues.length < 2 ||
    cardValues.length > 5 ||
    isNaN(cardValues.reduce((a, b) => a + b))
  ) {
    score.name = cardValues.length < 2 ? `Not enough cards (${cardValues.length}).` :
      cardValues.length > 5 ? `Too many cards (${cardValues.length}).` :
      `Something went wrong.`
    return score;
  }

  // const cardValues = isolateCardValues(cardValues);
  const sum = calculateSum(cardValues);
  const positiveSum = calculatePositiveSum(cardValues);
  const highestIntegerValue = findHighestIntegerValue(cardValues);
  const frequencies = calculateFrequencies(cardValues);
  const frequenciesWide = calculateFrequenciesWide(cardValues);
  const dyads = calculateSets(frequencies, 2);
  const threats = calculateSets(frequencies, 3);
  const quads = calculateSets(frequencies, 4);
  const runs = calculateRuns(frequencies);

  const vec = {
    sum,
    size: cardValues.length,
    positiveSum,
    highestIntegerValue,
    frequencies,
    frequenciesWide,
    dyads,
    threats,
    quads,
    runs,
  };

  criteria.isSabacc = sum === 0;

  if (criteria.isSabacc) {

    criteria.isPureSabacc = isPureSabacc(vec);
    criteria.isFullSabacc = isFullSabacc(vec);
    criteria.isFleet = isFleet(vec);
    criteria.isDualPowerCoupling = isDualPowerCoupling(vec);
    criteria.isPowerCoupling = isPowerCoupling(vec);
    criteria.isRhylet = isRhylet(vec);
    criteria.isStraightStaves = isStraightStaves(vec);
    criteria.isSquadron = isSquadron(vec);
    criteria.isStraightKhyron = isStraightKhyron(vec);
    criteria.isWizard = isWizard(vec);
    criteria.isBanthasWild = isBanthasWild(vec);
    criteria.isDualSabacc = isDualSabacc(vec);
    criteria.isLoneSabacc = isLoneSabacc(vec);
  }

  score.rank = 0;

  if (criteria.isPureSabacc) {
    score.name = `Pure Sabacc`;
    return score;
  } else {
    score.rank = score.rank + 1;
  }

  if (criteria.isFullSabacc) {
    score.name = `Full Sabacc`;
    return score;
  } else {
    score.rank = score.rank + 1;
  }

  if (criteria.isFleet) {
    score.name = `Fleet of ${vec.quads[0]}s`;
    score.rank = score.rank + (vec.quads[0] / 10) + ((5 - vec.size) / 1000) + ((20 - vec.positiveSum) / 100000) + ((10 - vec.highestIntegerValue) / 10000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isDualPowerCoupling) {
    score.name = `Dual Power Coupling of ${vec.dyads[0]}s & ${vec.dyads[1]}s`;
    score.rank = score.rank + (vec.dyads[0] / 10) + (vec.dyads[1] / 1000) + ((5 - vec.size) / 100000) + ((20 - vec.positiveSum) / 10000000) + ((10 - vec.highestIntegerValue) / 1000000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isPowerCoupling) {
    score.name = `Power Coupling (Yee-Haw) of ${vec.dyads[0]}s`;
    score.rank = score.rank + (vec.dyads[0] / 10) + ((5 - vec.size) / 1000) + ((20 - vec.positiveSum) / 100000) + ((10 - vec.highestIntegerValue) / 10000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isRhylet) {
    score.name = `Rhylet of ${vec.threats[0]}s & ${vec.dyads}s`;
    score.rank = score.rank + (vec.threats[0] / 10) + ((5 - vec.size) / 1000) + ((20 - vec.positiveSum) / 100000) + ((10 - vec.highestIntegerValue) / 10000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isStraightStaves) {
    const positive = vec.frequenciesWide[20] === 1;
    score.name = `Straight Staves (${positive ? `Positive` : `Negative`})`;
    score.rank = score.rank + (positive ? 0 : 0.5) + ((5 - vec.size) / 100);
    return score;
  } else {
    score.rank = score.rank + 1;
  }

  if (criteria.isSquadron) {
    score.name = `Squadron of ${vec.quads[0]}s`;
    score.rank = score.rank + (vec.quads[0] / 10) + ((5 - vec.size) / 1000) + ((20 - vec.positiveSum) / 100000) + ((10 - vec.highestIntegerValue) / 10000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isStraightKhyron) {
    const run = vec.runs.indexOf(4) > 0 ? vec.runs.indexOf(4) : vec.runs.indexOf(5);
    score.name = `Straight Khyron of ${run}s`;
    score.rank = score.rank + (run / 10) + ((5 - vec.size) / 1000) + ((20 - vec.positiveSum) / 100000) + ((10 - vec.highestIntegerValue) / 10000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isWizard) {
    const positive = vec.frequenciesWide[20] === 1;
    score.name = `Wizard (Gee-Whiz) (${positive ? `Positive` : `Negative`})`;
    score.rank = score.rank + (positive ? 0 : 0.5);
    return score;
  } else {
    score.rank = score.rank + 1;
  }

  if (criteria.isBanthasWild) {
    score.name = `Banthas Wild of ${vec.threats[0]}s`;
    score.rank = score.rank + (vec.threats[0] / 10) + ((5 - vec.size) / 1000) + ((10 - vec.highestIntegerValue) / 100000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isDualSabacc) {
    score.name = `Dual Sabacc (Rule of Two) of ${vec.dyads[0]}s & ${vec.dyads[1]}s`;
    score.rank = score.rank + (vec.dyads[0] / 10) + (vec.dyads[1] / 1000) + ((5 - vec.size) / 100000) + ((20 - vec.positiveSum) / 10000000) + ((10 - vec.highestIntegerValue) / 1000000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  if (criteria.isLoneSabacc) {
    score.name = `Lone Sabacc (Sabacc) of ${vec.dyads[0]}s`;
    score.rank = score.rank + (vec.dyads[0] / 10) + ((5 - vec.size) / 1000) + ((20 - vec.positiveSum) / 100000) + ((10 - vec.highestIntegerValue) / 10000000);
    return score;
  } else {
    score.rank = score.rank + 2;
  }

  // Unnamed Sabacc Hands
  if (criteria.isSabacc) {
    score.name = `Sabacc (${vec.positiveSum})`;
    score.rank = score.rank + (5 - vec.size) + ((20 - vec.positiveSum) / 100) + ((10 - vec.highestIntegerValue) / 10000);
    return score;
  } else {
    score.rank = score.rank + 4;
  }

  // Nulrhek Hands
  score.name = `Nulrhek (${vec.sum})`;
  score.rank = score.rank + Math.abs(vec.sum) + ((vec.sum > 0 ? 0 : 1) / 10) + ((5 - vec.size) / 100) + ((48 - vec.positiveSum) / 10000) + ((10 - vec.highestIntegerValue) / 1000000);
  return score;
};

// const isolateCardValues = (hand) => {
//   const unsortedValues = hand.map((card) => card.value);
//   return unsortedValues;
// };

const calculateSum = (cardValues) => {
  const sum = cardValues.reduce(
    (currentSum, currentValue) => currentSum + currentValue
  );
  return sum;
};

const calculatePositiveSum = (cardValues) => {
  const sum = cardValues.reduce(
    (currentSum, currentValue) => {
      if (currentValue > 0) {
        return currentSum + currentValue;
      }
      return currentSum;
    }
  );
  return sum;
};

const findHighestIntegerValue = (cardValues) => {
  const highestIntegerValue = Math.max(...cardValues);
  return highestIntegerValue;
}

const calculateFrequencies = (cardValues) => {
  const cardValuesAbsolute = cardValues.map((value) => Math.abs(value));
  const frequencies = cardValuesAbsolute.reduce(
    (frequenciesArray, value) => {
      frequenciesArray[value] = frequenciesArray[value] + 1;
      return frequenciesArray;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  return frequencies;
};

const calculateFrequenciesWide = (cardValues) => {
  const frequencies = cardValues.reduce(
    (frequenciesArray, value) => {
      frequenciesArray[value + 10] = frequenciesArray[value + 10] + 1;
      return frequenciesArray;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  return frequencies;
};

const calculateSets = (frequencies, setSize = 2) => {
  const sets = frequencies.reduce(
    (setsArray, frequency, value) => {
      if (frequency === setSize) {
        setsArray.push(value);
        return setsArray;
      }
      return setsArray;
    }, []
  );
  return sets;
};

const calculateRuns = (frequencies) => {
  const runs = frequencies.reduce(
    (runsArray, _frequency, value, frequenciesArray) => {
      if (
        frequenciesArray[value] &&
        !runsArray[value] &&
        !runsArray[value + 1] &&
        !runsArray[value + 2] &&
        !runsArray[value + 3] &&
        !runsArray[value + 4]
      ) {
        if (
          value < 10 &&
          frequenciesArray[value + 1] &&
          !runsArray[value + 1] &&
          !runsArray[value + 2] &&
          !runsArray[value + 3] &&
          !runsArray[value + 4]
        ) {
          if (
            value < 9 &&
            frequenciesArray[value + 2] &&
            !runsArray[value + 2] &&
            !runsArray[value + 3] &&
            !runsArray[value + 4]
          ) {
            if (
              value < 8 &&
              frequenciesArray[value + 3] &&
              !runsArray[value + 3] &&
              !runsArray[value + 4]
            ) {
              if (value < 7 && frequenciesArray[value + 4]) {
                runsArray[value + 4] = 5;
                return runsArray;
              }
              runsArray[value + 3] = 4;
              return runsArray;
            }
            runsArray[value + 2] = 3;
            return runsArray;
          }
          runsArray[value + 1] = 2;
          return runsArray;
        }
        runsArray[value] = 1;
        return runsArray;
      }
      return runsArray;
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
  return runs;
};

const isPureSabacc = (vec) => {
  return JSON.stringify(vec.frequencies) === JSON.stringify([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
};

const isFullSabacc = (vec) => {
  return JSON.stringify(vec.frequencies) === JSON.stringify([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]);
};

const isFleet = (vec) => {
  return vec.frequencies[0] === 1 && vec.quads.length;
};

const isDualPowerCoupling = (vec) => {
  return vec.frequencies[0] === 1 && vec.dyads.length === 2;
};

const isPowerCoupling = (vec) => {
  return vec.frequencies[0] > 0 && vec.dyads.length === 1;
};

const isRhylet = (vec) => {
  return vec.dyads.length && vec.threats.length && vec.frequenciesWide.indexOf(3);
};

const isStraightStaves = (vec) => {
  return JSON.stringify(vec.frequencies) === JSON.stringify([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]) || JSON.stringify(vec.frequencies) === JSON.stringify([1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]);
};

const isSquadron = (vec) => {
  return !vec.frequencies[0] && vec.quads.length;
};

const isStraightKhyron = (vec) => {
  return (vec.runs.indexOf(4) > 0 && vec.runs.indexOf(1) <= 0) || vec.runs.indexOf(5) > 0;
};

const isWizard = (vec) => {
  return vec.runs.indexOf(4) === 4 && vec.frequencies[10];
};

const isBanthasWild = (vec) => {
  return vec.threats.length > 0;
};

const isDualSabacc = (vec) => {
  return vec.dyads.length === 2;
};

const isLoneSabacc = (vec) => {
  return vec.dyads.length === 1;
};