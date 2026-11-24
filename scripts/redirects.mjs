import { readdirSync } from "node:fs";
export const redirects = new Map(
  [
    ["/foundations/http/", "/notes/http/"],
    ["/foundations/software-delivery/", "/notes/software-delivery/"],
    ["/security/tool-boundaries/", "/notes/tool-boundaries/"],
    ["/projects/tool-guard/", "/notes/tool-guard/"],
    ["/thinking/evidence/", "/notes/evidence/"],
    ["/design/visual-explanation/", "/notes/visual-explanation/"],
    ["/global/job-research/", "/notes/job-research/"],
    ["/foundations/", "/"],
    ["/security/", "/"],
    ["/thinking/", "/"],
    ["/design/", "/"],
    ["/global/", "/"],
    ["/projects/", "/"],
    ["/paths/first-project/", "/"],
    ["/review/", "/about/#historical-data"],
  ].concat(
    readdirSync("archive/legacy-jekyll/_posts")
      .filter((name) => name.endsWith(".md"))
      .map((name) => [
        "/posts/" +
          name.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "") +
          "/",
        "/archive/",
      ]),
    ["categories", "tags", "archives"].map((name) => [
      "/" + name + "/",
      "/archive/",
    ]),
  ),
);
