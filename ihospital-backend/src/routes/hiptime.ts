'use strict';

import * as express from 'express';
import * as moment from 'moment';

// import { DonateModel } from "../models/donate";
import { HiptimeModel } from "../models/hiptime";

const router = express.Router();

// const model = new DonateModel();
const model = new  HiptimeModel();



/*
//http://localhost:3008/apptime/1?name=abc
router.get('/:id', (req, res, next) => {
 

    let id = req.params.id;
    let name = req.query.name;

  // let db = req.db;
  // let q = req.query.q;
  // let filterBy = req.query.filterby;

  // model.list(db,q,filterBy)
  //   .then((results: any) => {
  //     res.send({ ok: true, rows: results });
  //   })
  //   .catch(error => {
  //     res.send({ ok: false, error: error })
  //   });

       res.send(".get => "+[id,name]);



});



router.post('/:id', (req, res, next) => {
 

  let id = req.params.id;
  let name = req.query.name;
  let data = req.body.data;
 
  let datas = req.body.data;
  let db = req.dbHospData;

  res.send("post =>"+[id,name,data]);
 

  
});
*/

//-------apptime query   public tableName  = 'app_time.userinfo';
router.get('/:id/:Name/', (req, res, next) => {
  let id = req.params.id;
  let  name=req.params.Name;
  
  let db = req.dbHospData;

    // let  q=req.query.q;

   res.send(id+','+name);
   
   /*
   req.params
req.body
req.query
*/

  /*
  model.detail(db, id)
    .then((results: any) => {
      res.send({ ok: true, name  ,detail: results[0] })
    })
*/


/*
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
*/

});

router.get('/',(req,res,next)=>{
  // res.send(req.query)
  res.send(req.query.name+ ','  +req.query.age);
});

// router.get('/detail/:id', (req, res, next) 

router.post('/', (req, res, next) => {
  /*
   {
    "data":{
    "Badgenumber":"4697"

     
      }
  }
  */

  let datas = req.body.data;
  let db = req.dbHospData;
    // console.log(datas);

    /*
  let q = req.query.q;
  let filterBy = req.query.filterby;
  model.list(db,datas,filterBy)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
*/

  
    model.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true, result:results});
        console.log(results);
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
    
    
  //  res.send({ok:true,result: datas });

 
 
});



export default router;