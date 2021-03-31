<script lang="ts">
  import { navigate } from "svelte-navigator";

  import SectionHeader from "./../../components/SectionHeader.svelte";
  import Input from "./../../components/Input.svelte";
  import Button from "./../../components/Button.svelte";
  import Select from "./../../components/Select.svelte";
  import axios from "./../../lib/axios";

  let username = "";
  let password = "";
  let role = "member";
  let error = false;
  let loading = false;

  async function handleSubmit(event: Event) {
    event.preventDefault();

    await axios.post("/register", { username, password, role });
    navigate("/users");
  }
</script>

<main>
  <SectionHeader title="New user" />
  <form class="mt-8 space-y-6" on:submit={handleSubmit}>
    <div>
      <div class="space-y-4">
        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          autocomplete="username"
          bind:value={username}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autocomplete="current-password"
          bind:value={password}
        />
        <Select
          id="role"
          name="role"
          label="Role"
          options={[
            { label: "Admin", value: "admin" },
            { label: "Member", value: "member" },
          ]}
          bind:value={role}
        />
      </div>
      {#if error}
        <p class="mt-2 text-sm text-red-600" id="email-error">
          Faild to create user.
        </p>
      {/if}
    </div>

    <div>
      <Button text="Create user" type="submit" className="w-full" {loading} />
    </div>
  </form>
</main>
