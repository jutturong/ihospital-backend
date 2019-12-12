'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as HttpStatus from 'http-status-codes';
import { EquipmentLibModel } from '../../models/open_erp/equipment-lib';

const router = express.Router();
const equipmentLibModel = new EquipmentLibModel();

router.get('/ward/:id', (req, res, next) => {
	let id = req.param.bind;
	let db = req.db;
	equipmentLibModel.listWard(db, id)
		.then((results: any) => {
			res.send({ rows: results });
		})
		.catch(error => {
			res.send({ ok: false, error: error })
		});
});

export default router;