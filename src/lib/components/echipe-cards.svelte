<script lang="ts">
	import TrendingDownIcon from "@tabler/icons-svelte/icons/trending-down";
	import TrendingUpIcon from "@tabler/icons-svelte/icons/trending-up";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

    const { echipe } = $props()
</script>

<div
	class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
>
    {#each echipe as echipa}
         <!-- content here -->
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>Echipa {echipa.denumirea}</Card.Description>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                puncte: {echipa.puncte}
			</Card.Title>
			<Card.Action>
				<Badge variant="outline">
					<TrendingUpIcon />
                    De facut?
				</Badge>
			</Card.Action>
		</Card.Header>
	</Card.Root>

    {/each}

</div>
