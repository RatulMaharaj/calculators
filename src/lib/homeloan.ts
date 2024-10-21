export const VAT = 0.15;

export const bankAdminFee = 5250 * (1 + VAT);

const deedsOfficeFees = [
  { maxAmount: 150000, fee: 527.0 },
  { maxAmount: 300000, fee: 682.0 },
  { maxAmount: 600000, fee: 850.0 },
  { maxAmount: 800000, fee: 1196.0 },
  { maxAmount: 1000000, fee: 1374.0 },
  { maxAmount: 2000000, fee: 1544.0 },
  { maxAmount: 4000000, fee: 2140.0 },
  { maxAmount: 6000000, fee: 2596.0 },
  { maxAmount: 8000000, fee: 3092.0 },
  { maxAmount: 10000000, fee: 3615.0 },
  { maxAmount: 15000000, fee: 4303.0 },
  { maxAmount: 20000000, fee: 5169.0 },
  { maxAmount: 30000000, fee: 6024.0 },
  { maxAmount: Infinity, fee: 8608.0 }, // For amounts exceeding 30,000,000
];

export function getDeedsOfficeFee(amount: number) {
  const config = deedsOfficeFees.find((item) => amount <= item.maxAmount);
  return config ? config.fee : null;
}

export function getTransferDuty(purchasePrice: number) {
  if (purchasePrice <= 1100000) {
    return 0;
  } else if (purchasePrice <= 1512500) {
    return (purchasePrice - 1100000) * 0.03;
  } else if (purchasePrice <= 2117500) {
    return 12375 + (purchasePrice - 1512500) * 0.06;
  } else if (purchasePrice <= 2722500) {
    return 48675 + (purchasePrice - 2117500) * 0.08;
  } else if (purchasePrice <= 12100000) {
    return 97075 + (purchasePrice - 2722500) * 0.11;
  } else {
    return 1128600 + (purchasePrice - 12100000) * 0.13;
  }
}

export function getAttorneyTransferFee(purchasePrice: number) {
  if (purchasePrice <= 100000) {
    return 6435;
  } else if (purchasePrice <= 500000) {
    const extraAmount = purchasePrice - 100000;
    return 6435 + Math.ceil(extraAmount / 50000) * 1025;
  } else if (purchasePrice <= 1000000) {
    const extraAmount = purchasePrice - 500000;
    return 14635 + Math.ceil(extraAmount / 100000) * 1985;
  } else if (purchasePrice <= 5000000) {
    const extraAmount = purchasePrice - 1000000;
    return 24560 + Math.ceil(extraAmount / 200000) * 1985;
  } else {
    const extraAmount = purchasePrice - 5000000;
    return 64260 + Math.ceil(extraAmount / 1000000) * 5000;
  }
}
