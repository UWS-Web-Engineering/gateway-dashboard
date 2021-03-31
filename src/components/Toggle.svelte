<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import classnames from "classnames";
  export let value: boolean;
  export let label = "";
</script>

<div>
  {#if label}
    <div class="block text-sm font-medium text-gray-700">{label}</div>
  {/if}
  <button
    type="button"
    class={classnames(
      "mt-1 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
      {
        "bg-gray-200": !value,
        "bg-indigo-600": value,
      }
    )}
    aria-pressed="false"
    on:click={() => (value = !value)}
  >
    <span class="sr-only">Use setting</span>
    <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
    <span
      aria-hidden="true"
      class={classnames(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
        {
          "translate-x-0": !value,
          "translate-x-5": value,
        }
      )}
    />
  </button>
</div>
