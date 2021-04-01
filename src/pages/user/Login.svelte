<script lang="ts">
  import axios from "./../../lib/axios";
  import Button from "./../../components/Button.svelte";
  import Input from "./../../components/Input.svelte";

  let loading = false;
  let username = "";
  let password = "";
  let error = false;

  async function handleSubmit(event: Event) {
    error = false;
    loading = true;

    event.preventDefault();
    try {
      const results = await axios.post("/login", {
        username,
        password,
      });

      window.sessionStorage.setItem("token", results.data.token);
      window.location.href = "/";
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
        Sign in to continue
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
        {#if error}
          <p class="mt-2 text-sm text-red-600" id="email-error">
            Invalid details please try again.
          </p>
        {/if}
      </div>

      <div>
        <Button text="Sign in" type="submit" className="w-full" {loading} />
      </div>
    </form>
  </div>
</main>

<style>
  main {
    @apply pt-0;
  }
</style>
