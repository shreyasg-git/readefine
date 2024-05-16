const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Reloader = require("advanced-extension-reloader-watch-2/umd/reloader");

const reloader = new Reloader({
  port: 6223,
});

reloader.watch();

module.exports = {
  entry: {
    index: "./src/popup/index.tsx",
    foreground: "./src/foreground/foreground.tsx",
    background: "./src/background/background.ts",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        exclude: /node_modules/,
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "manifest.json", to: "../manifest.json" }],
    }),
    ...getHtmlPlugins(["index"]),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap("done", (stats) => {
          const an_error_occured = stats.compilation.errors.length !== 0;

          if (an_error_occured) {
            reloader.play_error_notification();
          } else {
            reloader.reload({
              ext_id: "dphafhlelejgffkmbmnmomfehnekdnlj",
              play_sound: true,
            });
          }
        });
      },
    },
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js",
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HTMLPlugin({
        title: "React extension",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
