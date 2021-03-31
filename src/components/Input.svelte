<script lang="ts">
  import { onMount } from "svelte";

  export let type: "text" | "password" = "text";
  export let id: string;
  export let name = "";
  export let placeholder = "";
  export let description = "";
  export let label = "";
  export let value = "";
  export let autocomplete = "";

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
  <div class="mt-1">
    <input
      name={name ?? id}
      {id}
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      {placeholder}
      aria-describedby={`${id}-description`}
      {autocomplete}
      bind:value
      bind:this={inputElement}
    />
  </div>
  {#if description}
    <p class="mt-2 text-sm text-gray-500" id={`${id}-description`}>
      {description}
    </p>
  {/if}
</div>
