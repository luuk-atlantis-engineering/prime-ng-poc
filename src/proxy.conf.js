const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:5000';

const PROXY_CONFIG = [
  {
    context: [
      "/api/",
      "/Security",
       "/HomeNew/",
       "/IndexNew",
       "/Manage/",
       "/Account/",
       "/Content/",
       "/content/",
       "/Scripts/",
       "/HomeNew/IndexNew",
       "/bundles/",
       "/DXR.axd",
       "/Contacts/",
       "/MaintenanceTasks/",
       "/Warehouse/",
    ],
    target,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
