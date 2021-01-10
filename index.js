const Mustache = require("mustache");
const fs = require("fs");
const MUSTACHE_MAIN_DIR = "./main.mustache";
const axios = require("axios");

let DATA = {
  name: "Thomas",
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
  currentProject: {
    name: "",
    url: "",
  },
};

const getRepos = async () => {
  repos = [];
  const response = await axios.get(
    `https://api.github.com/users/shanelucy/repos`
  );

  for (const property in response.data) {
    repos.name = response.data[property].name;
    repos.language = response.data[property].language;
    repos.url = response.data[property].html_url;
    repos.description = response.data[property].description;
    DATA.repos.push({ ...repos });
  }
};

const getCurrentProject = async () => {
  const response = await axios.get(
    `https://api.github.com/users/shanelucy/events`
  );

  DATA.currentProject.name = response.data[0].repo.name;
  DATA.currentProject.url = response.data[0].repo.url;
};

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

const create = async () => {
  await getRepos();

  await getCurrentProject();

  await generateReadMe();
};

create();
