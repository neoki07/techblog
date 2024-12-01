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
<section>
	<ul>
		{#each data.posts as post}
			<li>
				<a href={post.slug}>{post.title}</a>
				<p>{formatDate(post.date)}</p>
				<p>{post.description}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	header {
		text-align: center;
		padding: 1.5rem;
	}

	header span {
		font-size: 1.25rem;
		font-weight: bold;
		line-height: 1;
	}
</style>
