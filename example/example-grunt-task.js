/*
 * This is an example on how to use Coatroom as a grunt task
 */

var coatroom = require( "coatroom" );

module.exports = function( grunt ) {

	grunt.registerTask( "build-coatroom", function() {

		var done = this.async();

		coatroom( {
			title: "Component library example",
			input: {
				components: "example/input/components/",
				less: [
					"example/input/less/colors.less"
				],
				styleguides: {
					"Introduction": "example/input/styleguides/introduction.md",
					"Colors": "example/input/styleguides/colors.md"
				}
			},
			output: {
				overview: "example/output/components.generated.html",
				less: "example/output/components.generated.less",
				css: "example/output/components.generated.css"
			},
			validation: {
				disallowedCSSRules: [
					"position=static",
					"position=fixed",
					"float",
					"margin"
				],
				disallowedCSSUnits: [
					"cm",
					"mm",
					"in",
					"vw"
				]
			}
		} ).catch( function( error ) {

			grunt.fail.fatal( error.stack || JSON.stringify( error, null, "\t" ) );

		} ).finally( function() {

			done();

		} );

	} );

};
