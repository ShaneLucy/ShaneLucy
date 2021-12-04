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
  headerPhotographerName: string;
  headerPhotographerAttribution: string;
  date: string;
  repoError: string;
  currentProject: {
    name: string;
    url: string;
    id: string;
    error: string;
  };
}

export interface Event {
  id: number;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: string;
    name: string;
    url: string;
  };
  payload: {
    push_id: number;
    size: number;
    distinct_size: number;
    ref: string;
    head: string;
    before: string;
    commits: Array<any>;
  };
  public: boolean;
  created_at: string;
}
