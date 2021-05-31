<script lang="ts">
  import { navigate } from "svelte-navigator";
  import friendlyUrl from "friendly-url";

  import SectionHeader from "./../../components/SectionHeader.svelte";
  import Input from "./../../components/Input.svelte";
  import Button from "./../../components/Button.svelte";
  import Toggle from "./../../components/Toggle.svelte";
  import axios from "./../../lib/axios";

  let active = true;
  let name = "";
  let description = "";
  let key = "";
  let url = "";
  let privateService = true;

  let error = false;
  let loading = false;

  async function handleSubmit(event: Event) {
    event.preventDefault();

    await axios.post("/service", {
      active,
      name,
      description,
      key,
      url,
      private: privateService,
    });
    navigate("/services");
  }

  function handleKeyChange(event: Event) {
    key = friendlyUrl((event.target as any).value);
  }

  function handleNameChange(event: Event) {
    if (key !== "") {
      return;
    }
    key = friendlyUrl((event.target as any).value);
  }

</script>

<main>
  <form class="space-y-6" on:submit={handleSubmit}>
    <div>
      <SectionHeader title="Service details" />
      <div class="space-y-4 mt-4">
        <Toggle label="Active" bind:value={active} />
        <Toggle label="Private" bind:value={privateService} />
        <Input
          id="name"
          name="name"
          type="text"
          label="Name"
          placeholder="My Service"
          on:change={handleNameChange}
          bind:value={name}
        />
        <Input
          id="description"
          name="description"
          type="text"
          label="Description"
          bind:value={description}
        />
        <Input
          id="key"
          name="key"
          type="text"
          label="Key"
          placeholder="my-service"
          description={key && process.env.API_URL + "/" + key}
          on:change={handleKeyChange}
          bind:value={key}
        />
      </div>

      <SectionHeader title="Service target" className="mt-8" />
      <div class="space-y-4 mt-4">
        <Input
          id="url"
          name="url"
          type="text"
          label="Url"
          placeholder="https://mydomain.com/api"
          bind:value={url}
        />
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
