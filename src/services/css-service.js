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

var cssLib = require( "css" );

var assert = require( "../utils/argument-assertion-util.js" );
var stringUtil = require( "../utils/string-util.js" );

function isMainSelector( selectorToTest, selector ) {

    if ( selectorToTest === selector ) {
        return true;
    } else {
        return false;
    }

}

function getDisallowedProperty( disallowedProperties, givenDeclaration ) {

    var disallowedPropertyProperty;
    var disallowedPropertyValue;
    var givenProperty = givenDeclaration.property;
    var givenValue = givenDeclaration.value;

    for ( var i = 0; i < disallowedProperties.length; i++ ) {

        var disallowedProperty = disallowedProperties[ i ];

        if ( stringUtil.contains( disallowedProperty, "!=" ) ) {

            disallowedPropertyProperty = disallowedProperty.split( "!=" )[ 0 ];
            disallowedPropertyValue = disallowedProperty.split( "!=" )[ 1 ];

            if ( disallowedPropertyProperty === givenProperty && disallowedPropertyValue !== givenValue ) {
                return disallowedProperty;
            }

        } else if ( stringUtil.contains( disallowedProperty, "=" ) ) {

            disallowedPropertyProperty = disallowedProperty.split( "=" )[ 0 ];
            disallowedPropertyValue = disallowedProperty.split( "=" )[ 1 ];

            if ( disallowedPropertyProperty === givenProperty && disallowedPropertyValue === givenValue ) {
                return disallowedProperty;
            }

        } else {

            if ( disallowedProperty === givenProperty ) {
                return disallowedProperty;
            }

        }

    }

    return null;

}

function validateThatUnitsAreValid( disallowedUnits, property, value ) {

    disallowedUnits.forEach( function( disallowedUnit ) {

        var regexp = new RegExp( "\\d+" + disallowedUnit, "i" );
        var match = value.match( regexp );

        if ( match ) {
            throw new Error( "The property \"" + property + "\" may not have the value \"" + value + "\" since containing the unit \"" + disallowedUnit + "\"." );
        }

    } );

}

module.exports.validate = function( css, mainSelector, disallowedProperties, disallowedUnits ) {

    if ( !css ) {
        throw new Error( "Missing CSS source code." );
    }

    if ( !mainSelector ) {
        throw new Error( "Main selector is missing." );
    }

    if ( !disallowedProperties ) {
        throw new Error( "Disallowed properties is missing." );
    }

    if ( !assert.isArray( disallowedProperties ) ) {
        throw new Error( "Disallowed properties is not an array." );
    }

    if ( !disallowedUnits ) {
        throw new Error( "Disallowed CSS units is missing." );
    }

    if ( !assert.isArray( disallowedUnits ) ) {
        throw new Error( "Disallowed CSS units is not an array." );
    }

    var cssTreeStructure = cssLib.parse( css );

    cssTreeStructure.stylesheet.rules.forEach( function( rule ) {

        if ( rule.type === "rule" ) {

            rule.declarations.forEach( function( declaration ) {

                // Validate so that CSS values are valid
                validateThatUnitsAreValid( disallowedUnits, declaration.property, declaration.value );

                // check if there are any disallowed properties in the declaration
                var disallowedProperty = getDisallowedProperty( disallowedProperties, declaration );

                if ( disallowedProperty ) {

                    // Go through each selector
                    rule.selectors.forEach( function( selector ) {

                        // If its a component's main selector, report it
                        if ( isMainSelector( selector, mainSelector ) ) {
                            throw new Error( "The selector \"" + rule.selectors + "\" has a disallowed CSS property that found with the rule \"" + disallowedProperty + "\"." );
                        }

                    } );

                }

            } );

        }

    } );

};
