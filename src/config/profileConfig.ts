import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	// 头像
	avatar: "https://cdn.jsdelivr.net/gh/HP-Patience/HP-Patience.github.io@main/source/avatar_img/me.jpg",

	// 名字
	name: "Celyn",

	// 个人签名
	bio: "费曼学习法，反思近期所学并反馈输出，将所学知识内化。",

	// 链接配置
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/HP-Patience",
			showName: false,
		},
		{
			name: "Email",
			icon: "fa7-solid:envelope",
			url: "mailto:1249140039@qq.com",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
