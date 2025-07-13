import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://leeoo.me/",
  author: "Leeoo",
  desc: "Leeoo's blog website.",
  title: "Leeoo's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/nomango",
    linkTitle: ` ${SITE.author} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nomango-l-01740b297/",
    linkTitle: `${SITE.author} on LinkedIn`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:leeoo.liu@foxmail.com",
    linkTitle: `Send an email to ${SITE.author}`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://steamcommunity.com/id/nomango/",
    linkTitle: `${SITE.author} on Steam`,
    active: true,
  },
  {
    name: "Discord",
    href: "https://discordapp.com/users/1005533340025225319",
    linkTitle: `${SITE.author} on Discord`,
    active: false,
  },
  {
    name: "Zhihu",
    href: "https://www.zhihu.com/people/nom-",
    linkTitle: `${SITE.author} on Zhihu`,
    active: true,
  },
  {
    name: "Weibo",
    href: "https://weibo.com/u/5309142901",
    linkTitle: `${SITE.author} on Weibo`,
    active: true,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `RSS Feed`,
    active: true,
  },
];
