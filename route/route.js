const express = require('express');
const appRoute = express.Router();
const appControl = require('../controller');

appRoute.route('/').get(appControl.index);
appRoute.route('/api/v1/login').post(appControl.login);
appRoute.route('/api/v1/admin/login').post(appControl.adminLogin);
appRoute.route('/api/v1/admin/signup').post(appControl.signup);
appRoute.route('/').get(appControl.index);
appRoute.route('/api/v1/video').get(appControl.getVideo);
appRoute.route('/api/v1/video').post(appControl.createVideo);
appRoute.route('/api/v1/video/:id').get(appControl.getSingleVideo);
appRoute.route('/api/v1/video/:id').patch(appControl.updateVideo);
appRoute.route('/api/v1/video/:id').delete(appControl.deleteVideo);

module.exports = appRoute;
