<script>
    // import data2 from "./data.js";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
    import SiteHeader from "$lib/components/site-header.svelte";
    import SectionCards from "$lib/components/echipe-cards.svelte";
    import ChartAreaInteractive from "$lib/components/chart-area-interactive.svelte";
    import DataTable from "$lib/components/data-table-questions.svelte";
    // import DataTable from "$lib/components/data-table.svelte";


    import { enhance } from '$app/forms';
    import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
    import { Button } from '$lib/components/ui/button';

    /** @type {import('./$types').PageProps} */
    let { data, form } = $props();
    const intrebari = data.intrebari
    const echipe = $state(data.echipe)
    console.log("intrebari", intrebari)
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
                    <SectionCards echipe={echipe} />
                    <div>

                        <form
                            class="px-4" 
                            method="POST"
                        >

                            <div class="pb-2">
                                <Button formaction="?/decrement" type=submit>
                                    Anteriorul
                                </Button>
                                Nr întrebare: {data.counter}
                                <Button formaction="?/increment" type=submit>
                                    Următorul
                                </Button>
                            </div>

                            <ButtonGroup.Root>
                                <Button variant="outline" size="sm" formaction="?/gresit" type="submit">
                                    Răspuns gresit
                                </Button>
                                <Button variant="outline" size="sm" formaction="?/reseteaza-respondent" type="submit">
                                    Resezeatză respondent
                                </Button>
                                <Button variant="outline" size="sm" formaction="?/corect" type="submit">
                                    Răspuns corect
                                </Button>
                            </ButtonGroup.Root>


                        </form>


                    </div>

                    <DataTable data={intrebari.map(i => ({...i, selectat: i.id === (data.counter%intrebari.length + 1)}))} />

                    <!-- <DataTable data={ intrebari.map(i => ({ -->
                    <!--     id: i.id,  -->
                    <!--     header: i.titlu,  -->
                    <!--     reviewer: i.raspuns,  -->
                    <!--     type: "Întrebare", status: i.id === (data.counter%intrebari.length + 1) ? -->
                    <!--         "activă"  -->
                    <!--     : "în așteptare",  -->
                    <!--     limit: "fară limită", target: "fără țintă"})) } /> -->
                    <!---->
                    <!-- <ul> -->
                    <!-- {#each intrebari as intr} -->
                    <!--         {#if intr.id === (data.counter%intrebari.length + 1)} -->
                    <!--             <li class="color-blue-400" style="color:green;">{intr.titlu} | {intr.raspuns}</li> -->
                    <!--         {:else} -->
                    <!--             <li>{intr.titlu} | {intr.raspuns}</li> -->
                    <!--         {/if} -->
                    <!-- {/each} -->
                    <!-- </ul> -->
                </div>
            </div>
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>
