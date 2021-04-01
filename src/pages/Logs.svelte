<script lang="ts">
  import { useParams, Link } from "svelte-navigator";
  import httpStatus from "http-status";
  import classnames from "classnames";

  import axios from "../lib/axios";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Spinner from "../components/Spinner.svelte";

  const params = useParams();
  let loading = true;

  interface Logs {
    data: any[];
    from: number;
    to: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
  }

  let logs: Logs | null = null;
  let services = {};

  function load(url) {
    axios
      .get(url)
      .then(({ data }) => {
        logs = data;
      })
      .finally(() => (loading = false));
  }

  let url = "/logs";
  if ($params.serviceId) {
    url += `/${$params.serviceId}`;
  }

  load(url);

  axios
    .get("/services")
    .then(({ data }) => {
      let _services = {};
      data.forEach((item) => {
        _services = {
          ..._services,
          [item.id]: item,
        };
      });
      services = _services;
    })
    .finally(() => (loading = false));
</script>

<main>
  <SectionHeader title="Logs" />

  {#if loading}
    <Spinner className="w-10 h-10 text-indigo-500 mx-auto mt-8" />
  {:else}
    <div class="flex flex-col mt-8">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Service
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Method
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Path
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Request Time
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each logs?.data as log}
                  <tr>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-500"
                    >
                      <Link to={`/service/${log.serviceId}`}>
                        {services[log.serviceId]?.name}
                      </Link>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {log.method}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {log.path}
                    </td>
                    <td
                      class={classnames("px-6 py-4 whitespace-nowrap text-sm", {
                        "text-green-500":
                          log.statusCode >= 200 && log.statusCode <= 299,
                        "text-red-500":
                          log.statusCode < 200 || log.statusCode > 299,
                      })}
                    >
                      {log.statusCode}
                      {httpStatus[log.statusCode]}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {log.responseTime - log.requestTime} ms
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {new Date(log.requestTime).toLocaleString("en-AU")}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            <nav
              class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
              aria-label="Pagination"
            >
              <div class="hidden sm:block">
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{logs.from}</span>
                  to
                  <span class="font-medium">{logs.to}</span>
                  of
                  <span class="font-medium">{logs.total}</span>
                  results
                </p>
              </div>
              <div class="flex-1 flex justify-between sm:justify-end">
                {#if logs.prev_page_url}
                  <button
                    on:click={() => load(logs.prev_page_url)}
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                {/if}
                {#if logs.next_page_url}
                  <button
                    on:click={() => load(logs.next_page_url)}
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                {/if}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
