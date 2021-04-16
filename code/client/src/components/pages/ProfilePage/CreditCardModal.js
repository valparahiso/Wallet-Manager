import React, { useState, useEffect } from 'react';
import { formatMs, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import FormHelperText from '@material-ui/core/FormHelperText';

import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import { TextField } from '@material-ui/core';
import SingleCreditCard from '../../subpages/SingleCreditCard';

import moment from 'moment';
import RadioButton from '../../utils/RadioButton';

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

export default function CreditCardModal(props) {
	const classes = useStyles();

	//This state represents the information the user provides in the credit card form
	const [FormData, setFormData] = useState({
		id: '',
		number: '',
		expiry: '',
		CVV: '',
		name: '',
		color: '',
		checkboxAll: false,
		checkboxOnly: false,
	});

	const [isRadioVisible, setIsRadioVisible] = useState(false);

	//These are the state for error validation
	const [errorCardNumber, setErrorCardNumber] = useState('');
	const [errorCVV, setErrorCVV] = useState('');
	const [errorName, setErrorName] = useState('');
	const [errorExpiry, setErrorExpiry] = useState('');
	const [errorAllExpenses, setErrorAllExpenses] = useState('');

	useEffect(() => {
		setErrorName('');
		setErrorExpiry('');
		setErrorCVV('');
		setErrorCardNumber('');
		setErrorAllExpenses('');

		//If we open the modal passing props.card it means that we want to edit a credit card
		if (props.card?.credit_card_id)
			setFormData({
				id: props.card.credit_card_id,
				expiry: props.card.expire_date,
				number: props.card.number,
				name: props.card.owner_name,
				CVV: '',
				index: props.card.credit_card_id,
				color: props.card.color,
				checkboxAll: false,
				checkboxOnly: false,
			});
		//Instead we want to add a new one
		else if (props.openCreditModal) {
			//We want to choose the color
			let randomNumber = Math.floor(Math.random() * styleArr.length);
			let color = styleArr[randomNumber];
			setFormData({
				id: '',
				number: '',
				expiry: '',
				CVV: '',
				name: '',
				color: color,
				checkboxAll: false,
				checkboxOnly: false,
			});
			setIsRadioVisible(true);
		}
	}, [props.openCreditModal, props.card]);

	const updateNumericField = (name, value) => {
		if (name === 'CVV') setErrorCVV('');
		if (name === 'number') setErrorCardNumber('');

		//If the digits of CVV are greater then 3 or the digits of NUMBER are greater then 16
		//we don't update the state because this is the field max length.
		if (name === 'CVV' && value.toString().length > 3) return;
		if (name === 'number' && value.toString().length > 16) return;

		//The state is updated only if they new value is numeric 0-9
		const re = /^[0-9\b]+$/;

		if (value === '' || re.test(value)) setFormData({ ...FormData, [name]: value });
	};

	const updateField = (name, value) => {
		setErrorName('');
		setErrorExpiry('');

		if (value.length > 30) return;

		if (name === 'expiry' && moment().isAfter(moment(value, 'YYYY-MM'), 'month'))
			setErrorExpiry('Expire date must be greater than today');

		if (name === 'name') value = value.toUpperCase();

		setFormData({ ...FormData, [name]: value });
	};

	const Prova = event => {
		const regex = /^[0-9\b]+$/;
		if (event.which === 8) {
			//canc and others
			return;
		}

		if (event.which === 229) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (!regex.test(event.key)) {
			event.preventDefault();
		}
	};

	const validateForm = e => {
		e.preventDefault();
		let error = false;

		if (FormData.number.length === 0) {
			setErrorCardNumber("Card Number can't be empty");
			error = true;
		}
		if (FormData.number.length !== 16 && FormData.number.length > 0) {
			setErrorCardNumber('Card Number must be 16 digits');
			error = true;
		}

		if (FormData.CVV.length === 0) {
			setErrorCVV("CVV can't be empty");
			error = true;
		}
		if (FormData.CVV.length !== 3 && FormData.CVV.length > 0) {
			setErrorCVV('CVV must be 3 digits');
			error = true;
		}

		if (FormData.expiry.length === 0) {
			setErrorExpiry("Expiry can't be empty");
			error = true;
		}
		if (moment().isAfter(moment(FormData.expiry, 'YYYY-MM'), 'month')) {
			setErrorExpiry('Card is expired');
			error = true;
		}

		if (!moment(FormData.expiry, 'YYYY-MM', true).isValid()) {
			setErrorExpiry('Please insert a valid date');
			error = true;
		}

		if (FormData.name.length === 0) {
			setErrorName("Card Holder's name can't be empty");
			error = true;
		}

		if (isRadioVisible) {
			if (!(FormData.checkboxAll ^ FormData.checkboxOnly)) {
				setErrorAllExpenses('Choose an option please');
				error = true;
			}
		}

		if (!error) props.saveModal(e, FormData);
	};

	const confirmDelete = e => {
		props.handleConfirmation(
			'danger',
			'Delete this credit card?',
			'Are you sure to delete this credit card? The expenses made with this card will be no longer imported automatically.',
			'Delete',
			() => {
				props.deleteCreditCard(FormData.id);
				props.handleOpenCreditModal(e, undefined, FormData.id);
			}
		);
	};

	return (
		<div>
			<Dialog
				fullScreen
				open={props.openCreditModal}
				onClose={props.handleOpenCreditModal}
				TransitionComponent={Transition}>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton edge='start' color='inherit' onClick={e => props.handleOpenCreditModal(e)} aria-label='close'>
							<CloseIcon />
						</IconButton>
						<Typography variant='h6' className={classes.title}>
							{props.card?.credit_card_id ? 'Edit a Credit Card' : 'Add a Credit Card'}
						</Typography>
						{props.card?.credit_card_id && (
							<Button
								autoFocus
								color='inherit'
								onClick={e => confirmDelete(e)}
								style={{
									outline: '2px dotted transparent',
									color: 'rgb(251, 100, 100)',
									textTransform: 'none',
									//fontWeight: 'bold',
									fontSize: '13pt',
								}}>
								Delete
							</Button>
						)}
					</Toolbar>
				</AppBar>
				<List>
					<div style={{ justifyContent: 'center', display: 'flex', marginTop: '60px' }}>
						<SingleCreditCard
							card={{
								credit_card_id: FormData.id,
								number: FormData.number,
								owner_name: FormData.name,
								expire_date: FormData.expiry,
								color: FormData.color,
							}}
						/>
					</div>
					<form
						className='form page'
						onSubmit={validateForm}
						style={{ marginTop: '20pt', marginBottom: '50pt', paddingBottom: '0px' }}>
						<div className={'form-group'} style={{ marginBottom: '2em' }}>
							<label htmlFor='CardNumber'>Card Number*</label>
							<TextField
								id='CardNumber'
								className={'form-control input-label'}
								inputMode='decimal'
								type='number'
								required={true}
								name='number'
								autoFocus={true}
								variant='outlined'
								placeholder='0000 0000 0000 0000'
								value={FormData.number}
								error={errorCardNumber !== ''}
								helperText={errorCardNumber}
								onChange={ev => updateNumericField(ev.target.name, ev.target.value)}
								onKeyDown={ev => Prova(ev)}
							/>
						</div>
						<div className={'form-group '} style={{ marginBottom: '2em' }}>
							<label htmlFor='cardHolder'>Owner's name*</label>
							<TextField
								id='cardHolder'
								className={'form-control input-label'}
								variant='outlined'
								type='text'
								required={true}
								name='name'
								placeholder='John Doe'
								value={FormData.name}
								error={errorName !== ''}
								helperText={errorName}
								onChange={ev => updateField(ev.target.name, ev.target.value)}
							/>
						</div>
						<div className={'form-group '} style={{ marginBottom: '2em' }}>
							<label htmlFor='validUpTo'>Valid up to*</label>
							<TextField
								id='validUpTo'
								className={'form-control input-label'}
								variant='outlined'
								type='month'
								required={true}
								name='expiry'
								placeholder='2021-03'
								value={FormData.expiry}
								error={errorExpiry !== ''}
								helperText={errorExpiry}
								onChange={ev => updateField(ev.target.name, ev.target.value)}
							/>
						</div>
						<div className={'form-group '} style={{ marginBottom: '2em' }}>
							<label htmlFor='CVV'>CVV*</label>
							<TextField
								id='CVV'
								className={'form-control input-label'}
								variant='outlined'
								inputMode='decimal'
								type='number'
								required={true}
								name='CVV'
								placeholder='123'
								value={FormData.CVV}
								error={errorCVV !== ''}
								helperText={errorCVV}
								onChange={ev => updateNumericField(ev.target.name, ev.target.value)}
								onKeyDown={ev => Prova(ev)}
							/>
							<p style={{ fontSize: '10pt', marginTop: '18px' }}>For security reason we don't memorize your CVV.</p>
						</div>

						{isRadioVisible && (
							<div className={'form-group '} style={{ marginBottom: '2em' }}>
								<label htmlFor='import'>Which expenses do you want to import?*</label>
								<div style={{ border: errorAllExpenses ? '1px solid red' : '', borderRadius: '5px' }}>
									<div style={{ marginLeft: '1em' }}>
										<input
											id={'First'}
											name={'checkboxAll'}
											value={FormData.checkboxAll}
											checked={FormData.checkboxAll}
											onClick={ev => {
												setErrorAllExpenses('');
												setFormData(OldState => ({
													...OldState,
													checkboxAll: !OldState.checkboxAll,
													checkboxOnly: false,
												}));
											}}
											onChange={ev => {
												setFormData({
													...FormData,
													checkboxAll: ev.target.checked,
													checkboxOnly: false,
												});
											}}
											type='radio'
											style={{
												marginTop: '2px',
												position: 'absolute',
											}}
										/>
										<label className='radio-label' htmlFor={'First'} style={{ fontSize: '14px', marginLeft: '30px' }}>
											All expenses (past and future ones)
										</label>
									</div>
									<div style={{ marginLeft: '1em' }}>
										<input
											id={'Second'}
											name={props.value}
											value={FormData.checkboxOnly}
											checked={FormData.checkboxOnly}
											onClick={ev => {
												setErrorAllExpenses('');
												setFormData(OldState => ({
													...OldState,
													checkboxOnly: !OldState.checkboxOnly,
													checkboxAll: false,
												}));
											}}
											onChange={ev => {
												setFormData({
													...FormData,
													checkboxOnly: ev.target.checked,
													checkboxAll: false,
												});
											}}
											type='radio'
											style={{
												marginTop: '2px',
												position: 'absolute',
											}}
										/>
										<label className='radio-label' htmlFor={'Second'} style={{ fontSize: '14px', marginLeft: '30px' }}>
											Only the future expenses
										</label>
									</div>
								</div>
								<FormHelperText style={{ marginLeft: '14px' }} error={errorAllExpenses !== ''}>
									{errorAllExpenses}
								</FormHelperText>
							</div>
						)}

						<div className='page_footer'>
							<button
								variant='contained'
								color='primary'
								className='primary_button btn btn-primary'
								//style={{ textTransform: 'none', fontSize: '16px', padding: '6px 12px' }}
								onClick={e => validateForm(e)}>
								Save Card
							</button>
						</div>
					</form>
				</List>
			</Dialog>
		</div>
	);
}

const styleArr = [
	'linear-gradient(25deg, #0f509e, #1399cd)',
	'linear-gradient(25deg, #FBAB7E, #F7CE68)',
	'linear-gradient(25deg, #3bb78f, #0bab64)',
	'linear-gradient(25deg, #a762d6, #6094ea)',
];
