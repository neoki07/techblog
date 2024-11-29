<script lang="ts">
	import { formatDate } from '$lib/date';
	import * as config from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<header>
	<span>{config.title}</span>
</header>
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

<style>
	header {
		text-align: center;
	}

	header span {
		font-size: 2em;
		font-weight: bold;
	}
</style>
