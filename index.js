const Mustache = require("mustache");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";
const axios = require("axios");

let DATA = {
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
    timeZone: "Europe/London", //???
  }),
  repos: [],
  repoError: "",
  thProject: "",
  thLanguage: "",
  thDescription: "",
  currentProject: {
    name: "",
    url: "",
    id: "",
    error: "",
  },
};

const getHeader = async () => {
  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1`
    );

    DATA.headerUrl = response.data[0].hdurl;
    DATA.headerDesc = "Fig 1 - " + response.data[0].title;
  } catch (error) {
    DATA.headerError = error.message;
  }
};

const getCurrentProject = async () => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/shanelucy/events`
    );

    DATA.currentProject.name = response.data[0].repo.name;
    DATA.currentProject.id = response.data[0].repo.id;
  } catch (error) {
    DATA.currentProject.error = error.message;
  }
};

const getRepos = async () => {
  try {
    repos = [];
    const response = await axios.get(
      `https://api.github.com/users/shanelucy/repos`
    );

    DATA.thProject = "Project";
    DATA.thLanguage = "Language";
    DATA.thDescription = "Description";

    DATA.repos = response.data.map((x) => {
      if (x.id === DATA.currentProject.id) {
        DATA.currentProject.url = x.html_url;
      }

      return (DATA.repos = {
        name: x.name ? x.name : null,
        language: x.language ? x.language : "null",
        url: x.url ? x.url : "null",
        description: x.description ? x.description : "null",
      });
    });
  } catch (error) {
    DATA.reposError = error.message;
  }
};

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

const create = async () => {
  await getHeader();

  await getCurrentProject();

  await getRepos();

  await generateReadMe();
};

create();
