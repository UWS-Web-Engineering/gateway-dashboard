<script lang="ts">
  export let title: string;
  export let value: Record<string, number>;
  export let prefix: string = "";
  export let suffix: string = "";
  export let reverseStatus: boolean = false;
</script>

<div class="px-4 py-5 sm:p-6">
  <dt class="text-base font-normal text-gray-900">{title}</dt>
  <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
    <div class="flex items-baseline text-2xl font-semibold text-indigo-140">
      {prefix}{value["7days"]}{suffix}
      <span class="ml-2 text-sm font-medium text-gray-500">
        from {prefix}{value["14days"]}{suffix}
      </span>
    </div>

    {#if (!reverseStatus && value["7days"] > value["14days"]) || (reverseStatus && value["7days"] < value["14days"])}
      <div
        class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 md:mt-2 lg:mt-0"
      >
        <svg
          class="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only"> Increased by </span>
        {#if value["14days"] === 0}
          100%
        {:else}
          {Math.abs(
            ((value["7days"] - value["14days"]) / value["14days"]) * 100
          )}%
        {/if}
      </div>
    {:else if value["7days"] === value["14days"]}
      <div
        class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 md:mt-2 lg:mt-0"
      >
        -
      </div>
    {:else}
      <div
        class="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 md:mt-2 lg:mt-0"
      >
        <svg
          class="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only"> Decreased by </span>
        {#if value["14days"] === 0}
          100%
        {:else}
          {Math.abs(
            ((value["7days"] - value["14days"]) / value["14days"]) * 100
          )}%
        {/if}
      </div>
    {/if}
  </dd>
</div>
