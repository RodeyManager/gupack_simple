'use strict';

const
    path    = require('path'),
    util    = require('util'),
    env     = require('./config/app-env');

const
    // 静态资源版本控制号
    vQueryKey = '_cv',
    hashSize = 10;

//导出模块
module.exports =  {
    env: env.name,
    // 源文件路径, 默认为 src
    sourceDir: env.source.path,
    // 编译产出路径，可以是绝对或者相对路径，默认为 build
    buildDir: env.dest.path,
    // 编译前进行清理
    startClean: true,
    // 默认首页
    indexFile: 'views/index.html',
    // task任务列表
    buildTasks: {
        // ---说明：单个任务配置
        'build.css': {
            src: [
                'assets/css/reset.css',
                'assets/css/**/*'
            ],
            dest: 'assets/css',
            // 依赖task列表
            rely: ['build.assets'],
            loader: cssLoaders('app.min.css'),
            watch: ['assets/css/**/*']
        },

        'build.modules': {
            src: 'modules/**/*',
            // 过滤掉不进行编译的文件或目录
            filters: [
                'modules/model.js',
                'modules/view.js',
                'modules/main.js'
            ],
            dest: 'modules',
            loader: jsLoaders(),
            watch: ['modules/**/*']
        },

        'build.views': {
            src: ['views/**/*.html'],
            dest: 'views',
            rely: ['build.css', 'build.components.js', 'build.lib.js', 'build.app.js', 'build.modules'],
            loader: htmlLoaders(),
            watch: [
                'views/**/*',
                'components/**/*',
                'templates/**/*',
                'assets/**/*'
            ]
        },

        'build.components.js': {
            src: 'components/**/*.js',
            dest: 'assets/js',
            loader: util._extend({
                'gulp-concat': 'components.js'
            }, jsLoaders())
        },

        'build.lib.js': {
            src: getLibs(),
            dest: 'assets/js',
            loader: util._extend({
                'gulp-concat': 'lib.js'
            }, jsLoaders())
        },

        'build.app.js': {
            src: [
                env.configPath,
                'config/app-api.js',
                'modules/main.js',
                'modules/model.js',
                'modules/view.js',
                'assets/js/app.js'
            ],
            dest: 'assets/js',
            loader: util._extend({
                'gulp-concat': 'app.js'
            }, jsLoaders())
        },

        'build.assets': {
            src: 'assets/{fonts,images,js}/**/*',
            filters: [
                'assets/js/app.js',
                'assets/js/components.js',
            ].concat(getLibs()),
            dest: 'assets',
            loader: {
                'gulp-jsminer': {
                    _if: env.isProduction,
                    preserveComments: '!'
                }
            }
        }

    },
    // 发布部署 (sftp)
    deploy: [
        // upload (build/**/*) (stg)
        {
            isExecute: false, // env.isStg
            host: '192.168.1.1',
            user: 'root',
            pass: 'root',
            port: '22',
            remotePath: '/var/www/simple',
            filters: [],
            timeout: 50000
        }
    ]
};

function cssLoaders(fileName){
    return {
        'gulp-merge-css': { fileName: fileName },
        'gulp-recache': recache(env.dest.path + '/assets'),
        'gulp-autoprefixer': {
            browsers: ['> 5%', 'IE > 8', 'last 2 versions']
        },
        'gulp-uglifycss': { _if: env.isProduction }
    }
}

function jsLoaders(){
    return {
        'gulp-babel': gulpBabel(),
        'gulp-jsminer': {
            _if: env.isProduction,
            preserveComments: '!'
        }
    }
}

function htmlLoaders(){
    return {
        'gulp-tag-include': { compress: env.isIf },
        // 版本号（缓存控制）
        'gulp-recache': recache(env.dest.path)
    }
}

function recache(path){
    return {
        _if: env.isIf,
        queryKey: vQueryKey,
        // hash值长度
        hashSize: hashSize,
        // 控制字节大小以内的图片转base64,
        toBase64Limit: 2000,
        basePath: path
    }
}

function getLibs(){
    return [
        'assets/js/lib.js',
        'assets/js/libs/jquery/jquery.min.js',
        'assets/js/plugins/jquery.query.js',
        'assets/js/plugins/jquery.cookie.js'
    ];
}

function gulpBabel(){
    return {
        presets: [ 'es2015', 'es2015', 'es2017', 'stage-2' ],
        plugins: [
            'transform-remove-strict-mode'
        ]
    };
}
