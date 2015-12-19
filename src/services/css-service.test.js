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

var should = require( "tape" );

var cssService = require( "./css-service.js" );

should( "work", function( t ) {

	t.plan( 1 );

	t.doesNotThrow( function() {

		var css = ".parent { text-align: center; } .parent2 .child { float: right; }";

		cssService.validate( css, ".parent", [ "float" ], [] );

	} );

} );

should( "complain no css is provided", function( t ) {

	t.plan( 1 );

	try {
		cssService.validate();
	} catch ( e ) {
		t.equals( e.message, "Missing CSS source code." );
	}

} );

should( "complain no base selector was provided", function( t ) {

	t.plan( 1 );

	try {
		cssService.validate( "css" );
	} catch ( e ) {
		t.equals( e.message, "Main selector is missing." );
	}

} );

should( "complain no rules were provided", function( t ) {

	t.plan( 1 );

	try {
		cssService.validate( "css", "btn" );
	} catch ( e ) {
		t.equals( e.message, "Disallowed properties is missing." );
	}

} );

should( "complain disallowed properties is not an array", function( t ) {

	t.plan( 1 );

	try {
		cssService.validate( "css", "btn", "disallowed properties", [] );
	} catch ( e ) {
		t.equals( e.message, "Disallowed properties is not an array." );
	}

} );

should( "complain about disallowed CSS properties", function( t ) {

	t.plan( 1 );

	var css = ".parent { float: right; } .parent .child { text-align: center; } .parent.child2 { color: black; }";

	try {
		cssService.validate( css, ".parent", [ "float" ], [] );
	} catch ( e ) {
		t.equals( e.message, "The selector \".parent\" cannot have the CSS property \"float\"." );
	}

} );

should( "complain about disallowed property value", function( t ) {

	t.plan( 1 );

	var css = ".parent .child { text-align: center; } .parent { float: right; position: relative; position: static; }";

	try {
		cssService.validate( css, ".parent", [ "position=static" ], [] );
	} catch ( e ) {
		t.equals( e.message, "The selector \".parent\" cannot have the CSS property \"position=static\"." );
	}

} );

should( "complain about disallowed CSS units", function( t ) {

	t.plan( 1 );

	var css = ".selector { background-position: left 30EM right; }";

	try {
		cssService.validate( css, ".selector", [], [ "em" ] );
	} catch ( e ) {
		t.equals( e.message, "The property \"background-position\" may not have the value \"left 30EM right\" since containing the unit \"em\"." );
	}

} );
