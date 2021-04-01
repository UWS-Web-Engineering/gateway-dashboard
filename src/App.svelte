<script lang="ts">
  import { Router, Route, navigate } from "svelte-navigator";

  import Dashboard from "./pages/Dashboard.svelte";
  import Users from "./pages/Users.svelte";
  import NewService from "./pages/service/NewService.svelte";
  import Services from "./pages/Services.svelte";
  import Service from "./pages/service/Service.svelte";
  import UserLogin from "./pages/user/Login.svelte";
  import UserLogout from "./pages/user/Logout.svelte";
  import UserNew from "./pages/user/NewUser.svelte";
  import SetupAdmin from "./pages/setup/admin.svelte";
  import Logs from "./pages/Logs.svelte";

  import Header from "./components/Header.svelte";
  import Loading from "./components/Loading.svelte";
  import axios from "./lib/axios";
  import { profile } from "./store";

  let loading = true;
  let auth = false;
  let setup = false;

  const statusRequest = axios.get("/setup/status");
  const profileRequest = axios.get("/profile");

  Promise.all([
    statusRequest.catch((error) => error.response),
    profileRequest.catch((error) => error.response),
  ])
    .then(([statusResponse, profileResponse]) => {
      if (!statusResponse?.data.hasAdmin) {
        setup = true;
        navigate("/setup/admin");
        return;
      }

      if (profileResponse?.status === 401) {
        navigate("/user/login");
      } else {
        auth = true;
        profile.set(profileResponse.data);
      }
    })
    .finally(() => {
      loading = false;
    });

  export let url = "";
</script>

{#if !loading}
  <div class="flex flex-col min-h-screen">
    <Router {url} primary={false}>
      {#if auth}
        <Header />
        <Route path="/"><Dashboard /></Route>
        <Route path="/users"><Users /></Route>
        <Route path="/user/new"><UserNew /></Route>
        <Route path="/service/new"><NewService /></Route>
        <Route path="/services"><Services /></Route>
        <Route path="/service/:id"><Service /></Route>
        <Route path="/logs"><Logs /></Route>
        <Route path="/logs/:serviceId"><Logs /></Route>
        <Route path="/user/logout"><UserLogout /></Route>
      {/if}
      {#if setup}<Route path="/setup/admin"><SetupAdmin /></Route>{/if}
      {#if !auth && !setup}<Route path="/user/login"><UserLogin /></Route>{/if}
    </Router>
  </div>
{:else}
  <Loading />
{/if}

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  main {
    @apply flex-1;
    @apply px-4;
    @apply container;
    @apply mx-auto;
    @apply py-8;
    @apply pt-28;
  }

  html,
  body {
    @apply bg-gray-100;
  }
</style>
