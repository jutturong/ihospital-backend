'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as multer from 'multer';
import * as fs from 'fs';
import * as parser from 'xml2json';
import * as readline from 'readline';
import * as windows874 from 'windows-874';

import { UploadFile } from './../../models/claimrec/uploadFile';

const router = express.Router();
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/temp')
    },
    // filename: function (req, file, cb) {
    //   cb(null, file.originalname)
    //   //cb(null, file.fieldname + '-' + Date.now())
    // }
});

const uploadfile = new UploadFile();

var upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), async (req, res, next) => {
  let db = req.dbHospData;
  const file = req.file;
  await uploadfile.extractFile(db, file);
  let billtran: any = await uploadfile.readFileBillTran(file.filename);
  res.send({ 
      ok: true, 
      file:file, 
      billtran:billtran,
      extract: 'public/uploads/unzip/'+file.filename
     })
});

router.get('/listfile/:id', async (req, res, next) => {
    let file = req.params.id;
    let db = req.dbHospData;
    let billtran: any = await uploadfile.readFileBillTran(file);
    let opservice: any = await uploadfile.readOPServices(file);
    res.send({ ok: true, billtran:billtran, opservice:opservice });
});

export default router;