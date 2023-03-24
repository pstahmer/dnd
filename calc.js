/**
 * functionComment - description
 *
 * @param  {type} argA description
 * @param  {type} argB description
 * @param  {type} argC description
 * @return {type}      description
 */
var calculate = (target, modifier, count) => {
  var roll = (target, modifier, advantage = false) => {
    const r1 = Math.trunc(Math.random() * 20) + 1;
    const r2 = Math.trunc(Math.random() * 20) + 1;
    const roll = advantage ? Math.max(r1, r2) : r2;
    const total = roll + modifier;
    return total >= target;
  };

  var results = [];
  var advResults = [];
  for (let i = 0; i < count; i++) {
    results.push(roll(target, modifier, false));
    advResults.push(roll(target, modifier, true));
  }

  var percent = results.reduce((a, b) => +a + b) / count * 100;
  var advPercent = advResults.reduce((a, b) => +a + b) / count * 100;
  console.log(`Pass percent: ${percent.toFixed(2)}`);
  console.log(`Pass percent with Advantage: ${advPercent.toFixed(2)}`);
  return {
    pass: percent,
    advPass: advPercent
  };
};

calculate(15, 2, 100000)
calculate()
