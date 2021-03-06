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

var mustacheService = require( "./mustache-service.js" );

var OVERVIEW_EXTERNAL_CSS = [
    "http://fonts.googleapis.com/css?family=Open+Sans",
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/styles/default.min.css"
];

function createClasses( componentBaseClass, type, state ) {

    var classes = componentBaseClass;

    if ( type ) {
        classes += " " + componentBaseClass + "-" + type;
    }

    if ( state ) {
        classes += " " + state;
    }

    return classes;

}

function buildTemplateWithClasses( component, type, state ) {
    return mustacheService.build( component.template, {
        classes: createClasses( component.class, type, state )
    } );
}

module.exports.createSafeAnchorName = function( name ) {

    name = name.trim();
    name = name.toLowerCase();
    name = name.replace( /\s+/g, "-" );
    name = name.replace( /-+/g, "-" );

    return name;

};

module.exports.generate = function( documentTitle, scripts, css, styleguides, components, configuration ) {

    /*
     * Init
     */

    if ( !configuration.defaultTableHeaderBackgroundColor ) {
        configuration.defaultTableHeaderBackgroundColor = "white";
    }

    if ( !configuration.defaultTableCellBackgroundColor ) {
        configuration.defaultTableCellBackgroundColor = "transparent";
    }

    if ( !configuration.externalStylesheets ) {
        configuration.externalStylesheets = OVERVIEW_EXTERNAL_CSS;
    } else {
        configuration.externalStylesheets.concat( OVERVIEW_EXTERNAL_CSS );
    }

    /*
     * Render
     */

    var html = "";

    html += "<!DOCTYPE html>";
    html += "<html lang=\"en\">";
    html += "<head>";
    html += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
    html += "<meta charset=\"utf-8\">";
    html += "<title>" + documentTitle + "</title>";

    configuration.externalStylesheets.forEach( function( externalStylesheet ) {
        html += "<link href=\"" + externalStylesheet + "\" rel=\"stylesheet\" type=\"text/css\">";
    } );

    html += "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/styles/default.min.css\">";
    html += "<style>";
    html += ".coatroom { font-family: \"Open Sans\", sans-serif; font-size: 14px; }";
    html += ".coatroom table { width: 100%;   border-collapse: collapse; }";
    html += ".coatroom table thead tr { background: white; }";
    html += ".coatroom table th, .coatroom table td { padding: 10px; border: 1px solid #5AB6F6; vertical-align: top; }";
    html += ".coatroom table thead tr th { background-color: " + configuration.defaultTableHeaderBackgroundColor + "; }";
    html += ".coatroom table tbody tr td { background-color: " + configuration.defaultTableCellBackgroundColor + "; }";
    html += ".coatroom a { text-decoration: none; color: #3498db; }";
    html += ".coatroom a:hover { text-decoration: underline; }";
    html += ".coatroom blockquote { font-style: italic; }";
    html += ".coatroom .section-leftmenu { background: #ecf0f1; padding: 10px; position: fixed; top: 10px; left: 10px; width: 150px; }";
    html += ".coatroom .section-leftmenu a, .section-leftmenu div { display: block; padding: 10px; text-decoration: none; color: black; }";
    html += ".coatroom .section-leftmenu a.component { padding-left: 20px; }";
    html += ".coatroom .section-leftmenu a:hover { color: #ecf0f1; background: #3498db; }";
    html += ".coatroom .section-components { background: #ecf0f1; padding: 10px; position: absolute; top: 10px; left: 190px; right: 10px; }";
    html += ".coatroom .section-components h2:not(:first-of-type) { padding-top: 75px; }";
    html += ".coatroom .section-components code { border: 1px solid silver; background-color: white; }";
    html += ".coatroom .hljs-keyword, .coatroom .hljs-attribute, .coatroom .hljs-selector-tag, .coatroom .hljs-meta-keyword, .coatroom .hljs-doctag, .coatroom .hljs-name { font-weight: normal; }";
    html += "</style>";
    html += "<style>";
    html += css;
    html += "</style>";
    html += "</head>";
    html += "<body class=\"coatroom\">";

    {

        /*
         * Left-Menu
         */

        {

            html += "<div class='section-leftmenu'>";

            styleguides.forEach( function( styleguide ) {
                html += "<a href='#" + module.exports.createSafeAnchorName( styleguide.label ) + "'>" + styleguide.label + "</a>";
            } );

            html += "<div>Components</div>";

            components.forEach( function( component ) {
                html += "<a href='#" + module.exports.createSafeAnchorName( component.dss.name ) + "' class='component'>" + component.dss.name + "</a>";
            } );

            html += "</div>";

        }

        /*
         * Components section
         */

        {

            html += "<div class=\"section-components\">";
            html += "<h1>" + documentTitle + "</h1>";

            styleguides.forEach( function( styleguide ) {

                html += "<a name=\"" + module.exports.createSafeAnchorName( styleguide.label ) + "\"></a>";
                html += "<h2>" + styleguide.label + "</h2>";

                html += styleguide.html;

            } );

            components.forEach( function( component ) {

                var overviewBackgroundColor = component.dss.overviewBackgroundColor;

                html += "<a name='" + module.exports.createSafeAnchorName( component.dss.name ) + "'></a>";
                html += "<h2>" + component.dss.name + "</h2>";
                html += "<p>" + component.dss.description + "</p>";

                html += "<h3>Overview</h3>";
                html += "<table>";

                // Only render the headers if there multiple states
                //				if ( component.dss.states && component.dss.states.length ) {

                html += "<thead>";
                html += "<tr>";
                html += "<th>type / state</th>";
                html += "<th>default</th>";

                if ( component.dss.states ) {
                    component.dss.states.forEach( function( state ) {
                        html += "<th>" + state.name + "</th>";
                    } );
                }

                html += "</tr>";
                html += "</thead>";
                //				}

                html += "<tbody>"; {

                    // Default type
                    html += "<tr>";
                    // Only render the default column, if we have multiple modifiers
                    //					if ( component.dss.states && component.dss.states.length ) {
                    html += "<td>default</td>";
                    //					}
                    {

                        // Default type
                        html += "<td style='background-color: " + overviewBackgroundColor + ";'>" + buildTemplateWithClasses( component ) + "</td>";

                        // For all other states
                        if ( component.dss.states ) {
                            component.dss.states.forEach( function( state ) {
                                // Default state
                                html += "<td style=\"background-color: " + overviewBackgroundColor + ";\">" + buildTemplateWithClasses( component, undefined, state.name ) + "</td>";
                            } );
                        }

                    }
                    html += "</tr>";

                    // All other types
                    if ( component.dss.types ) {
                        component.dss.types.forEach( function( type ) {

                            html += "<tr>";

                            html += "<td>" + type.name + "</td>";

                            // Default state
                            html += "<td>" + buildTemplateWithClasses( component, type.name ) + "</td>";
                            if ( component.dss.states ) {
                                component.dss.states.forEach( function( state ) {
                                    html += "<td style='background-color: " + overviewBackgroundColor + ";'>" + buildTemplateWithClasses( component, type.name, state.name ) + "</td>";
                                } );
                            }
                            html += "</tr>";

                        } );
                    }

                }
                html += "</tbody>";
                html += "</table>";

                // Include the style guide HTML
                html += component.styleguide.html;

            } );

            html += "</div>"; // end of section-components

        }

    }

    if ( scripts ) {
        html += "<!-- included external scripts -->";
        html += "<script type=\"text/javascript\">";
        html += scripts;
        html += "</script>";
    }

    // Code highlighting
    html += "<script src='https://cdn.jsdelivr.net/highlight.js/9.0.0/highlight.min.js'></script>";
    html += "<script>hljs.initHighlightingOnLoad();</script>";

    html += "</body>";
    html += "</html>";

    return html;

};
