<script lang="ts">
	import { formatDate } from '$lib/date';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.post.title} />
</svelte:head>

<article>
	<h1>{data.post.title}</h1>
	<p>{formatDate(data.post.date)}</p>
	<p>{data.post.description}</p>
	<div>{@html data.post.content}</div>
</article>
