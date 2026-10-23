module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [{ pattern: 'tests/*.spec.jsx', watched: false }],
    preprocessors: { 'tests/*.spec.jsx': ['webpack'] },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: { rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader', options: {
          presets: [
            ['@babel/preset-env', { targets: { chrome: '110' } }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
          plugins: [['istanbul', { exclude: ['**/tests/**'] }]]
        } }
      }] },
      stats: 'errors-only'
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html', subdir: 'html' }, { type: 'lcovonly', subdir: '.' }, { type: 'text-summary' }]
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    },
    singleRun: false,
    autoWatch: true,
    browserNoActivityTimeout: 60000,
    client: { clearContext: false }
  });
};
