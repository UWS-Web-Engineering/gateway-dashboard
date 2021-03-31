<script lang="ts">
  import { Link, useLocation } from "svelte-navigator";
  import Avatars from "@dicebear/avatars";
  import sprites from "@dicebear/avatars-initials-sprites";
  import classnames from "classnames";

  import { profile as profileStore } from "./../store";

  const location = useLocation();
  let profile;
  let menuOpen = false;
  let userMenuOpen = false;
  let pathname = "";
  let avatar = "";

  location.subscribe((loc) => {
    pathname = loc.pathname;
    menuOpen = false;
    userMenuOpen = false;
  });

  function onMenuClick() {
    menuOpen = !menuOpen;
  }

  function onUserMenuClick() {
    userMenuOpen = !userMenuOpen;
  }

  profileStore.subscribe((value) => {
    profile = value;
    let avatars = new Avatars(sprites, { dataUri: true });
    avatar = avatars.create(profile.username);
  });

  let ROUTES: Record<string, { path: string; roles: string[] }> = {
    Dashboard: {
      path: "/",
      roles: ["admin", "member"],
    },
    Services: {
      path: "/services",
      roles: ["admin", "member"],
    },
    Logs: {
      path: "/logs",
      roles: ["admin", "member"],
    },
    Users: {
      path: "/users",
      roles: ["admin"],
    },
  };
</script>

<nav class="bg-white shadow">
  <div class="container mx-auto px-4 h-20 flex flex-col justify-center">
    <div class="flex justify-between h-full">
      <div class="flex">
        <div class="-ml-2 mr-2 flex items-center md:hidden">
          <button
            type="button"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
            on:click={onMenuClick}
          >
            <span class="sr-only">Open main menu</span>
            {#if !menuOpen}
              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            {:else}
              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            {/if}
          </button>
        </div>
        <div class="flex-shrink-0 flex items-center">
          <img
            class="block lg:hidden h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <img
            class="hidden lg:block h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
            alt="Workflow"
          />
        </div>
        <div class="hidden md:ml-6 md:flex md:space-x-8">
          {#each Object.entries(ROUTES).filter(([_, r]) =>
            r.roles.includes(profile.role)
          ) as [key, value]}
            <Link
              to={value.path}
              class={classnames(
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                {
                  "border-indigo-500 text-gray-900": pathname === value.path,
                  "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700":
                    pathname !== value.path,
                }
              )}
            >
              {key}
            </Link>
          {/each}
        </div>
      </div>
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <Link to="/service/new">
            <button
              type="button"
              class="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                class="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>New Service</span>
            </button>
          </Link>
        </div>
        <div class="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
          <div class="ml-3 relative">
            <div>
              <button
                type="button"
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
                on:click={onUserMenuClick}
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="h-8 w-8 rounded-full"
                  src={avatar}
                  alt={profile?.username}
                />
              </button>
            </div>

            {#if userMenuOpen}
              <div
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <Link
                  to="/user/logout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem">Sign out</Link
                >
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if menuOpen}
    <div
      class="md:hidden fixed top-0 left-0 bg-white w-full h-full mt-20 z-10"
      id="mobile-menu"
    >
      <div class="pt-2 pb-3 space-y-1">
        {#each Object.entries(ROUTES) as [key, value]}
          <Link
            to={value.path}
            class={classnames(
              "block pl-3 pr-4 py-2 border-l-4 text-base font-medium sm:pl-5 sm:pr-6",
              {
                "bg-indigo-50 border-indigo-500 text-indigo-700":
                  pathname === value.path,
                "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700":
                  pathname !== value.path,
              }
            )}
          >
            {key}
          </Link>
        {/each}
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4 sm:px-6">
          <div class="flex-shrink-0">
            <img
              class="h-10 w-10 rounded-full"
              src={avatar}
              alt={profile?.username}
            />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800 capitalize">
              {profile?.username}
            </div>
            <div class="text-sm font-medium text-gray-500 capitalize">
              {profile?.role}
            </div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <Link
            to="/user/logout"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 sm:px-6"
            >Sign out</Link
          >
        </div>
      </div>
    </div>
  {/if}
</nav>
