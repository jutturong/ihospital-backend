'use strict';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';
import { locale } from 'moment';
import * as moment from 'moment';
import { DataCancerModel } from './../../models/cancer/data-cancer';

const router = express.Router();
const model = new DataCancerModel();

router.get('/', (req, res, next) => {
  let db = req.db;
  model.list(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/:an', (req, res, next) => {
  let an = req.params.an;
  let db = req.db;
  model.listByFk(db, an)
    .then((results: any) => {
      res.send({ rows: results })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/', (req, res, next) => {
  let data = req.body.data;
  let db = req.db;
  console.log(data);
  model.save(db, data).then((result: any) => {
      res.send(result);
    }).catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.put('/:cancer_id', (req, res, next) => {
  let cancer_id = req.params.cancer_id;
  let data = req.body.data;
  let db = req.db;
  if (cancer_id) {
    model.update(db, cancer_id, data)
      .then((result: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.get('/checkCancerAlready/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getCancerAlready(db, hn)
    .then((result: any) => {
      res.send(result)
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/getCancerNew/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getCancerNew(db, hn)
    .then((result: any) => {
      res.send(result)
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/getCancerHis/:hn', (req, res, next) => {
  let hn = req.params.hn;
  let db = req.db;
  model.getCancerHis(db, hn)
    .then((result: any) => {
      res.send({row: result})
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
});

router.get('/getCancerById/:cancer_id', (req, res, next) => {
  let cancer_id = req.params.cancer_id;
  let db = req.db;
  model.getCancerById(db, cancer_id)
    .then((result: any) => {
      res.send(result[0])
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