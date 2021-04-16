'use-strict';

const db = require('./db.js');

exports.listExpenses = function (expense_id, categories, min_price, max_price, start_date, end_date) {
	return new Promise((resolve, reject) => {
		let sql = `SELECT e.expense_id, e.date, e.price, e.category_id, name as category_name, 
                        icon as category_icon, description, cash_or_card 
                    FROM expenses e, categories c
                    WHERE e.category_id == c.category_id`;
		let filters = [];

		if (expense_id) {
			sql += ' AND expense_id=?';
			filters.push(expense_id);
		} else {
			if (categories) {
				sql += 'AND category_id IN(';

				for (let i = 0; i < categories.length; i++) {
					sql += ' ?,';
				}
				sql = sql.substr(0, sql.length - 1) + ')';
				filters = categories;
			}

			if (min_price || max_price) {
				sql += categories ? ' AND' : '';
				if (min_price && !max_price) {
					sql += ' price>=?';
					filters.push(min_price);
				} else if (!min_price && maxp_rice) {
					sql += ' price<=?';
					filters.push(max_price);
				} else {
					sql += ' price>=? AND price<=?';
					filters.push(min_price);
					filters.push(max_price);
				}
			}

			if (start_date || end_date) {
				sql += categories || min_price || max_price ? ' AND' : '';
				if (start_date && !end_date) {
					sql += ' date>=?';
					filters.push(start_date);
				} else if (!start_date && end_date) {
					sql += ' date<=?';
					filters.push(end_date);
				} else {
					sql += ' date>=? AND date<=?';
					filters.push(start_date);
					filters.push(end_date);
				}
			}

			sql += ' ORDER BY date DESC, expense_id DESC';
		}

		db.all(sql, [...filters], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.createExpense = function (date, price, category, description, cash_or_card) {
	return new Promise((resolve, reject) => {
		cash_or_card = cash_or_card ? cash_or_card : 0;
		const sql = `INSERT INTO expenses(date, price, category_id, description, cash_or_card)
                        VALUES(?,?,?,?,?)`;

		db.run(sql, [date, price, category, description, cash_or_card], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.updateExpense = function (expense_id, date, price, category, description, cash_or_card) {
	return new Promise((resolve, reject) => {
		let sql = 'UPDATE expenses SET';
		let fields = [];

		if (date) {
			sql += ' date=?';
			fields.push(date);
		}

		if (price) {
			sql += date ? ',' : '';
			sql += ' price=?';
			fields.push(price);
		}

		if (category) {
			sql += date || price ? ',' : '';
			sql += ' category_id=?';
			fields.push(category);
		}

		if (description) {
			sql += date || price || category ? ',' : '';
			sql += ' description=?';
			fields.push(description);
		}

		if (cash_or_card >= 0) {
			sql += date || price || category || description ? ',' : '';
			sql += ' cash_or_card=?';
			fields.push(cash_or_card);
		}

		sql += ' WHERE expense_id=?';
		fields.push(expense_id);

		db.run(sql, [...fields], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.deleteExpense = function (expense_id) {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM expenses WHERE expense_id=?';
		db.run(sql, [expense_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
};
