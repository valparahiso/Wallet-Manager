// Essentials
import React, { useState } from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { SwipeableList, SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

// Components
import { BudgetFeedback } from '../utils/BudgetFeedback';
import MainHelpSection from '../utils/HelpSection';
import CategoryChip from '../CategoryChip';

// Images
import PlanEmpty from '../../images/plan_emptystate.jpg';
import ExpensesEmpty from '../../images/expenses_emptystate.jpg';

// Modules
const moment = require('moment');

function Homepage(props) {
	const [showHelp, setShowHelp] = useState(false);

	const closeHelp = () => {
		setShowHelp(false);
	};

	return (
		<div className='page'>
			<ExpenseList expenses={props.expenses} deleteExpense={props.deleteExpense} />
			<PlanGlance totalBudget={props.totalBudget} />
			<MainHelpSection show={showHelp} close={closeHelp} />
			<div className='page_footer' style={{ boxShadow: '0px 0px 0px 0px' }}>
				<Col
					xs={2}
					style={{ position: 'absolute', right: '0px', bottom: '71px', padding: '0' }}
					onClick={() => setShowHelp(true)}>
					<i className='fas fa-question-circle fa-lg'
						style={{ borderRadius: '60px', width: '50px', boxShadow: 'rgb(136 136 136) 0px 0px 5px',
						padding: '15px 0px', background: 'white'}}></i>
				</Col>
			</div>
		</div>
	);
}

function ExpenseList(props) {
	let firstExpenses = props.expenses
		.slice(0, 6)
		.map(el => <ExpenseItem key={el.expense_id} expense={el} deleteExpense={props.deleteExpense} />);

	return (
		<div className='page_section' style={{ height: '280px' }}>
			<div className='section_title'>
				<div className='container'>
					<Row>
						<Col xs={8} style={{ paddingLeft: '0' }}>
							Last Expenses
						</Col>
						<Col xs={4} style={{ textAlign: 'right', fontWeight: 'normal', fontSize: '14px', paddingRight: '0' }}>
							<Link to='/expenses' style={{ position: 'relative', bottom: '-3px', color: 'rgba(74, 74, 74, 1.0)' }}>
								{'Show All '}
								<i className='fas fa-chevron-right'> </i>
							</Link>
						</Col>
					</Row>
				</div>
			</div>
			<Col style={{ paddingLeft: '0', paddingRight: '0' }}>
				{props.expenses.length > 0 ? 
					<SwipeableList>{firstExpenses}</SwipeableList> 
					:
					<> 
					<img alt={'Icon of an empty plan'} src={ExpensesEmpty} width='85%'/>
					<p style={{ fontSize: '14px', marginBottom: '5px' }}>There are no expenses yet</p>
					<Link to='/add'>
						<button style={{ fontSize: '14px' }} className='primary_button btn btn-primary'>
							Add an expense
						</button>
					</Link>
					</>}
			</Col>
		</div>
	);
}

function ExpenseItem(props) {
	const [redirect, setRedirect] = useState(false);

	return (
		<>
		{redirect && <Redirect to={{ pathname: '/expenses/edit', state: { expense_id: props.expense.expense_id } }}/>}
		<SwipeableListItem
			swipeLeft={{
				content: (
					<div className={`basic-swipeable-list__item-content-left`} style={{ textAlign: 'left' }}>
						<span>{'Delete'}</span>
					</div>
				),
				action: () => props.deleteExpense(props.expense.expense_id),
			}}>
			<Row className='basic-swipeable-list__item' style={{ marginLeft: '0px', marginRight: '0px',}}
				onClick={() => setRedirect(true)}>				
				<Col xs={3} style={{ textAlign: 'left', fontWeight: 'bold', paddingRight: '0px' }}>
					{'€ ' + parseFloat(props.expense.price).toFixed(2)}
				</Col>
				<Col xs={4}>{moment(props.expense.date).format('DD/MM/YYYY').toString()}</Col>
				<Col xs={5} style={{ paddingRight: '0', textAlign: 'right' }}>
					{props.expense.category_name && (
						<CategoryChip name={props.expense.category_name} icon={props.expense.category_icon} />
					)}
				</Col>
			</Row>
		</SwipeableListItem>
		</>
	);
}

function PlanGlance(props) {
	const percentage = props.totalBudget?.budget && (props.totalBudget.spent * 100) / props.totalBudget.budget;
	return (
		<div className='page_section' style={{ height: '280px' }}>
			<div className='section_title'>
				<div className='container'>
					<Row>
						<Col xs={8} style={{ paddingLeft: '0' }}>
							Plan Glance
							</Col>
						<Col xs={4} style={{ textAlign: 'right', fontWeight: 'normal', fontSize: '14px', paddingRight: '0' }}>
							<Link to={'/plan'} style={{ position: 'relative', bottom: '-3px', color: 'rgba(74, 74, 74, 1.0)' }}>
								<div>
									{'Show All '}
									<i className='fas fa-chevron-right'> </i>
								</div>
							</Link>
						</Col>
					</Row>
				</div>
			</div>
			{props.totalBudget?.budget ? (
				<div>
					<Row style={{ paddingTop: '8px' }}>
						<Col xs='9'>
							<ProgressBar
								now={percentage}
								label={`${parseInt(percentage)}%`}
								style={{ height: '33pt', marginLeft: '15px' }}
								srOnly={props.percentage < 5 ? true : false}>
								{percentage < 1 ? <h5 style={{ margin: 'auto' }}> 0% </h5> : ''}
							</ProgressBar>
						</Col>
						<Col
							xs='3'
							style={{
								paddingLeft: '0px',
								paddingRight: '15px',
								textAlign: 'center',
								fontSize: '13px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Row>
								<p>
									<span style={{ fontWeight: 'bold' }}>{'€' + parseFloat(props.totalBudget.budget).toFixed(2)}</span>
									<br />
									{'Total Budget'}
								</p>
							</Row>
						</Col>
					</Row>
					<Row style={{ paddingLeft: '15px' }}>
						{percentage < 100 && (
							<div
								style={{
									marginTop: '-10px',
									textAlign: 'left',
									marginLeft: (percentage / 100) * 50 + '%',
									paddingTop: '4px',
									color: 'rgba(12, 73, 170, 0.913)',
									fontSize: '14px',
									fontWeight: 'bold',
								}}>
								{'€ ' + parseFloat(props.totalBudget.spent).toFixed(2)}
							</div>
						)}
					</Row>
					<Row style={{ marginTop: '1rem', fontSize: '14px' }}>
						<Col>
							<p style={{ marginBottom: '3px' }}>
								<span style={{ fontWeight: 'bold'}}>
								{moment(props.totalBudget.end_date).diff(moment(), 'days') + 1} days 
								</span>
								{' left from today'}
							</p>
							<p>
								Your budget will renew on <span style={{ fontWeight: 'bold' }}>{moment(props.totalBudget.end_date).format('DD/MM/YYYY').toString()}</span>
							</p>
						</Col>
					</Row>

					<Col>
						<BudgetFeedback
							start_date={props.totalBudget.start_date}
							end_date={props.totalBudget.end_date}
							budget={props.totalBudget.budget}
							spent={props.totalBudget.spent}
						/>
					</Col>
				</div>
			) : (
				<Row>
					<Col>
						<img alt={'Icon of an empty plan'} src={PlanEmpty} width='85%' />
						<p style={{ fontSize: '14px', marginBottom: '5px' }}>You don't have created your plan yet</p>
						<Link to='/plan/add'>
							<button style={{ fontSize: '14px' }} className='primary_button btn btn-primary'>
								Add a plan
							</button>
						</Link>
					</Col>
				</Row>)
			}
		</div>
	);
}

export default Homepage;
