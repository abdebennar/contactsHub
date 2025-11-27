import fs from "fs";
import path from "path";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
]);

function isVisible(name) {
  return !name.startsWith("."); // no dotfiles
}

function printTree(dir, prefix = "") {
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => {
      // skip invisible files and ignored dirs
      if (!isVisible(entry.name)) return false;
      if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) return false;
      return true;
    });

  entries.forEach((entry, index) => {
    const connector = index === entries.length - 1 ? "└── " : "├── ";
    const fullPath = path.join(dir, entry.name);

    console.log(prefix + connector + entry.name);

    // If FILE → print content
    if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, "utf8");

      const filePrefix =
        index === entries.length - 1 ? "    " : "│   ";

      console.log(
        prefix +
          filePrefix +
          "----- FILE CONTENT START --------------------------------"
      );

      content.split("\n").forEach((line) => {
        console.log(prefix + filePrefix + line);
      });

      console.log(
        prefix +
          filePrefix +
          "----- FILE CONTENT END ----------------------------------"
      );
    }

    // If DIRECTORY → recurse
    if (entry.isDirectory()) {
      const newPrefix =
        index === entries.length - 1 ? "    " : "│   ";
      printTree(fullPath, prefix + newPrefix);
    }
  });
}

printTree(process.argv[2] || ".");
