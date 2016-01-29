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

var test = require( "tape" );

var validateConfigurationsService = require( "./validate-configurations-service.js" );

test( "when no configuration is specified", function( t ) {

	t.plan( 1 );

	try {
		validateConfigurationsService.validate();
	} catch ( e ) {
		t.equals( e.message, "Options is missing." );
	}

} );

test( "that all is valid", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "Component library example",
		input: {
			components: "example/input/components/",
			less: [
				"example/input/less/colors.less"
			],
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
				"margin"
			],
			disallowedCSSUnits: [
				"cm",
				"mm",
				"in",
				"px",
				"vw"
			]
		}
	};

	t.doesNotThrow( function() {

		validateConfigurationsService.validate( configuration );

	} );

} );

test( "complain input.less is not an array", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/",
			less: "less"
		},
		output: {
			overview: "overview.html",
			less: "components.less"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Input less configuration is not an array." );
	}

} );

test( "complain input.lessModifyVars is not an object", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/",
			lessModifyVars: "lessModifyVars"
		},
		output: {
			overview: "overview.html",
			less: "components.less"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Input lessModifyVars configuration is not an object." );
	}

} );

test( "complain input.less is an empty array", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/",
			less: []
		},
		output: {
			overview: "overview.html",
			less: "components.less"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Input less configuration cannot be empty." );
	}

} );

test( "complain input.scripts is an empty array", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/",
			scripts: []
		},
		output: {
			overview: "overview.html",
			less: "components.less"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Input scripts configuration cannot be empty." );
	}

} );

test( "complain validation.disallowedCSSRules is not an array", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/"
		},
		output: {
			overview: "overview.html",
			less: "components.less"
		},
		validation: {
			disallowedCSSRules: "disallowedCSSRules"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Configuration \"validation.disallowedCSSRules\" is not an array." );
	}

} );

test( "complain validation.disallowedCSSRules is empty", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/"

		},
		output: {
			overview: "overview.html",
			less: "components.less"
		},
		validation: {
			disallowedCSSRules: []
		}

	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Configuration \"validation.disallowedCSSRules\" cannot be empty." );
	}

} );

test( "complain validation.disallowedCSSUnits is not an array", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/"
		},
		output: {
			overview: "overview.html",
			less: "components.less"
		},
		validation: {
			disallowedCSSUnits: "disallowedCSSUnits"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Configuration \"validation.disallowedCSSUnits\" is not an array." );
	}

} );

test( "complain validation.disallowedCSSUnits is empty", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/"

		},
		output: {
			overview: "overview.html",
			less: "components.less"
		},
		validation: {
			disallowedCSSUnits: []
		}

	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Configuration \"validation.disallowedCSSUnits\" cannot be empty." );
	}

} );

test( "complain input.styleguides is not an array", function( t ) {

	t.plan( 1 );

	var configuration = {
		title: "title",
		input: {
			components: "/components/",
			styleguides: "styleguides"
		}
	};

	try {
		validateConfigurationsService.validate( configuration );
	} catch ( e ) {
		t.equals( e.message, "Configuration \"input.styleguides\" is not an object." );
	}

} );

test( "complain on unknown configurations", function( t ) {

	t.plan( 3 );

	try {
		validateConfigurationsService.validate( {
			title: "title",
			input: {
				components: "/components/"
			},
			output: {
				"less": "components.less",
				"overview": "overview.less"
			},
			unknownProperty: "some value"
		} );
	} catch ( e ) {
		t.equals( e.message, "Unknown property \"unknownProperty\" in configuration." );
	}

	try {
		validateConfigurationsService.validate( {
			title: "title",
			input: {
				components: "/components/",
				unknownProperty: "some value"
			},
			output: {
				less: "components.less",
				overview: "overview.less"
			}
		} );
	} catch ( e ) {
		t.equals( e.message, "Unknown property \"input.unknownProperty\" in configuration." );
	}

	try {
		validateConfigurationsService.validate( {
			title: "title",
			input: {
				components: "/components/"
			},
			output: {
				less: "components.less",
				overview: "overview.less",
				unknownProperty: "some value"
			}
		} );
	} catch ( e ) {
		t.equals( e.message, "Unknown property \"output.unknownProperty\" in configuration." );
	}

} );
