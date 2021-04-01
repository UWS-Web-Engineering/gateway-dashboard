<script lang="ts">
  import { navigate } from "svelte-navigator";

  import Button from "./../../components/Button.svelte";
  import Input from "./../../components/Input.svelte";
  import axios from "./../../lib/axios";

  let loading = false;
  let error = false;
  let username = "";
  let password = "";

  async function handleSubmit(event: Event) {
    loading = true;
    error = false;

    event.preventDefault();
    try {
      await axios.post("/setup/admin", {
        username,
        password,
      });

      window.location.href = "/user/login";
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  }
</script>

<main class="flex items-center justify-center">
  <div class="max-w-md w-full space-y-8">
    <div>
      <img
        class="mx-auto h-20 w-auto"
        src="/api_gateway_logo.svg"
        alt="Workflow"
      />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create admin account
      </h2>
    </div>
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
        </div>
      </div>

      <div>
        <Button
          className="w-full"
          {loading}
          text="Create Account"
          type="submit"
        />
      </div>
    </form>
  </div>
</main>

<style>
  main {
    @apply pt-0;
  }
</style>
