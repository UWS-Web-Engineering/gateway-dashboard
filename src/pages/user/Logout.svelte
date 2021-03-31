<script lang="ts">
  import axios from "./../../lib/axios";
  import Loading from "./../../components/Loading.svelte";

  axios
    .get("/logout")
    .then(() => (window.location.href = "/"))
    .catch(() => (window.location.href = "/"));
</script>

<Loading />
