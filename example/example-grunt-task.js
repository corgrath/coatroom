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
                lessModifyVars: {
                    "colorClouds": "#ecf0f1",
                    "colorTurquoise": "#1abc9c",
                    "colorEmerald": "#2ecc71",
                    "colorSky": "#3498db",
                    "colorAmethyst": "#9b59b6",
                    "colorApshalt": "#34495e",
                    "colorOrange": "#f39c12",
                    "colorLava": "#c0392b",
                    "colorConcrete": "#95a5a6"
                },
                styleguides: {
                    "Introduction": "example/input/styleguides/introduction.md",
                    "Colors": "example/input/styleguides/colors.md"
                },
                scripts: [
                    "example/input/scripts/console-log.js"
                ]
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
                    "margin",
                    "z-index!=0"
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
