// If installed via npm
//var coatroom = require("coatroom");

// If via 'npm run-script build-example'
var coatroom = require( "../main.js" );

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
			"vw"
		]
	}
} );
