export type Tag = 'sveltekit' | 'svelte';

export type Post = {
	title: string;
	description: string;
	date: string;
	tags: Tag[];
	published: boolean;
	slug: string;
};

export type FrontMatter = {
	title: string;
	description: string;
	date: string;
	tags: Tag[];
	published: boolean;
};

export type Module = {
	metadata: FrontMatter;
	default: {
		render: () => {
			css: { code: string };
			head: string;
			html: string;
		};
	};
};
