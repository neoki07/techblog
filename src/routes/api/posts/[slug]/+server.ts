import { json } from '@sveltejs/kit';
import { promises as fs } from 'fs';
import path from 'path';
import { compile } from 'mdsvex';
import type { Module, Post } from '$lib/types';
import type { RequestHandler } from './$types';

async function getPost(slug: string) {
	const filePath = `/posts/${slug}.md`;
	const absFilePath = path.join(process.cwd(), filePath);

	const rawContent = await fs.readFile(absFilePath, 'utf-8');
	const content = await compile(rawContent);

	if (!content) {
		return null;
	}

	const { metadata } = (await import(filePath)) as Module;

	const post = { ...metadata, content: content.code, slug } satisfies Post;

	if (!post.published) {
		return null;
	}

	return post;
}

export const GET: RequestHandler = async ({ params }) => {
	const posts = await getPost(params.slug);
	return json(posts);
};
