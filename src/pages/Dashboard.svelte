<script lang="ts">
  import axios from "../lib/axios";
  import StatisticsCard from "../components/StatisticsCard.svelte";

  let requests: Record<string, number> = {};
  let success: Record<string, number> = {};
  let responseTime: Record<string, number> = {};

  axios.get("/health/requests").then(({ data }) => (requests = data));
  axios.get("/health/success").then(({ data }) => (success = data));
  axios.get("/health/responseTime").then(({ data }) => (responseTime = data));
  axios.get("/health/chart").then(({ data }) => {
    // @ts-ignore
    new Chart(document.getElementById("myChart").getContext("2d"), {
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
      <StatisticsCard title="Number of Requests" value={requests} />
      <StatisticsCard title="Success Rate" value={success} />
      <StatisticsCard title="Avg. Response Time" value={responseTime} />
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
