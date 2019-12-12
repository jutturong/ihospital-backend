import { LabCrossModel } from '../../models/bloodbank/labcross';
'use strict';

import * as express from 'express';
import * as moment from 'moment';

const router = express.Router();

const model = new LabCrossModel();

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

router.get('/byfk/:ref', (req, res, next) => {
  let db = req.db;
  let ref = req.params.ref;
  model.listByFk(db, ref)
    .then((results: any) => {
      res.send(results);
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
        res.send({ ok: true ,results})
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
});

router.put('/:req_id', (req, res, next) => {
  let ref = req.params.ref;
  let datas = req.body.data;
  let db = req.db;
  if (datas) {
    model.updateAll(db, ref, datas)
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

router.get('/detail/:ref', (req, res, next) => {
  let ref = req.params.ref;
  let db = req.db;
  model.detail(db, ref)
    .then((results: any) => {
      res.send({ ok: true, detail: results[0] })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});


router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.db;

  model.remove(db, id)
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