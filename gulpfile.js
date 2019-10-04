//Подключаем модули gulp
const gulp = require('gulp'),
      rename = require('gulp-rename'),
      sourcemaps = require('gulp-sourcemaps'),
      browserSync = require('browser-sync').create(),
      del = require('del');

// Подключение модулей gulp-css
const scss = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer');

//Функции
    //Таск на html
    function html() {
      return gulp.src("src/*.html")
      // Выгрузка скомпилированного html в dist/
      .pipe(gulp.dest('dist/'))
      .pipe(browserSync.stream());
    }
    //Таск на стили
    function styles() {
        // Выбор файла scss
        return gulp.src('src/assets/sass/style.scss')
        // Выполнение sourcemaps начало (возможность видеть ошибку в начальном файле)
        .pipe(sourcemaps.init())
        // Компиляция scss в css
        .pipe(scss({
            errorLogToConsole: true,
            outputStyle: "compressed"
        }))
        // Просмотр ошибок в консоли
        .on('error', console.error.bind(console))
        // Расставление автопрефиксов для кроссбраузерности
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 0.1%'],
            cascade: false
        }))
        // Переименование файла
        .pipe(rename({suffix: '.min'}))
        // Sourcemap конец
        .pipe(sourcemaps.write())
        // Выгрузка скомпилированного css в dist/css
        .pipe(gulp.dest('dist/css'))
        // Обновляет браузер в случае изменения файлов scss
        .pipe(browserSync.stream());
    }

    // Коприование шрифтов
    function fonts(){
        return gulp.src("src/assets/fonts/**/*.ttf")
        .pipe(gulp.dest('dist/fonts'))
    }

    // Копирование изображений
    function img(){
        return gulp.src("src/assets/images/**/*.*")
        .pipe(gulp.dest('dist/images'))
    }

	//Функция для автообновления файлов в случае их изменения
    function watch(){
    // Запуск browserSync
        browserSync.init({
            server: {
                baseDir: "dist/"
            },
            port: 3000
        });
    // Запуск функции converter в случае изменения файлов стилей scss
        gulp.watch('src/assets/sass/**/*.scss', styles);
    // Обновляет браузер в случае изменения html
        gulp.watch("src/*.html").on('change', html);

    }

    function clean(){
        return del(['dist/*']);
    }

// ТАСКИ
    //Компилирование файлов стилей и скриптов по отдельности
    gulp.task('html', html);
    gulp.task('styles', styles);
    gulp.task('fonts', fonts);
    gulp.task('img', img);
// Автоматическое компилирование файлов и запуск browserSync
    gulp.task('watch', watch);
// Удаление файлов в dist и компилирование новых файлов
    gulp.task('dist', gulp.series(clean,
                      gulp.parallel('html', 'styles', 'fonts', 'img')
                      ));
// Удаление файлов в dist и компилирование новых файлов + автоматическое компилирование файлов
    gulp.task('dev', gulp.series('dist', 'watch'));
