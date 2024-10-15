export function monthlyEffectiveRate(annualRate: number) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

export function discountFactor(i: number) {
  return 1 / (1 + i);
}

export function presentValue(amount: number, i: number, n: number) {
  const v = discountFactor(i);
  return amount * Math.pow(v, n);
}

export function futureValue(amount: number, i: number, n: number) {
  return amount * Math.pow(1 + i, n);
}

export function annuityFactor(n: number, i: number, arrears = false) {
  const v = discountFactor(i);
  const d = 1 - v;

  if (arrears) {
    return (1 - v ** n) / i;
  } else {
    return (1 - v ** n) / d;
  }
}
