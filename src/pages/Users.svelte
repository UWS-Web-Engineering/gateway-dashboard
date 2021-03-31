<script lang="ts">
  import axios from "../lib/axios";
  import { users as usersStore, profile as userProfile } from "../store";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Spinner from "../components/Spinner.svelte";
  import Button from "../components/Button.svelte";
  import Input from "../components/Input.svelte";

  let loading = true;
  let deleting: Record<number, boolean> = {};

  let search = "";
  let users = [];
  let profile;

  axios
    .get("/users")
    .then(({ data }) => {
      usersStore.set(data);
    })
    .finally(() => (loading = false));

  usersStore.subscribe((value) => {
    users = value;
  });

  userProfile.subscribe((value) => (profile = value));

  async function handleDelete(id: number) {
    deleting[id] = true;
    await axios.delete(`/user/${id}`);
    usersStore.update((value) => {
      return [...value.filter((user) => user.id !== id)];
    });
    deleting[id] = undefined;
  }
</script>

<main>
  <SectionHeader
    title="Users"
    actions={[{ text: "Create new user", to: "/user/new" }]}
  />

  {#if loading}
    <Spinner className="w-10 h-10 text-indigo-500 mx-auto mt-8" />
  {:else}
    <div class="flex flex-col mt-8">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="mb-4">
            <Input id="search" placeholder="Search" bind:value={search} />
          </div>

          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider"
                  >
                    {users.filter((u) => u.username.includes(search)).length} Record/s
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {#each users.filter((u) => u.username.includes(search)) as user}
                  <tr>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {user.id}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {user.username}
                      {#if user.id === profile.id}(self){/if}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize"
                    >
                      {user.role}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center"
                    >
                      {#if user.id !== profile.id}
                        <Button
                          loading={deleting[user.id]}
                          variant="danger"
                          text="Delete"
                          on:click={() => handleDelete(user.id)}
                        />
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
