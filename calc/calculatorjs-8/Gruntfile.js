module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dest: {
                src: [
                    'src/sum.js',
                    'src/product.js'
                ],
                dest: "dist/calculator.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        compare_size: {
            files: [
                'dist/<%= pkg.name %>.js',
                'dist/<%= pkg.name %>.min.js'
            ]
        },
        qunit: {
            files: [
                "tests/*.html",
                "tests/*.min.html"
            ]
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            files: [
                "dist/*.js",
                "!dist/*.min.js"
            ]
        },
        jsdoc : {
            dist : {
                src: ['src/*.js', 'tests/*.js', 'README.md'],
                dest: 'doc'
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-compare-size');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('build', ['concat', 'uglify', 'compare_size']);

    // Test task(s).
    grunt.registerTask('test', ['jshint', 'qunit']);

    // Default task(s).
    grunt.registerTask('default', ['build', 'test']);
};