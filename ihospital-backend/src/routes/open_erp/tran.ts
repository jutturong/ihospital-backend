'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { TranModel } from '../../models/open_erp/tran';

const router = express.Router();
const tranModel = new TranModel();

router.get('/', (req, res, next) => {
  let db = req.db;
  tranModel.getTran(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/tran-status-use/:id', (req, res, next) => {
  let db = req.db;
  let id = req.params.id;
  tranModel.tranStatusUse(db, id)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/request', (req, res, next) => {
  let db = req.db;
  tranModel.getTranRequest(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/book-detail/:id', (req, res, next) => {
  let db = req.db;
  let id = req.params.id;
  tranModel.tranDetail(db, id)
    .then((result: any) => {
      res.send({ row: result[0] });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.post('/', (req, res, next) => {
  let data = req.body.data;
  let db = req.db;
  tranModel.save(db, data)
    .then((result: any) => {
      res.send({ ok: true, result: result });
    }).catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/respiratory', (req, res, next) => {
  let data = req.body.data;
  let db = req.db;
  tranModel.saveRes(db, data)
    .then((result: any) => {
      res.send({ ok: true, result: result });
    }).catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  let data = req.body.data;
  let db = req.db;
  if (id) {
    tranModel.update(db, id, data)
      .then((result: any) => {
        res.send({ ok: true, row: result })
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

router.put('/update-durable/:id', (req, res, next) => {
  let id = req.params.id;
  let data = req.body.data;
  let db = req.db;
  if (id) {
    tranModel.updateDurable(db, id, data)
      .then((result: any) => {
        res.send({ ok: true, row: result })
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

router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.db;
  if (id) {
    tranModel.remove(db, id)
      .then((result: any) => {
        res.send({ ok: true, row: result })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  }
})

export default router;