import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://nomango.dev/",
  author: "Haibo Liu",
  desc: "Nomango's blog website.",
  title: "Nomango's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOCALE = ["zh-CN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/Nomango",
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
    href: "mailto:nomango.lhb@gmail.com",
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
    active: true,
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
    active: false,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `RSS Feed`,
    active: true,
  },
];
