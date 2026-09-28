import { remark } from "remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { icon } from "./icons.mjs";
import {writeFileSync} from "fs"
import github from "./assets/github.json" with { type: "json" };
import wakatime from "./assets/wakatime.json" with { type: "json" };

// horizontal table: icons in the header row, values in the row below
const table = (items) => ({
  type: "table",
  align: items.map(() => "center"),
  children: [
    { type: "tableRow", children: items.map(([html]) => ({ type: "tableCell", children: [{ type: "html", value: html }] })) },
    { type: "tableRow", children: items.map(([, value]) => ({ type: "tableCell", children: [{ type: "text", value: String(value) }] })) },
  ],
});

const top = (entries, kind) => entries.map(({name, percent}) => ({name, percent: Math.round(percent)})).filter(({percent}) => percent > 0).sort((a, b) => b.percent - a.percent).slice(0, 10).map(({name, percent}) => [icon(kind, name), percent + "%"]);

const stat = (name, title) => `<img src="assets/icons/${name}.svg" width="24" height="24" alt="${title}" title="${title}" />`;

const md = remark().use(remarkGfm).use(remarkStringify).stringify({
  type: "root",
  children: [
    { type: "heading", depth: 3, children: [{ type: "text", value: "Hi there" }] },
    { type: "heading", depth: 3, children: [{ type: "text", value: "Some github stats" }] },
    table([
      [stat("pullrequest", "pull requests"), github.stats.pullRequests.totalCount],
      [stat("commit", "contributions in the last year"), github.stats.contributionsCollection.contributionCalendar.totalContributions],
      [stat("issue", "issues"), github.stats.issues.totalCount],
      [stat("star", "stars"), github.stats.repositories.nodes.reduce((acc, node) => acc + (node?.stargazerCount || 0), 0)],
      [stat("merge", "repositories contributed to"), github.stats.repositoriesContributedTo.totalCount],
    ]),
    { type: "paragraph", children: [{ type: "text", value: "According to github stats here are languages used in repositories under my account" }] },
    table(Object.entries(github.languages.repositories.nodes.flatMap(node => node.languages.edges.map(edge => edge.node.name)).reduce((acc, x) => Object.assign(acc, {[x]: (acc[x] || 0) + 1}), {})).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([language, count]) => [icon("languages", language), Math.round(count/github.languages.repositories.nodes.length*100) + "%"])),
    { type: "paragraph", children: [
      { type: "text", value: "and here are languages I'm used to code with for last month according to " },
      { type: "link", url: "https://wakatime.com/@67b0932f-7fe8-4117-a47a-87e37d1b0d05", children: [{ type: "text", value: "wakatime report" }] },
    ] },
    table(top(wakatime.languages, "languages")),
    { type: "paragraph", children: [{ type: "text", value: "Apps I spend my time in" }] },
    table(top(wakatime.editors, "editors")),
    { type: "paragraph", children: [{ type: "text", value: "I'm coding on" }] },
    table(top(wakatime.operating_systems, "platforms")),
  ],
});

writeFileSync("README.md", md, "utf-8");

console.log(md);
