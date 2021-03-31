<script lang="ts">
  export let id: string;
  export let name = "";
  export let label = "";
  export let value = "";
  export let options: { label: string; value: string }[];
</script>

<div>
  <label for={id} class="block text-sm font-medium text-gray-700">{label}</label
  >
  <select
    {id}
    name={name ?? id}
    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    bind:value
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>
