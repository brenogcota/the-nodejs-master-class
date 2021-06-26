let enviroments = {};

enviroments.staging = {
  'port': 3000,
  'envName': 'staging'
};

enviroments.production = {
  'port': 5000,
  'envName': 'production'
};

const currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging;

module.exports = enviromentToExport;
