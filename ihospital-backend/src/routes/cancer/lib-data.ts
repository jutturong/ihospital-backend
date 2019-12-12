import { LibDataModel } from './../../models/cancer/lib-data';
'use strict';
import * as express from 'express';
import * as fse from 'fs-extra';
import * as wrap from 'co-express';
import { locale } from 'moment';
import * as moment from 'moment';

const router = express.Router();
const model = new LibDataModel();



router.get('/title', (req, res, next) => {
  let db = req.db;
  model.listTitle(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/marital', (req, res, next) => {
  let db = req.db;
  model.listMarital(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/topo', (req, res, next) => {
  let db = req.db;
  model.listTopo(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/topo/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listTopoByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/icd9cm', (req, res, next) => {
  let db = req.db;
  model.listIcd9cm(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/icd9cm/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listIcd9cmByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});


router.get('/mor/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listMorByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/mor', (req, res, next) => {
  let db = req.db;
  model.listMor(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});


router.get('/tnm/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listTnmByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/tnm', (req, res, next) => {
  let db = req.db;
  model.listTnm(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/behaviour', (req, res, next) => {
  let db = req.db;
  model.listBehaviour(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/stage', (req, res, next) => {
  let db = req.db;
  model.listStage(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/laterality', (req, res, next) => {
  let db = req.db;
  model.listLaterality(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/grade', (req, res, next) => {
  let db = req.db;
  model.listGrade(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/extend', (req, res, next) => {
  let db = req.db;
  model.listExtend(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/t', (req, res, next) => {
  let db = req.db;
  model.listT(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/n', (req, res, next) => {
  let db = req.db;
  model.listN(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/m', (req, res, next) => {
  let db = req.db;
  model.listM(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/life', (req, res, next) => {
  let db = req.db;
  model.listLibDischt(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/sitegroup/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listSitegroupByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});


router.get('/province', (req, res, next) => {
  let db = req.db;
  model.listProvince(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/treattype', (req, res, next) => {
  let db = req.db;
  model.listTreattype(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/treatrx', (req, res, next) => {
  let db = req.db;
  model.listTreatRx(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/hospital', (req, res, next) => {
  let db = req.db;
  model.listHospital(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/hospital/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listHospitalByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/doctor', (req, res, next) => {
  let db = req.db;
  model.listDoctor(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/doctor/:code', (req, res, next) => {
  let code = req.params.code;
  let db = req.db;
  model.listDoctorByCode(db, code)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/treatright', (req, res, next) => {
  let db = req.db;
  model.listTreatright(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/pttype', (req, res, next) => {
  let db = req.db;
  model.listPttype(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

router.get('/ward', (req, res, next) => {
  let db = req.db;
  model.listWard(db)
    .then((results: any) => {
      res.send({ rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    });
});

// router.post('/', (req, res, next) => {
//   let datas = req.body.data;
//   let db = req.db;
//   model.save(db, datas)
//     .then((results: any) => {
//       res.send({ ok: true, req_id: results });
// });

//   model.getCurrentCounter(db, 1).then((result: any) => {
//     let currentCounter = result[0].counter;
//     let counter = result[0].counter + 1;
//     let data = { 'counter': counter };

//     model.updateCounter(db, 1, data).then((result: any) => {
//       console.log(result)
//     });

//   }).catch(error => {
//     res.send({ ok: false, error: error })
//   })
//     .finally(() => {
//       db.destroy();
//     });
// });

export default router;