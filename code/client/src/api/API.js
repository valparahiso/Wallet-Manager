import Category from './Category';
import Expense from './Expense';
import TotalBudget from './TotalBudget';
import CategoryBudget from './CategoryBudget';
import CreditCard from './CreditCard';

const moment = require('moment');

const baseURL = '/api';

// *** EXPENSES ***

// GET      /api/expenses
async function getExpenses(filters) {
	return new Promise((resolve, reject) => {
		let url = '/expenses';

		if (filters) {
			url += '?';
			if (filters.categories.length > 0) {
				filters.categories.forEach(el => {
					url += 'category[]=' + el + '&';
				});
				url = url.substr(0, url.length - 1);
			}

			url +=
				filters.categories.length > 0 &&
				(filters.min_price || filters.max_price || filters.start_date || filters.end_date)
					? '&'
					: '';
			url += filters.min_price ? 'min_price=' + filters.min_price : '';

			url +=
				filters.categories.length > 0 &&
				filters.min_price &&
				(filters.max_price || filters.start_date || filters.end_date)
					? '&'
					: '';
			url += filters.max_price ? 'max_price=' + filters.max_price : '';

			url +=
				filters.categories.length > 0 &&
				filters.min_price &&
				filters.max_price &&
				(filters.start_date || filters.end_date)
					? '&'
					: '';
			url += filters.start_date ? 'start_date=' + filters.start_date : '';
			url +=
				filters.categories.length > 0 &&
				filters.min_price &&
				filters.max_price &&
				filters.start_date &&
				filters.end_date
					? '&'
					: '';
			url += filters.end_date ? 'end_date=' + filters.end_date : '';
		}

		fetch(baseURL + url, {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response.json().then(expenses => {
						resolve(
							expenses.map(expense => {
								return new Expense(
									expense.expense_id,
									expense.date,
									expense.price,
									expense.category_id,
									expense.category_name,
									expense.category_icon,
									expense.description,
									expense.cash_or_card
								);
							})
						);
					});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			});
	});
}

// POST     /api/expenses
async function addExpense(date, price, category_id, description, cash_or_card) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/expenses', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				date: moment(date).format('YYYYMMDD').toString(),
				price: price,
				category_id: category_id,
				description: description,
				cash_or_card: cash_or_card ? 1 : 0,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response
						.json()
						.then(expense_id => {
							resolve(expense_id);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// GET     /api/expenses/:expense_id
async function getExpense(expense_id) {
	let url = '/expenses/?expense_id=' + expense_id;
	const response = await fetch(baseURL + url);
	const expenseJSON = await response.json();
	if (response.ok) {
		return expenseJSON.map(expense => {
			return new Expense(
				expense.expense_id,
				expense.date,
				expense.price,
				expense.category_id,
				expense.description,
				expense.cash_or_card
			);
		});
	} else throw expenseJSON;
}

// PUT      /api/expenses/:expense_id
async function editExpense(expense_id, date, price, category_id, description, cash_or_card) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/expenses/' + expense_id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				date: date ? moment(date).format('YYYYMMDD').toString() : '',
				price: price,
				category_id: category_id,
				description: description,
				cash_or_card: cash_or_card ? 1 : 0,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// DELETE       /api/expenses/:expense_id
async function deleteExpense(expense_id) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/expenses/' + expense_id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// *** CATEGORIES ***

// GET      /api/categories
async function getCategories() {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/categories', {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response.json().then(categories => {
						resolve(
							categories.map(category => {
								return new Category(category.category_id, category.name, category.icon);
							})
						);
					});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			});
	});
}

// POST     /api/categories
async function addCategory(name, icon) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/categories/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: name,
				icon: icon,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response
						.json()
						.then(category_id => {
							resolve(category_id);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// PUT      /api/categories/:category_id
async function editCategory(category_id, name, icon) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/categories/' + category_id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: name,
				icon: icon,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// DELETE       /api/categories/:category_id
async function deleteCategory(category_id) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/categories/' + category_id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// *** BUDGETS ***
// GET      /api/budgets/total
async function getTotalBudget() {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/total', {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response.json().then(totalBudget => {
						if (totalBudget) {
							resolve(
								new TotalBudget(
									totalBudget.total_budget_id,
									totalBudget.start_date,
									totalBudget.end_date,
									totalBudget.budget,
									totalBudget.period,
									totalBudget.spent
								)
							);
						} else {
							resolve(null);
						}
					});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// POST     /api/budgets/total
async function addTotalBudget(start_date, end_date, budget, period) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/total', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				start_date: moment(start_date).format('YYYYMMDD').toString(),
				end_date: moment(end_date).format('YYYYMMDD').toString(),
				budget: budget,
				period: period,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response
						.json()
						.then(total_budget_id => {
							resolve(total_budget_id);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// PUT      /api/budgets/total/:total_budget_id
async function editTotalBudget(total_budget_id, start_date, end_date, budget, period) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/total/' + total_budget_id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				start_date: start_date ? moment(start_date).format('YYYYMMDD').toString() : '',
				end_date: end_date ? moment(end_date).format('YYYYMMDD').toString() : '',
				budget: budget,
				period: period,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// DELETE       /api/budgets/total/:total_budget_id
async function deleteTotalBudget(total_budget_id) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/total/' + total_budget_id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// *** CATEGORY BUDGETS ***
// GET      /api/budgets/categories
async function getCategoryBudgets() {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/categories', {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response.json().then(categoryBudgets => {
						resolve(
							categoryBudgets.map(categoryBudget => {
								return new CategoryBudget(
									categoryBudget.total_budget_id,
									categoryBudget.category_id,
									categoryBudget.category_name,
									categoryBudget.category_icon,
									categoryBudget.budget,
									categoryBudget.spent
								);
							})
						);
					});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			});
	});
}

// POST     /api/budgets/categories
async function addCategoryBudget(total_budget_id, category_id, budget) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/categories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				total_budget_id: total_budget_id,
				category_id: category_id,
				budget: budget,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response
						.json()
						.then(category_budget_id => {
							resolve(category_budget_id);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// PUT      /api/budgets/categories/:category_budget_id
async function editCategoryBudget(category_id, budget) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/categories/' + category_id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				budget: budget,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// DELETE       /api/budgets/categories/:category_budget_id
async function deleteCategoryBudget(category_id) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/budgets/categories/' + category_id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// *** CREDIT CARDS ***
// GET      /api/creditcards
async function getCreditCards() {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/creditcards', {
			method: 'GET',
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response
						.json()
						.then(creditCards => {
							resolve(
								creditCards.map(creditCard => {
									return new CreditCard(
										creditCard.credit_card_id,
										creditCard.owner_name,
										creditCard.number,
										moment(creditCard.expire_date, 'YYYYMM').format('YYYY-MM'),
										creditCard.color
									);
								})
							);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			});
	});
}

// POST     /api/creditcards
async function addCreditCard(owner_name, number, expire_date, color) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/creditcards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				owner_name: owner_name,
				number: number,
				expire_date: expire_date,
				color: color,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					response
						.json()
						.then(credit_card_id => {
							resolve(credit_card_id);
						})
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						});
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// PUT      /api/creditcards/:credit_card_id
async function editCreditCard(credit_card_id, owner_name, number, expire_date, color) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/creditcards/' + credit_card_id, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				owner_name: owner_name,
				number: number,
				expire_date: expire_date,
				color: color,
			}),
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

// DELETE       /api/creditcards/:credit_card_id
async function deleteCreditCard(credit_card_id) {
	return new Promise((resolve, reject) => {
		fetch(baseURL + '/creditcards/' + credit_card_id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				const status = response.status;
				if (response.ok) {
					resolve(null);
				} else {
					response
						.json()
						.then(obj => {
							obj.status = status;
							reject(obj);
						}) // error msg in the response body
						.catch(err => {
							reject({ errors: [{ param: 'Application', msg: 'Cannot parse server response' }] });
						}); // something else
				}
			})
			.catch(err => {
				reject({ errors: [{ param: 'Server', msg: 'Cannot communicate' }] });
			}); // connection errors
	});
}

const API = {
	getExpenses,
	getExpense,
	addExpense,
	editExpense,
	deleteExpense,
	getCategories,
	addCategory,
	editCategory,
	deleteCategory,
	getTotalBudget,
	addTotalBudget,
	editTotalBudget,
	deleteTotalBudget,
	getCategoryBudgets,
	addCategoryBudget,
	editCategoryBudget,
	deleteCategoryBudget,
	getCreditCards,
	addCreditCard,
	editCreditCard,
	deleteCreditCard,
};

export default API;
