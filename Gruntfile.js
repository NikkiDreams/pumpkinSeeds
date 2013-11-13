/* This is provided to help compile the library of LESS files.
*	Author: Nichole Shannon
*	Date: 11.04.2013
*
* Use: $ grunt watch ; to automatically watch any changes to the LESS files and fire off a build
* Use: $ grunt less ; to manually build and deploy the LESS files and fire off a build
* Use: $ grunt less:core ; to manually build and deploy a sleceted set of the LESS files
* SEE grunt.registerTask entries at the bottom of this file for more options
* This is a custom modification of @tbranyen's fantastic
* boilerplate-handlebars-layoutmanager project gruntfile
*
* NOTE: for this to work you need to install the below npm tasks
* (e.g. grunt-handlebars) at the same level as your grunt.js file
* for the grunt.loadNpmTasks() to work
*/

module.exports = function(grunt) {
	"use strict";
	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}

	var gzip = require( "gzip-js" ),
		srcHintOptions = readOptionalJSON( "<%= pkg.directories.src.js %>/.jshintrc" );

	grunt.log.write(" ------------------------------------------------ ^ Hi! ^ \n ");

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist: ['<%= pkg.directories.site.loc %>/', '<%= pkg.directories.dist.loc %>/']
		},

		concat: {
	      options: {
	        banner: '<%= banner %><%= jqueryCheck %>',
	        stripBanners: false,
	         // define a string to put between each file in the concatenated output
	        separator: ';'
	      },
	      pks: {
	      	// the files to concatenate
	        src: [
	          '<%= pkg.directories.src.js %>/<%= pkg.name %>.core.js',
	          '<%= pkg.directories.src.js %>/<%= pkg.name %>.core.config.js',
	          '<%= pkg.directories.src.js %>/<%= pkg.name %>.api.js',
	          '<%= pkg.directories.src.js %>/<%= pkg.name %>.templates.js'
	        ],
	        dest: '<%= pkg.directories.dist.loc %>/js/<%= pkg.name %>-dev-<%= pkg.version %>.js'
	      }
	    },

	    jshint: {
			options: {
				ignores: ['<%= pkg.directories.src.js %>/io.mev/**/*.js'],
				jshintrc: "<%= pkg.directories.src.loc %>/.jshintrc"
			},
			src: {
				src: "<%= pkg.directories.src.js %>/**/*.js"
			}
			/*
			site: {
				src: ["<%= pkg.directories.site.js %>/<%= pkg.name %>-*.js"],
				exclude: [ "<%= pkg.directories.site.js %>/io.mev" ],
				options: srcHintOptions
			},
			tests: {
				src: "<%= pkg.directories.test %>/ ** /*.js",
				options: {
					jshintrc: "<%= pkg.directories.test %>/.jshintrc",
					ignores: ['jquery.*','io.*']
				}
			}
			*/
		},

		jsonlint: {
			pkg: {
				src: [ "package.json" ]
			},

			jscs: {
				src: [ ".jscs.json",  ]
			},

			bower: {
				src: [ "bower.json" ]
			}
		},
		
		uglify: {
			all: {
				files: {
					"<%= pkg.directories.dist.loc %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js": [ 
						'<%= pkg.directories.src.js %>/<%= pkg.name %>.core.js',
				        '<%= pkg.directories.src.js %>/<%= pkg.name %>.core.config.js',
				        '<%= pkg.directories.src.js %>/<%= pkg.name %>.api.js',
				        '<%= pkg.directories.src.js %>/<%= pkg.name %>.templates.js' 
				        ]
				},
				options: {
					preserveComments: false,
					sourceMap: "<%= pkg.directories.dist.loc %>/js/<%= pkg.name %>.min.map",
					sourceMappingURL: "<%= pkg.name %>.min.map",
					report: "min",
					beautify: {
						ascii_only: true
					},
					banner: "/*! PKS v<%= pkg.version %> | " +
						'<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> | ' +
						"(c) 2010 Nichole Shannon && NikkiDreams */\n",
					compress: {
						hoist_funs: false,
						loops: false,
						unused: false
					}
				}
			}
		},


		qunit: {
			files: ['<%= pkg.directories.test %>/**/*.html']
		},
		/*
		minify: {
			
		},
		*/
		less: {
			core: {
				options: {
					// Set the option to compress the resulting css.
					less: true
				},
				files: [{
						expand: true,        // Enable dynamic expansion.
						cwd: '<%= pkg.directories.src.less %>',  // Src matches are relative to this path.
						src: ['<%= pkg.name %>.less','<%= pkg.name %>-responsive.less'],     // Actual pattern(s) to match.
						dest: '<%= pkg.directories.dist.loc %>/css',  // Destination path prefix.
						ext: '-<%= pkg.version %>.css'         // Dest filepaths will have this extension.
				}]
			}
			/*
			mobile_themes: {
				options: {
					// Set the option to compress the resulting css.
					less: true
				},
				files: [{
						expand: true,        // Enable dynamic expansion.
						cwd: '<%= pkg.directories.src.less_themes %>',  // Src matches are relative to this path.
						src: ['<%= pkg.themes.source.mobile %>'],     // Actual pattern(s) to match.
						dest: '<%= pkg.directories.site.themes %>/',  // Destination path prefix.
						//ext: '.css',         // Dest filepaths will have this extension.
						rename: function(dest, src) {
							return dest + src.substring(0, src.indexOf('/')) + "/"+ src.substring(0, src.indexOf('/'))  +'_mobile.css';
						}
				}]
			},
			responsive_themes: {
				options: {
					// Set the option to compress the resulting css.
					less: true
				},
				files: [{
					expand: true,        // Enable dynamic expansion.
					cwd: '<%= pkg.directories.src.less_themes %>',  // Src matches are relative to this path.
					src: ['<%= pkg.themes.source.responsive %>'],     // Actual pattern(s) to match.
					dest: '<%= pkg.directories.site.themes %>/',  // Destination path prefix.
					//ext: '.css',         // Dest filepaths will have this extension.
					rename: function(dest, src) {
						return dest + src.substring(0, src.indexOf('/')) + "/"+ src.substring(0, src.indexOf('/'))  +'_responsive.css';
					}
				}]
			}
			*/
		},
		copy: {
			html: {
				files: [{
					expand: true,        // Enable dynamic expansion.
					cwd: '<%= pkg.directories.src.static %>',  // Src matches are relative to this path.
					src: ['assets/*/*.*','index.html'],     // Actual pattern(s) to match.
					dest: '<%= pkg.directories.site.loc %>'  // Destination path prefix.
				}]
			},
			css: {
				files: [{
					expand: true,        // Enable dynamic expansion.
					cwd: '<%= pkg.directories.dist.loc %>',  // Src matches are relative to this path.
					src: ['css/*.*',],     // Actual pattern(s) to match.
					dest: '<%= pkg.directories.site.assets %>'  // Destination path prefix.
				}]
			},
			js: {
				files: [{
					expand: true,        // Enable dynamic expansion.
					cwd: '<%= pkg.directories.dist.loc %>',  // Src matches are relative to this path.
					src: ['js/*.*',],     // Actual pattern(s) to match.
					dest: '<%= pkg.directories.site.assets %>'  // Destination path prefix.
				}]
			}
		},
		
		watch: {
			// Keep an eye on those stylesheets.
			css: {
				// The path 'less/**/*.less' will expand to match every less file in
				// the less directory.
				files: [ '<%= pkg.directories.src.less %>/**/*.less' ],
				// The tasks to run
				tasks: [ 'less', 'copy:css', 'sed:css' ]
			},
			scripts: {
				// The path 'less/**/*.less' will expand to match every less file in
				// the less directory.
				files: [ '<%= pkg.directories.src.js %>/**/*.js' ],
				// The tasks to run
				tasks: [ 'jshint', 'uglify', 'concat', 'copy:js' ]
			},
			html: {
				// The path 'less/**/*.less' will expand to match every less file in
				// the less directory.
				files: [ '<%= pkg.directories.src.loc %>/index.html' ],
				// The tasks to run
				tasks: [ 'copy:html', 'sed:html' ]
			},
			images: {
				// The path 'less/**/*.less' will expand to match every less file in
				// the less directory.
				files: [ '<%= pkg.directories.src.less %>/**/images/*', '<%= pkg.directories.src.less %>/**/fonts/*' ],
				// The tasks to run
				tasks: [ 'copy' ]
			}
		},

		sed: {
			html: {
				pattern: '{{%VERSION%}}',
				replacement: '<%= pkg.version %>',
				path: '<%= pkg.directories.site.loc %>/index.html',
				recursive: false
			},
			css: {
				pattern: '{{%VERSION%}}',
				replacement: '<%= pkg.version %>',
				path: '<%= pkg.directories.site.loc %>/assets/css/',
				recursive: true
			},
			data: {
				pattern: '{{%VERSION%}}',
				replacement: '<%= pkg.version %>',
				path: '<%= pkg.directories.site.loc %>/assets/data/',
				recursive: true
			}
		}

	});
	// Load grunt tasks from NPM packages
	//require( "load-grunt-tasks" )( grunt );

	// Integrate PKS specific tasks
	// grunt.loadTasks( "build/tasks" );

	// Default task.
	// These are the tasks that get run when you run Grunt without any arguments.
	// To add more tasks, just add them to the array.
	grunt.registerTask('all', [ 'less', 'copy' ]);
	grunt.registerTask('default', [ 'clean', 'jsonlint', 'jshint', 'less', 'uglify', 'concat', 'copy', 'sed' ]);
	grunt.registerTask('core', [ 'less:core' ]);
	grunt.registerTask('themes', [ 'less:mobile_themes', 'less:responsive_themes' ]);
	grunt.registerTask('mobile', [ 'less:mobile_themes' ]);
	grunt.registerTask('responsive', [ 'less:responsive_themes' ]);


	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-clean');
  	grunt.loadNpmTasks('grunt-contrib-concat');
  	grunt.loadNpmTasks('grunt-contrib-connect');
  	grunt.loadNpmTasks('grunt-contrib-copy');
  	grunt.loadNpmTasks('grunt-contrib-jshint');
  	grunt.loadNpmTasks('grunt-jsonlint');
  	grunt.loadNpmTasks('grunt-contrib-less');
  	grunt.loadNpmTasks('grunt-contrib-qunit');
  	grunt.loadNpmTasks('grunt-contrib-uglify');
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-html-validation');
  	grunt.loadNpmTasks('grunt-sed');

	

	grunt.log.write(" ------------------------------------------------ ^ Bye! ^ \n");

};