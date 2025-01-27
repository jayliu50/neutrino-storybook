let arrify         = require('arrify')

module.exports = function () {
	return function (neutrino) {
		const STORIES_EXTENSIONS  = /\.(stories|story)\.[jt]sx?$/
		let compileRule           = neutrino.config.module.rules.get('compile')
		let compileExtensions     = compileRule && arrify(compileRule.get('test')).concat(DOCS_EXTENSIONS)

		neutrino.config
			.module
				.when(compileRule, function (module) {
					// TODO: find a way to not depend on 'compile' rule
					module.rule('compile')
						.test(compileExtensions)
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
				.rule('storybook-source')
					.test(STORIES_EXTENSIONS)
					.pre()
					.exclude
						.add(/node_modules/)
						.end()
					.use('source')
						.loader(require.resolve('@storybook/source-loader'))
						.options({
							injectStoryParameters   : true,
							inspectLocalDependencies: true
						})
						.end()
					.end()
				.end()
	}
}