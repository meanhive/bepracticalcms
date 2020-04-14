const secretKey = require('../config.json');
const jwt = require('jsonwebtoken');
const assert = require('assert');
const path = require('path');
const UserModel = require('../model/user');
const AdminModel = require('../model/admin');
const VideoModel = require('../model/video');

module.exports = {
  index: (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  },
  adminLogin: (req, res) => {
    if ((req.body.username || req.body.email) && req.body.password) {
      var query = {
        password: req.body.password,
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      };
      AdminModel.findOne(query, '-new -password')
        .populate({
          path: 'language',
          select: 'name',
        })
        .exec((err, user) => {
          if (err) res.status(500).json({ error_code: 500, message: err });
          if (user !== undefined && user !== null) {
            const token = jwt.sign(
              {
                email: user.email,
                password: user.password,
              },
              secretKey.secret
            );

            var authObject = {
              data: user,
              message: 'Login Successful',
              error_code: 200,
              token: token,
            };
            res.status(200).send(authObject);
          } else {
            res.status(200).send({
              error_code: 704,
              property: 'user',
              message: 'User not found',
            });
          }
        });
    }
  },
  login: (req, res) => {
    if ((req.body.username || req.body.email) && req.body.password) {
      var query = {
        password: req.body.password,
        $or: [
          {
            email: req.body.email,
          },
          {
            username: req.body.username,
          },
        ],
      };
      UserModel.findOne(query, '-new -password')
        .populate({
          path: 'language',
          select: 'name',
        })
        .exec((err, user) => {
          if (err) res.status(500).json({ error_code: 500, message: err });
          if (user !== undefined && user !== null) {
            const token = jwt.sign(
              {
                email: user.email,
                password: user.password,
              },
              secretKey.secret
            );

            var authObject = {
              data: user,
              message: 'Login Successful',
              error_code: 200,
              token: token,
            };
            res.status(200).send(authObject);
          } else {
            res.status(200).send({
              error_code: 704,
              property: 'user',
              message: 'User not found',
            });
          }
        });
    }
  },
  signup: (req, res) => {
    if (req.body) {
      let userObj = new UserModel(req.body);

      userObj.save((err, user) => {
        if (err) {
          console.log(err.name);
          let count = 0,
            err_c;

          switch (err.name) {
            case 'ValidationError':
              console.log(err.errors);
              for (let field in err.errors) {
                if (count === 0) {
                  switch (err.errors[field].properties.type) {
                    case 'invalid':
                      err_c = 401;
                      count++;
                      res.status(200).json({
                        error_code: err_c,
                        property: field,
                        message: 'Invalid Format',
                      });
                      break;
                    case 'unique':
                      err_c = 402;
                      count++;
                      res.status(200).json({
                        error_code: err_c,
                        property: field,
                        message: 'Already Exist',
                      });
                      break;
                    case 'user defined':
                      err_c = 401;
                      count++;
                      res.status(200).json({
                        error_code: err_c,
                        property: field,
                        message: 'Invalid Format',
                      });
                      break;
                    case 'reqexp':
                      err_c = 401;
                      count++;
                      res.status(200).json({
                        error_code: err_c,
                        property: field,
                        message: 'Invalid Format',
                      });
                      break;
                    case 'required':
                      err_c = 401;
                      count++;
                      res.status(200).json({
                        error_code: err_c,
                        property: field,
                        message: 'Required',
                      });
                      break;
                    default:
                      err_c = 500;
                      count++;
                      res.status(500).json({
                        error_code: err_c,
                        message: err,
                      });
                      break;
                  }
                }
              }
              break;

            default:
              res.status(500).json({ error_code: 500, message: err });
              break;
          }
        } else {
          var finalRes = {
            data: user,
            message: 'Success',
            statusCOde: 200,
          };
          res.status(200).send(finalRes);
        }
      });
    } else {
      res.status(200).json({ error_code: 707, message: 'Incomplete Params' });
    }
  },
  getVideo: (req, res) => {
    VideoModel.find((err, data) => {
      if (err) {
        return assert.equal(null, err);
      } else {
        return res.json(data);
      }
    });
  },
  createVideo: (req, res) => {
    let vid = new VideoModel(req.body);

    vid
      .save()
      .then((response) =>
        res.status(200).json({ error_code: '200', message: 'Product Created' })
      )
      .catch((err) =>
        res
          .status(200)
          .json({ error_code: '400', message: 'Unable to create video source' })
      );
  },
  getSingleVideo: (req, res) => {
    let id = req.params.id;
    VideoModel.findById({ _id: id }, (err, data) => {
      if (err) {
        return assert.equal(null, err);
      } else {
        return res.json(data);
      }
    });
  },
  updateVideo: (req, res) => {
    let id = req.params.id;

    VideoModel.findById({ _id: id }, (err, data) => {
      if (err) {
        return assert.equal(null, err);
      } else {
        data.title = req.body.title;
        data.videoUrl = req.body.videUrl;
        data.thumbnailUrl = req.body.thumbnailUrl;
        data.courseTitle = req.body.courseTitle;
        data.batchId = req.body.batchId;
        data.batchTime = req.body.batchTime;

        data
          .save()
          .then((response) => {
            res
              .status(200)
              .json({ error_code: '200', message: 'Data Updated' });
          })
          .catch((err) => {
            res.status(200).json({
              error_code: '400',
              message: 'Unable to updated.try again',
            });
          });
      }
    });
  },
  deleteVideo: (req, res) => {
    let id = req.params.id;

    VideoModel.findByIdAndDelete({ _id: id }, (err, data) => {
      if (err) {
        return assert.equal(null, err);
      } else {
        res
          .status(200)
          .json({ error_code: '200', message: 'Data Deleted Successfully' });
      }
    });
  },
};
