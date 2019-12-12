'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { EquipmentModel } from '../../models/open_erp/equipment';

const router = express.Router();
const equipmentModel = new EquipmentModel();

router.get('/', (req, res, next) => {
	let db = req.db;
	equipmentModel.getEquipment(db)
		.then((results: any) => {
			res.send({ rows: results });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/type', (req, res, next) => {
	let db = req.db;
	equipmentModel.getEquipmentType(db)
		.then((results: any) => {
			res.send({ rows: results });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/type-by-id/:id', (req, res, next) => {
	let id = req.params.id
	let db = req.db;
	equipmentModel.getEquipmentTypeByCode(db, id)
		.then((results: any) => {
			res.send({ row: results[0] });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/search/:term', (req, res, next) => {
	let db = req.db;
	let term = req.params.term;
	equipmentModel.getEquipmentBySearch(db, term)
		.then((results: any) => {
			res.send({ rows: results });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/equipment-by-group/:typecode', (req, res, next) => {
	let db = req.db;
	let typecode = req.params.typecode;

	equipmentModel.getEquipmentByGroup(db, typecode)
		.then((results: any) => {
			res.send({ rows: results });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/equipment-ward/:ward/:status', (req, res, next) => {
	let db = req.db;
	let ward = req.params.ward;
	let status = req.params.status;
	equipmentModel.getEquipmentByWard(db, ward, status)
		.then((results: any) => {
			res.send({ rows: results });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/stock', (req, res, next) => {
	let db = req.db;
	equipmentModel.getEquipmentStock(db)
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
	equipmentModel.equipmentDetail(db, id)
		.then((result: any) => {
			res.send({ row: result[0] });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});


router.get('/patient-admit/:term', (req, res, next) => {
	let db = req.db;
	let term = req.params.term;
	equipmentModel.getPatientAdmint(db, term)
		.then((result: any) => {
			res.send({ row: result[0] });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.get('/patient-visit/:term', (req, res, next) => {
	let db = req.db;
	let term = req.params.term;
	equipmentModel.getPatientVisit(db, term)
		.then((result: any) => {
			res.send({ row: result[0] });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

router.post('/save-durable', (req, res, next) => {
	let data = req.body.data;
	let db = req.db;
	equipmentModel.saveDurable(db, data)
	  .then((result: any) => {
		res.send(result);
	  }).catch(error => {
		res.send({ ok: false, error: error })
	  })
	  .finally(() => {
		db.destroy();
	  });
  })

export default router;