module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg : '<json:../package.json>',
		meta : {
			banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		concat : {
			dist : {
				src : [
					/*'<banner:meta.banner>', */
					'adapters/index.js',
					'lib/lodash.custom.js',
					'adapters/mocha.js',
					'adapters/qunit.js',
					'adapters/jasmine.js'
				],
				dest : 'dist/<%= pkg.name %>.js'
			}
		},
		min : {
			dist : {
				src : [ /* '<banner:meta.banner>', */ '<config:concat.dist.dest>' ],
				dest : 'dist/<%= pkg.name %>.min.js'
			}
		},
		lint : {
			files : ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		jshint : {
			options : {
				curly : true,
				eqeqeq : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				sub : true,
				undef : true,
				boss : true,
				eqnull : true,
				browser : true
			},
			globals : {
				jQuery : true
			}
		},
		watch: {
			files: '<config:concat.dist.src>',
			tasks: 'concat min'
		},
		uglify : {},
		lodash : [ 'extend', 'each', 'indexOf', 'bind' ]
	});

	grunt.registerTask('lodash', 'Builds a custom lodash distributable', function() {
		var done = this.async();
		grunt.log.writeln('Building custom lodash distributable');
		var includes = grunt.config('lodash');
		var iife = 'iife=;(function(window, undefined){%output%})(this.Testee);';
		grunt.utils.spawn({
			cmd : 'lodash',
			args : ['-d', 'include="' + includes.join(', ') + '"', iife],
			opts : {
				cwd : './lib'
			}
		}, function(error, results) {
			grunt.log.writeln(results);
			done();
		});
	});

	// Default task.
	grunt.registerTask('default', 'concat min');
};