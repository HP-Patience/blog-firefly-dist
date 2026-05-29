import type { FriendLink, FriendsPageConfig } from "../types/config";

// 可以在src/content/spec/friends.md中编写友链页面下方的自定义内容

// 友链页面配置
export const friendsPageConfig: FriendsPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// 是否显示底部自定义内容（friends.mdx 中的内容）
	showCustomContent: true,

	// 是否显示评论区，需要先在commentConfig.ts启用评论系统
	showComment: true,

	// 是否开启随机排序配置，如果开启，就会忽略权重，构建时进行一次随机排序
	randomizeSort: false,
};

// 友链配置
export const friendsConfig: FriendLink[] = [
	{
		title: "Astro",
		imgurl: "https://astro.build/assets/press/astro-icon-dark.png",
		desc: "现代化的静态站点生成框架",
		siteurl: "https://astro.build",
		tags: ["Framework"],
		weight: 10,
		enabled: true,
	},
	{
		title: "Firefly",
		imgurl: "https://firefly.cuteleaf.cn/_astro/avatar.BcAu2wMi_yT6PR.webp",
		desc: "基于 Astro 的优雅博客主题",
		siteurl: "https://firefly.cuteleaf.cn/",
		tags: ["Theme"],
		weight: 9,
		enabled: true,
	},
];

// 获取启用的友链并进行排序
export const getEnabledFriends = (): FriendLink[] => {
	const friends = friendsConfig.filter((friend) => friend.enabled);

	if (friendsPageConfig.randomizeSort) {
		return friends.sort(() => Math.random() - 0.5);
	}

	return friends.sort((a, b) => b.weight - a.weight);
};
