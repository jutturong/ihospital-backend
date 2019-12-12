'use strict';

import * as express from 'express';
import * as moment from 'moment';

var http = require('http');
var fs = require('fs');
const router = express.Router();

router.post('/general', (req, res, next) => {
  var str = '';
  let type: number = req.body.type;
  let path: number = req.body.path;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ok: false, data: null});
  }
  var options = {
    host: 'gishealth.moph.go.th',
    path: `/api/get_gishealth.php${path}`
  };

  http.request(options, function (response) {
    //console.log(response);
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      //console.log(str);
      res.send({ ok: true, data: str });
    });
  }).end();

});

router.post('/items', (req, res, next) => {
  var str = '';
  let type: string = req.body.type;
  let date1: string = req.body.date1;
  let date2: string = req.body.date2;
  let hn: string = req.body.hn;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;
  let path = '';
  if (type === 'date') {
    path = `/sl-ems/dist/rest_main_sems_by_period_datetime?user=testaccount01&key=49SI5J2uyVwx5h5bJ5Gn&start=${date1} 00:00:00&end=${date2} 23:59:59 `;
  } else {
    path = `/sl-ems/dist/rest_main_sems_by_searchkey?user=testaccount01&key=49SI5J2uyVwx5h5bJ5Gn&searchkey=${hn}`;
  }

  var options = {
    host: '35.185.177.172',
    path: path
  };
  console.log(options);

  if (!tokenKey || tokenKey === '') {
    res.send({ok: false, data: null});
  }
  http.request(options, function (response) {
    //console.log(response);
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      //console.log(str);
      res.send({ ok: true, data: str });
    });
  }).end();

});

router.post('/items__', (req, res, next) => {
  let type: string = req.body.type;
  let date1: string = req.body.date1;
  let date2: string = req.body.date2;
  let hn: string = req.body.hn;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;
  let urlItem = '';
  if (type === 'date') {
    urlItem = `http://35.185.177.172/sl-ems/dist/rest_main_sems_by_period_datetime?user=testaccount01&key=49SI5J2uyVwx5h5bJ5Gn&start=${date1} 00:00:00&end=${date2} 23:59:59 `;
  } else {
    urlItem = `http://35.185.177.172/sl-ems/dist/rest_main_sems_by_searchkey?user=testaccount01&key=49SI5J2uyVwx5h5bJ5Gn&searchkey=${hn}`;
  }

  // const url1 = `http://35.185.177.172/sl-ems/dist/rest_main_sems_by_period_datetime?user=testaccount01&key=49SI5J2uyVwx5h5bJ5Gn&start=2017-03-14 00:00:00&end=2017-03-14 23:59:59 `;
  // const url2 = `http://35.185.177.172/sl-ems/dist/rest_main_sems_by_searchkey?user=testaccount01&key=49SI5J2uyVwx5h5bJ5Gn&searchkey=` + row.hn;
  console.log(urlItem);
  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
  }

  http.request({
    uri: urlItem,
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
  }, function (error, response, body) {
    res.send(body);
  });
});

export default router;