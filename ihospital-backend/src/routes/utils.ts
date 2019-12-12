'use strict';

import * as express from 'express';
import { UtilsModel } from '../models/utils';
import { HospdataModel } from '../models/hospdata';

const utilsModel = new UtilsModel();
const hospdataModel = new HospdataModel();

var http = require('http');
var router = express.Router();
var xlsxj = require("xlsx-to-json-lc");

router.get('/save-drug-catalog-from-xlsx', (req, res, next) => {
  let db = req.dbHospData;
  let src = './app/tmp/t.xlsx';
  let dest = './app/tmp/output.json';
  let arrData = [];

  xlsxj({
    input: src,
    output: dest,
    //sheet: "sheetname",  // specific sheetname inside excel file (if you have multiple sheets)
    lowerCaseHeaders:true
  }, function(err, result) {
    if(err) {
      console.error(err);
    } else {
      utilsModel.saveDrugCatalog(db, result[0])
        .then((saveResults: any) => {
          console.log({ ok: true, result: saveResults });
          res.send({ ok: true, result: saveResults });
        })
        .catch(error => {
          console.log({ ok: false, error: error })
          res.send({ ok: false, error: error })
        })
        .finally(() => {
          db.destroy();
        });
      console.log('\r\n'+src + ' found: ' + result.length + ' rows.\r\n');
      res.send({ ok: true, found: result.length });
    }
  });
  
});

router.post('/ops', (req, res, next) => {
});

router.get('/get-drug-catalog/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;
  console.log('hospcode:'+id);
  utilsModel.get1(db, id)
    .then(result => {
      res.send(result);
    });
});

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

router.post('/get-url-content', (req, res, next) => {
  let type = req.body.type;
  let path = req.body.path;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '' || type !== 'executive_document') {
    res.status(401).send( { ok: false, error: 401, message: 'unauthorized' });
  }

  http.request({
    uri: `192.168.0.222/executive/${path}`,
    method: "GET",
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10
  }, function (error, response, body) {
    res.send(body);
  });
});


router.post('/get-url-content__', (req, res, next) => {
  let type = req.body.type;
  let path = req.body.path;
  let tokenKey: string = req.body.tokenKey;

  if (!tokenKey || tokenKey === '' || type !== 'executive_document') {
    res.send({ok: false, data: null});
  }

  var opsUrl = '192.168.0.222';
  var Path = `/executive/${path}`;

  var options = {
    host: opsUrl,
    port: 80,
    path: Path
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);
    res.on("data", function(chunk) {
      res.send('BODY:' + chunk);
    });
  }).on('error', function(e) {
    res.send(e);
  });

});

    /*
      `date` datetime DEFAULT NULL,
  `employee_id` int(6) unsigned NOT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `imei` varchar(64) DEFAULT NULL,
  `mcaddr` varchar(32) DEFAULT NULL,
  `ip` varchar(32) DEFAULT NULL,
  `keyw` varchar(128) DEFAULT NULL,
  `expire` date DEFAULT NULL,
  `detail` text,
  */

 router.post('/save-sys-mobile-device', (req, res, next) => {
  let db = req.dbHospData;
  let ref = req.body.ref || 0;
  let data = req.body.data;
  let tokenKey = req.body.tokenKey;
  if (tokenKey === '' || !data) {
      res.send({ ok: false, rows: [] });
  }
  utilsModel.saveSysMobileDevice(db, ref, data)
      .then((results: any) => {
          console.log('save sys_mobile_device: ' + ref + ' success.');
          res.status(200).send({ status: 200, ok: true, result: results });
      })
      .catch(error => {
          console.log('save sys_mobile_device: ' + ref + ' fail!!', error);
          res.send({ status: 500, ok: false, error: error })
      })
      .finally(() => {
          db.destroy();
      });
});

router.post('/delete-sys-mobile-device', (req, res, next) => {
  let db = req.dbHospData;
  let ref = req.body.ref || 0;
  let tokenKey = req.body.tokenKey;
  if (tokenKey === '' || ref <= 0) {
      res.send({ ok: false, message: 'parameter error' });
  }
  utilsModel.deleteSysMobileDevice(db, ref)
      .then((results: any) => {
          console.log('delete sys_mobile_device: ' + ref + ' success.');
          res.send({ status: 200, ok: true, result: results });
      })
      .catch(error => {
          console.log('delete sys_mobile_device: ' + ref + ' fail!!', error);
          res.send({ status: 500, ok: false, error: error })
      })
      .finally(() => {
          db.destroy();
      });
});

router.post('/get-sys-mobile-device', (req, res, next) => {
  let db = req.dbHospData;
  let typeSearch = req.body.ref || 'id';
  let textSearch = req.body.ref || '';
  let typeCompare = req.body.ref || '=';
  let tokenKey = req.body.tokenKey;
  if (tokenKey === '' || textSearch === '') {
      res.send({ ok: false, message: 'parameter error' });
  }
  utilsModel.getSysMobileDevice(db, typeSearch, textSearch, typeCompare)
      .then((results: any) => {
          console.log('get sys_mobile_device: ' + textSearch + ' success.');
          res.status(200).send({ status: 200, ok: true, result: results });
      })
      .catch(error => {
          console.log('get sys_mobile_device: ' + textSearch + ' fail!!', error);
          res.send({ status: 500, ok: false, error: error })
      })
      .finally(() => {
          db.destroy();
      });
});
export default router;
