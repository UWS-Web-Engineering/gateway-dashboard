<script lang="ts">
  import { useParams, navigate } from "svelte-navigator";
  import classnames from "classnames";

  import axios from "../../lib/axios";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import Spinner from "../../components/Spinner.svelte";
  import Button from "../../components/Button.svelte";
  import StatisticsCard from "../../components/StatisticsCard.svelte";

  const params = useParams();

  let loading = true;
  let deleting = false;
  let updating = false;
  let service;
  let target = "";
  let gateway = "";
  let requests: Record<string, number> = {};
  let success: Record<string, number> = {};
  let responseTime: Record<string, number> = {};

  function getCharElm() {
    return new Promise((resolve) => {
      const elm = document.getElementById("myChart");
      if (!elm) {
        setTimeout(() => {
          resolve(getCharElm());
        }, 100);
        return;
      }

      // @ts-ignore
      resolve(elm.getContext("2d"));
    });
  }

  async function loadChart(data: any) {
    // @ts-ignore
    new Chart(await getCharElm(), {
      type: "line",
      data: {
        labels: Object.keys(data.total).reverse(),
        datasets: [
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
  }

  Promise.all([
    axios
      .get(`/health/requests/${$params.id}`)
      .then(({ data }) => (requests = data)),
    axios
      .get(`/health/success/${$params.id}`)
      .then(({ data }) => (success = data)),
    axios
      .get(`/health/responseTime/${$params.id}`)
      .then(({ data }) => (responseTime = data)),
    axios.get(`/service/${$params.id}`).then(({ data }) => {
      service = data;
      target = `${service.url}`;
      gateway = `${process.env.API_URL}/${service.key}`;
    }),
  ])
    .then(() =>
      axios.get(`/health/chart/${$params.id}`).then(({ data }) => {
        loadChart(data);
      })
    )
    .finally(() => (loading = false));

  async function handleDelete() {
    deleting = true;
    await axios.delete(`/service/${$params.id}`);
    deleting = false;
    navigate("/services");
  }

  async function handleStatusToggle() {
    updating = true;
    await axios
      .put(`/service/${$params.id}`, {
        ...service,
        active: !service.active,
      })
      .then(({ data }) => {
        service = data;
        target = `${service.url}`;
        gateway = `${process.env.API_URL}/${service.key}`;
      });
    updating = false;
  }

  async function handlePrivateToggle() {
    updating = true;
    await axios
      .put(`/service/${$params.id}`, {
        ...service,
        active: !service.active,
      })
      .then(({ data }) => {
        service = data;
        target = `${service.url}`;
        gateway = `${process.env.API_URL}/${service.key}`;
      });
    updating = false;
  }

</script>

<main>
  <SectionHeader
    title={service?.name}
    actions={[{ text: "View logs", to: `/logs/${$params.id}` }]}
  />

  {#if loading}
    <Spinner className="w-10 h-10 text-indigo-500 mx-auto mt-8" />
  {:else}
    <div class="flex space-x-4">
      <div class="flex flex-col space-y-4 py-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Service Information
        </h3>
        <div>
          <div class="capitalize mr-2 text-gray-500 text-sm">Status:</div>
          <div
            class={classnames({
              "text-green-500": service.active,
              "text-red-500": !service.active,
            })}
          >
            {service.active ? "Active" : "Offline"}
          </div>
        </div>
        <div>
          <div class="capitalize mr-2 text-gray-500 text-sm">Name:</div>
          <div class="text-gray-900">{service.name}</div>
        </div>
        <div>
          <div class="capitalize mr-2 text-gray-500 text-sm">Description:</div>
          <div class="text-gray-900">{service.description || "N/A"}</div>
        </div>
        <div>
          <div class="capitalize mr-2 text-gray-500 text-sm">Target:</div>
          <div class="text-gray-900">
            <a href={target} class="text-indigo-500 hover:text-indigo-700"
              >{target}</a
            >
          </div>
        </div>
        <div>
          <div class="capitalize mr-2 text-gray-500 text-sm">Gateway:</div>
          <div class="text-gray-900">
            <a href={gateway} class="text-indigo-500 hover:text-indigo-700">
              {gateway}</a
            >
          </div>
        </div>
        <div class="flex space-x-2">
          <Button
            text={service.active ? "Deactivate service" : "Activate service"}
            className="w-atuo"
            loading={updating}
            on:click={handleStatusToggle}
          />
          <Button
            text={service.private ? "Make public" : "Make private"}
            className="w-atuo"
            loading={updating}
            on:click={handlePrivateToggle}
          />
          <Button
            text="Delete service"
            variant="danger"
            className="w-atuo"
            loading={deleting}
            on:click={handleDelete}
          />
        </div>
      </div>

      <div class="flex-1 border-l pl-4 flex flex-col">
        <div class="mt-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Last 7 days
          </h3>
          <dl
            class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200"
          >
            <StatisticsCard title="Number of Requests" value={requests} />
            <StatisticsCard title="Success Rate" value={success} suffix="%" />
            <StatisticsCard
              title="Avg. Response Time"
              value={responseTime}
              suffix=" ms"
              reverseStatus
            />
          </dl>
        </div>
        <div class="mt-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Number of Request in the last 14 days
          </h3>
          <div
            class="mt-5 rounded-lg bg-white overflow-hidden shadow flex-grow p-2"
          >
            <canvas id="myChart" />
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
