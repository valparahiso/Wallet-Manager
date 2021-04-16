import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button as ButtonMaterial } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CategoryChip from '../../CategoryChip';
import EmpyState from '../../../images/expenses_emptystate.jpg';

function ExpenseList(props) {
	const deleteExpense = id => {
		props.handleAlert(() => props.deleteExpense(id));
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				marginTop: '20px',
			}}>
			{props.expenses.length > 0 ? (
				<ListGroup as='ul' variant='flush' style={{ borderTop: '1px solid rgba(0,0,0,.125)' }}>
					{props.expenses.map(element => (
						<ListItem
							key={element.expense_id}
							expense={element}
							pageMode={props.pageMode}
							deleteExpense={deleteExpense}
							pageModetoNormal={props.pageModetoNormal}
						/>
					))}
				</ListGroup>
			) : (
				<div className='center-vertically' style={{ marginTop: '20px' }}>
					<img src={EmpyState} width='75%' alt={'Icon of a cart'} style={{ alignSelf: 'center' }} />
					<p style={{ marginTop: '-25px' }}>There are no expenses yet</p>
					<Link to='/add'>
						<button style={{ fontSize: '14px' }} className='primary_button btn btn-primary'>
							Add an expense
						</button>
					</Link>
				</div>
			)}
		</div>
	);
}

//Component that represents the list of the item when props.listStatus=normal
function ListItem(props) {
	return (
		<ListGroup.Item id={props.expense.expense_id} className={'table-row'}>
			<div className='d-flex w-100' style={{ paddingLeft: '15px', paddingRight: '15px' }}>
				<div className='container'>
					<div className='row' style={{ padding: '5px 0 5px 0', textAlign: 'left' }}>
						<div className='col-1 center-vertically'>
							{props.pageMode === 'edit' && (
								<i
									className='fas fa-minus-circle fa-lg'
									style={{ color: 'rgb(255, 59, 48)', margin: '-10px' }}
									onClick={() => props.deleteExpense(props.expense.expense_id)}></i>
							)}
						</div>

						<div className={props.pageMode === 'edit' ? 'col-9 center-vertically' : 'col-12 center-vertically'}>
							<Link
								to={{ pathname: '/expenses/edit', state: { expense_id: props.expense.expense_id } }}
								style={{ color: 'rgba(0, 0, 0, 0.87)', width: '100%' }}>
								<div className='row'>
									<div className={props.pageMode === 'edit' ? 'col-5' : 'col-3'} style={{ padding: 0 }}>
										<span style={{ fontWeight: 'bold', fontSize: '16px' }}>€ {props.expense.price.toFixed(2)}</span>
									</div>
									<div className='col-1' style={{ padding: 0 }}>
										{props.expense.cash_or_card === 0 ? (
											<i className='fas fa-money-bill'></i>
										) : (
											<i className='fas fa-credit-card'></i>
										)}
									</div>
									<div
										className={props.pageMode === 'edit' ? 'col-6' : 'col-4'}
										style={{ padding: 0, textAlign: 'center' }}>
										<span style={{ fontSize: '16px', textAlign: 'center' }}>
											{moment(props.expense.date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
										</span>
									</div>
									{props.expense.category_name && (
										<div className={props.pageMode === 'edit' ? 'col-12 ' : 'col-4 '}>
											<CategoryChip name={props.expense.category_name} icon={props.expense.category_icon} />
										</div>
									)}
									{props.expense?.description && (
										<div className='col-12'>
											<p className='mb-1' style={{ color: 'grey', fontSize: '14px', textAlign: 'left' }}>
												{props.expense.description}
											</p>
										</div>
									)}
								</div>
							</Link>
						</div>

						<div className='col-1 center-vertically'>
							{props.pageMode === 'edit' && (
								<ButtonMaterial onClick={props.pageModetoNormal} style={{ paddingRight: '15px' }}>
									<Link
										to={{ pathname: '/expenses/edit', state: { expense_id: props.expense.expense_id } }}
										style={{ color: 'rgba(0, 0, 0, 0.87)', width: '100%' }}>
										<i className='fas fa-pen-square fa-lg'></i>
									</Link>
								</ButtonMaterial>
							)}
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
}

export default ExpenseList;
