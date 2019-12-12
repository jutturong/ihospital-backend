'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as crypto from 'crypto';

import { LoginModel } from '../models/login';
import { AuditModel } from '../models/audit';

const router = express.Router();
const loginModel = new LoginModel();
const auditModel = new AuditModel();

router.post('/sum-monthly', (req, res, next) => {
  let db = req.dbHospData;
  let columnName = req.body.columnName;
  let date1 = req.body.date1;
  let date2 = req.body.date2;

  if (!columnName || columnName === '') {
    res.send({ status: 400, error: 'column key not found' });
    return;
  }

  auditModel.sumMonthlyAll(db, columnName, date1, date2)
      .then((results: any) => {
        console.log('sum audit monthly ' + date1 + ' to ' + date2 + ' = ' + results.length + ' record<s> founded.');
          if (results.length > 0) {
              res.send({ status: 200, rows: results[0] });
          } else {
              res.send({ status: 400, error: results });
          }
      })
      .catch(error => {
          console.log(error);
          res.send({ status: 500, error: error });
      })
      .finally(() => {
          db.destroy();
      });
});

export default router;