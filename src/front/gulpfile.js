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
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});
gulp.task('clean', () => {
    shelljs.echo('Clean dist folder');

    shelljs.rm('-rf', './dist');

    shelljs.echo(chalk.green(`dist folder is cleaned. `));
});
gulp.task('assets', () => {
    gulp.src('./src/assets/**/*.*')
        .pipe(gulp.dest('./dist/assets/'));

    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist/'));
});
gulp.task('electron-start', () => {
    return gulp.src('/').pipe(shell('electron ./../../dist/main.js'));
});

gulp.task('output', () => {
    return gulp.src('./dist/**/*.*')
        .pipe(gulp.dest('./../../dist/'));
});

gulp.task('run', () => {
    return sequence('clean', 'build', 'assets', 'output', 'electron-start');
});

gulp.task('build:all', ()=>{
    return sequence('clean', 'build', 'assets', 'output');
});

gulp.task('local', ()=>{
    return gulp.src('/').pipe(shell('electron ./dist/main.js'));
});