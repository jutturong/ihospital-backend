'use strict';
import * as express from 'express';
import { SpecimenModel } from '../../models/bloodbank/specimen';

const router = express.Router();

const model = new SpecimenModel();

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
  console.log(ref);
  if (ref) {
    model.update(db, ref, datas)
      .then((results: any) => {
        res.send({ ok: true , results: results})
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

router.get('/:ref', (req, res, next) => {
  let ref = req.params.ref;
  let db = req.db;
  model.view(db, ref)
    .then((results: any) => {
      res.send({ ok: 'ok', row: results[0] });
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