<script>
    import data from "./data.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
    import SiteHeader from "$lib/components/site-header.svelte";
    import SectionCards from "$lib/components/section-cards.svelte";
    // import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
    import DataTable from "$lib/components/data-table.svelte";


    import { enhance } from '$app/forms';
    import { Button } from '$lib/components/ui/button';

    /** @type {import('./$types').PageProps} */
    let { data: data2, form } = $props();
</script>


<Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
    <AppSidebar variant="inset" />
    <Sidebar.Inset>
        <SiteHeader />
        <div class="flex flex-1 flex-col">
            <div class="@container/main flex flex-1 flex-col gap-2">
                <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div>

                        <form
                            class="px-4" 
                            method="POST"
                            use:enhance
                        >

                            <p>
                                <Button formaction="?/decrement" type=submit>
                                    Anteriorul
                                </Button>
                                Nr întrebare: {data2.counter}
                                <Button formaction="?/increment" type=submit>
                                    Următorul
                                </Button>
                            </p>

                            <p>
                                <Button variant="secondary" formaction="?/corect" type="submit">
                                    Răspuns corect
                                </Button>
                                Nr întrebare: {data2.counter}
                                <Button formaction="?/necorect" type="submit">
                                    Răspuns necorect
                                </Button>
                            </p>


                        </form>


                    </div>
                    <DataTable {data} />
                </div>
            </div>
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>
