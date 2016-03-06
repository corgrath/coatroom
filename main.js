/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 */

var EOL = require( "os" ).EOL;

var Promise = require( "bluebird" );

var fileService = require( "./src/services/file-service.js" );
var lessService = require( "./src/services/less-service.js" );
var dssService = require( "./src/services/dss-service.js" );
var markdownService = require( "./src/services/markdown-service.js" );
var overviewPageService = require( "./src/services/overview-page-service.js" );
var inputScriptsService = require( "./src/services/input-scripts-service.js" );
var validateConfigurationsService = require( "./src/services/validate-configurations-service.js" );
var cssService = require( "./src/services/css-service.js" );
var logUtil = require( "./src/utils/log-util.js" );
var packageService = require( "./src/services/package-service.js" );

function getComponentData( sourceFolder, componentDirectoryName ) {

    return new Promise( function( resolve ) {

        var component = {};

        // Add the base component CSS class
        component.class = componentDirectoryName;

        // Add the template
        var template = fileService.readFile( fileService.join( sourceFolder, componentDirectoryName, componentDirectoryName + ".mustache" ) );

        component.template = template;

        // Add the style guide markdown
        var styleguideMarkdownSource = fileService.readFile( fileService.join( sourceFolder, componentDirectoryName, componentDirectoryName + ".md" ) );
        component.styleguide = {
            source: styleguideMarkdownSource,
            html: markdownService.build( styleguideMarkdownSource )
        };

        // Adding LESS source code
        var less = fileService.readFile( fileService.join( sourceFolder, componentDirectoryName, componentDirectoryName + ".less" ) );
        component.less = less;

        // Fetch the DSS information
        return dssService.parse( componentDirectoryName, less ).then( function( dssData ) {

            // Add the DSS information
            component.dss = dssData;

            // Return the component
            resolve( component );

        } );

    } );

}

function build( configuration ) {

    // Write the version
    logUtil.log( "Main", "Coatroom version " + packageService.getVersion() + "." );

    // Validate the configuration
    validateConfigurationsService.validate( configuration );

    // Tell the user we are now starting the build process
    logUtil.log( "Main", "Starting to generate components for \"" + configuration.title + "\"." );

    var timeStarted = new Date().getTime();

    var componentDirectoryNames = fileService.getAllDirectories( configuration.input.components );

    var allLESS = "";
    var components = [];

    var styleguides = [];

    // Styleguide
    if ( configuration.input.styleguides ) {
        logUtil.log( "Main", "Will now process styleguides." );
        for ( var property in configuration.input.styleguides ) {
            if ( configuration.input.styleguides.hasOwnProperty( property ) ) {

                var styleguideFile = configuration.input.styleguides[ property ];
                var styleguideMarkdown = fileService.readFile( styleguideFile );
                var styleguideHTML = markdownService.build( styleguideMarkdown );

                styleguides.push( {
                    label: property,
                    html: styleguideHTML
                } );

            }
        }
    }

    var scripts = inputScriptsService.getScriptsFromConfiguration( configuration );

    if ( configuration.input.less ) {
        logUtil.log( "Main", "Will now read in all LESS input files." );
        allLESS += fileService.concatenate( configuration.input.less );
    } else {
        logUtil.log( "Main", "We have LESS include path. Will now concatenate LESS include files." );
    }

    return Promise.each( componentDirectoryNames, function( componentDirectoryName ) {

        logUtil.log( "Main", "Found component folder \"" + componentDirectoryName + "\"." );

        return getComponentData( configuration.input.components, componentDirectoryName ).then( function( component ) {

            components.push( component );

            allLESS += component.less + EOL;

        } );

    } ).then( function() {

        fileService.writeFile( configuration.output.less, allLESS );

        return lessService.build( allLESS, configuration.output.less, configuration.input.lessModifyVars ).then( function( css ) {

            // Validate the CSS
            logUtil.log( "Main", "Will now validate the CSS." );
            componentDirectoryNames.forEach( function( componentDirectoryName ) {
                cssService.validate( css, "." + componentDirectoryName, configuration.validation.disallowedCSSRules, configuration.validation.disallowedCSSUnits );
            } );

            if ( configuration.output.css ) {
                fileService.writeFile( configuration.output.css, css );
            } else {
                logUtil.log( "Main", "Will not save CSS file, as configuration did not specify CSS output file." );
            }

            // Generate the overview page
            var overviewConfiguration = {
                externalStylesheets: configuration.input.externalStylesheets,
                defaultTableHeaderBackgroundColor: configuration.input.defaultTableHeaderBackgroundColor,
                defaultTableCellBackgroundColor: configuration.input.defaultTableCellBackgroundColor
            };

            var html = overviewPageService.generate( configuration.title, scripts, css, styleguides, components, overviewConfiguration );
            fileService.writeFile( configuration.output.overview, html );

            var buildDuration = new Date().getTime() - timeStarted;
            logUtil.log( "Main", "Building complete after \"" + buildDuration + "\" milliseconds." );
            logUtil.log( "Main", "Have a great day! <(^_^)>" );

        } );

    } );

}

/*
 * Export
 */

module.exports = build;
