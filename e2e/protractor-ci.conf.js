const config = require('./protractor.conf').config;

config.capabilities = {
 browserName: 'chrome',
 chromeDriver: '../node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_87.0.4280.88',
 chromeOptions: {
   args: ['--headless', '--no-sandbox']
 }
};

exports.config = config;
