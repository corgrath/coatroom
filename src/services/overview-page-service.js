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

module.exports.createComponentAnchorName = function( name ) {

    name = name.trim();
    name = name.toLowerCase();
    name = name.replace( /\s+/g, "-" );
    name = name.replace( /-+/g, "-" );

    return name;

};

module.exports.generate = function( documentTitle, scripts, css, styleguides, components ) {

    var html = "";

    html += "<!doctype html>";
    html += "<html lang=\"en\">";
    html += "<head>";
    html += "<meta charset=\"utf-8\">";
    html += "<title>" + documentTitle + "</title>";
    html += "<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>";
    html += "<link rel='stylesheet'' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.0.0/styles/default.min.css'>";
    html += "<style>";
    html += "body { font-family: 'Open Sans', sans-serif; font-size: 14px; }";
    html += "table { width: 100%;   border-collapse: collapse; }";
    html += "table thead tr { background: white; }";
    html += "table th, table td {";
    html += "padding: 10px; border: 1px solid #5AB6F6; vertical-align: top;";
    html += "}";

    html += "a { text-decoration: none; color: #3498db; }";
    html += "a:hover { text-decoration: underline; }";
    html += "blockquote { font-style: italic; }";
    html += ".section-leftmenu { background: #ecf0f1; padding: 10px; position: fixed; top: 10px; left: 10px; width: 150px; }";
    html += ".section-leftmenu a, .section-leftmenu div { display: block; padding: 10px; text-decoration: none; color: black; }";
    html += ".section-leftmenu a.component { padding-left: 20px; }";
    html += ".section-leftmenu a:hover { color: #ecf0f1; background: #3498db; }";
    html += ".section-components { background: #ecf0f1; padding: 10px; position: absolute; top: 10px; left: 190px; right: 10px; }";
    html += ".section-components h2:not(:first-of-type) { padding-top: 75px; }";
    html += ".section-components code { border: 1px solid silver; background-color: white; }";
    html += ".hljs-keyword, .hljs-attribute, .hljs-selector-tag, .hljs-meta-keyword, .hljs-doctag, .hljs-name { font-weight: normal; }";
    html += "</style>";
    html += "<style>";
    html += css;
    html += "</style>";
    html += "</head>";
    html += "<body class=\"overview\">";

    {

        /*
         * Left-Menu
         */

        {

            html += "<div class='section-leftmenu'>";

            styleguides.forEach( function( styleguide ) {
                html += "<a href='#" + styleguide.label + "'>" + styleguide.label + "</a>";
            } );

            html += "<div>Components</div>";

            components.forEach( function( component ) {
                html += "<a href='#" + module.exports.createComponentAnchorName( component.dss.name ) + "' class='component'>" + component.dss.name + "</a>";
            } );

            html += "</div>";

        }

        /*
         * Components section
         */

        {

            html += "<div class='section-components'>";
            html += "<h1>" + documentTitle + "</h1>";

            styleguides.forEach( function( styleguide ) {

                html += "<a name='" + styleguide.label + "'></a>";
                html += "<h2>" + styleguide.label + "</h2>";

                html += styleguide.html;

            } );

            components.forEach( function( component ) {

                html += "<a name='" + module.exports.createComponentAnchorName( component.dss.name ) + "'></a>";
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
                        html += "<td>" + buildTemplateWithClasses( component ) + "</td>";

                        // For all other states
                        if ( component.dss.states ) {
                            component.dss.states.forEach( function( state ) {
                                // Default state
                                html += "<td>" + buildTemplateWithClasses( component, undefined, state.name ) + "</td>";
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
                                    html += "<td>" + buildTemplateWithClasses( component, type.name, state.name ) + "</td>";
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
    html += "<script src='https://cdn.jsdelivr.net/highlight.js/9.0.0/highlight.min.js'></script>";
    html += "<script>hljs.initHighlightingOnLoad();</script>";

    html += "</body>";
    html += "</html>";

    return html;

};
