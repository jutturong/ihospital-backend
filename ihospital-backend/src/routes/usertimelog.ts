'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { UsertimelogModel } from "../models/usertimelog";

const router = express.Router();

const model = new UsertimelogModel();



router.get('/', (req, res, next) => {
 
  let db = req.db;
  let q = req.query.q;
  let filterBy = req.query.filterby;

  model.list(db,q,filterBy)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});
router.post('/', (req, res, next) => {
   

/*
http://10.3.42.21:3008/checkinout
body,raw,JSON =>
 {
    "data":{
    "id_user":"4697"

     
      }
  }
*/
 

  let datas = req.body.data;
  let db = req.dbHospData;
     
  // console.log(datas);

  
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

router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  let datas = req.body.data;
  let db = req.dbHospData;

  if (id) {
    model.update(db, id, datas)
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

router.get('/detail/:id', (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;

  model.detail(db, id)
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
  let db = req.dbHospData;

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