<script lang="ts">
  import { onMount } from "svelte";

  import axios from "../lib/axios";

  let requests: Record<string, number> = {};
  let success: Record<string, number> = {};
  let responseTime: Record<string, number> = {};
  let ctx;

  onMount(() => {
    // @ts-ignore
    ctx = document.getElementById("myChart").getContext("2d");
  });

  axios.get("/health/requests").then(({ data }) => (requests = data));
  axios.get("/health/success").then(({ data }) => (success = data));
  axios.get("/health/responseTime").then(({ data }) => (responseTime = data));
  axios.get("/health/chart").then(({ data }) => {
    // @ts-ignore
    new Chart(ctx, {
      type: "line",
      data: {
        labels: Object.keys(data.total).reverse(),
        datasets: [
          {
            label: "Failed",
            backgroundColor: "#FCA5A5",
            borderColor: "#EF4444",
            data: Object.values(data.failed).reverse(),
          },
          {
            label: "Success",
            backgroundColor: "#6EE7B7",
            borderColor: "#10B981",
            data: Object.values(data.success).reverse(),
          },
          {
            label: "Requests",
            backgroundColor: "#A5B4FC",
            borderColor: "#6366F1",
            data: Object.values(data.total).reverse(),
          },
        ],
      },

      // Configuration options go here
      options: {
        scales: {
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
            },
          ],
        },
      },
    });
  });
</script>

<main class="flex flex-col space-y-8">
  <div>
    <h3 class="text-lg leading-6 font-medium text-gray-900">Last 7 days</h3>
    <dl
      class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x"
    >
      <div class="px-4 py-5 sm:p-6">
        <dt class="text-base font-normal text-gray-900">Number of Requests</dt>
        <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div
            class="flex items-baseline text-2xl font-semibold text-indigo-140"
          >
            {requests["7days"]}
            <span class="ml-2 text-sm font-medium text-gray-500">
              from {requests["14days"]}
            </span>
          </div>

          {#if requests["7days"] > requests["14days"]}
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
              {#if requests["14days"] === 0}
                100%
              {:else}
                {Math.abs(
                  ((requests["7days"] - requests["14days"]) /
                    requests["14days"]) *
                    100
                )}%
              {/if}
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
              {#if requests["14days"] === 0}
                100%
              {:else}
                {Math.abs(
                  ((requests["7days"] - requests["14days"]) /
                    requests["14days"]) *
                    100
                )}%
              {/if}
            </div>
          {/if}
        </dd>
      </div>

      <div class="px-4 py-5 sm:p-6">
        <dt class="text-base font-normal text-gray-900">Success Rate</dt>
        <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div
            class="flex items-baseline text-2xl font-semibold text-indigo-140"
          >
            {success["7days"]}%
            <span class="ml-2 text-sm font-medium text-gray-500">
              from {success["14days"]}%
            </span>
          </div>

          {#if success["7days"] > success["14days"]}
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
              {#if success["14days"] === 0}
                100%
              {:else}
                {Math.abs(
                  ((success["7days"] - success["14days"]) / success["14days"]) *
                    100
                )}%
              {/if}
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
              {#if success["14days"] === 0}
                100%
              {:else}
                {Math.abs(
                  ((success["7days"] - success["14days"]) / success["14days"]) *
                    100
                )}%
              {/if}
            </div>
          {/if}
        </dd>
      </div>

      <div class="px-4 py-5 sm:p-6">
        <dt class="text-base font-normal text-gray-900">Avg. Response Time</dt>
        <dd class="mt-1 flex justify-between items-baseline md:block lg:flex">
          <div
            class="flex items-baseline text-2xl font-semibold text-indigo-140"
          >
            {responseTime["7days"]} ms
            <span class="ml-2 text-sm font-medium text-gray-500">
              from {responseTime["14days"]} ms
            </span>
          </div>
          {#if responseTime["7days"] < responseTime["14days"]}
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
              {#if responseTime["14days"] === 0}
                100%
              {:else}
                {Math.abs(
                  ((responseTime["7days"] - responseTime["14days"]) /
                    responseTime["14days"]) *
                    100
                )}%
              {/if}
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
              {#if responseTime["14days"] === 0}
                100%
              {:else}
                {Math.abs(
                  ((responseTime["7days"] - responseTime["14days"]) /
                    responseTime["14days"]) *
                    100
                )}%
              {/if}
            </div>
          {/if}
        </dd>
      </div>
    </dl>
  </div>
  <div class="flex-grow flex flex-col">
    <h3 class="text-lg leading-6 font-medium text-gray-900">
      Number of Request in the last 14 days
    </h3>
    <div class="mt-5 rounded-lg bg-white overflow-hidden shadow flex-grow p-2">
      <canvas id="myChart" />
    </div>
  </div>
</main>
