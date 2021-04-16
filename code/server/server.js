'use-strict';

// imports
const express = require('express');
const morgan = require('morgan');
const { check, validationResult } = require('express-validator');
const moment = require('moment');

// DB interfaces
const expensesDao = require('./expenses_dao');
const categoriesDao = require('./categories_dao');
const budgetsDao = require('./budgets_dao');
const creditCardsDao = require('./credit_cards_dao');

const PORT = 3001;
const APIService = '/api';

app = new express();

app.use(morgan('tiny'));
app.use(express.json());

// REST API endpoints

// Resources: Expenses, Categories, Budgets, Category Budgets

// *** EXPENSES ***

// GET      /expenses
// Request body: could be empty or with filter parameters
// Response body: Array of objects, each describing a Expense
// Errors: 'db errors'
app.get(APIService + '/expenses', (req, res) => {
	expensesDao
		.listExpenses(
			req.query.expense_id,
			req.query.category_id,
			req.query.min_price,
			req.query.max_price,
			req.query.start_date,
			req.query.end_date
		)
		.then(expenses => res.json(expenses))
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// POST     /expenses
// Request body: expense information (date, price, category_id, description, cash_or_card)
// Response body: empty (we need only if the payment is successful or not)
// Errors: if FullName, CardNumber and CVV are empty, if CardNumber is not exact 16 digits, if CVV is not exact 3 digits, if Price is less than 1
app.post(
	APIService + '/expenses',
	[
		check('date').isString(),
		check('price').isFloat(),
		check('category_id').optional().isInt(),
		check('description').optional().isString(),
		check('cash_or_card').isInt(),
	],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		//If the expense doesn't have a category we put -1
		if (!req.body.category_id) {
			req.body.category_id = -1;
		}

		//If the expense doesn't have the description we put ""
		if (!req.body.description) {
			req.body.description = '';
		}

		expensesDao
			.createExpense(req.body.date, req.body.price, req.body.category_id, req.body.description, req.body.cash_or_card)
			.then(expense_id => res.status(201).json({ expense_id }))
			.catch(err => {
				console.log(err);
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// PUT      /expenses/:expense_id
app.put(
	APIService + '/expenses/:expense_id',
	[
		check('date').optional().isString(),
		check('price').optional().isFloat(),
		check('category_id').optional().isInt(),
		check('description').optional().isString(),
		check('cash_or_card').optional().isInt(),
	],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		expensesDao
			.updateExpense(
				req.params.expense_id,
				req.body.date,
				req.body.price,
				req.body.category_id,
				req.body.description,
				req.body.cash_or_card
			)
			.then(expense_id => res.status(201).json({ expense_id }))
			.catch(err => {
				console.log(err);
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// DELETE   /expenses/:expense_id
app.delete(APIService + '/expenses/:expense_id', (req, res) => {
	expensesDao
		.deleteExpense(req.params.expense_id)
		.then(() => res.end())
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// *** CATEGORIES ***

// GET      /categories
app.get(APIService + '/categories', (req, res) => {
	categoriesDao
		.listCategories()
		.then(categories => res.json(categories))
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// POST     /categories
app.post(APIService + '/categories', [check('name').isString(), check('icon').optional().isString()], (req, res) => {
	// handle request body errors

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	categoriesDao
		.createCategory(req.body.name, req.body.icon)
		.then(category_id => {
			res.status(201).json(category_id);
		})
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// PUT      /categories/:category_id
app.put(
	APIService + '/categories/:category_id',
	[check('name').optional().isString(), check('icon').optional().isString()],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		categoriesDao
			.updateCategory(req.params.category_id, req.body.name, req.body.icon)
			.then(category_id => res.status(201).json({ category_id }))
			.catch(err => {
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// DELETE   /categories/:category_id
app.delete(APIService + '/categories/:category_id', (req, res) => {
	categoriesDao
		.deleteCategory(req.params.category_id)
		.then(() => res.end())
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// *** BUDGETS ***

// GET      /budgets/total
app.get(APIService + '/budgets/total', (req, res) => {
	budgetsDao
		.getTotalBudget()
		.then(total_budget => res.json(total_budget))
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// POST     /budgets/total
app.post(
	APIService + '/budgets/total',
	[check('start_date').isString(), check('end_date').isString(), check('budget').isFloat(), check('period').isString()],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		budgetsDao
			.createTotalBudget(req.body.start_date, req.body.end_date, req.body.budget, req.body.period)
			.then(total_budget_id => res.json(total_budget_id))
			.catch(err => {
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// PUT      /budgets/total/:total_budget_id
app.put(
	APIService + '/budgets/total/:total_budget_id',
	[
		check('start_date').optional().isString(),
		check('end_date').optional().isString(),
		check('budget').optional().isFloat(),
		check('period').optional().isString(),
	],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		budgetsDao
			.updateTotalBudget(
				req.params.total_budget_id,
				req.body.start_date,
				req.body.end_date,
				req.body.budget,
				req.body.period
			)
			.then(total_budget_id => res.json(total_budget_id))
			.catch(err => {
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// DELETE   /budgets/total/:total_budget_id
app.delete(APIService + '/budgets/total/:total_budget_id', (req, res) => {
	budgetsDao
		.deleteTotalBudget(req.params.total_budget_id)
		.then(() => res.end())
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// *** CATEGORY BUDGETS ***

// GET      /budgets/categories
app.get(APIService + '/budgets/categories', (req, res) => {
	budgetsDao
		.listCategoryBudgets()
		.then(category_budgets => res.json(category_budgets))
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// POST     /budgets/categories
app.post(
	APIService + '/budgets/categories',
	[check('total_budget_id').isInt(), check('category_id').isInt(), check('budget').isFloat()],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		budgetsDao
			.createCategoryBudget(req.body.total_budget_id, req.body.category_id, req.body.budget)
			.then(category_id => res.json(category_id))
			.catch(err => {
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// PUT      /budgets/categories/:category_budget_id
app.put(APIService + '/budgets/categories/:category_id', [check('budget').isFloat()], (req, res) => {
	// handle request body errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	budgetsDao
		.updateCategoryBudget(req.params.category_id, req.body.budget)
		.then(category_id => res.json(category_id))
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// DELETE   /budgets/categories/:category_budget_id
app.delete(APIService + '/budgets/categories/:category_id', (req, res) => {
	budgetsDao
		.deleteCategoryBudget(req.params.category_id)
		.then(() => res.end())
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// *** CREDIT CARDS ***

// GET 		/creditcards
app.get(APIService + '/creditcards', (req, res) => {
	creditCardsDao
		.listCreditCards()
		.then(credit_cards => res.json(credit_cards))
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

// POST     /creditcards
app.post(
	APIService + '/creditcards',
	[
		check('owner_name').isString(),
		check('number').isInt().isLength({ min: 16, max: 16 }),
		check('expire_date').isString(),
		check('color').isString(),
	],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		creditCardsDao
			.createCreditCard(req.body.owner_name, req.body.number, req.body.expire_date, req.body.color)
			.then(credit_card_id => res.json(credit_card_id))
			.catch(err => {
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// PUT      /creditcards/:credit_card_id
app.put(
	APIService + '/creditcards/:credit_card_id',
	[
		check('owner_name').optional().isString(),
		check('number').optional().isInt().isLength({ min: 16, max: 16 }),
		check('expire_date').optional().isInt(),
		check('color').optional().isString(),
	],
	(req, res) => {
		// handle request body errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		creditCardsDao
			.updateCreditCard(
				req.params.credit_card_id,
				req.body.owner_name,
				req.body.number,
				req.body.expire_date,
				req.body.color
			)
			.then(credit_card_id => res.json(credit_card_id))
			.catch(err => {
				res.status(500).json({
					errors: [{ msg: err }],
				});
			});
	}
);

// DELETE   /creditcards/:credit_card_id
app.delete(APIService + '/creditcards/:credit_card_id', (req, res) => {
	creditCardsDao
		.deleteCreditCard(req.params.credit_card_id)
		.then(() => res.end())
		.catch(err => {
			res.status(500).json({
				errors: [{ msg: err }],
			});
		});
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
