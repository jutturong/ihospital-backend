'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as crypto from 'crypto';

import { LoginModel } from '../models/login';
import { IndexModel } from '../models';

const router = express.Router();
const loginModel = new LoginModel();
const indexModel = new IndexModel();

router.get('/', (req, res, next) => {
  res.send({
    name: 'hospdata',
    status: 200,
    version: process.env.VERSION + '-' + process.env.SUBVERSION,
    date_response: moment().locale('th').format('YYYY-MM-DD HH:mm:ss'),
    token: crypto.createHash('md5').update(moment().locale('th').format()).digest('hex')
  });
});

router.get('/client', (req, res, next) => {
  var ua = req.header('user-agent');
  let browserDevice = 'desktop';
  let mobileType = null;
  let mobileName = null;

  /*
  Mozilla/$(MOZILA_VER) ($(DEVICE_TYPE); $(OS); $(PLATFORM) $(PLATFORM_VER);
  SAMSUNG $(MODEL_NAME) Build/$(BUILD_TAG)) AppleWebKit/$(APPLEWEBKIT_VER)
  (KHTML, like Gecko) $(APP_NAME)/$(APP_VER) (Chrome/$(CHROME_VER))
  $(UX RECOMMEND) Safari/$(SAFARI_VER)
  */
  if (/mobile/i.test(ua)) {
    browserDevice = 'mobile';
  }
  
  if (/ipad/i.test(ua)) {
    browserDevice = 'tablet';
    mobileName = 'iPad';
  } else if (/iphone/i.test(ua)) {
    browserDevice = 'mobile';
    mobileName = 'iPhone';
  } else if (/SAMSUNG SM-A9000/i.test(ua)) {
    browserDevice = 'mobile';
    mobileName = 'Samsung Galaxy A5';
  } else if (/SAMSUNG SM-G9301/i.test(ua)) {
    browserDevice = 'mobile';
    mobileName = 'Samsung Galaxy A7';
  } else if (/SAMSUNG SM-A9000/i.test(ua)) {
    browserDevice = 'mobile';
    mobileName = 'Samsung Galaxy A9';
  } else if (/SAMSUNG SM-N900V/i.test(ua)) {
    browserDevice = 'mobile';
    mobileName = 'Samsung Galaxy Note 3';
  } else if (/SAMSUNG SM-N/i.test(ua) || /SAMSUNG GT-N/i.test(ua)) {
    browserDevice = 'mobile';
    mobileName = 'Samsung Galaxy Note model';
  } else if (/SAMSUNG SM-T/i.test(ua) || /SAMSUNG GT-P/i.test(ua)) {
    browserDevice = 'tablet';
    mobileName = 'Samsung Galaxy Tab model';
  } else if (/SM-T835/i.test(ua)) {
    browserDevice = 'tablet';
    mobileName = 'Samsung Galaxy Tab S4';
  } else if (/android/i.test(ua)) {
    browserDevice = browserDevice === 'desktop' ? 'mobile' : browserDevice;
    mobileName = 'Android';
  }

  var ip = (req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress);
  var remoteAddr = req.connection.remoteAddress;
  if (remoteAddr.search(':') !== -1 && remoteAddr.search('.') !== -1) {
    let addr = remoteAddr.split(':');
    remoteAddr = addr[3];
  }
  var socketAddr = req.socket.remoteAddress;
  if (socketAddr.search(':') !== -1 && socketAddr.search('.') !== -1) {
    let addr = socketAddr.split(':');
    socketAddr = addr[3];
  }

  res.send({
    status: 200,
    date_response: moment().locale('th').format('YYYY-MM-DD HH:mm:ss'),
    headers: req.headers,
    // xforwardedfor: req.headers['x-forwarded-for'],
    // connection: req.connection,
    device: browserDevice,
    mobileType: mobileType,
    mobileName: mobileName,
    remoteAddress: remoteAddr,
    socketremoteAddress: socketAddr
  });

});

router.get('/get-annouce/:month/:year', (req, res, next) => {
  let db = req.dbHospData;
  let month = +req.params.month;
  let year = +req.params.year;

  indexModel.getAnnouce(db, month, year)
      .then((results: any) => {
        console.log('get annouce ' + month + ' ' + year + ' = ' + results.length + ' record<s> founded.');
          if (results.length > 0) {
              res.send({ status: 200, ok: true, rows: results });
          } else {
              res.send({ status: 400, ok: true, error: results });
          }
      })
      .catch(error => {
          console.log(error);
          res.send({ status: 500, ok: true, error: error });
      })
      .finally(() => {
          db.destroy();
      });
});

router.post('/sum-annouce/:year', (req, res, next) => {
  let db = req.dbHospData;
  let year = +req.params.year;

  indexModel.sumAnnouce(db, year)
      .then((results: any) => {
        console.log('sum annouce ' + year + ' = ' + results[0].length + ' record<s> founded.');
          if (results.length > 0) {
              res.send({ status: 200, ok: true, rows: results[0] });
          } else {
              res.send({ status: 400, ok: true, error: results });
          }
      })
      .catch(error => {
          console.log(error);
          res.send({ status: 500, ok: true, error: error });
      })
      .finally(() => {
          db.destroy();
      });
});

router.post('/search-annouce', (req, res, next) => {
  let textSearch = req.body.textSearch;

  if (textSearch) {
    let db = req.dbHospData;
    indexModel.searchAnnouce(db, textSearch)
    .then((results: any) => {
      console.log('search annouce ' + textSearch + ' = ' + results.length + ' record<s> founded.');
        if (results.length > 0) {
            res.send({ status: 200, ok: true, rows: results });
        } else {
            res.send({ status: 400, ok: true, error: results });
        }
    })
    .catch(error => {
        console.log(error);
        res.send({ status: 500, ok: true, error: error });
    })
    .finally(() => {
        db.destroy();
    });
} else {

  }
});

router.post('/my-i18n', (req, res, next) => {
  let textSearch = req.body.text;
  let lang = req.body.lang || 'en';
  let tokenKey = req.body.tokenKey;

  let db = req.dbHospData;
  indexModel.getMyI18N(db, textSearch, lang)
  .then((results: any) => {
    console.log('search i18n map ' + textSearch + ' = ' + results.length + ' record<s> founded.');
      if (results.length > 0) {
        if (textSearch) {
          res.send({ status: 200, rows: results[0].text });
        } else {
          res.send({ status: 200, rows: results });
        }
      } else {
          res.send({ status: 400, error: results });
      }
  })
  .catch(error => {
      console.log(error);
      res.send({ status: 500, ok: true, error: error });
  })
  .finally(() => {
      db.destroy();
  });
});

export default router;