const USERNAME = "ramaputra1";

interface GitHubUser {
  public_repos: number;
  followers: number;
}

export interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContribResponse {
  total: { lastYear?: number; [year: string]: number | undefined };
  contributions: Contribution[];
}

export async function getGitHubStats() {
  try {
    const [userRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
        { next: { revalidate: 3600 } },
      ),
    ]);

    const user: GitHubUser = await userRes.json();
    const contrib: ContribResponse = await contribRes.json();

    return {
      publicRepos: user.public_repos,
      followers: user.followers,
      contributions: contrib.contributions,
    };
  } catch {
    return { publicRepos: 8, followers: 11, contributions: [] as Contribution[] };
  }
}
