'use strict';

import * as express from 'express';
import * as moment from 'moment';

var QRCode = require('qrcode')

const router = express.Router();
const today = moment().format('YYYY-MM-DD HH:mm:ss');

router.get('/', (req, res, next) => {
  res.send({
    statusCode: 200
  });
});

/*
http://<server ip>/service/qrCode/<base64>/<return raw>/<data>
base64: 0=plain text data or 1=base64 encoding data
raw: 0=return with html 1=return raw of qrcode data only
data: text for generate qrcode <plain text or base64 encode>
*/
router.get('/qrCode/:base64/:raw/:data', (req, res, next) => {
  const base64 = req.params.base64;
  let data = req.params.data;
  let raw = req.params.raw;
  if (+base64 === 1) {
    data = Buffer.from(data, 'base64').toString('ascii');
  }
  QRCode.toDataURL(data, function (err, url) {
    if (err) console.log('error: ' + err)
    if (+raw === 1) {
      res.end(url);
    } else {
      res.end("<!DOCTYPE html/><html><head><title>qrcode</title></head><body><img src='" + url + "'/></body></html>")
    }
  })
});

export default router;