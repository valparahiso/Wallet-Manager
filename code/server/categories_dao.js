'use-strict';

const db = require('./db.js');

exports.listCategories = function () {
	return new Promise((resolve, reject) => {
		let sql = 'SELECT * FROM categories WHERE category_id != -1 ORDER BY category_id';

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.createCategory = function (name, icon) {
	return new Promise((resolve, reject) => {
		let fields = [];
		fields.push(name);

		let sql;

		if (icon) {
			sql = 'INSERT INTO categories(name, icon) VALUES(?,?)';
			fields.push(icon);
		} else {
			sql = 'INSERT INTO categories(name) VALUES(?)';
		}

		db.run(sql, [...fields], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.updateCategory = function (category_id, name, icon) {
	return new Promise((resolve, reject) => {
		let sql = 'UPDATE categories SET name=?, icon=? WHERE category_id=?';

		db.run(sql, [name, icon, category_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.deleteCategory = function (category_id) {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM categories WHERE category_id=?';

		db.run(sql, [category_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
};
