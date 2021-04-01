<script lang="ts">
  import { onMount } from "svelte";
  import classnames from "classnames";

  export let type: "text" | "password" = "text";
  export let id: string;
  export let name = "";
  export let placeholder = "";
  export let description = "";
  export let label = "";
  export let value = "";
  export let autocomplete = "";
  export let prefix = "";

  let inputElement;
  onMount(() => {
    inputElement.type = type;
  });
</script>

<div>
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700"
      >{label}</label
    >
  {/if}
  <div class="mt-1 flex rounded-md shadow-sm">
    {#if prefix}
      <span
        class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
      >
        {prefix}
      </span>
    {/if}
    <input
      name={name ?? id}
      {id}
      class={classnames(
        "flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300",
        {
          "rounded-l-md": !prefix,
        }
      )}
      {placeholder}
      aria-describedby={`${id}-description`}
      {autocomplete}
      bind:value
      on:change
      bind:this={inputElement}
    />
  </div>
  {#if description}
    <p class="mt-2 text-sm text-gray-500" id={`${id}-description`}>
      {description}
    </p>
  {/if}
</div>
