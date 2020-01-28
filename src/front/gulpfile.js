const gulp = require('gulp');
const shell = require('gulp-shell');
const shelljs = require('shelljs');
const chalk = require('chalk');
const rimraf = require('rimraf');
const sequence = require('run-sequence');
const packager = require("electron-packager");
const package = require("./package.json");
const path = require('path');

const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});
gulp.task('clean', () => {
    shelljs.echo('Clean dist folder');
    
    shelljs.rm('-rf', './dist');
    
    shelljs.echo(chalk.green(`dist folder is cleaned. `));
});
gulp.task('electron-start', () => {
    return gulp.src('/').pipe(shell('electron ./index.js'));
});

gulp.task('run', () => {
    return sequence('clean', 'build', 'electron-start');
});
