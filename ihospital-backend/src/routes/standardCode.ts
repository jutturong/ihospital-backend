'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

import { StandardCodeModel } from '../models/standardCode';

const router = express.Router();
const stdCode = new StandardCodeModel();

router.get('/budget-pattern', (req, res, next) => {

  let db = req.dbBM;

  stdCode.getBudgetPattern(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.get('/budget-type', (req, res, next) => {

  let db = req.dbBM;

  stdCode.getBudgetType(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

export default router;