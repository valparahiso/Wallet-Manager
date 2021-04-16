//This is a fake API. This is the fake expenses that the application retrieve from the bank provider.

const expenses = cardId => [
	{
		date: '20210210',
		price: 15.5,
		suggest_categories: ['Food', 'Dinner', 'Launch', 'Pizza'],
		description: `Hamburger`,
		cash_or_card: 1,
	},
	{
		date: '20210122',
		price: 55.5,
		suggest_categories: ['Food', 'Dinner', 'Launch', 'Pizza'],
		description: `Supermarket`,
		cash_or_card: 1,
	},
	{
		date: '20210209',
		price: 15.5,
		suggest_categories: ['Food', 'Dinner', 'Launch', 'Pizza'],
		description: `Dinner with friends`,
		cash_or_card: 1,
	},
	{
		date: '20210211',
		price: 22.5,
		suggest_categories: ['Food', 'Dinner', 'Launch', 'Pizza'],
		description: `Family dinner`,
		cash_or_card: 1,
	},
	{
		date: '20201218',
		price: 15.5,
		suggest_categories: ['Food', 'Dinner', 'Launch', 'Pizza'],
		description: `Supermarket`,
		cash_or_card: 1,
	},
	{
		date: '20210110',
		price: 37.5,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Gasoline`,
		cash_or_card: 1,
	},
	{
		date: '20210205',
		price: 36,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Bus ticket`,
		cash_or_card: 1,
	},
	{
		date: '20210109',
		price: 25.5,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Train ticket`,
		cash_or_card: 1,
	},
	{
		date: '20210205',
		price: 36,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Bus ticket`,
		cash_or_card: 1,
	},
	{
		date: '20210109',
		price: 25.5,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Train ticket`,
		cash_or_card: 1,
	},
	{
		date: '20210110',
		price: 42.5,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Gasoline`,
		cash_or_card: 1,
	},
	{
		date: '20210110',
		price: 17.0,
		suggest_categories: ['Gas', 'Gasoline', 'Transport', 'Bus', 'Car', 'Fuel'],
		description: `Gasoline`,
		cash_or_card: 1,
	},

	{
		date: '20210130',
		price: 17.5,
		suggest_categories: ['Home', 'House', 'Furniture'],
		description: `New pillow`,
		cash_or_card: 1,
	},
	{
		date: '20210205',
		price: 40,
		suggest_categories: ['School', 'Education', 'Book'],
		description: `Book`,
		cash_or_card: 1,
	},
	{
		date: '20210210',
		price: 15.5,
		suggest_categories: ['School', 'Education', 'Book'],
		description: `React course`,
		cash_or_card: 1,
	},
	{
		date: '20201209',
		price: 17.5,
		suggest_categories: ['School', 'Education', 'Book'],
		description: `Book`,
		cash_or_card: 1,
	},
	{
		date: '20201222',
		price: 17.5,
		suggest_categories: ['School', 'Education', 'Book'],
		description: `Book`,
		cash_or_card: 1,
	},
	{
		date: '20210114',
		price: 18.5,
		suggest_categories: ['Sport', 'Soccer', 'Football', 'Sports'],
		description: `Swim`,
		cash_or_card: 1,
	},
	{
		date: '20210210',
		price: 13.5,
		suggest_categories: ['Sport', 'Soccer', 'Football', 'Sports'],
		description: `Sport tax`,
		cash_or_card: 1,
	},
	{
		date: '20210114',
		price: 18.5,
		suggest_categories: ['Sport', 'Soccer', 'Football', 'Sports'],
		description: `Swim`,
		cash_or_card: 1,
	},
	{
		date: '20210210',
		price: 13.5,
		suggest_categories: ['Sport', 'Soccer', 'Football', 'Sports'],
		description: `Sport tax`,
		cash_or_card: 1,
	},
	{
		date: '20210114',
		price: 18.5,
		suggest_categories: ['Sport', 'Soccer', 'Football', 'Sports'],
		description: `Swim`,
		cash_or_card: 1,
	},
	{
		date: '20210210',
		price: 13.5,
		suggest_categories: ['Sport', 'Soccer', 'Football', 'Sports'],
		description: `Sport tax`,
		cash_or_card: 1,
	},
];

function getCreditCartExpenses(cardId, categories) {
	let array = [];

	expenses(cardId).forEach(expense => {
		let cat_id = -1;

		//Here I have a single expense
		categories.forEach(category => {
			//Here I have a single expense and single category
			expense.suggest_categories.forEach(suggest_cat => {
				if (cat_id === -1 && category.name === suggest_cat) {
					cat_id = category.category_id;
				}
			});
		});

		//Here I have the expense categorize
		array.push({
			date: expense.date,
			price: expense.price,
			category_id: cat_id,
			description: expense.description,
			cash_or_card: expense.cash_or_card,
		});
	});

	let random = array.sort(() => 0.5 - Math.random()).slice(0, 10);

	return random;
}

export default getCreditCartExpenses;
