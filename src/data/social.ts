import {
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
} from "@/components/ui/BrandIcons";
import type { SocialLink } from "@/types";

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/ramaputra1", icon: GitHubIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rama-adi-putra-05baa0267/",
    icon: LinkedInIcon,
  },
  {
    label: "Email",
    href: "mailto:@ramabusiness321@gmail.com",
    icon: EmailIcon,
  },
];

export const contactEmail = "@ramabusiness321@gmail.com";
