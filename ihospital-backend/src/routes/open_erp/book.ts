'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { BookModel } from '../../models/open_erp/book';

const router = express.Router();
const bookModel = new BookModel();

router.get('/', (req, res, next) => {
  let db = req.db;
  bookModel.getBook(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/stock', (req, res, next) => {
  let db = req.db;
  bookModel.getBook(db)
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
  bookModel.bookDetail(db, id)
    .then((result: any) => {
      res.send({ row: result[0] });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.post('/', async (req, res, next) => {
  let data = req.body.data;
  let db = req.db;
  await bookModel.save(db, data)
    .then((result: any) => {
      res.send(result);
    }).catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/assessment', (req, res, next) => {
  let data = req.body.data;
  let db = req.db;
  bookModel.saveAssessment(db, data)
    .then((result: any) => {
      res.send(result);
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
    bookModel.update(db, id, data)
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

export default router;