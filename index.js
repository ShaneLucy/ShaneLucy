const MUSTACHE = require("mustache");
const FS = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";
const AXIOS = require("axios");

const DATA = {
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
  currentProject: {
    name: "",
    url: "",
    id: "",
    error: "",
  },
};

const getHeader = async () => {
  try {
    const RESPONSE = await AXIOS.get(
      `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1`
    );

    DATA.headerUrl = RESPONSE.data[0].hdurl;
    DATA.headerDesc = RESPONSE.data[0].title;
  } catch (error) {
    DATA.headerError = error.message;
  }
};

const getCurrentProject = async () => {
  try {
    const RESPONSE = await AXIOS.get(
      `https://api.github.com/users/shanelucy/events`
    );

    DATA.currentProject.name = RESPONSE.data[0].repo.name;
    DATA.currentProject.id = RESPONSE.data[0].repo.id;
  } catch (error) {
    DATA.currentProject.error = error.message;
  }
};

const getRepos = async () => {
  try {
    const RESPONSE = await AXIOS.get(
      `https://api.github.com/users/shanelucy/repos`
    );

    DATA.repos = RESPONSE.data.map((x) => {
      if (x.id === DATA.currentProject.id) {
        DATA.currentProject.url = x.html_url;
      }

      return DATA.repos = {
        name: x.name ? x.name : null,
        language: x.language ? x.language : "null",
        url: x.url ? x.html_url : "null",
        description: x.description ? x.description : "null",
      };
    });
  } catch (error) {
    DATA.reposError = error.message;
  }
};

function generateReadMe() {
   FS.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = MUSTACHE.render(data.toString(), DATA);
    FS.writeFileSync("README.md", output);
  });
}

const create = async () => {
  await getHeader();

  await getCurrentProject();

  await getRepos();

  generateReadMe();
};

create();
