<script lang="ts">
  import classnames from "classnames";
  import Spinner from "./Spinner.svelte";

  type VariantTypes = "primary" | "danger";

  export let text;
  export let type: "submit" | "button" = "button";
  export let className = "";
  export let loading = false;
  export let variant: VariantTypes = "primary";

  const VARIANTS: Record<VariantTypes, string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  const variantStyle = VARIANTS[variant];
</script>

<button
  {type}
  class={classnames(
    "relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    className,
    {
      "opacity-50 cursor-default": loading,
    },
    variantStyle
  )}
  disabled={loading}
  on:click
>
  {#if !loading}
    {text}
  {:else}
    <Spinner className="w-5 h-5 text-white" />
  {/if}
</button>
