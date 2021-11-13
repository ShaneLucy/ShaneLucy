import axios from "axios";
import mustache from "mustache";
import { readFile, writeFileSync } from "fs";
import { default as unsplashRes } from "../random-photo/data.json";
import type { Data, Repo } from "./types";

const MUSTACHE_MAIN_DIR = "./main.mustache";

const DATA: Data = {
  headerUrl: "",
  headerDesc: "",
  headerError: "",
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Europe/London",
  }),
  repos: [],
  repoError: "",
  currentProject: {
    name: "",
    url: "",
    id: "",
    error: "",
  },
};
console.log(unsplashRes);

const getHeader = async () => {
  try {
    const RESPONSE = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1`
    );

    DATA.headerUrl = RESPONSE.data[0].hdurl;
    DATA.headerDesc = RESPONSE.data[0].title;
  } catch (error: any) {
    DATA.headerError = error?.message;
  }
};

const getCurrentProject = async () => {
  try {
    const RESPONSE = await axios.get(`https://api.github.com/users/shanelucy/events`);

    DATA.currentProject.name = RESPONSE.data[0].repo.name;
    DATA.currentProject.id = RESPONSE.data[0].repo.id;
  } catch (error: any) {
    DATA.currentProject.error = error?.message;
  }
};

const getRepos = async () => {
  try {
    const RESPONSE = await axios.get(`https://api.github.com/users/shanelucy/repos`);

    DATA.repos = RESPONSE.data.map((repo: Repo) => {
      if (repo.id === DATA.currentProject.id) {
        DATA.currentProject.url = repo.html_url;
      }

      return {
        name: repo.name ? repo.name : "null",
        language: repo.language ? repo.language : "null",
        url: repo.url ? repo.html_url : "null",
        description: repo.description ? repo.description : "null",
      };
    });
  } catch (error: any) {
    DATA.repoError = error?.message;
  }
};

function generateReadMe() {
  readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = mustache.render(data.toString(), DATA);
    writeFileSync("README.md", output);
  });
}

const create = async () => {
  await getHeader();

  await getCurrentProject();

  await getRepos();

  generateReadMe();
};

create();
