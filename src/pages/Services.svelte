<script lang="ts">
  import { Link } from "svelte-navigator";
  import axios from "../lib/axios";
  import { services as servicesStore } from "../store";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Spinner from "../components/Spinner.svelte";

  let loading = true;

  let services = [];

  axios
    .get("/services")
    .then(({ data }) => {
      servicesStore.set(data);
    })
    .finally(() => (loading = false));

  servicesStore.subscribe((value) => {
    services = value;
  });
</script>

<main>
  <SectionHeader
    title="Services"
    actions={[{ text: "Create new service", to: "/service/new" }]}
  />

  {#if loading}
    <Spinner className="w-10 h-10 text-indigo-500 mx-auto mt-8" />
  {:else}
    <div class="flex flex-col space-y-4 py-4">
      {#each services as service}
        <Link to={`/service/${service.id}`}>
          <div
            class="border p-4 rounded-md shadow bg-white flex items-center group cursor-pointer hover:shadow-md"
          >
            <div
              class="text-lg capitalize text-gray-800 group-hover:text-indigo-500"
            >
              {service.name}
            </div>
            <div class="text-xs text-gray-500 ml-2">URL: {service.url}</div>
            <div class="text-sm text-gray-500 flex-1 flex justify-end mr-4">
              STATUS: {#if service.active}
                <span class="text-green-500 ml-1">Online</span>
              {:else}
                <span class="text-red-500 ml-1">Offline</span>
              {/if}
            </div>
            <div>
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="chevron-right"
                class="h-5 w-5 text-gray-500 group-hover:text-indigo-500"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
                ><path
                  fill="currentColor"
                  d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"
                /></svg
              >
            </div>
          </div>
        </Link>
      {/each}
    </div>
  {/if}
</main>
