let arrify         = require('arrify')
let createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin')

module.exports = function () {
	return function (neutrino) {
		const DOCS_EXTENSIONS     = /\.(stories|story)\.mdx$/
		const MARKDOWN_EXTENSIONS = /\.md$/
		let compileRule           = neutrino.config.module.rules.get('compile')
		let markdownRule          = neutrino.config.module.rules.get('markdown')
		let compileExtensions     = compileRule && arrify(compileRule.get('test')).concat(DOCS_EXTENSIONS)

		neutrino.config
			.module
				.when(compileRule, function (module) {
					// TODO: find a way to not depend on 'compile' rule
					module.rule('compile')
						.test(compileExtensions)
						.end()
				})
				.when(compileRule && !markdownRule, function (module) {
					// TODO: find a way to not depend on 'compile' rule
					module.rule('compile')
						.test(compileExtensions.concat(MARKDOWN_EXTENSIONS))
						.end()
				})
				.when(!markdownRule, function (module) {
					module.rule('markdown')
						.test(MARKDOWN_EXTENSIONS)
						.use('mdx')
							.loader(require.resolve('@mdx-js/loader'))
							.end()
						.end()
				})
				.rule('storybook-docs')
					.test(DOCS_EXTENSIONS)
					.use('mdx')
						.loader(require.resolve('@mdx-js/loader'))
						.options({
							compilers: [createCompiler()]
						})
						.end()
					.end()
				.end()
	}
}