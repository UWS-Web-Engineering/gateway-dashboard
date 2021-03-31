<script lang="ts">
  import { useParams, navigate } from "svelte-navigator";

  import axios from "../../lib/axios";
  import SectionHeader from "../../components/SectionHeader.svelte";
  import Spinner from "../../components/Spinner.svelte";
  import Button from "../../components/Button.svelte";

  const params = useParams();

  let loading = true;
  let deleting = false;
  let service;

  axios
    .get(`/service/${$params.id}`)
    .then(({ data }) => {
      service = data;
    })
    .finally(() => (loading = false));

  async function handleDelete() {
    deleting = true;
    await axios.delete(`/service/${$params.id}`);
    deleting = false;
    navigate("/services");
  }
</script>

<main>
  <SectionHeader
    title="Service details"
    actions={[{ text: "View logs", to: `/logs/${$params.id}` }]}
  />

  {#if loading}
    <Spinner className="w-10 h-10 text-indigo-500 mx-auto mt-8" />
  {:else}
    <div class="flex flex-col space-y-4 py-4">
      {#each Object.entries(service) as [key, value]}
        <div class="flex">
          <div class="capitalize mr-2 text-gray-700">{key}:</div>
          <div class="text-gray-800">{value}</div>
        </div>
      {/each}
      <div class="flex">
        <div class="capitalize mr-2 text-gray-700">Gateway URL:</div>
        <div class="text-gray-800">
          {process.env.API_URL}/gateway/{service.name}
        </div>
      </div>
    </div>
    <div>
      <Button
        text="Delete service"
        variant="danger"
        className="w-atuo"
        loading={deleting}
        on:click={handleDelete}
      />
    </div>
  {/if}
</main>
