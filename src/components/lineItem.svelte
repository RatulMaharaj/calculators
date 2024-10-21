<script lang="ts">
  import { formatCurrency } from "../lib/format";
  import { twMerge } from "tailwind-merge";
  export let label: str = "";
  export let amount: number;
  export let classes: str = "";
</script>

<div class={twMerge("w-full justify-between flex text-xs mt-2", classes)}>
  <span>{label}</span>
  {#if amount !== undefined}
    <span>{formatCurrency(amount)}</span>
  {/if}
</div>
