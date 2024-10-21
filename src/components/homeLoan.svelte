<script>
  import { calculateRepayment } from "../lib/amort";
  import { formatCurrency } from "../lib/format";
  import {
    getDeedsOfficeFee,
    getTransferDuty,
    getAttorneyTransferFee,
    VAT,
    bankAdminFee,
  } from "../lib/homeloan";
  import LineItem from "./lineItem.svelte";

  let purchaseAmount = 1_500_000;
  let depositAmount = 0;
  let paymentTerm = 20;
  let primeInterestRate = 11.5;
  let interestRate = 11.75;

  // fees
  let costs = {
    bondDeedsOfficeFee: getDeedsOfficeFee(purchaseAmount),
    bondRegistrationFee: getAttorneyTransferFee(purchaseAmount),
    transferDeedsOfficeFee: getDeedsOfficeFee(purchaseAmount),
    transferDuty: getTransferDuty(purchaseAmount),
    transferFee: getAttorneyTransferFee(purchaseAmount),
    vatOnBondRegistration: getAttorneyTransferFee(purchaseAmount) * VAT,
    vatOnTransferFee: getAttorneyTransferFee(purchaseAmount) * VAT,
    bankInitiationFee: bankAdminFee,
  };

  let totalCosts = Object.values(costs).reduce((acc, val) => acc + val, 0);

  // options
  let includeInitiationFee = false;
  let includeMonthlyFee = false;
  let payInArrears = false;

  let amort = calculateRepayment({
    purchaseAmount,
    depositAmount,
    paymentTerm: paymentTerm * 12,
    balloonRate: 0,
    interestRate,
    includeInitiationFee,
    includeMonthlyFee,
    payInArrears,
  });

  $: {
    amort = calculateRepayment({
      purchaseAmount,
      depositAmount,
      paymentTerm: paymentTerm * 12,
      balloonRate: 0,
      interestRate,
      includeInitiationFee,
      includeMonthlyFee,
      payInArrears,
    });
  }

  $: {
    costs = {
      transferDeedsOfficeFee: getDeedsOfficeFee(purchaseAmount),
      bondRegistrationFee: getAttorneyTransferFee(purchaseAmount),
      transferFee: getAttorneyTransferFee(purchaseAmount),
      bondDeedsOfficeFee: getDeedsOfficeFee(purchaseAmount),
      transferDuty: getTransferDuty(purchaseAmount),
      vatOnBondRegistration: getAttorneyTransferFee(purchaseAmount) * VAT,
      vatOnTransferFee: getAttorneyTransferFee(purchaseAmount) * VAT,
      bankInitiationFee: bankAdminFee,
    };

    totalCosts = Object.values(costs).reduce((acc, val) => acc + val, 0);
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
      on:input={(e) => (purchaseAmount = Math.abs(e?.target?.value))}
    />
  </label>
  <label class="flex flex-col gap-2">
    <span class="text-xs">Deposit Amount</span>
    <input
      type="number"
      placeholder="Deposit Amount"
      class="input input-bordered"
      value={depositAmount}
      on:input={(e) => {
        depositAmount =
          Math.abs(e.target.value) > purchaseAmount
            ? purchaseAmount
            : Math.abs(e.target.value);
      }}
    />
  </label>

  <label class="flex flex-col gap-2">
    <span class="flex w-full justify-between text-xs">
      <span>Payment Term</span>
      <span>{paymentTerm} years</span>
    </span>
    <input
      type="range"
      min="0"
      max="30"
      step="5"
      bind:value={paymentTerm}
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
      <LineItem label="Total amount repayable" amount={amort.totalPayable} />
      <LineItem
        classes="font-bold"
        label="Total interest payable"
        amount={amort.totalInterestPayable}
      />
      <br />
      <LineItem label="Transfer Fees" amount={undefined} classes="underline" />
      <LineItem
        label="Deeds Office Fees"
        amount={costs.transferDeedsOfficeFee}
      />
      <LineItem label="Attorney Transfer Fees" amount={costs.transferFee} />
      <LineItem label="VAT" amount={costs.vatOnTransferFee} />
      <LineItem
        label="Total Transfer Fees"
        amount={costs.transferDeedsOfficeFee +
          costs.transferFee +
          costs.vatOnTransferFee}
      />
      <br />
      <LineItem label="Bond Fees:" amount={undefined} classes="underline" />
      <LineItem label="Deeds Office Fees" amount={costs.bondDeedsOfficeFee} />
      <LineItem
        label="Attorney Bond Registration"
        amount={costs.bondRegistrationFee}
      />
      <LineItem label="VAT" amount={costs.vatOnBondRegistration} />
      <LineItem
        label="Total Bond Registration Fees"
        amount={costs.bondDeedsOfficeFee +
          costs.bondRegistrationFee +
          costs.vatOnBondRegistration}
      />
      <br />
      <LineItem
        label="Transfer Duty (Payable to SARS)"
        amount={costs.transferDuty}
      />
      <LineItem
        label="Bank Initiation Fee (Including VAT)"
        amount={costs.bankInitiationFee}
      />
      <LineItem label="Total Fees" classes="font-bold" amount={totalCosts} />
    </div>
  </div>
  <div class="form-control mt-4">
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
