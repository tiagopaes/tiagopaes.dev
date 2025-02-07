import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Tiago Paes",
  EMAIL: "me@tiagopaes.dev",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Lista de posts sobre programação.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projetos",
  DESCRIPTION: "Lista dos meus projetos recentes, portifólio.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "youtube",
    HREF: "https://youtube.com/@tiagopaees?sub_confirmation=1",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/tiagopaes"
  },
  { 
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/tiagopaees",
  },
  {
    NAME: "whatsapp",
    HREF: "https://wa.me/5511953411568"
  }
];
