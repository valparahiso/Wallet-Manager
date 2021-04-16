'use-strict';

const db = require('./db.js');

exports.listCreditCards = function () {
	return new Promise((resolve, reject) => {
		let sql = 'SELECT * FROM credit_cards';

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.createCreditCard = function (owner_name, number, expire_date, color = '') {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO credit_cards(owner_name, number, expire_Date, color) VALUES(?,?,?,?)';

		db.run(sql, [owner_name, number, expire_date, color], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.updateCreditCard = function (credit_card_id, owner_name, number, expire_date, color = '') {
	return new Promise((resolve, reject) => {
		let sql = 'UPDATE credit_cards SET owner_name=?, number=?, expire_date=?, color=? WHERE credit_card_id=?';

		db.run(sql, [owner_name, number, expire_date, color, credit_card_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.deleteCreditCard = function (credit_card_id) {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM credit_cards WHERE credit_card_id=?';

		db.run(sql, [credit_card_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
};
