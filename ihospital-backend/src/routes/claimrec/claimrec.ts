'use strict';

import * as express from 'express';
import * as multer from 'multer';
import * as moment from 'moment';

import { SessionModel } from './../../models/claimrec/Session';
import { UploadFile } from './../../models/claimrec/uploadFile';

const uploadPath = 'public/uploads/temp/';
const extractPath = 'public/uploads/unzip/';

const router = express.Router();
const model = new SessionModel();
const uploadfile = new UploadFile(extractPath, uploadPath);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  // filename: function (req, file, cb) {
  //   cb(null, file.originalname)
  //   //cb(null, file.fieldname + '-' + Date.now())
  // }
});

var upload = multer({ storage: storage })

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

router.post('/', upload.single('file'), async (req, res, next) => {
  let data: any  = {};
  let db = req.dbHospData;
  let file: any = req.file; 
  if(file){
    data.origainal_name = file.originalname;
    data.filename = file.filename;
    data.path = file.path;
    data.size = file.size;
    data.size = file.size;
    data.extract_path =  extractPath + file.filename;
    data.hcode = file.originalname.slice(0,5);
    await uploadfile.extractFile(db, file);
    let billtran: any = await uploadfile.readFileBillTran(file.filename);
    data.hname = billtran.ClaimRec.Header.HNAME || '';
    data.sessno = billtran.ClaimRec.Header.SESSNO || '';
  }
  data.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
  data.session_date = req.body.session_date;
  
  model.save(db, data)
  .then((results: any) => {
    res.send({ ok: true, data:data })
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

router.get('/readfile/:id/:ref', async (req, res, next) => {
  let id = req.params.id;
  let ref = req.params.ref;
  let db = req.dbHospData;
  let billtran: any = await uploadfile.readFileBillTran(ref);
  let opservice: []; //any = await uploadfile.readOPServices(ref);

  model.detail(db, id)
    .then((results: any) => {
      res.send({ ok: true, billtran:billtran, opservice:opservice, detail: results[0] })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:id', async (req, res, next) => {
  let id = req.params.id;
  let db = req.dbHospData;
  let detail = await model.detail(db, id);
  await uploadfile.deleteFile(detail[0].filename);
  await uploadfile.deleteFolder(detail[0].filename);
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