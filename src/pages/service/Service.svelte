<script lang="ts">
  import { useParams, navigate } from "svelte-navigator";
  import classnames from "classnames";

  import axios from "../../lib/axios";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import Spinner from "../../components/Spinner.svelte";
  import Button from "../../components/Button.svelte";

  const params = useParams();

  let loading = true;
  let deleting = false;
  let updating = false;
  let service;
  let target = "";
  let gateway = "";
  let paths = [];

  axios.get(`/services/healths`);
  axios
    .get(`/service/${$params.id}`)
    .then(({ data }) => {
      service = data;
      target = `${service.secure ? "https://" : "http://"}${service.domain}:${
        service.port
      }${service.path}`;
      gateway = `${process.env.API_URL}/gateway/${service.key}`;
    })
    .finally(() => (loading = false));

  axios.get(`/service/${$params.id}/paths`).then(({ data }) => {
    paths = data;
  });

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
        target = `${service.secure ? "https://" : "http://"}${service.domain}:${
          service.port
        }${service.path}`;
        gateway = `${process.env.API_URL}/gateway/${service.key}`;
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
        <div class="text-md">Details</div>
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
            text="Delete service"
            variant="danger"
            className="w-atuo"
            loading={deleting}
            on:click={handleDelete}
          />
        </div>
      </div>

      <div class="flex-1 border-l pl-4">
        <div class="text-md py-2">Paths</div>
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
                  Private
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each paths as path}
                <tr>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {path.method}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {path.path}
                  </td>
                  <td
                    class={classnames("px-6 py-4 whitespace-nowrap text-sm", {
                      "text-green-500": path.requireAuth,
                      "text-red-500": !path.requireAuth,
                    })}
                  >
                    {path.requireAuth ? "True" : "False"}
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
              <p class="text-sm text-gray-400">
                Paths are automatically added to this list as they are called
              </p>
            </div>
          </nav>
        </div>
      </div>
    </div>
  {/if}
</main>
