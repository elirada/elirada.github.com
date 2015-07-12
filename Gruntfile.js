/*
 * Generated on 2014-06-15
 * generator-assemble v0.4.11
 * https://github.com/assemble/generator-assemble
 *
 * Copyright (c) 2014 Hariadi Hinta
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('underscore');

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    config: {
      src: 'src',
      dist: 'dist'
    },

    watch: {
      assemble: {
        files: ['<%= config.src %>/{content,data,templates,js,sass}/{,*/,*/*/}*.{md,hbs,yml,js,scss.json}'],
        tasks: ['browserify', 'assemble', 'string-replace']
      },
      sass: {
        files: ['<%= config.src %>/sass/**/*.scss'],
        tasks: ['sass', 'cssflip']
      },
      images: {
        files: ['<%= config.src %>/images/**/*.jpg'],
        tasks: ['copy:images']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>',
          open: true
        },
        files: [
          '<%= config.dist %>/{,*/}*.html',
          '<%= config.dist %>/assets/{,*/}*.css',
          '<%= config.dist %>/assets/{,*/}*.js',
          '<%= config.dist %>/assets/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    connect: {
      options: {
        port: 9002,
        livereload: 35727,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= config.dist %>'
          ]
        }
      }
    },

    assemble: {
      pages: {
        options: {
          flatten: true,
          assets: '<%= config.dist %>/assets',
          bower: 'bower_components/',
          layoutdir: '<%= config.src %>/templates/layouts/',
          layout: 'default.hbs',
          data: '<%= config.src %>/data/*.{json,yml}',
          partials: '<%= config.src %>/templates/partials/*.hbs',
          plugins: ['assemble-contrib-permalinks','assemble-contrib-sitemap'],
          pictures: _.map(grunt.file.expand('src/images/pictures/*'), function (path, index) {
            return {
              name: path.replace('src/images/pictures/', ''),
              col: index % 3
            };
          }),
          collections: [
            {
              name: 'menu',
              sortby: 'menuIndex'
            },
            {
              name: 'column',
              sortby: 'columnIndex'
            },
            {
              name: 'news',
              sortby: 'date',
              sortorder: 'descending'
            }
          ]
        },
        files: {
          '<%= config.dist %>/': ['<%= config.src %>/templates/pages/*.hbs'],
          '<%= config.dist %>/columns/': ['<%= config.src %>/content/columns/**/*.hbs'],
          '<%= config.dist %>/news/': ['<%= config.src %>/content/news/**/*.hbs']
        }
      }
    },

    // Before generating any new files,
    // remove any previously-created files.
    clean: ['<%= config.dist %>/**/*.{html,xml}'],

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    },

    browserify: {
      dist: {
        files: {
          'dist/assets/js/main.js': ['src/js/main.js'],
        },
        options: {
        }
      }
    },

    sass: {                                 // task
        dist: {                             // target
            files: {                        // dictionary of files
                'dist/assets/css/theme.css': 'src/sass/theme.scss'     // 'destination': 'source'
            }
        }
    },

    cssflip: {
      main: {
        options: {
        },
        files: {
          'dist/assets/css/theme-rtl.css': 'dist/assets/css/theme.css'
        }
      }
    },

    copy: {
      cname: {
        src: 'CNAME',
        dest: 'dist/CNAME'
      },
      images: {                         // Another target
        expand: true,                  // Enable dynamic expansion
        cwd: 'src/images/',                   // Src matches are relative to this path
        src: ['**/*.{png,jpg,JPG,gif,ico}'],   // Actual patterns to match
        dest: 'dist/assets/images/'                  // Destination path prefix
      }
    },

    imagemin: {
      // images: {                         // Another target
      //   files: [{
      //     expand: true,                  // Enable dynamic expansion
      //     cwd: 'src/images/',                   // Src matches are relative to this path
      //     src: ['**/*.{png,jpg,JPG,gif,ico}'],   // Actual patterns to match
      //     dest: 'dist/assets/images/'                  // Destination path prefix
      //   }]
      // }
    },

    'string-replace': {
      options: {
        replacements: [{
            pattern: /dist\//igm,
            replacement: ''
          }
        ]
      },
      sitemap: {
        files: {
          'dist/sitemap.xml': 'dist/news/sitemap.xml',
        },
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true
      },
      local: {
        options: {
          remote: '../',
          branch: 'master'
        }
      }
    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-css-flip');

  grunt.loadNpmTasks('grunt-build-control');

  grunt.registerTask('release', [
    'buildcontrol'
  ]);

  grunt.registerTask('serve', [
    'clean',
    'assemble',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy',
    // 'imagemin',
    'browserify',
    'sass',
    'cssflip',
    'assemble',
    'string-replace'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);

};
