'use strict';

import * as express from 'express';
import * as moment from 'moment';

// import { DonateModel } from "../models/donate";
import { ApptimeModel } from "../models/apptime";
// import { ApptimeModel }  from "../models/apptime";


const router = express.Router();

// const model = new DonateModel();
const model = new  ApptimeModel();



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
   
  
  //let datas = req.body.data;
  /*
  {
    "data":{
    "employeeCode":"88370",
    "employeeNo":"A1631",
    "IMEI":"8643940201649460193",
    "simserial":"89014103211649460193",
      "deviceID":"864394020164945"
     
      }
  }
  */

  let datas = req.body;
  
  let db = req.dbHospData;

  console.log(datas);


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

     
  
});

router.post('/device', (req, res, next) => {
  let db = req.db;


  let filterBy = req.query.filterby;
  let datas=req.body.data;
  
  let employeeNo=req.body.data.employeeNo;
  let IMEI=req.body.data.IMEI;
  let simserial=req.body.data.simserial;
  let deviceID=req.body.data.deviceID;
 

/*
{"ok":true,"rows":[{"id_user":385,"employeeCode":88370,"employeeNo":"A1631","IMEI":"864394020164945","simserial":"89014103211649460193","deviceID":"864394020164945","timelog":"2019-11-11 11:17:40","Badgenumber":4697}]}
*/

    // console.log(employeeNo,IMEI,simserial,deviceID);
  // console.log(datas);

  /*
  model.save(db, datas)
        .then((results) => {
        res.send({ ok: true });
    })
  */

  
   model.queryuser(db,employeeNo,IMEI,simserial,deviceID).then((results:any)=>{
     res.send({ok:true,rows:results});
   });
  
   
  

    
});

router.post('/dateexpire/',(req,res,next)=>{
  let db = req.db;
  let data=req.body.data;

  let employeeNo=req.body.data.employeeNo;
  let IMEI=req.body.data.IMEI;
  let simserial=req.body.data.simserial;
  let deviceID=req.body.data.deviceID;
  let IMEI_expire=req.body.data.IMEI_expire;
  let id_user=req.body.data.id_user;

  // console.log(data);

  
  model.queryuserexpire(db, id_user ,IMEI_expire).then((results:any)=>{
    res.send({ok:true,rows:results});
  });
 


});

router.post('/expire/',(req,res,next)=>{
  let db = req.db;
  let data=req.body.data;
  //  console.log(data);


  let employeeNo=req.body.data.employeeNo;
  let IMEI=req.body.data.IMEI;
  let simserial=req.body.data.simserial;
  let deviceID=req.body.data.deviceID;
  
/*
{ employeeNo: 'A1631',
  IMEI: '864394020164945',
  simserial: '89014103211649460193',
  deviceID: '864394020164945' }

  {
	"data":{
		"employeeNo":"A1631",
		 "IMEI": "864394020164945",
         "simserial": "89014103211649460193",
         "deviceID": "864394020164945" ,
         "IMEI_expire" : "0000-00-00"
	}
}


*/
  console.log(data);



});

//http://10.3.42.61:3008/apptime/counHour/

router.post('/counHour/',(req,res,next)=>{

   /*
  {
	"data":{
		"startdate":"2019-12-06 08:30:20",
		"enddate":"2019-12-06 15:51:10"
	
	}
}
   */
  let db = req.db;
  let data=req.body.data;
  let startdate=data.startdate;
  let enddate=data.enddate;
  model.countH(db, startdate ,enddate ).then((results: any) => {
    res.send({ ok: true, rows: results });
  })
  .catch(error => {
    res.send({ ok: false, error: error })
  });
  // res.send(startdate + ',' +  enddate );

});

router.get('/code/:employeeNo', (req, res, next) => {
 
  let db = req.db;
  let employeeNo = req.params.employeeNo;
  let filterBy = req.query.filterby;
   
    //  res.send(employeeNo);

     
     model.queryemployeeNo(db,employeeNo)
     .then((results: any) => {
       res.send({ ok: true, rows: results });
     })
     .catch(error => {
       res.send({ ok: false, error: error })
     });

  
    /*
   model.list(db,q,filterBy)
   .then((results: any) => {
     res.send({ ok: true, rows: results });
   })
   .catch(error => {
     res.send({ ok: false, error: error })
   });
   */

   



});

export default router;