import Home from './images/home-empty.svg';
import HomeFilled from './images/home-filled.svg';
import Add from './images/add.svg';
import AddFilled from './images/addFilled.svg';
import Expenses from './images/expenses.svg';
import ExpensesFilled from './images/expensesFilled.svg';
import Plan from './images/plan.svg';
import PlanFilled from './images/planFilled.svg';

import Profile from './images/profile.svg';
import ProfileFilled from './images/profileFilled.svg';

const PageList = [
	{
		route: '/homepage',
		pageTitle: 'Wallet Manager',
		navbar: {
			label: 'Home', // navbar's label under the icon
			icon: Home, // normal icon
			iconFilled: HomeFilled, // selected icon
		},
	},
	{
		route: '/expenses',
		pageTitle: 'Your Expenses',
		pageAction: {
			label: 'Edit',
			action: 'handleEdit',
			type: 'normal',
		},
		navbar: {
			label: 'Expenses',
			icon: Expenses,
			iconFilled: ExpensesFilled,
		},
	},
	{
		route: '/add',
		pageTitle: 'Add Expense',
		pageAction: {
			label: 'Clear',
			action: 'handleDelete',
			type: 'danger',
		},
		navbar: {
			icon: Add,
			iconFilled: AddFilled,
			label: '',
		},
	},

	{
		route: '/plan',
		pageTitle: 'Your Plan',
		pageAction: {
			label: 'Edit',
			action: '/plan/edit',
			type: 'link',
		},
		navbar: {
			icon: Plan,
			iconFilled: PlanFilled,
			label: 'Plan',
		},
	},

	{
		route: '/profile',
		pageTitle: 'Profile',
		navbar: {
			icon: Profile,
			iconFilled: ProfileFilled,
			label: 'Profile',
		},
	},

	{
		route: '/plan/edit',
		pageTitle: 'Edit Plan',
		backRoute: '/plan',
		pageAction: {
			label: 'Delete',
			action: 'handleDelete',
			type: 'danger',
		},
	},

	{
		route: '/plan/add',
		pageTitle: 'Add Plan',
		backRoute: '/plan',
		pageAction: {
			label: '',
			action: '',
			type: '',
		},
	},

	{
		route: '/expenses/edit',
		pageTitle: 'Edit Expense',
		backRoute: '/expenses',
		pageAction: {
			label: 'Delete',
			action: 'handleDelete',
			type: 'danger',
		},
	},
	{
		route: '/expenses/filter',
		pageTitle: 'Filter Expenses',
		backRoute: '/expenses',
		pageAction: {
			label: 'Clear All',
			action: '',
			type: 'danger',
		},
	},
];

export default PageList;
