import {
  AstroIcon,
  Kotlin,
  Nextjs,
  React,
  Tailwind,
  Vite,
} from "@/components/icon";
import type { I18n } from "@/interfaces/i18n.interface";

export function getProjectsData(t: I18n) {
  return [
    {
      name: "Waypoint",
      description: t.projects.firstDescription,
      link: "https://waypoint-store.netlify.app/",
      github: "https://github.com/Enzo889/astro-store",
      stack: [
        { name: "Astro", icon: AstroIcon },
        { name: "TailwindCSS", icon: Tailwind },
      ],
    },
    {
      name: "MCI - BMI App",
      description: t.projects.secondDescription,
      link: "https://github.com/Enzo889/IMCAPP",
      github: "https://github.com/Enzo889/IMCAPP",
      stack: [{ name: "Kotlin", icon: Kotlin }],
    },
    {
      name: "FOTO",
      description: t.projects.thirdDescription,
      link: "https://foto-site.vercel.app/",
      github: "https://github.com/Enzo889/FOTO",
      stack: [
        { name: "Nextjs", icon: Nextjs },
        { name: "TailwindCSS", icon: Tailwind },
      ],
    },
    {
      name: "Tailwind Background Generator",
      description: t.projects.fourthDescription,
      link: "https://tailwindbg.vercel.app/",
      github: "https://github.com/Enzo889/Tailwind-Backgrounds",
      stack: [
        { name: "React", icon: React },
        { name: "TailwindCSS", icon: Tailwind },
        { name: "Vite", icon: Vite },
      ],
    },
    {
      name: "Enzo Favorite",
      description: t.projects.fifthDescription,
      link: "https://enzofavorite.vercel.app/",
      github: "https://github.com/Enzo889/Enzo-Favorite",
      stack: [
        { name: "React", icon: React },
        { name: "Vite", icon: Vite },
      ],
    },
    {
      name: "Spoti-Astro",
      description: t.projects.sixthDescription,
      link: "https://spoti-astro.vercel.app/",
      github: "https://github.com/Enzo889/spoti",
      stack: [
        { name: "Astro", icon: AstroIcon },
        { name: "TailwindCSS", icon: Tailwind },
      ],
    },
  ];
}
