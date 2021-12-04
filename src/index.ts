import axios from "axios";
import mustache from "mustache";
import { readFile, writeFileSync } from "fs";
import { default as unsplashRes } from "../random-photo/data.json";
import type { Data, Repo, Event } from "./types";

const MUSTACHE_MAIN_DIR = "./main.mustache";

const DATA: Data = {
  headerUrl: `${unsplashRes?.urls?.regular}&auto=format`,
  headerDesc: unsplashRes?.alt_description ?? "",
  headerPhotographerName: unsplashRes?.user?.name ?? "",
  headerPhotographerAttribution: `https://unsplash.com/@${unsplashRes?.user?.username}?utm_source=Profile%20readme&utm_medium=referral`,
  date: new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
    timeZone: "Europe/London",
  }),
  repoError: "",
  currentProject: {
    name: "",
    url: "",
    id: "",
    error: "",
  },
};

const getCurrentProject = async () => {
  try {
    const RESPONSE = await axios.get(`https://api.github.com/users/shanelucy/events`);

    const CURRENT_PROJECT: Event = RESPONSE.data.find(
      (element: Event) => element.repo.name !== "ShaneLucy/ShaneLucy"
    );

    [, DATA.currentProject.name] = CURRENT_PROJECT.repo.name.split("ShaneLucy/");
    DATA.currentProject.id = CURRENT_PROJECT.repo.id;
  } catch (error: any) {
    DATA.currentProject.error = error?.message;
  }

  try {
    const RESPONSE = await axios.get(`https://api.github.com/users/shanelucy/repos`);

    RESPONSE.data.forEach((repo: Repo) => {
      if (repo.id === DATA.currentProject.id) {
        DATA.currentProject.url = repo.html_url;
      }
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
  await getCurrentProject();

  generateReadMe();
};

create();
