import { json } from '@sveltejs/kit';
import type { Module, Post } from '$lib/types';

async function getPosts() {
	const modules = import.meta.glob<Module>('/posts/*.md', { eager: true });

	const posts = Object.entries(modules)
		.map(([path, { metadata }]) => {
			const slug = path.split('/').at(-1)?.replace('.md', '') ?? '';
			return { ...metadata, slug } satisfies Post;
		})
		.filter((post) => {
			return post.published && post.slug;
		})
		.toSorted((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});

	return posts;
}

export async function GET() {
	const posts = await getPosts();
	return json(posts);
}
