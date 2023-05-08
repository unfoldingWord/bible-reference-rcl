const path = require("path");
const fs = require("fs");
const upperFirst = require("lodash/upperFirst");
const camelCase = require("lodash/camelCase");
const { name, version, repository } = require("./package.json");
const { styles, theme } = require("./styleguide.styles");

let sections = [
  {
    name: "README",
    content: "README.md",
  },
  {
    name: "BibleReference ",
    content: "src/components/BibleReference/_readme.md",
    components: () => {
      const componentNames = ["BibleReference", "useBibleReference"];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/BibleReference`,
          `${componentName}.js`
        );
      });
    },
  },
  {
    name: "ReferenceSelector ",
    content: "src/components/ReferenceSelector/_readme.md",
    components: () => {
      const componentNames = ["ReferenceSelector"];
      return componentNames.map((componentName) => {
        return path.resolve(
          __dirname,
          `src/components/ReferenceSelector`,
          `${componentName}.js`
        );
      });
    },
  },
];

module.exports = {
  title: `${upperFirst(camelCase(name))} v${version}`,
  ribbon: {
    url: repository.url,
    text: "View on GitHub",
  },
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const dirname = path.dirname(componentPath, ".js");
    const file = dirname.split("/").slice(-1)[0];
    const componentName = upperFirst(camelCase(file));
    return `import { ${componentName} } from "${name}";`;
  },
  usageMode: "expand",
  exampleMode: "expand",
  pagePerSection: true,
  sections,
  components: "src/components/**/[A-Z]*.js",
  moduleAliases: {
    "bible-reference-rcl": path.resolve(__dirname, "src"),
  },
  version,
  serverPort: 6060,
  updateExample(props, exampleFilePath) {
    // props.settings are passed by any fenced code block, in this case
    const { settings, lang } = props;
    // "../mySourceCode.js"
    if (settings && typeof settings.file === "string") {
      // "absolute path to mySourceCode.js"
      const filepath = path.resolve(exampleFilePath, settings.file);
      // displays the block as static code
      settings.static = true;
      // no longer needed
      delete settings.file;
      return {
        content: fs.readFileSync(filepath, "utf8"),
        settings,
        lang,
      };
    }
    return props;
  },
  webpackConfig: {
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
  },
};
