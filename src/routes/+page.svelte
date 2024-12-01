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
				<p class="description">{post.description}</p>
				<p class="published-date">{formatDate(post.date)}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	header {
		text-align: center;
		padding-block: 4rem;
		padding-inline: 2rem;
	}

	header span {
		font-size: 1.5rem;
		font-weight: bold;
		line-height: 1;
	}

	section {
		display: flex;
		justify-content: center;
	}

	ul {
		padding-inline: 2rem;
		max-width: 40rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	li {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	a {
		font-size: 1.125rem;
		font-weight: 600;
	}

	a:hover {
		color: #374151;
	}

	.description {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.published-date {
		font-size: 0.75rem;
		font-weight: 500;
		color: #374151;
	}
</style>
