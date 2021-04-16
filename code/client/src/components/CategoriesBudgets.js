import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { VectorIcon } from '../images/CategoryIcon';
import { Avatar, makeStyles } from '@material-ui/core';
import Piechart from './piechart';
import { BudgetFeedback } from './utils/BudgetFeedback';

const CategoriesBudgets = props => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				marginTop: '20px',
			}}>
			{props?.categoryBudgets.length > 0 && (
				<>
					<div className='page_section section-title-div'>
						<h6 className='section-title'>Category Budgets</h6>
					</div>
					<ListGroup as='ul' variant='flush'>
						{props?.categoryBudgets.map(element => (
							<ListItem
								key={element.category_id}
								categoryBudget={element}
								expenses={props.expenses}
								totalBudget={props.totalBudget}
							/>
						))}
					</ListGroup>
				</>
			)}
		</div>
	);
};

//Component that represents the list of the item when props.listStatus=normal
const ListItem = props => {
	const [icon, setIcon] = useState({ svg: '', name: '', color: '' });

	const [amountPerCategory, setAmountPerCategory] = useState([]);

	const [percentage, setPercentage] = useState('');

	const [leftToSpend, setLeftToSpend] = useState('');

	const [amountSpent, setAmountSpent] = useState('');

	const [overBudget, setOverBudget] = useState(false);

	useEffect(() => {
		//Search the icon and the color associated with that category name.
		const iconObj = VectorIcon.filter(element => element.name === props.categoryBudget.category_icon);
		let color;
		if (iconObj.length !== 0) {
			setIcon({ svg: iconObj[0].svg, name: iconObj[0].name, color: iconObj[0].color });
			color = iconObj[0].color;
		} else {
			//If we don't have an icon we want to display the first letter of category name
			setIcon({
				svg: '',
				name: props.categoryBudget.category_name.charAt(0),
				color: props.categoryBudget.category_icon,
			});
			color = props.categoryBudget.category_icon;
		}

		let amount = props.categoryBudget.spent;

		let amountSpent;
		if (amount > props.categoryBudget.budget) amountSpent = props.categoryBudget.spent - 0.00001;
		else amountSpent = amount;

		let amountNotSpent = props.categoryBudget.budget - amountSpent;

		setAmountPerCategory([
			{ name: '', num: amountNotSpent, color: '#f2f2f2' },
			{ name: '', num: amountSpent, color: color },
		]);

		// calc percentage
		let percentage = (100 * (amount / props.categoryBudget.budget)).toFixed(0);
		setPercentage(percentage);

		let leftToSpend;
		if (amount <= props.categoryBudget.budget) {
			leftToSpend = (props.categoryBudget.budget - amount).toFixed(2);
			setOverBudget(false);
		} else {
			leftToSpend = Math.abs(props.categoryBudget.budget - amount).toFixed(2);
			setOverBudget(true);
		}
		setLeftToSpend(leftToSpend);

		setAmountSpent(amount.toFixed(2));
	}, [props.categoryBudget, props.expenses]);

	const useStyles = makeStyles({
		root: {
			margin: '5px',
			outline: '0',
			'& svg': {
				color: `${icon.color} !important`,
			},
		},
	});

	const classes = useStyles();

	return (
		<ListGroup.Item id={props.categoryBudget.category_id} className={'table-row'}>
			<div className='d-flex w-100'>
				<div className='container'>
					<div className='row' style={{ padding: '5px 0 5px 0', textAlign: 'left' }}>
						<div className='col-4' style={{ position: 'relative', padding: 0 }}>
							<div>
								<Piechart data={amountPerCategory} radius={60} total={props.categoryBudget.budget} />
							</div>
							<div
								style={{
									position: 'absolute',
									marginTop: '-102px',
									marginLeft: '30px',
								}}>
								<div className='center-vertically'>
									<Avatar
										style={{
											backgroundColor: 'white',
											width: '60px',
											height: '60px',
											color: icon.color,
											fontSize: '25pt',
										}}>
										{icon.svg === '' ? (
											props.categoryBudget.category_name.charAt(0)
										) : (
											<svg className={classes.root}>{icon.svg}</svg>
										)}
									</Avatar>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center' }}>{`${percentage} %`}</div>
							</div>
						</div>
						<div className='col-8'>
							<div className='column'>
								<div style={{ paddingLeft: '15px' }}>
									<h6 style={{ fontWeight: 'bold' }}>{props.categoryBudget.category_name}</h6>
								</div>
								<div
									style={{
										minHeight: '50px',

										display: 'flex',

										flexDirection: 'column',
										paddingLeft: '15px',
									}}>
									<h6>
										Budget:
										<span style={{ fontWeight: 'bold' }}>{' € ' + props.categoryBudget.budget.toFixed(2)}</span>
									</h6>{' '}
									{overBudget ? (
										<p
											style={{
												marginBottom: '0',
											}}>
											You spent <span style={{ color: 'rgb(255, 59, 48)', fontWeight: 'bold' }}>€ {leftToSpend} </span>
											over the budget
										</p>
									) : (
										<p
											style={{
												marginBottom: '0',
											}}>
											Left € {leftToSpend} to spend
										</p>
									)}
								</div>

								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<BudgetFeedback
										start_date={props.totalBudget.start_date}
										end_date={props.totalBudget.end_date}
										spent={amountSpent}
										budget={props.categoryBudget.budget}
										categoryBudget={true}
									/>
								</div>
							</div>
						</div>

						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								marginTop: '5px',
							}}>
							<p
								style={{
									fontSize: '11pt',
									paddingLeft: '15px',
								}}>
								€ {amountSpent} / {props.categoryBudget.budget.toFixed(2)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
};

export default CategoriesBudgets;
