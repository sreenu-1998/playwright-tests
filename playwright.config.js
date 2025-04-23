const config = {
  use: {
    headless: process.env.HEADED !== 'true',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  globalSetup: require.resolve('./global-setup'),
  reporter: [
    ['list'], // For console output
    ['./html-reporter'], // Your custom reporter
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // Default built-in HTML reporter
  ],
};

module.exports = config;
