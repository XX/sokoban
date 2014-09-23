module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bowercopy: {
            options: {
                srcPrefix: 'bower_components',
                destPrefix: 'build'
            },
            scripts: {
                files: {
                    'js/jquery.min.js': 'jquery/dist/jquery.min.js',
                    'js/gl-matrix-min.js': 'gl-matrix/dist/gl-matrix-min.js',
                    'js/webgl-utils.js': 'webgl-utils/index.js',
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'sokoban/res',
                    src: '**',
                    dest: 'build'
                }, {
                    expand: true,
                    cwd: 'web',
                    src: '**',
                    dest: 'build'
                }]
            }
        },
        concat: {
            dist: {
                src: ['sokoban/src/**/*.js', 'sokoban/res/**/*.js'],
                dest: 'build/js/sokoban.js'
            }
        },
        watch: {
            sources: {
                files: ['sokoban/src/**'],
                tasks: ['concat'],
                options: {
                    nospawn: true
                }
            },
            static: {
                files: ['sokoban/res/**', 'web/**'],
                tasks: ['newer:copy'],
                options: {
                    nospawn: true
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-newer');

    grunt.registerTask('build', ['bowercopy', 'copy', 'concat']);
    grunt.registerTask('default', ['watch']);
}; 
