import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { ListGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import '../../../App.css';
import { Avatar } from '@material-ui/core';
import { VectorIcon } from '../../../images/CategoryIcon';
import RadioButton from '../../utils/RadioButton';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'fixed',
		backgroundColor: 'rgba(12, 70, 157)',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

export default function EditFilter(props) {
	const classes = useStyles();

	const [CategoryChecked, setCategoryChecked] = useState([]);

	const [price, setPrice] = useState({ min: null, max: null });

	const [paymentMethod, setPaymentMethod] = useState('');

	const [expensePeriod, setExpensePeriod] = useState({});

	const saveFilter = e => {
		let categories = CategoryChecked.filter(el => el.check).map(el => ({ name: el.name, icon: el.icon }));

		props.updateFilter(categories, price, paymentMethod);
		props.handleCustomPeriod(e, expensePeriod.initialDate, expensePeriod.finalDate);
		props.handleClose();
	};

	useEffect(() => {
		const array = [
			...props.categories.map(cat => {
				let isCheck = false;
				if (props.filterList.categories.length > 0) {
					isCheck = props.filterList.categories.some(filterCat => filterCat.name === cat.name);
				}
				return { name: cat.name, icon: cat.icon, check: isCheck };
			}),
		];

		setCategoryChecked(array);

		setPrice(props.filterList.price);

		setPaymentMethod(props.filterList.paymentMethod);

		setExpensePeriod({ ...props.customPeriod });
	}, [props.categories, props.filterList, props.dialogOpen, props.customPeriod]);

	const updateCheckbox = (name, checked) => {
		//I update the state by putting true on the clicked checkbox
		const newData = [...CategoryChecked];
		const newArray = newData.map(elem => {
			if (elem.name === name) elem.check = checked;
			return elem;
		});
		setCategoryChecked(newArray);
	};

	const updatePrice = (name, value) => {
		let min = price?.min;
		let max = price?.max;
		if (name === 'min') {
			min = value;
		} else if (name === 'max') {
			max = value;
		}

		setPrice({ min: min, max: max });
	};

	const updatePaymentMethod = value => {
		setPaymentMethod(value);
	};

	const clearFilter = () => {
		const array = [
			...props.categories.map(cat => {
				return { name: cat.name, icon: cat.icon, check: false };
			}),
		];

		setCategoryChecked(array);

		setPrice({ max: '', min: '' });
		setPaymentMethod('All');

		setExpensePeriod({ initialDate: '', finalDate: '' });
	};

	const handleInitialDate = e => {
		if (moment(e.target.value).isAfter(expensePeriod.finalDate)) {
			setExpensePeriod({ initialDate: expensePeriod.finalDate, finalDate: e.target.value });
		} else {
			setExpensePeriod({ ...expensePeriod, initialDate: e.target.value });
		}
	};

	const handleFinalDate = e => {
		if (moment(e.target.value).isBefore(expensePeriod.initialDate)) {
			setExpensePeriod({ initialDate: e.target.value, finalDate: expensePeriod.initialDate });
		} else {
			setExpensePeriod({ ...expensePeriod, finalDate: e.target.value });
		}
	};

	return (
		<Dialog fullScreen open={props.dialogOpen} onClose={props.handleClose} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton edge='start' color='inherit' onClick={props.handleClose} aria-label='close'>
						<CloseIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						Edit Filter
					</Typography>
					<Button
						autoFocus
						color='inherit'
						onClick={clearFilter}
						style={{
							outline: '2px dotted transparent',
							color: 'rgb(251, 100, 100)',

							textTransform: 'none',

							fontSize: '13pt',
						}}>
						Clear
					</Button>
				</Toolbar>
			</AppBar>
			<div className='page' style={{ paddingLeft: '0', paddingRight: '0' }}>
				<List>
					<EditDate
						expensePeriod={expensePeriod}
						handleInitialDate={handleInitialDate}
						handleFinalDate={handleFinalDate}
					/>

					<EditPrice price={price} updatePrice={updatePrice} />
					<EditPaymentMethod paymentMethod={paymentMethod} updatePaymentMethod={updatePaymentMethod} />
					<CategoriesList CategoryChecked={CategoryChecked} updateCheckbox={updateCheckbox} />
				</List>
			</div>
			<div className='page_footer'>
				<button variant='contained' color='primary' className='primary_button btn btn-primary' onClick={saveFilter}>
					Save Filter
				</button>
			</div>
		</Dialog>
	);
}

function EditDate(props) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				marginBottom: '30px',
			}}>
			<div className='d-flex '>
				<div className='container'>
					<div className='page_section section-title-div' style={{ marginBottom: 0 }}>
						<h6 className='section-title'>Update Custom Period</h6>
					</div>
					<p style={{ marginBottom: 0 }}>Choose a period to custom the view of expenses</p>
					<div className='row' style={{ padding: '10px' }}>
						<div className='col-6'>
							<span style={{ fontSize: '16px' }}>From</span>{' '}
							<i className='far fa-calendar-alt' style={{ paddingLeft: '8px', lineHeight: '1.2' }} />
						</div>
						<div className='col-6'>
							<span style={{ fontSize: '16px' }}>To</span>{' '}
							<i className='far fa-calendar-alt' style={{ paddingLeft: '8px', lineHeight: '1.2' }} />
						</div>
					</div>
					<div className='row'>
						<div className='col-6'>
							<Form.Control
								type='date'
								value={props.expensePeriod.initialDate}
								onChange={props.handleInitialDate}
								style={{ textAlign: 'center', paddingRight: 0 }}
							/>
						</div>
						<div className='col-6'>
							<Form.Control
								type='date'
								value={props.expensePeriod.finalDate}
								onChange={props.handleFinalDate}
								style={{ textAlign: 'center', paddingRight: 0 }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function EditPrice(props) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
			}}>
			<div className='d-flex '>
				<div className='container'>
					<div className='page_section section-title-div' style={{ marginBottom: 0 }}>
						<h6 className='section-title'>Price</h6>
					</div>
					<div className='row' style={{ padding: '10px' }}>
						<div className='col-6'>
							<span style={{ fontSize: '16px' }}>From </span>
						</div>
						<div className='col-6'>
							<span style={{ fontSize: '16px' }}>To</span>
						</div>
					</div>
					<div className='row'>
						<div className='col-6'>
							<InputGroup>
								<InputGroup.Prepend>
									<InputGroup.Text>€</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control
									name='min'
									value={props.price?.min}
									placeholder='Min'
									type='number'
									maxLength='10'
									onChange={ev => props.updatePrice(ev.target.name, ev.target.value)}
								/>
							</InputGroup>
						</div>
						<div className='col-6'>
							<InputGroup>
								<InputGroup.Prepend>
									<InputGroup.Text>€</InputGroup.Text>
								</InputGroup.Prepend>
								<Form.Control
									name='max'
									value={props.price?.max}
									placeholder='Max'
									type='number'
									maxLength='10'
									onChange={ev => props.updatePrice(ev.target.name, ev.target.value)}
								/>
							</InputGroup>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function EditPaymentMethod(props) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				marginTop: '30px',
			}}>
			<div className='d-flex '>
				<div className='container'>
					<div className='page_section section-title-div'>
						<h6 className='section-title'>Payment Method</h6>
					</div>
					<div className='container' style={{ margin: '15px 0' }}>
						<div className='row' style={{ justifyContent: 'center', margin: 0 }}>
							<div className='col-4 '>
								<div className='radio-box'>
									<RadioButton
										value='Cash'
										icon='fas fa-money-bill'
										checked={props.paymentMethod === 'Cash'}
										onChange={ev => props.updatePaymentMethod(ev.target.value)}
									/>
								</div>
							</div>
							<div className='col-4 '>
								<div className='radio-box'>
									<RadioButton
										value='Card'
										icon='fas fa-credit-card'
										checked={props.paymentMethod === 'Card'}
										onChange={ev => props.updatePaymentMethod(ev.target.value)}
									/>
								</div>
							</div>
							<div className='col-4 '>
								<div className='radio-box'>
									<RadioButton
										value='All'
										icon='fas fa-dollar-sign'
										checked={props.paymentMethod === 'All'}
										onChange={ev => props.updatePaymentMethod(ev.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function CategoriesList(props) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				marginTop: '20px',
			}}>
			<div className='d-flex '>
				<div className='container'>
					<div className='page_section section-title-div' style={{ marginBottom: 0 }}>
						<h6 className='section-title'>Categories</h6>
					</div>

					<ListGroup variant='flush'>
						{props.CategoryChecked.map(element => (
							<CategoryCheckBox
								key={element.name}
								id={element.name}
								checked={element.check}
								updateCheckbox={props.updateCheckbox}
								value={element.name}
								icon={element.icon}
							/>
						))}
					</ListGroup>
				</div>
			</div>
		</div>
	);
}

/**
 * This function represent a checkbox. It has the caracteristic that only one checkbox in the group
 * must be selected. So they refer all to 'category' inside the 'FormData' state.
 * @param {*} props:
 * 		- props.id: univoc id that represent the checkbox
 * 		- props.value: is the value of the checkbox (ex. 'A')
 * 		- props.categorySel: represent the category that is now selected
 * 		- props.updateField: is the function that update the state of a category
 */
function CategoryCheckBox(props) {
	const [icon, setIcon] = useState({ svg: '', name: '', color: '' });

	useEffect(() => {
		//Search the icon and the color associated with that category name.
		const iconObj = VectorIcon.filter(element => element.name === props.icon);

		if (iconObj.length !== 0) {
			setIcon({ svg: iconObj[0].svg, name: iconObj[0].name, color: iconObj[0].color });
		} else {
			//If we don't have an icon we want to display the first letter of category name
			setIcon({ svg: '', name: props.value.charAt(0), color: props.icon });
		}
	}, [props.icon, props.value]);
	return (
		<ListGroup.Item style={{ height: '50pt', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
			<div className='custom-control custom-checkbox text-left'>
				<input
					className='custom-control-input normal'
					type='checkbox'
					id={props.id}
					name={props.value}
					value={props.value}
					checked={props.checked}
					onChange={ev => props.updateCheckbox(ev.target.name, ev.target.checked)}
				/>
				<label className='custom-control-label' htmlFor={props.id} style={{ display: 'flex' }}>
					<Avatar
						style={
							props.checked
								? { backgroundColor: icon.color, width: '30px', height: '30px', marginRight: '10px' }
								: { backgroundColor: '#bdbdbd', width: '30px', height: '30px', marginRight: '10px' }
						}>
						{icon.svg === '' ? (
							props.value.toUpperCase().charAt(0)
						) : (
							<svg className='svg-icon' style={{ margin: '7px' }}>
								{icon.svg}
							</svg>
						)}
					</Avatar>
					<span style={{ fontSize: '16px' }} className='center-vertically'>
						{props.value}
					</span>
				</label>
			</div>
		</ListGroup.Item>
	);
}
