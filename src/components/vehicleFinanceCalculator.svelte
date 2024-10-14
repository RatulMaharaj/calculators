<script lang="ts">
  let purchaseAmount = 350_000;
  let depositAmount = 10_000;
  let paymentTerm = 72;
  let balloonAmount = 0;
  let primeinterestRate = 11.5;
  let interestRate = 11.5;

  function calculateRepayment(
    purchaseAmount,
    depositAmount,
    paymentTerm,
    balloonAmount,
    interestRate
  ) {
    // Loan principal (purchase amount minus deposit amount)
    let loanAmount = purchaseAmount - depositAmount;

    // Monthly interest rate
    let monthlyInterestRate = interestRate / 100 / 12;

    // Calculate monthly payment using the amortization formula
    let monthlyPayment =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, paymentTerm)) /
      (Math.pow(1 + monthlyInterestRate, paymentTerm) - 1);

    return monthlyPayment.toFixed(2); // Return the payment amount rounded to 2 decimal places
  }

  let repaymentAmount = calculateRepayment(
    purchaseAmount,
    depositAmount,
    paymentTerm,
    balloonAmount,
    interestRate
  );

  $: {
    repaymentAmount = calculateRepayment(
      purchaseAmount,
      depositAmount,
      paymentTerm,
      balloonAmount,
      interestRate
    );
  }
</script>

<div class="flex flex-col gap-y-2 w-full sm:max-w-md">
  <h1 class="text-center text-3xl font-bold">Vehicle Finance Calculator 🚗</h1>
  <h2 class="text-center -mt-2">Estimate your monthly loan repayments</h2>
  <br />
  <label class="flex flex-col gap-2">
    <span>Purchase Amount</span>
    <input
      type="text"
      placeholder="Purchase Amount"
      class="input input-bordered"
      bind:value={purchaseAmount}
    />
  </label>
  <label class="flex flex-col gap-2">
    <span>Deposit Amount</span>
    <input
      type="text"
      placeholder="Deposit Amount"
      class="input input-bordered"
      bind:value={depositAmount}
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between">
      <span>Payment Term</span>
      <span>{paymentTerm} months</span>
    </span>
    <input
      type="range"
      min="0"
      max="96"
      step="12"
      bind:value={paymentTerm}
      class="range w-full"
    />
  </label>
  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between">
      <span>Balloon Payment</span>
      <span>{balloonAmount}%</span>
    </span>
    <input
      type="range"
      min="0"
      max="35"
      step="5"
      bind:value={balloonAmount}
      class="range w-full"
    />
  </label>
  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between">
      <span>Interest Rate</span>
      <span>{interestRate}%</span>
    </span>
    <input
      type="range"
      min={primeinterestRate - 4}
      max={primeinterestRate + 4}
      step={0.25}
      bind:value={interestRate}
      class="range w-full"
    />
  </label>

  <div class="stats shadow mt-4">
    <div class="stat">
      <div class="stat-title">Estimate monthly repayment</div>
      <div class="stat-value">{repaymentAmount}</div>
      <div class="stat-desc">21% more than last month</div>
    </div>
  </div>
</div>
