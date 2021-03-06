'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { RequestItemModel } from '../../models/bloodbank/request-item';

const router = express.Router();

const model = new RequestItemModel();

router.get('/req_id/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.listByFk(db, req_id)
    .then((results: any) => {
      res.send(results);
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/an/:an', (req, res, next) => {
  let an = req.params.an;
  let db = req.db;
  model.listByAn(db, an)
    .then((results: any) => {
      res.send({ ok: true, rows: results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
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

router.put('/:req_id', (req, res, next) => {
  let ref = req.params.req_id;
  let datas = req.body.datas;
  let db = req.db;
  console.log(datas);
  if (datas) {
    model.update(db, ref, datas)
      .then((results: any) => {
        res.send({ ok: true, results: results})
      })
      .catch(error => {
        res.send({ ok: false, error: error})
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