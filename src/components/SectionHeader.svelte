<script lang="ts">
  import { Link } from "svelte-navigator";
  import Button from "../components/Button.svelte";

  export let title;
  export let actions: { text: string; to: string }[] = [];
</script>

<div class="pb-5 border-b border-gray-300 flex items-center justify-between">
  <h3 class="text-lg leading-6 font-medium text-gray-900 capitalize">
    {title}
  </h3>
  <div class="mt-3 sm:mt-0 sm:ml-4">
    {#each actions as action}
      <Link to={action.to}>
        <Button text={action.text} />
      </Link>
    {/each}
  </div>
</div>
