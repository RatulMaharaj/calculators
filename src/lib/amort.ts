import { annuityFactor, monthlyEffectiveRate } from "./actuarial";

export function calculateRepayment({
  purchaseAmount,
  depositAmount,
  paymentTerm,
  balloonRate,
  interestRate,
  includeInitiationFee = true,
  includeMonthlyFee = true,
  payInArrears = false,
}: {
  purchaseAmount: number;
  depositAmount: number;
  balloonRate: number;
  paymentTerm: number;
  interestRate: number;
  includeInitiationFee?: boolean;
  includeMonthlyFee?: boolean;
  payInArrears?: boolean;
}) {
  // credit act fees
  const initiationFee = includeInitiationFee ? 1207.5 : 0;
  const monthlyFee = includeMonthlyFee ? 69 : 0;

  const loanAmount = purchaseAmount - depositAmount + initiationFee;
  // amount payable at the end of the term
  const balloonAmountPayable = (balloonRate / 100) * purchaseAmount;

  const {
    annualEffectiveInterestRate,
    monthlyEffectiveInterestRate,
    monthlyAccumulationFactor,
    monthlyDiscountFactor,
    termAccumulationFactor,
    termDiscountFactor,
  } = getMonthlyRatesAndFactors(interestRate, paymentTerm);

  let installment =
    (loanAmount - balloonAmountPayable * termDiscountFactor) /
    annuityFactor(paymentTerm, monthlyEffectiveInterestRate, payInArrears);

  const totalPayable = installment * paymentTerm + balloonAmountPayable;
  const totalInterestPayable =
    installment * paymentTerm + balloonAmountPayable - loanAmount;

  const schedule = createAmortizationSchedule({
    paymentTerm,
    loanAmount,
    monthlyEffectiveInterestRate,
    installment,
    balloonAmountPayable,
  });

  return {
    loanAmount,
    balloonAmountPayable,
    installment: installment + monthlyFee,
    totalInterestPayable,
    totalPayable,
    totalFeesPayable: initiationFee + monthlyFee * paymentTerm,
    annualEffectiveInterestRate,
    monthlyEffectiveInterestRate,
    monthlyAccumulationFactor,
    monthlyDiscountFactor,
    termAccumulationFactor,
    termDiscountFactor,
    schedule,
  };
}

export function getMonthlyRatesAndFactors(i: number, n: number) {
  const annualEffectiveInterestRate = i / 100;

  // Monthly effective interest rate
  const monthlyEffectiveInterestRate = monthlyEffectiveRate(
    annualEffectiveInterestRate
  );

  // Monthly accumulation factor
  const monthlyAccumulationFactor = 1 + monthlyEffectiveInterestRate;

  // Monthly discount factor
  const monthlyDiscountFactor = 1 / monthlyAccumulationFactor;

  const termAccumulationFactor = Math.pow(monthlyAccumulationFactor, n);
  const termDiscountFactor = 1 / termAccumulationFactor;

  return {
    annualEffectiveInterestRate,
    monthlyEffectiveInterestRate,
    monthlyAccumulationFactor,
    monthlyDiscountFactor,
    termAccumulationFactor,
    termDiscountFactor,
  };
}

export function createAmortizationSchedule({
  paymentTerm,
  loanAmount,
  monthlyEffectiveInterestRate,
  installment,
  balloonAmountPayable,
}: {
  paymentTerm: number;
  loanAmount: number;
  monthlyEffectiveInterestRate: number;
  installment: number;
  balloonAmountPayable: number;
}) {
  const schedule = [];
  let remainingBalance = loanAmount;

  for (let month = 1; month <= paymentTerm; month++) {
    const interestPayment = remainingBalance * monthlyEffectiveInterestRate;
    const principalPayment = installment - interestPayment;
    remainingBalance -= principalPayment;

    schedule.push({
      month,
      interestPayment,
      principalPayment,
      remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
    });
  }

  // Add balloon payment at the end of the term
  if (balloonAmountPayable > 0) {
    schedule.push({
      month: paymentTerm + 1,
      interestPayment: 0,
      principalPayment: balloonAmountPayable,
      remainingBalance: 0,
    });
  }

  return schedule;
}
