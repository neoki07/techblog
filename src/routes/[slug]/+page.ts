import type { PageLoad } from './$types';
import type { Post } from '$lib/types';

export const load: PageLoad = async ({ fetch, params }) => {
	const response = await fetch(`api/posts/${params.slug}`);
	const post: Post = await response.json();
	return { post };
};
