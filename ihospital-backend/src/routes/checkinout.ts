'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { CheckinoutModel } from "../models/checkinout";

const router = express.Router();

const model = new CheckinoutModel();



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

router.get('/callID/:id', (req, res, next) => { 
  let db = req.db;
  let q = req.query.q;
  let id=req.params.id;
  // res.send(id);

  model.getFormID(db,id)
  .then((results:any)=>{
    res.send({ok:true,rows:results});
  })
  .catch(error=>{
    res.send({ok:false,error:error})
  });



});

router.get('/Badge/:Badgenumber',(req,res,next)=>{
  let db = req.db;
  let  Badgenumber=req.params.Badgenumber;
  let filterBy = req.query.filterby;

  // console.log(Badgenumber);
 
  model.querybadgenumber(db,Badgenumber)
  .then((results:any)=>{
    res.send({ok:true,rows:results});
  })
  .catch(error=>{
    res.send({ok:false,error:error})
  });

});

router.post('/', (req, res, next) => {

  let datas = req.body.data;
  let db = req.dbHospData;
   console.log(datas);

   
/*
http://10.3.42.21:3008/usertimelog
body,raw,JSON

   {
        "data":{
            "Badgenumber":"4444",
            "CHECKTIME":"",
            "CHECKTYPE":"",
            "VERIFYCODE":"0",
            "SENSORID":"99",
            "WorkCode":"100",
            "sn":"1"
            
        }
    
    }
*/

  
    model.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true,rows: results })
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