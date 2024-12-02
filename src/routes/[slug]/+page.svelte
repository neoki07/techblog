<script lang="ts">
	import { formatDate } from '$lib/date';
	import * as config from '$lib/config';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.post.title} />
</svelte:head>

<header>
	<a href="/">{config.title}</a>
</header>
<section>
	<article>
		<h1>{data.post.title}</h1>
		<p class="published-date">{formatDate(data.post.date)}</p>
		<div class="content">{@html data.post.content}</div>
	</article>
</section>

<style>
	header {
		text-align: center;
		padding-block: 1rem;
		padding-inline: 2rem;
	}

	header a {
		font-size: 1rem;
		font-weight: bold;
		line-height: 1;
	}

	section {
		display: flex;
		justify-content: center;
		margin-block-start: 2rem;
	}

	article {
		padding-inline: 2rem;
		max-width: 40rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: bold;
	}

	.published-date {
		margin-block-start: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
	}

	.content {
		margin-block-start: 2rem;
	}
</style>
