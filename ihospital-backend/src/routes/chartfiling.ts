'use strict';

import { HospdataModel } from '../models/hospdata';
import { LoginModel } from '../models/login';
import * as express from 'express';
import * as moment from 'moment';
import * as crypto from 'crypto';
import { Jwt } from '../models/jwt';

var http = require('http');
var fs = require('fs');
var request = require("request");

const { URL, URLSearchParams } = require('url');
const router = express.Router();
const hospdataModel = new HospdataModel();
const loginModel = new LoginModel();
const jwt = new Jwt();

router.get('/', (req, res, next) => {
  res.send({ ok: true, module: 'hospdata', date: moment().format('x') });
});

router.post('/', (req, res, next) => {
  var str = '';
  let type: string = req.body.type;
  let id: string = req.body.id;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
  }

  if (type == 'ipd') {
    var options = {
      host: '192.168.0.8',
      path: `/kkh/ws/mra/get_scan_chart.php?an=${id}&checkfile=0&header=1`
    };
  } else if (type == 'opd') {
    var options = {
      host: '192.168.0.8',
      path: `/kkh/ws/mra/get_scan_visit.php?vn=${id}&checkfile=0&header=1`
    };
  } else {
    res.send({ ok: false, data: [] });
  }
  console.log(options);
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

router.post('/f', (req, res, next) => {
  var str = '';
  let type: string = req.body.type;
  let id: string = req.body.id;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
  }

  if (type == 'ipd') {
    var options = `http://192.168.0.8/kkh/ws/mra/get_scan_chart.php?an=${id}&checkfile=0&header=1`;
  } else if (type == 'opd') {
    var options = `http://192.168.0.8/kkh/ws/mra/get_scan_visit.php?vn=${id}&checkfile=0&header=1`;
  } else {
    res.send({ ok: false, data: false });
  }
  console.log(options);
  res.send({ ok: true, data: options });
});

router.post('/file-token', (req, res, next) => {
  var str = '';
  let db = req.dbHospData;
  let type: string = req.body.type;
  let id: string = req.body.id;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
  }

  const today = moment().format('YYYY-MM-DD HH:mm:ss');
  let nowDate = new Buffer(today);
  var tokenCode = nowDate.toString('base64');
  let encrToken = crypto.createHash('sha256').update(tokenKey + tokenCode).digest('hex');

  loginModel.saveTokenEvent(db, {
    date: today,
    token: tokenKey,
    type: 'view chart ' +type,
    ref: id,
    event: ''
  })
    .then((r: any) => {
    })
    .catch(error => {
      console.log(error);
    });


  if (type == 'ipd') {
    var options = `http://203.157.88.8/kkh/ws/mra/get_ipdchart.php?tokencode=${tokenCode}&token=${encrToken}&header=1`;
  } else if (type == 'opd') {
    var options = `http://203.157.88.8/kkh/ws/mra/get_opdvisit.php?tokencode=${tokenCode}&token=${encrToken}&header=1`;
  } else {
    res.send({ ok: false, data: false });
  }
  hospdataModel.saveScanToken(db, tokenCode, encrToken, type, id)
    .then((results: any) => {
      console.log(options);
      res.send({ ok: true, data: options });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/payroll-document', (req, res, next) => {
  var str = '';
  // let db = req.dbHospData;
  let year: string = req.body.year;
  let type: string = req.body.type;
  let cid: string = req.body.cid;
  let key: string = req.body.key;
  let checkfile: string = req.body.checkfile || 0;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
  }

  var url = `192.168.0.88`;
  var path = `/include/ws/get_pdf.php?year=${year}&type=${type}&cid=${cid}&checkfile=${checkfile}&key=${key}`;
  var options = {
    host: url,
    port: 80,
    path: path
  };
  http.request(options, function (response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      res.send({ ok: true, data: str });
    });
  }).on('error', function (e) {
    res.send({ ok: false, error: e });
  }).end();
});

router.post('/ipd', (req, res, next) => {
  var str = '';
  let an: number = req.body.type;
  let path: number = req.body.path;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
  }
  var options = {
    host: '192.168.0.8',
    path: `/kkh/ws/mra/get_scan_chart.php?an=${an}&checkfile=0&header=1`
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

router.get('/read-scan-file/:type/:ref', (req, res, next) => {
  let typeChart = req.params.type;
  let ref = req.params.ref;
  let url = '';
  let path = '';
  let str = '';

  console.log('chart: ' + typeChart + ': ' + ref);
  if (typeChart == 'IPD') {
    url = `192.168.0.8`;
    path = `/kkh/ws/mra/get_scan_chart.php?an=${ref}&checkfile=0&header=1`;
  } else {
    url = `192.168.0.8`;
    path = `/kkh/ws/mra/get_scan_visit.php?vn=${ref}&checkfile=0&header=1`;
  }

  var options = {
    host: url,
    port: 80,
    path: path
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
  }).on('error', function (e) {
    res.send({ ok: false, error: e });
  }).end();
});

router.post('/read-scan-file', (req, res, next) => {
  let typeChart: string = req.body.type;
  let ref: string = req.body.ref;
  let url = '';
  let path = '';
  let str = '';

  console.log('chart: ' + typeChart + ': ' + ref);
  if (typeChart == 'IPD') {
    url = `192.168.0.8`;
    path = `/kkh/ws/mra/get_scan_chart.php?an=${ref}&checkfile=0&header=1`;
  } else {
    url = `192.168.0.8`;
    path = `/kkh/ws/mra/get_scan_visit.php?vn=${ref}&checkfile=0&header=1`;
  }

  var options = {
    host: url,
    port: 80,
    path: path
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
  }).on('error', function (e) {
    res.send({ ok: false, error: e });
  }).end();
});

router.post('/get-scan-file', (req, res, next) => {
  let ref: string = req.body.ref;
  let typeChart: string = req.body.typeChart;
  let tokenKey = req.body.tokenKey;

  let url = '';
  let path = '';
  if (typeChart == 'IPD') {
    url = `http://192.168.0.8/kkh/ws/mra/get_scan_chart.php`;
    path = `an=${ref}&checkfile=0&header=1`;
  } else {
    url = `http://192.168.0.8/kkh/ws/mra/get_scan_visit.php`;
    path = `vn=${ref}&checkfile=0&header=1`;
  }

  var options = {
    method: 'GET',
    host: url,
    port: 80,
    path: path
  };

  var request = http.request(options, function (response) {
    var data = '';

    response.on('data', function (chunk) {
      data += chunk;
    });

    response.on('end', function () {
      res.send(data);
    });
  });

  request.end();
});

router.post('/ops', (req, res, next) => {
  var str = '';
  let type: number = req.body.type;
  let path: number = req.body.path;
  let hospCode: string = req.body.hospCode;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '') {
    res.send({ ok: false, data: null });
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
    res.send({ ok: false, data: null });
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

export default router;