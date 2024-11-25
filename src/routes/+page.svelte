<script lang="ts">
	import { formatDate } from '$lib/date';
	import * as config from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<sction>
	<ul>
		{#each data.posts as post}
			<li>
				<a href={post.slug}>{post.title}</a>
				<p>{formatDate(post.date)}</p>
				<p>{post.description}</p>
			</li>
		{/each}
	</ul>
</sction>
