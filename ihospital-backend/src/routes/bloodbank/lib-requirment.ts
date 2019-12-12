import { LibRequirmentModel } from '../../models/bloodbank/lib-requirment';
'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';

const router = express.Router();

const model = new LibRequirmentModel();

router.get('/', (req, res, next) => {
  let db = req.db;
  model.list(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});


router.post('/', (req, res, next) => {
  let datas = req.body.data;
  let db = req.db;

    model.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  
});

router.put('/:ref', (req, res, next) => {
  let ref = req.params.ref;
  let datas = req.body.data;

  let db = req.db;

  if (ref) {

    model.update(db, ref, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.get('/detail/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.detail(db, req_id)
    .then((results: any) => {
      res.send({ ok: true, detail: results['0'] })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:ref', (req, res, next) => {
  let ref = req.params.ref;
  let db = req.db;

  model.remove(db, ref)
    .then((results: any) => {
      res.send({ ok: true })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

export default router;