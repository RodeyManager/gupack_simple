'use strict';

const
    babelify = require('babelify'),
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

        'build.modules.views': {
            src: 'modules/**/*View.js',
            // 过滤掉不进行编译的文件或目录
            filters: [],
            dest: 'modules',
            loader: {
                'gulp-browserify-multi-entry': {
                    debug: !env.isIf,
                    external: ['jquery'],
                    transform: [ babelify ]
                },
                'gulp-jsminer': jsminer()
            }
        },

        'build.views': {
            src: ['views/**/*.html'],
            dest: 'views',
            rely: ['build.css', 'build.lib.js', 'build.modules.views'],
            loader: htmlLoaders(),
            watch: [
                'views/**/*',
                'components/**/*',
                'templates/**/*',
                'assets/**/*',
                'services/**/*',
                'modules/**/*'
            ]
        },

        'build.lib.js': {
            src: getLibs(),
            dest: 'assets/js',
            loader: {
                'gulp-concat': 'lib.js',
                'gulp-jsminer': jsminer()
            }
        },

        'build.assets': {
            src: 'assets/{fonts,images,js}/**/*',
            filters: [].concat(getLibs()),
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

function jsminer(){
    return {
        _if: env.isProduction,
        preserveComments: '!'
    };
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
