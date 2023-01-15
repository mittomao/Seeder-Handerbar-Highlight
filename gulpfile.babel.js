import path from 'path';
import glob from 'glob';
import gulp from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import handlebars from 'gulp-compile-handlebars';
import layouts from 'handlebars-layouts';
import del from 'del';
import minimist from 'minimist';
import browserSync from 'browser-sync';
import handlebarAssets from './handlebar-helpers/index';
import { registerHandlebarsRender } from './handlebar-helpers/utils/compile';
import handlebarsCache from './handlebar-helpers/utils/cache';
import webpack from 'webpack-stream';

const { helpers, decorators } = handlebarAssets;

const getRunningEnv = () => {
  const { env = 'development' } = minimist(process.argv.slice(2));
  return env;
};

const getConfigs = () => {
  const env = getRunningEnv();

  const stylesConfPath = `./conf/styles-conf/${env}/`;
  const templatesConfPath = `./conf/templates-conf/${env}`;
  const envConf = require('./conf/development.json');

  return {
    stylesConfPath,
    templatesConfPath,
    ...envConf,
  };
};

// Please keep this top most
const configs = getConfigs();
const { buildFolders, outputFolders, stylesConfPath, templatesConfPath, vendors, base, pagesBasePath } = configs;
const { contentsPaths, stylesPaths, scriptsPaths, assetsPaths, htmlPaths, partialsPaths,
  layoutsPath, pagesPath } = buildFolders;
const { tmpPath, distPath, sitecorePath } = outputFolders;

const registerDecorators = (hbEnv, registeringDecorators) => {
  if (!hbEnv || !registeringDecorators) {
    return;
  }

  for (const [ key, value ] of Object.entries(registeringDecorators)) {
    hbEnv.registerDecorator(key, value);
  }
};

const registerHandlebarsLayouts = hbEnv => hbEnv.registerHelper(layouts(hbEnv));

const getWebpackEntries = () => {
  let entry = {
    'app': glob.sync('./src/scripts/*.js')
  };

  let pagePaths = glob.sync('./src/scripts/pages/*.js');

  if (pagePaths.length) {
    // Get name from path, e.g ./src/scripts/pages/login.js => login
    let pageNames = pagePaths.map(path => path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.js')));

    pageNames.forEach((name, index) => {
      entry[name] = pagePaths[index];
    });
  }

  return entry;
};

const webpackConfig = {
  mode: 'production',
  optimization: {
    minimize: true
  },
  devtool: 'source-map',
  entry: getWebpackEntries(),
  output: {
    filename: '[name].min.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/scripts'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ]
          }
        }
      }
    ]
  }
};

export const html = () => {
  invalidateFileCache();
  const hbEnv = handlebars.Handlebars;
  registerDecorators(hbEnv, decorators);
  registerHandlebarsLayouts(hbEnv);
  registerHandlebarsRender(handlebars.Handlebars);
  const renderingVariables = require(`${templatesConfPath}/config.json`);

  renderingVariables.hasVendorScripts = !!vendors.scripts;
  renderingVariables.hasVendorStyles = !!vendors.styles;

  const options = {
    ignorePartials: true,
    batch: [ ...partialsPaths, layoutsPath ],
    helpers,
  };

  return gulp.src(pagesPath, { base: pagesBasePath, nodir: true })
    .pipe(handlebars({ ...renderingVariables }, options))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(tmpPath));
};

export const styles = () => {
  return gulp.src(stylesPaths)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [ '.', stylesConfPath ]
    }).on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${tmpPath}styles`));
};

export const stylesVendor = () => {
  return gulp.src(vendors.styles)
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.css'))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${tmpPath}styles`));
};

export const fontsVendor = () => {
  return gulp.src(vendors.fonts)
    .pipe(gulp.dest(`${tmpPath}assets/fonts`));
};

export const staticsVendor = () => {
  return gulp.src(vendors.statics)
    .pipe(gulp.dest(`${tmpPath}assets/statics`));
};

export const scriptsBase = () => {
  return gulp.src(base.scripts)
    .pipe(gulp.dest(`${tmpPath}scripts`));
};

export const scriptsVendor = () => {
  return gulp.src(vendors.scripts)
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest(`${tmpPath}scripts`));
};

export const scripts = () => {
  return gulp.src(scriptsPaths, { sourcemaps: true })
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(`${tmpPath}scripts`, { sourcemaps: true }));
};

export const assets = () => {
  return gulp.src(assetsPaths)
    .pipe(gulp.dest(`${tmpPath}assets`));
};

export const reload = (done) => {
  browserSync.reload();
  done();
};

export const hosting = () => {
  browserSync({
    notify: false,
    port: 8081,
    server: {
      baseDir: [ tmpPath ],
      index: 'pages.html'
    },
    startPath: 'index.html'
  });
};

export const clean = () => del([ tmpPath, distPath ]);

const watch = () => {
  gulp.watch(stylesPaths, { usePolling: true }, gulp.series(styles, reload));
  gulp.watch(scriptsPaths, { usePolling: true }, gulp.series(scripts, reload));
  gulp.watch(assetsPaths, { usePolling: true }, gulp.series(assets, reload));
  gulp.watch(htmlPaths, { usePolling: true }, gulp.series(html, reload));
  gulp.watch(contentsPaths, { usePolling: true }, gulp.series(html, reload));
};

const copyToDistPath = () => {
  return gulp.src(`${tmpPath}**/*`)
    .pipe(gulp.dest(distPath));
};

const copyToCode = () => {
  return gulp.src([
    `${tmpPath}**/*`,
    `!${tmpPath}**/*.map`,
    `!${tmpPath}assets/images`,
    `!${tmpPath}assets/images/**/*`,
    `!${tmpPath}styles/components`,
    `!${tmpPath}styles/components/**/*`,
  ])
    .pipe(gulp.dest(sitecorePath));
};

const invalidateFileCache = () => {
  handlebarsCache.invalidate();
  return gulp;
};

export const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    scriptsBase,
    scriptsVendor,
    fontsVendor,
    staticsVendor,
    assets
  ),
  copyToDistPath
);

export const compile = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    scriptsBase,
    scriptsVendor,
    fontsVendor,
    staticsVendor,
    assets
  ),
  copyToCode
);

gulp.task('dev', gulp.series(build, gulp.parallel(hosting, watch)));
gulp.task('default', build);