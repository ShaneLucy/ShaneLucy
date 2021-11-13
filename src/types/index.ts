export interface Repo {
  id?: string;
  html_url: string;
  name: string;
  language: string;
  url: string;
  description: string;
}

export interface Data {
  headerUrl: string;
  headerDesc: string;
  headerError: string;
  date: string;
  repos: Array<Repo>;
  repoError: string;
  currentProject: {
    name: string;
    url: string;
    id: string;
    error: string;
  };
}
