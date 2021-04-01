<script lang="ts">
  import { Link } from "svelte-navigator";
  import classnames from "classnames";

  import Button from "../components/Button.svelte";

  export let className;
  export let title;
  export let actions: { text: string; to: string }[] = [];
</script>

<div
  class={classnames(
    "pb-5 border-b border-gray-300 flex items-center justify-between",
    className
  )}
>
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
