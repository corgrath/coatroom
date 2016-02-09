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

var Promise = require( "bluebird" );
var dss = require( "dss" );

var stringUtil = require( "../utils/string-util.js" );

dss.parser( "type", function( i, line /*, block*/ ) {
    return module.exports._parseAnnotation( line );
} );

dss.parser( "overviewBackgroundColor", function( i, line /*, block*/ ) {
    return line;
} );

module.exports._parseAnnotation = function( line ) {

    var name,
        description,
        indexOfFirstSpace = line.indexOf( " " );

    if ( indexOfFirstSpace === -1 ) {
        name = line;
        description = "";
    } else {
        name = line.substring( 0, indexOfFirstSpace );
        description = line.substring( indexOfFirstSpace );


        name = name.trim();
        description = description.trim();

        if ( stringUtil.startsWith( description, "- " ) ) {
            description = description.substring( 2 ).trim();
        }

    }

    return {
        name: name,
        description: description
    };

};


module.exports.parse = function( componentName, lessSource ) {

    return new Promise( function( resolve ) {

        var options = {

        };

        dss.parse( lessSource, options, function( dssData ) {

            if ( !dssData ) {
                throw new Error( "DSS data is undefined" );
            }

            if ( !dssData.blocks.length ) {
                throw new Error( "Could not find any DSS blocks for the component \"" + componentName + "\"." );
            }

            /*
             * Special fixes
             */

            // If no states exist, create ean mpty array
            if ( !dssData.blocks[ 0 ].state ) {
                dssData.blocks[ 0 ].state = [];
            }

            // Convert any single items into an array
            if ( !( dssData.blocks[ 0 ].state instanceof Array ) ) {
                dssData.blocks[ 0 ].state = [ dssData.blocks[ 0 ].state ];
            }

            // If no type exist, create an empty array
            if ( !dssData.blocks[ 0 ].type ) {
                dssData.blocks[ 0 ].type = [];
            }

            // Convert any single items into an array
            if ( !( dssData.blocks[ 0 ].type instanceof Array ) ) {
                dssData.blocks[ 0 ].type = [ dssData.blocks[ 0 ].type ];
            }

            var data = {
                name: dssData.blocks[ 0 ].name,
                description: dssData.blocks[ 0 ].description,
                states: dssData.blocks[ 0 ].state,
                types: dssData.blocks[ 0 ].type,
                overviewBackgroundColor: dssData.blocks[ 0 ].overviewBackgroundColor
            };

//            console.log("dssData.blocks[ 0 ]", JSON.stringify(dssData.blocks[ 0 ], null, "\t"));
//            console.log("data", JSON.stringify(data, null, "\t"));

            resolve( data );

        } );

    } );

};
