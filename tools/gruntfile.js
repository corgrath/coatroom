module.exports = function( grunt ) {

	"use strict";

	/*
	 * Configuration
	 */

	grunt.initConfig( {
		"jsbeautifier": {
			files: [
				// javascript
				"./gruntfile.js",
				"../main.js",
				"../src/**/*.js",
				"../example/**/*.js",
				// less files
				"../src/**/*.less",
				"../example/**/*.less",
				// html
				"../example/**/*.mustache"
			],
			options: {
				js: {
					indentWithTabs: true,
					spaceInParen: true
				},
				css: {
					fileTypes: [
						".less"
					],
					indentWithTabs: true,
					selectorSeparatorNewline: true,
					newline_between_rules: true,
					end_with_newline: true
				},
				html: {
					fileTypes: [
						".mustache"
					],
					indentWithTabs: true
				}
			}
		},
		jshint: {
			all: [
				"./gruntfile.js",
				"../main.js",
				"../src/**/*.js",
				"../example/**/*.js"
			],
			options: {
				"globals": {
					require: true,
					module: true,
					Buffer: true,
					console: true
				},
				// http://jshint.com/docs/options/#esversion
				// https://github.com/jshint/jshint/blob/master/examples/.jshintrc
				//"strict": "implied",
				"unused": true,
				"undef": true,
				"quotmark": "double",
				"latedef": true
			}
		}
	} );

	/*
	 * Load tasks
	 */

	grunt.loadTasks( "../node_modules/grunt-jsbeautifier/tasks" );
	grunt.loadTasks( "../node_modules/grunt-contrib-jshint/tasks" );

	/*
	 * Register tasks
	 */

	grunt.registerTask( "default", [ "build" ] );
	grunt.registerTask( "build", [ "jsbeautifier", "jshint" ] );

};
