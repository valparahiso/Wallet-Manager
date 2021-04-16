'use-strict';

const db = require('./db.js');

// total budgets table queries
exports.getTotalBudget = function () {
	return new Promise((resolve, reject) => {
		const sql = `SELECT total_budget_id, start_date, end_date, budget, period, spent
        FROM total_budgets tb, 
            (SELECT sum(price) as spent
            FROM expenses e, total_budgets tb
            WHERE (date>=tb.start_date AND date<=tb.end_date))`;

		db.get(sql, [], (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row || null);
			}
		});
	});
};

exports.createTotalBudget = function (start_date, end_date, budget, period) {
	return new Promise((resolve, reject) => {
		const sql = `INSERT INTO total_budgets(start_date, end_date, budget, period) VALUES (?,?,?,?)`;

		db.run(sql, [start_date, end_date, budget, period], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.updateTotalBudget = function (total_budget_id, start_date, end_date, budget, period) {
	return new Promise((resolve, reject) => {
		let sql = 'UPDATE total_budgets SET ';
		let fields = [];

		if (start_date) {
			sql += ' start_date=?';
			fields.push(start_date);
		}

		sql += start_date && (end_date || budget || period) ? ',' : '';
		if (end_date) {
			sql += ' end_date=?';
			fields.push(end_date);
		}

		sql += start_date && end_date && (budget || period) ? ',' : '';
		if (budget) {
			sql += ' budget=?';
			fields.push(budget);
		}
		sql += start_date && end_date && budget && period ? ',' : '';
		if (period) {
			sql += ' period=?';
			fields.push(period);
		}

		sql += ' WHERE total_budget_id=?';
		fields.push(total_budget_id);

		db.run(sql, [...fields], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.deleteTotalBudget = function (total_budget_id) {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM total_budgets WHERE total_budget_id=?';

		db.run(sql, [total_budget_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
};

// category_budgets queries
exports.listCategoryBudgets = function () {
	return new Promise((resolve, reject) => {
		const sql = `SELECT cb.total_budget_id, cb.category_id, e.category_name, cb.budget, e.spent, e.category_icon
            FROM category_budgets cb
            LEFT JOIN (SELECT c.category_id, c.name as category_name, c.icon as category_icon, e.spent
                        FROM categories c
                        LEFT JOIN (SELECT e.category_id, sum(price) as spent
                                    FROM expenses e, total_budgets tb
                                    WHERE (e.date>=tb.start_date AND e.date<=tb.end_date)
                                    GROUP BY e.category_id) e
                        ON c.category_id = e.category_id )  e
            ON cb.category_id = e.category_id`;

		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

exports.createCategoryBudget = function (total_budget_id, category_id, budget) {
	return new Promise((resolve, reject) => {
		const sql = 'INSERT INTO category_budgets(total_budget_id, category_id, budget) VALUES (?,?,?)';

		console.log(sql);

		db.run(sql, [total_budget_id, category_id, budget], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.updateCategoryBudget = function (category_id, budget) {
	return new Promise((resolve, reject) => {
		let sql = 'UPDATE category_budgets SET budget=? WHERE category_budget_id=?';

		db.run(sql, [budget, category_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(this.lastID);
			}
		});
	});
};

exports.deleteCategoryBudget = function (category_id) {
	return new Promise((resolve, reject) => {
		const sql = 'DELETE FROM category_budgets WHERE category_id=?';
		db.run(sql, [category_budget_id], function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
};

// MEGA QUERY PER avere sia la categorie budget e tot speso che per quelle non pianificate
/*
SELECT *
FROM (
SELECT cb.category_id, cb.budget, sum(price)
FROM category_budgets cb, total_budgets tb, expenses e
WHERE cb.category_id = e.category_id AND (date>start_date AND date<end_date)
GROUP BY cb.category_id, cb.budget
UNION
SELECT category_id, 0, sum(price)
FROM expenses e, total_budgets tb
WHERE category_id NOT IN ( SELECT category_id
												FROM category_budgets)
 AND (date>start_date AND date<end_date)
 GROUP BY e.category_id
 )
 ORDER BY budget DESC
 */
