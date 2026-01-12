import { remark } from "remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { icon } from "./icons.mjs";
import {writeFileSync} from "fs"
import github from "./assets/github.json" with { type: "json" };
import wakatime from "./assets/wakatime.json" with { type: "json" };

const md = remark().use(remarkGfm).use(remarkStringify).stringify({
  type: "root",
  children: [
    { type: "heading", depth: 3, children: [{ type: "text", value: "Hi there" }] },
    { type: "heading", depth: 3, children: [{ type: "text", value: "Last contributions" }] },
    {
      type: "table",
      children: github.contributions.edges.map(edge => ({
        type: "tableRow",
        children: [
          { type: "tableCell", children: [{ type: "text", value: edge?.node?.repository?.nameWithOwner }] },
          { type: "tableCell", children: [{
          type: "link",
          url: edge?.node?.url,
          children: [{ type: "text", value: edge?.node?.title }],
        }] }
        ],
      }))
    },
    { type: "heading", depth: 3, children: [{ type: "text", value: "Some github stats" }] },
    {
      type: "table",
      children: [
        {
          type: "tableRow",
          children: [
            {type: "tableCell", children: [{type: "html", value: '<img src="assets/icons/pullrequest.svg" width="24" height="24" alt="requests" title="requests" />'}]},
            {type: "tableCell", children: [{type: "html", value: '<img src="assets/icons/commit.svg" width="24" height="24" alt="commits" title="commits" />'}]},
            {type: "tableCell", children: [{type: "html", value: '<img src="assets/icons/issue.svg" width="24" height="24" alt="issues" title="issues" />'}]},
            {type: "tableCell", children: [{type: "html", value: '<img src="assets/icons/star.svg" width="24" height="24" alt="stars" title="stars" />'}]},
            {type: "tableCell", children: [{type: "html", value: '<img src="assets/icons/merge.svg" width="24" height="24" alt="contributions" title="contributions" />'}]},
          ]
        },
        {
          type: "tableRow",
          children: [
            {type: "tableCell", children: [{type: "text", value: String(github.stats.repositoriesContributedTo.totalCount)}]},
            {type: "tableCell", children: [{type: "text", value: String(github.stats.contributionsCollection.totalCommitContributions)}]},
            {type: "tableCell", children: [{type: "text", value: String(github.stats.issues.totalCount)}]},
            {type: "tableCell", children: [{type: "text", value: String(github.stats.followers.totalCount)}]},
            {type: "tableCell", children: [{type: "text", value: String(github.stats.repositoriesContributedTo.totalCount)}]},
          ]
        }
      ]
    },
    { type: "paragraph", children: [{ type: "text", value: "According to github stats here are languages used in repositories under my account" }] },
    {
      type: "table",
      children: Object.entries(github.languages.repositories.nodes.flatMap(node => node.languages.edges.map(edge => edge.node.name)).reduce((acc, x) => Object.assign(acc, {[x]: (acc[x] || 0) + 1}), {})).sort((a, b) => b[1] - a[1]).map(entry => [entry[0], parseFloat((entry[1]/github.languages.repositories.nodes.length*100).toFixed(2))]).splice(0, 10).map(([language, percent]) => ({
        type: "tableRow",
        children: [
          { type: "tableCell", children: [{ type: "html", value: icon("languages", language) }] },
          { type: "tableCell", children: [{ type: "text", value: percent + "%" }] },
        ],
      }))
    },
    { type: "paragraph", children: [{ type: "text", value: "and here are languages I'm used to code with for last month according to [wakatime report](https://wakatime.com/@67b0932f-7fe8-4117-a47a-87e37d1b0d05)" }] },
    {
      type: "table",
      children: wakatime.languages.sort((a, b) => b.percent - a.percent).slice(0, 10).map(({name, percent}) => ({
        type: "tableRow",
        children: [
          { type: "tableCell", children: [{ type: "html", value: icon("languages", name) }] },
          { type: "tableCell", children: [{ type: "text", value: percent.toFixed(2) + "%" }] },
        ],
      }))
    },
    { type: "paragraph", children: [{ type: "text", value: "I'm coding in" }] },
    {
      type: "table",
      children: wakatime.editors.sort((a, b) => b.percent - a.percent).slice(0, 10).map(({name, percent}) => ({
        type: "tableRow",
        children: [
          { type: "tableCell", children: [{ type: "html", value: icon("editors", name) }] },
          { type: "tableCell", children: [{ type: "text", value: percent.toFixed(2) + "%" }] },
        ],
      }))
    },
    { type: "paragraph", children: [{ type: "text", value: "I'm coding on" }] },
    {
      type: "table",
      children: wakatime.operating_systems.sort((a, b) => b.percent - a.percent).slice(0, 10).map(({name, percent}) => ({
        type: "tableRow",
        children: [
          { type: "tableCell", children: [{ type: "html", value: icon("platforms", name) }] },
          { type: "tableCell", children: [{ type: "text", value: percent.toFixed(2) + "%" }] },
        ],
      }))
    },
  ],
});

writeFileSync("README.md", md, "utf-8");

console.log(md);
