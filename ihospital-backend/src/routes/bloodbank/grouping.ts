'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { GroupingModel } from '../../models/bloodbank/grouping';



const router = express.Router();

const model = new GroupingModel();

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
  let req_id = req.params.req_id;
  let db = req.db;
  model.detail(db, req_id)
    .then((results: any) => {
      res.send({ ok: true, rows: results[0] });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/blood-card', (req, res, next) => {
  res.render('blood-card');
  // let db = req.db;
  // let req_id = req.params.req_id;
  // model.bloodCard(db, req_id)
  // .then((results: any) => {
  //   res.render('blood-card', {
  //     rows: results
  //   });
  //   })
  //   .catch(error => {
  //     res.send({ ok: false, error: error })
  //   })
  //   .finally(() => {
  //     db.destroy();
  //   });
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

router.put('/:grouping_id', (req, res, next) => {
  let grouping_id = req.params.grouping_id;
  let datas = req.body.data;
  let db = req.db;
  if (grouping_id) {
    model.update(db, grouping_id, datas)
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