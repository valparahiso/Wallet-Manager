import React, { useState, useEffect } from 'react';
import Piechart from '../../piechart';
import moment from 'moment';
import { VectorIcon } from '../../../images/CategoryIcon';

function ShowPieChart(props) {
	const [expensesPieChart, setExpensesPieChart] = useState([]);
	// {name: category_name, num: price of expenses in this category, color: color of category icon}
	const [totalBudget, setTotalBudget] = useState('');

	useEffect(() => {
		let filterExpenses = props.expenses;

		// display expenses for Expenses Period
		if (props.expensesPeriod.period !== 'all') {
			filterExpenses = filterExpenses.filter(
				el =>
					moment(el.date).isSameOrAfter(props.expensesPeriod.datePeriod.clone().startOf(props.expensesPeriod.period)) &&
					moment(el.date).isSameOrBefore(props.expensesPeriod.datePeriod.clone().endOf(props.expensesPeriod.period))
			);
		} else if (props.datePicker.initialDate !== '' && props.datePicker.finalDate !== '') {
			filterExpenses = filterExpenses.filter(
				el =>
					moment(el.date).isSameOrAfter(props.datePicker.initialDate) &&
					moment(el.date).isSameOrBefore(props.datePicker.finalDate)
			);
		} else if (props.datePicker.initialDate !== '') {
			filterExpenses = filterExpenses.filter(el => moment(el.date).isSameOrAfter(props.datePicker.initialDate));
		} else if (props.datePicker.finalDate !== '') {
			filterExpenses = filterExpenses.filter(el => moment(el.date).isSameOrBefore(props.datePicker.finalDate));
		}

		let sum = filterExpenses
			.map(el => el.price)
			.reduce((accumulator, current) => accumulator + current, 0)
			.toFixed(2);
		setTotalBudget(sum);

		calculatePieChart(filterExpenses);
	}, [props.expenses, props.expensesPeriod, props.datePicker]);

	const calculatePieChart = expenses => {
		let sumExpenses = [];

		const distinctCategories = [...new Set(expenses.map(el => el.category_name))];

		distinctCategories.forEach(cat => {
			let sumPrice = expenses
				.filter(expense => expense.category_name === cat)
				.map(el => el.price)
				.reduce((accumulator, current) => accumulator + current, 0);

			let color;
			if (cat !== '') {
				let icon = expenses.filter(expense => expense.category_name === cat).map(el => el.category_icon);
				let iconObj = VectorIcon.filter(element => element.name === icon[0]);

				if (iconObj.length !== 0) {
					color = iconObj[0].color;
				} else {
					//If we don't have an icon we have the color in the field category_icon
					color = icon[0];
				}
			} else color = '#bfbfbf';

			sumExpenses.push({ name: cat, num: sumPrice, color: color });
		});

		setExpensesPieChart(sumExpenses);
	};

	return (
		<div>
			{expensesPieChart.length > 0 ? (
				<div style={{ minHeight: '325px' }}>
					<Piechart data={expensesPieChart} />
					<p style={{ fontWeight: 'bold', paddingTop: '10px' }}> Total: € {totalBudget}</p>
				</div>
			) : (
				<div style={{ minHeight: '325px' }}>
					<Piechart
						emptystate={true}
						data={[
							{ name: '', num: 1, color: '#f2f2f2' },
							{ name: 'a', num: 1, color: '#f2f2f2' },
						]}
					/>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<div
							style={{
								marginTop: '-187px',
								backgroundColor: 'white',
								border: '2px solid',
								position: 'relative',
								borderRadius: '15px',
								padding: '10px',
								width: '250px',
								height: '70px',
							}}>
							There aren't expenses to calculate the pie chart
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ShowPieChart;
