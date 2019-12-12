'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { ClaimModel } from "../models/claim";

const router = express.Router();

const model = new ClaimModel();

router.get('/', async (req, res, next) => {
 
  let db = req.db;
  let q = req.query.q;
  let filterBy = req.query.filterby;

  try {
    const result = await model.list(db,q,filterBy);
    res.send({ ok: true, rows: result });
  } catch (error) {
    res.send({ ok: false, error: error, message: error.message });
  }

  // model.list(db,q,filterBy)
  //   .then((results: any) => {
  //     res.send({ ok: true, rows: results });
  //   })
  //   .catch(error => {
  //     res.send({ ok: false, error: error })
  //   });
});

router.post('/', async (req, res, next) => {
  let datas = req.body.data;
  let db = req.dbHospData;

  try {
    const result = await model.save(db, datas);
    res.send({ ok: true, result });
  } catch (error) {
    res.send({ ok: false, error: error, message: error.message });
  }
    // model.save(db, datas)
    //   .then((results: any) => {
    //     res.send({ ok: true })
    //   })
    //   .catch(error => {
    //     res.send({ ok: false, error: error })
    //   })
    //   .finally(() => {
    //     db.destroy();
    //   });
  
});

router.put('/:id', async (req, res, next) => {
  let id = req.params.id;
  let datas = req.body.data;
  let db = req.dbHospData;

  if (id) {
    try {
      const result = await model.update(db, id, datas);
      res.send({ ok: true, result });
    } catch (error) {
      res.send({ ok: false, error: error, message: error.message });
    }
    // model.update(db, id, datas)
    //   .then((results: any) => {
    //     res.send({ ok: true })
    //   })
    //   .catch(error => {
    //     res.send({ ok: false, error: error })
    //   })
    //   .finally(() => {
    //     db.destroy();
    //   });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์', message: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.get('/detail/:id', async (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  try {
    const result = await model.detail(db, id);
    res.send({ ok: true, detail: result[0], result });
  } catch (error) {
    res.send({ ok: false, error: error, message: error.message });
  }

  // model.detail(db, id)
  //   .then((results: any) => {
  //     res.send({ ok: true, detail: results[0] })
  //   })
  //   .catch(error => {
  //     res.send({ ok: false, error: error })
  //   })
  //   .finally(() => {
  //     db.destroy();
  //   });
});

router.delete('/:id', async (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  try {
    const result = await model.remove(db, id);
    res.send({ ok: true, result });
  } catch (error) {
    res.send({ ok: false, error: error, message: error.message });
  }

  // model.remove(db, id)
  //   .then((results: any) => {
  //     res.send({ ok: true })
  //   })
  //   .catch(error => {
  //     res.send({ ok: false, error: error })
  //   })
  //   .finally(() => {
  //     db.destroy();
  //   });
});

export default router;