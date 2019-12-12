'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { CrossmatchModel } from '../../models/bloodbank/crossmatch';

const router = express.Router();

const model = new CrossmatchModel();

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

router.get('/:req_id', (req, res, next) => {
  let ref = req.params.req_id;
  let db = req.db;
  model.listByFk(db, ref)
    .then((results: any) => {
      res.send(results)
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/pk/', (req, res, next) => {
  let ids = req.body.ids
  let db = req.db;
  model.listByPk(db, ids)
    .then((results: any) => {
      res.send(results)
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
        res.send({ ok: true})
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
});

router.put('/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let datas = req.body.data;
  let db = req.db;
  if (req_id) {
    model.update(db, req_id, datas)
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


router.delete('/:req_id', (req, res, next) => {
  let req_id = req.params.req_id;
  let db = req.db;
  model.remove(db, req_id)
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