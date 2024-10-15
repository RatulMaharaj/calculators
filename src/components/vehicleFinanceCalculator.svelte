<script lang="ts">
  import { calculateRepayment, createAmortizationSchedule } from "../lib/amort";
  import { formatCurrency } from "../lib/format";

  let purchaseAmount = 350_000;
  let depositAmount = 0;
  let paymentTerm = 72;
  let balloonRate = 0;
  let primeInterestRate = 11.5;
  let interestRate = 14.5;

  // options
  let includeInitiationFee = true;
  let includeMonthlyFee = true;
  let payInArrears = false;

  let amort = calculateRepayment({
    purchaseAmount,
    depositAmount,
    paymentTerm,
    balloonRate,
    interestRate,
    includeInitiationFee,
    includeMonthlyFee,
    payInArrears,
  });

  $: {
    amort = calculateRepayment({
      purchaseAmount,
      depositAmount,
      paymentTerm,
      balloonRate,
      interestRate,
      includeInitiationFee,
      includeMonthlyFee,
      payInArrears,
    });
  }
</script>

<div class="flex flex-col gap-y-2 w-full sm:max-w-md">
  <label class="flex flex-col gap-2">
    <span class="text-xs">Purchase Amount</span>
    <input
      type="number"
      min="0"
      placeholder="Purchase Amount"
      class="input input-bordered"
      value={purchaseAmount}
      on:input={(e) => (purchaseAmount = Math.abs(e.target.value))}
    />
  </label>
  <label class="flex flex-col gap-2">
    <span class="text-xs">Deposit Amount</span>
    <input
      type="number"
      placeholder="Deposit Amount"
      class="input input-bordered"
      value={depositAmount}
      on:input={(e) =>
        (depositAmount =
          Math.abs(e.target.value) > purchaseAmount
            ? purchaseAmount
            : Math.abs(e.target.value))}
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between text-xs">
      <span>Payment Term</span>
      <span>{paymentTerm} months</span>
    </span>
    <input
      type="range"
      min="12"
      max="96"
      step="6"
      bind:value={paymentTerm}
      class="range w-full"
    />
  </label>
  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between text-xs">
      <span>Balloon Payment</span>
      <span>{balloonRate}%</span>
    </span>
    <input
      type="range"
      min="0"
      max="45"
      step="5"
      bind:value={balloonRate}
      class="range w-full"
    />
  </label>
  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between text-xs">
      <span>Interest Rate</span>
      <span>{interestRate}%</span>
    </span>
    <input
      type="range"
      min={primeInterestRate - 4}
      max={30}
      step={0.25}
      bind:value={interestRate}
      class="range w-full"
    />
  </label>

  <div class="stats bg-base-200 shadow mt-4">
    <div class="stat">
      <div class="stat-value text-center">
        {formatCurrency(amort.installment)}
      </div>
      <div class="stat-title text-sm text-center">
        Estimated monthly repayment
      </div>

      {#if amort.balloonAmountPayable > 0}
        <div
          class="w-full justify-between text-accent font-medium flex text-xs mt-4"
        >
          <span>Balloon amount payable after {paymentTerm} months</span>
          <span>{formatCurrency(amort.balloonAmountPayable)}</span>
        </div>
      {/if}
      <div class="w-full justify-between flex text-xs mt-2">
        <span>Total amount repayable</span>
        <span>{formatCurrency(amort.totalPayable)}</span>
      </div>
      <div class="w-full justify-between flex font-bold text-xs mt-1">
        <span>Total interest payable</span>
        <span>{formatCurrency(amort.totalInterestPayable)}</span>
      </div>
      <div class="w-full justify-between flex text-xs mt-1">
        <span>Total fees payable</span>
        <span>{formatCurrency(amort.totalFeesPayable)}</span>
      </div>
    </div>
  </div>
  <div class="form-control mt-4">
    <label class="label cursor-pointer">
      <span class="label-text text-xs"
        >Finance initiation fee of {formatCurrency(1207.5)}</span
      >
      <input
        type="checkbox"
        class="toggle toggle-accent"
        bind:checked={includeInitiationFee}
      />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text text-xs"
        >Include monthly fee of {formatCurrency(69)}</span
      >
      <input
        type="checkbox"
        class="toggle toggle-accent"
        bind:checked={includeMonthlyFee}
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text text-xs">Payments in arrears</span>
      <input
        type="checkbox"
        class="toggle toggle-accent"
        bind:checked={payInArrears}
      />
    </label>
  </div>
</div>
