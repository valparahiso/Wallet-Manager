import React from 'react';
import './App.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import moment from 'moment';

// Components
import Homepage from './components/pages/Homepage';
import PageTitle from './components/app_frames/PageTitle';
import YourExpenses from './components/pages/ExpensesPage/YourExpenses';
import Profile from './components/pages/ProfilePage/Profile';
import BottomBar from './components/app_frames/BottomBar';
import EditPlan from './components/subpages/EditAddPlan/EditPlan';
import AddPlan from './components/subpages/EditAddPlan/AddPlan';
import Plan from './components/pages/Plan';
import AddExpense from './components/pages/AddExpense/AddExpense';

// API
import API from './api/API';
import Expense from './api/Expense';
import TotalBudget from './api/TotalBudget';
import getCreditCardExpenses from './api/CreditCardExpenses';
import AlertToast from './components/utils/AlertToast';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			expenses: [],
			categories: [],
			totalBudget: {},
			categoryBudgets: [],
			creditCards: [],
			loading: true,
			pageMode: 'normal',
			deleteFeedback: false,
			error: false,
			noExpenses: false,
			errorMsg: {},
			toast: { type: '', message: '', openToast: false },
			redirect: { redirect: false, route: '' },
		};
	}

	componentDidMount() {
		const APIcalls = [
			API.getExpenses(),
			API.getCategories(),
			API.getTotalBudget(),
			API.getCategoryBudgets(),
			API.getCreditCards(),
		];

		Promise.all(APIcalls)
			.then(data =>
				this.setState({
					expenses: data[0],
					categories: data[1],
					totalBudget: data[2],
					categoryBudgets: data[3],
					creditCards: data[4],
					loading: false,
				})
			)
			.catch(err => this.setState({ error: true, errorMsg: err, loading: false }));
	}

	changePageMode = () => {
		this.state.pageMode === 'edit' ? this.setState({ pageMode: 'normal' }) : this.setState({ pageMode: 'edit' });
	};

	pageModetoNormal = () => {
		this.setState({ pageMode: 'normal' });
	};

	setDeleteFeedback = value => {
		this.setState({ deleteFeedback: value });
	};

	handleExpensesEdit = value => {
		this.setState({ noExpenses: value });
	};

	/*
	 * EXPENSES
	 */
	addExpense = (date, price, category_id, description, cash_or_card, view_toast = true) => {
		API.addExpense(date, price, category_id, description, cash_or_card)
			.then(expense_id => {
				const newExpense = {
					expense_id: expense_id,
					date: date,
					price: price,
					description: description,
					cash_or_card: cash_or_card,
				};
				return this.setState({ expenses: this.state.expenses.concat(newExpense) });
			})
			.then(() => view_toast && this.openToast('Expense added successfully'))
			.then(() => API.getExpenses())
			.then(expenses => this.setState({ expenses: expenses }))
			.then(() => API.getTotalBudget())
			.then(totalBudget => this.setState({ totalBudget: totalBudget }))
			.then(() => API.getCategoryBudgets())
			.then(categoryBudgets => this.setState({ categoryBudgets: categoryBudgets }))

			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				view_toast && this.openToast('Error, please try again', 'error');
			});
	};

	editExpense = (expense_id, date, price, category_id, description, cash_or_card) => {
		API.editExpense(expense_id, date, price, category_id, description, cash_or_card)
			.then(() => {
				const newExpense = new Expense(expense_id, date, price, description, cash_or_card);
				return this.setState(state =>
					state.expenses.forEach(el => {
						if (el.expense_id === expense_id) {
							el = newExpense;
						}
					})
				);
			})
			.then(() => this.openToast('Expense modified successfully'))
			.then(() => API.getExpenses())
			.then(expenses => this.setState({ expenses: expenses }))
			.then(() => API.getTotalBudget())
			.then(totalBudget => this.setState({ totalBudget: totalBudget }))
			.then(() => API.getCategoryBudgets())
			.then(categoryBudgets => this.setState({ categoryBudgets: categoryBudgets }))

			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	deleteExpense = expense_id => {
		API.deleteExpense(expense_id)
			.then(() => this.setState({ expenses: this.state.expenses.filter(el => el.expense_id !== expense_id) }))
			.then(() => this.openToast('Expense deleted successfully'))
			.then(() => API.getExpenses())
			.then(expenses => this.setState({ expenses: expenses }))
			.then(() => API.getTotalBudget())
			.then(totalBudget => this.setState({ totalBudget: totalBudget }))
			.then(() => API.getCategoryBudgets())
			.then(categoryBudgets => this.setState({ categoryBudgets: categoryBudgets }))

			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	/**
	 * CREDIT CARD
	 */
	addCreditCard = (name, number, expiry, import_expenses, color = '') => {
		API.addCreditCard(name, number, moment(expiry, 'YYYY-MM').format('YYYYMM'), color)
			.then(card_id => {
				const NewCard = {
					credit_card_id: card_id,
					owner_name: name,
					number: number,
					expire_date: expiry,
					color: color,
				};
				this.setState({ creditCards: [...this.state.creditCards, NewCard] });

				if (import_expenses) {
					let array = getCreditCardExpenses(card_id, this.state.categories);
					array.forEach(expense => {
						this.addExpense(
							expense.date,
							expense.price,
							expense.category_id,
							expense.description,
							expense.cash_or_card,
							false
						);
					});
				}
			})
			.then(() =>
				this.openToast(import_expenses ? 'Expenses from credit card imported' : 'Credit card successfully added')
			)
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	editCreditCard = (id, name, number, expiry, color = '') => {
		API.editCreditCard(id, name, number, moment(expiry, 'YYYY-MM').format('YYYYMM'), color)
			.then(() => API.getCreditCards().then(creditCards => this.setState({ creditCards: creditCards })))
			.then(() => this.openToast('Credit card modified successfully'))
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	deleteCreditCard = creditCard_id => {
		API.deleteCreditCard(creditCard_id)
			.then(() => {
				const newCardList = this.state.creditCards.filter(elem => elem.credit_card_id !== creditCard_id);
				this.setState({ creditCards: newCardList });
			})
			.then(() => this.openToast('Credit card deleted successfully'))
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	/***
	 * CATEGORY
	 */
	addCategory = (name, icon) => {
		API.addCategory(name, icon)
			.then(cat_id => {
				const NewCat = { category_id: cat_id, name: name, icon: icon };
				this.setState({ categories: [...this.state.categories, NewCat] });
			})
			.then(() => this.openToast('Category added successfully'))
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				console.log('Error addCategory: ', err);
				this.openToast('Error, please try again', 'error');
			});
	};

	editCategory = (category_id, name, icon) => {
		API.editCategory(category_id, name, icon)
			.then(() => {
				const newState = this.state.categories.map(cat =>
					cat.category_id === category_id ? { category_id: category_id, name: name, icon: icon } : cat
				);

				this.setState({ categories: newState });
			})
			.then(() => {
				const newExpenses = this.state.expenses.map(ex => {
					if (ex.category_id === category_id) {
						ex.category_icon = icon;
						ex.category_name = name;
					}
					return ex;
				});

				this.setState({ expenses: newExpenses });
			})
			.then(() => {
				const newCatB = this.state.categoryBudgets.map(cb => {
					if (cb.category_id === category_id) {
						cb.category_icon = icon;
						cb.category_name = name;
					}
					return cb;
				});
				this.setState({ categoryBudgets: newCatB });
			})

			.then(() => this.openToast('Category modified successfully'))
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				console.log('Error editCategory: ', err);
				this.openToast('Error, please try again', 'error');
			});
	};

	deleteCategory = category_id => {
		API.deleteCategory(category_id)
			.then(() => {
				const newCatList = this.state.categories.filter(elem => elem.category_id !== category_id);
				this.setState({ categories: newCatList });
			})
			.then(() => this.openToast('Category deleted successfully'))
			.then(() => {
				const newExpenses = this.state.expenses.map(ex => {
					if (ex.category_id === category_id) {
						ex.category_id = -1;
						ex.category_icon = '';
						ex.category_name = '';
					}
					return ex;
				});

				this.setState({ expenses: newExpenses });
			})

			.then(() => {
				const newCatBudget = this.state.categoryBudgets.filter(elem => elem.category_id !== category_id);
				this.setState({ categoryBudgets: newCatBudget });
			})

			.catch(err => {
				console.log('Error deleteCategory: ', err);
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	/**
	 * PLAN
	 */
	addPlan = (totalBudget, categoryBudgets, redirectRoute) => {
		let redirect = { redirect: false, route: '' };
		if (redirectRoute) {
			redirect.redirect = true;
			redirect.route = redirectRoute;
		}

		API.addTotalBudget(totalBudget.start_date, totalBudget.end_date, totalBudget.budget, totalBudget.period)
			.then(total_budget_id => {
				const newTotalBudget = new TotalBudget(
					total_budget_id,
					totalBudget.start_date,
					totalBudget.end_date,
					totalBudget.budget,
					totalBudget.period
				);

				this.setState({ totalBudget: newTotalBudget });

				if (categoryBudgets.length > 0) {
					let budgets = categoryBudgets.slice();
					budgets.forEach(el => {
						el.total_budget_id = total_budget_id;
						API.addCategoryBudget(total_budget_id, el.category_id, el.budget).catch(err =>
							this.setState({ error: true, errorMsg: err })
						);
					});
					this.setState({ categoryBudgets: budgets });
				}
				return;
			})
			.then(() => API.getTotalBudget())
			.then(totalBudget => this.setState({ totalBudget: totalBudget }))
			.then(() => API.getCategoryBudgets())
			.then(categoryBudgets => this.setState({ categoryBudgets: categoryBudgets || [] }))
			.then(() => this.openToast('Plan added successfully'))
			.then(() => this.setState({ redirect: redirect }))
			.then(() => this.setState({ redirect: { redirect: false, route: '' } }))
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	editPlan = (updateBudget, updateCategoryBudgets, totalBudget, categoryBudgets, redirectRoute) => {
		let redirect = { redirect: false, route: '' };
		if (redirectRoute) {
			redirect.redirect = true;
			redirect.route = redirectRoute;
		}

		if (updateCategoryBudgets) {
			API.deleteTotalBudget(this.state.totalBudget.total_budget_id)
				.then(() =>
					API.addTotalBudget(totalBudget.start_date, totalBudget.end_date, totalBudget.budget, totalBudget.period)
				)
				.then(() => API.getTotalBudget())
				.then(totalBudget => {
					this.setState({ totalBudget: totalBudget });

					if (categoryBudgets.length > 0) {
						return categoryBudgets.forEach(el => {
							API.addCategoryBudget(totalBudget.total_budget_id, el.category_id, el.budget).catch(err =>
								this.setState({ error: true, errorMsg: err })
							);
						});
					}
				})
				.then(() => API.getCategoryBudgets())
				.then(categoryBudgets => this.setState({ categoryBudgets: categoryBudgets || [] }))
				.then(() => this.openToast('Plan modified successfully'))
				.then(() => this.setState({ redirect: redirect }))
				.then(() => this.setState({ redirect: { redirect: false, route: '' } }))
				.catch(err => {
					this.setState({ error: true, errorMsg: err });
					this.openToast('Error, please try again', 'error');
				});
		} else if (updateBudget) {
			API.editTotalBudget(
				totalBudget.total_budget_id,
				totalBudget.start_date,
				totalBudget.end_date,
				totalBudget.budget,
				totalBudget.period
			)
				.then(() => API.getTotalBudget())
				.then(totalBudget => this.setState({ totalBudget: totalBudget }))
				.then(() => this.openToast('Plan modified successfully'))
				.then(() => this.setState({ redirect: redirect }))
				.then(() => this.setState({ redirect: { redirect: false, route: '' } }))
				.catch(err => {
					this.setState({ error: true, errorMsg: err });
					this.openToast('Error, please try again', 'error');
				});
		} else {
			API.editTotalBudget(
				totalBudget.total_budget_id,
				totalBudget.start_date,
				totalBudget.end_date,
				totalBudget.budget,
				totalBudget.period
			)
				.then(() => API.getTotalBudget())
				.then(totalBudget => this.setState({ totalBudget: totalBudget }))
				.then(() => this.openToast('Plan modified successfully'))
				.then(() => this.setState({ redirect: redirect }))
				.then(() => this.setState({ redirect: { redirect: false, route: '' } }))
				.catch(err => {
					this.setState({ error: true, errorMsg: err });
					this.openToast('Error, please try again', 'error');
				});
		}
	};

	deletePlan = redirectRoute => {
		let redirect = { redirect: false, route: '' };
		if (redirectRoute) {
			redirect.redirect = true;
			redirect.route = redirectRoute;
		}

		API.deleteTotalBudget(this.state.totalBudget.total_budget_id)
			.then(() => this.setState({ totalBudget: {}, categoryBudgets: [], deleteFeedback: false }))
			.then(() => this.openToast('Plan deleted successfully'))
			.then(() => this.setState({ redirect: redirect }))
			.then(() => this.setState({ redirect: { redirect: false, route: '' } }))
			.catch(err => {
				this.setState({ error: true, errorMsg: err });
				this.openToast('Error, please try again', 'error');
			});
	};

	openToast = (message, type = '', openToast = true) => {
		let audio;
		if (type === 'error') {
			audio = new Audio('/sounds/error_sound.mp3');
		} else {
			audio = new Audio('/sounds/good_sound.mp3');
		}
		audio.play();
		this.setState({ toast: { type, message, openToast } });
	};

	closeToast = (message, type = '', openToast = false) => {
		this.setState({ toast: { type, message, openToast } });
	};

	render() {
		if (this.state.loading) {
			// Spinner while waiting componentDidMount setting the new state
			return (
				<div className='center-vertically' style={{ height: '100vh', marginLeft: '45%' }}>
					<Spinner animation='border' role='status' />
					<p style={{ marginLeft: '-63px', marginTop: '15px' }}>Loading your expenses...</p>
				</div>
			);
		} else {
			return (
				<Router>
					{this.state.redirect.redirect && <Redirect to={this.state.redirect.route} />}
					<div className='App'>
						<PageTitle
							totalBudget={this.state.totalBudget}
							changePageMode={this.changePageMode}
							setDeleteFeedback={this.setDeleteFeedback}
							goingEdit={this.goingEditPage}
							pageMode={this.state.pageMode}
							noExpenses={this.state.noExpenses}
						/>

						<Switch>
							<Route exact path='/'>
								<Redirect to='/homepage' />
							</Route>

							<Route exact path='/plan/edit'>
								<EditPlan
									expenses={this.state.expenses}
									categories={this.state.categories}
									totalBudget={this.state.totalBudget}
									categoryBudgets={this.state.categoryBudgets}
									editPlan={this.editPlan}
									deletePlan={this.deletePlan}
									deleteFeedback={this.state.deleteFeedback}
									setDeleteFeedback={this.setDeleteFeedback}
								/>
							</Route>

							<Route exact path='/plan/add'>
								<AddPlan
									expenses={this.state.expenses}
									categories={this.state.categories}
									totalBudget={this.state.totalBudget}
									categoryBudgets={this.state.categoryBudgets}
									addPlan={this.addPlan}
									deleteFeedback={this.state.deleteFeedback}
									setDeleteFeedback={this.setDeleteFeedback}
								/>
							</Route>

							<Route exact path='/expenses/edit'>
								<AddExpense
									mode='edit'
									categories={this.state.categories}
									expenses={this.state.expenses}
									editExpense={this.editExpense}
									addCategory={this.addCategory}
									deleteFeedback={this.state.deleteFeedback}
									setDeleteFeedback={this.setDeleteFeedback}
									deleteExpense={this.deleteExpense}
								/>
							</Route>

							<Route exact path='/homepage'>
								<Homepage
									expenses={this.state.expenses}
									totalBudget={this.state.totalBudget}
									deleteExpense={this.deleteExpense}
								/>
							</Route>

							<Route exact path='/expenses'>
								<YourExpenses
									pageMode={this.state.pageMode}
									expenses={this.state.expenses}
									categories={this.state.categories}
									deleteExpense={this.deleteExpense}
									pageModetoNormal={this.pageModetoNormal}
									handleExpensesEdit={this.handleExpensesEdit}
								/>
							</Route>

							<Route exact path='/add'>
								<AddExpense
									mode='add'
									categories={this.state.categories}
									addExpense={this.addExpense}
									addCategory={this.addCategory}
									deleteFeedback={this.state.deleteFeedback}
									setDeleteFeedback={this.setDeleteFeedback}
								/>
							</Route>

							<Route exact path='/plan'>
								<Plan
									totalBudget={this.state.totalBudget}
									categoryBudgets={this.state.categoryBudgets}
									expenses={this.state.expenses}
								/>
							</Route>

							<Route exact path='/profile'>
								<Profile
									//For Credit Card
									creditCards={this.state.creditCards}
									addCreditCard={this.addCreditCard}
									editCreditCard={this.editCreditCard}
									deleteCreditCard={this.deleteCreditCard}
									//For Categories
									categories={this.state.categories}
									addCategory={this.addCategory}
									editCategory={this.editCategory}
									deleteCategory={this.deleteCategory}
								/>
							</Route>

							<Route path='/'>
								<h1>Pagina non trovata</h1>
							</Route>
						</Switch>

						{/*<div style={{ marginTop: '-50px' }}>
							<button onClick={() => this.openToast('No connection', 'error')}>Open Failure</button>
							<button onClick={() => this.openToast('Expenses added successfully')}>Open Success</button>
						</div>*/}

						<AlertToast
							type={this.state.toast?.type}
							message={this.state.toast?.message}
							open={this.state.toast?.openToast}
							close={this.closeToast}
						/>
						<BottomBar pageModeToNormal={this.pageModetoNormal} />
					</div>
				</Router>
				//home, expenses, plan, settings, add
				// edit expense, filter expense, edit plan
			);
		}
	}
}

export default App;
