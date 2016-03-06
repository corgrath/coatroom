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

var logUtil = require( "../utils/log-util.js" );
var assert = require( "../utils/argument-assertion-util.js" );

function validateObjectProperties( object, propertySuffix, allowedProperties ) {

    var properties = [];

    for ( var property in object ) {
        if ( object.hasOwnProperty( property ) ) {
            if ( allowedProperties.indexOf( property ) === -1 ) {
                throw new Error( "Unknown property \"" + ( propertySuffix ? propertySuffix + "." : "" ) + property + "\" in configuration." );
            }
        }
    }

    return properties;

}

module.exports.validate = function validate( configuration ) {

    logUtil.log( "ValidateConfigurationService", "Validating configuration.." );

    if ( !configuration ) {
        throw new Error( "Options is missing." );
    }

    {

        if ( !configuration.title ) {
            throw new Error( "Title is missing." );
        }

        if ( !configuration.input ) {
            throw new Error( "Input option is missing." );
        }

        {

            if ( !configuration.input.components ) {
                throw new Error( "Components input option is missing." );
            }

            if ( configuration.input.less !== undefined ) {

                if ( !assert.isArray( configuration.input.less ) ) {
                    throw new Error( "Input less configuration is not an array." );
                }

                if ( configuration.input.less.length === 0 ) {
                    throw new Error( "Input less configuration cannot be empty." );
                }

            }

            if ( configuration.input.lessModifyVars !== undefined ) {

                if ( !assert.isObject( configuration.input.lessModifyVars ) ) {
                    throw new Error( "Input lessModifyVars configuration is not an object." );
                }

            }

            if ( configuration.input.styleguides !== undefined ) {

                if ( !assert.isObject( configuration.input.styleguides ) ) {
                    throw new Error( "Configuration \"input.styleguides\" is not an object." );
                }

            }

            if ( configuration.input.scripts !== undefined ) {

                if ( !assert.isArray( configuration.input.scripts ) ) {
                    throw new Error( "Input scripts configuration is not an array." );
                }

                if ( configuration.input.scripts.length === 0 ) {
                    throw new Error( "Input scripts configuration cannot be empty." );
                }

            }

            if ( configuration.input.externalStylesheets !== undefined ) {

                if ( !assert.isArray( configuration.input.externalStylesheets ) ) {
                    throw new Error( "Configuration \"input.externalStylesheets\" is not an array." );
                }

                if ( configuration.input.externalStylesheets.length === 0 ) {
                    throw new Error( "Configuration \"input.externalStylesheets\" cannot be empty." );
                }

            }

        }

        if ( !configuration.output ) {
            throw new Error( "Output configuration is missing." );
        }

        {

            if ( !configuration.output.overview ) {
                throw new Error( "Output overview option is missing." );
            }

            if ( !configuration.output.less ) {
                throw new Error( "Output less option is missing." );
            }

            if ( configuration.input.css && !assert.isString( configuration.input.css ) ) {
                throw new Error( "Output css option is missing." );
            }

        }

        if ( configuration.validation !== undefined ) {

            if ( configuration.validation.disallowedCSSRules !== undefined ) {

                if ( !assert.isArray( configuration.validation.disallowedCSSRules ) ) {
                    throw new Error( "Configuration \"validation.disallowedCSSRules\" is not an array." );
                }

                if ( configuration.validation.disallowedCSSRules.length === 0 ) {
                    throw new Error( "Configuration \"validation.disallowedCSSRules\" cannot be empty." );
                }

            }

            if ( configuration.validation.disallowedCSSUnits !== undefined ) {

                if ( !assert.isArray( configuration.validation.disallowedCSSUnits ) ) {
                    throw new Error( "Configuration \"validation.disallowedCSSUnits\" is not an array." );
                }

                if ( configuration.validation.disallowedCSSUnits.length === 0 ) {
                    throw new Error( "Configuration \"validation.disallowedCSSUnits\" cannot be empty." );
                }

            }

        }

    }

    /*
     * Find any unknown properties
     */

    validateObjectProperties( configuration, "", [ "title", "input", "output", "validation" ] );
    validateObjectProperties( configuration.input, "input", [ "components", "less", "lessModifyVars", "scripts", "styleguides", "externalStylesheets" ] );
    validateObjectProperties( configuration.output, "output", [ "overview", "less", "css" ] );
    validateObjectProperties( configuration.validation, "validation", [ "disallowedCSSRules", "disallowedCSSUnits" ] );

    logUtil.log( "ValidateOptionsService", "Validation of configuration done! All options are okay!" );

};
