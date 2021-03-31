<script lang="ts">
  import { navigate } from "svelte-navigator";

  import SectionHeader from "./../../components/SectionHeader.svelte";
  import Input from "./../../components/Input.svelte";
  import Button from "./../../components/Button.svelte";
  import Toggle from "./../../components/Toggle.svelte";
  import axios from "./../../lib/axios";

  let name = "";
  let url = "";
  let active = true;
  let error = false;
  let loading = false;

  async function handleSubmit(event: Event) {
    event.preventDefault();

    await axios.post("/service", {
      name: encodeURIComponent(name.toLocaleLowerCase()),
      url,
      active,
    });
    navigate("/services");
  }
</script>

<main>
  <SectionHeader title="New service" />
  <form class="mt-8 space-y-6" on:submit={handleSubmit}>
    <div>
      <div class="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Name"
          placeholder="my-service"
          bind:value={name}
        />
        <Input
          id="url"
          name="url"
          type="text"
          label="Url"
          placeholder="192.168.1.1:8080"
          bind:value={url}
        />
        <Toggle label="Active" bind:value={active} />
      </div>
      {#if error}
        <p class="mt-2 text-sm text-red-600" id="email-error">
          Failed to create service.
        </p>
      {/if}
    </div>

    <div>
      <Button
        text="Create service"
        type="submit"
        className="w-full"
        {loading}
      />
    </div>
  </form>
</main>
