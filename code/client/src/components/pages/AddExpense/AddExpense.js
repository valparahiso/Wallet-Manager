// eslint-disable-next-line
// Essentials
import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Row, Col, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { SegmentedControl } from 'segmented-control-react';
import { Avatar } from '@material-ui/core';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import moment from 'moment';

// Components
import AddNewCategory from '../../subpages/AddNewCategory';
import { VectorIcon as list } from '../../../images/CategoryIcon';
import { SelectFeedbackRedirect } from '../../utils/Feedbacks';
import { MicrophoneSection, MicError } from './Microphone';

const segments = [{ name: 'Cash' }, { name: 'Card' }];

class AddExpense extends React.Component {
	constructor() {
		super();
		this.state = {
			id: '',
			amount: '',
			amount_formatted: '',
			segments: segments,
			selected: 0,
			date: moment().format('YYYY-MM-DD'),
			category: '',
			description: '',
			loading: true,
			openCategoryModal: false,
			feedback: false,
			micError: false,
			micErrorSuggestion: '',
		};
		this.onChangeAmount = this.onChangeAmount.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeDate = this.onChangeDate.bind(this);
		this.onChangeCategory = this.onChangeCategory.bind(this);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.AddExpense = this.AddExpense.bind(this);
		this.handleOpenCategoryModal = this.handleOpenCategoryModal.bind(this);
		this.Menu = this.Menu.bind(this);
		this.onExpenseAdded = this.onExpenseAdded.bind(this);
		this.onDeleteExpense = this.onDeleteExpense.bind(this);
	}

	handleChange(index) {
		this.setState({ selected: index });
	}

	onDeleteExpense() {
		this.props.deleteExpense(this.state.id);
	}

	onChangeAmount(e) {
		const re = /(^[0-9]+\.?[0-9]{0,2}$)/;
		if (e.target.value === '' || (re.test(e.target.value) && parseFloat(e.target.value.replace('.', ',')) <= 99999)) {
			console.log(e.target.value);
			this.setState({
				amount: e.target.value.replace('.', ','),
				amount_formatted: e.target.value,
			});
		}
	}

	onChangeDate(e) {
		this.setState({ date: e.target.value });
	}

	onChangeDescription(e) {
		this.setState({ description: e.target.value });
	}

	onChangeCategory(key) {
		if (key === this.state.category) {
			this.setState({ category: '' });
			return;
		}
		this.setState({ category: key });
	}

	onExpenseAdded() {
		this.setState({
			id: '',
			amount: '',
			amount_formatted: '',
			segments: segments,
			selected: 0,
			date: moment().format('YYYY-MM-DD'),
			category: '',
			description: '',
			feedback: false,
		});

		this.form.reset();
		this.seg.children[0].children[0].children[0].click();
	}

	AddExpense(e) {
		e.preventDefault();
		this.setState({
			feedback: true,
		});

		if (this.props.mode !== 'edit') {
			this.props.addExpense(
				moment(this.state.date).format('YYYYMMDD'),
				parseFloat(this.state.amount.replace('.', '').replace(',', '.')),
				this.state.category !== '' ? this.state.category : -1,
				this.state.description,
				this.state.selected
			);
			this.onExpenseAdded();
		} else {
			this.props.editExpense(
				this.state.id,
				moment(this.state.date).format('YYYYMMDD'),
				parseFloat(this.state.amount.replace('.', '').replace(',', '.')),
				this.state.category !== '' ? this.state.category : -1,
				this.state.description,
				this.state.selected
			);
			this.props.history.push('/expenses');
		}
	}

	//This open and close the modal 'Add a new Category'
	handleOpenCategoryModal() {
		this.setState({ openCategoryModal: !this.state.openCategoryModal });
	}

	updadeFieldByMic = (field, value) => {
		// console.log(value);
		try {
			const regex = /\b(?:amount|type|date|category|description|clear)\b/gi;
			let commands = value.match(regex);
			let values = value.split(regex);
			// console.log('commands')
			if (!commands || commands.length === 0)
				throw new MicError(
					'Wrong commands! Just say the name of the field with the, value, you want. Like amount 50 €'
				);
			// commands.forEach(el => console.log(el));
			// console.log('values')
			if (!values || values.length === 0)
				throw new MicError('Wrong values! Just say the name of the field with the, value, you want. Like amount 50 €');
			// values.forEach(el => console.log(el));

			// if something before the first command just throw it away
			if (commands.length < values.length) values.splice(0, 1);
			let suggestion = '';
			commands.forEach((command, i) => {
				if (command === 'amount') {
					let amount = values[i].trim();
					amount = amount.replace('€', '').replace(',', '.');
					let real_amount = parseFloat(amount);
					if (!real_amount)
						throw new MicError('Wrong amount! Try with the command: amount, followed by: the amount of the expense');

					this.setState({ amount: real_amount.toString(), amount_formatted: real_amount.toString() });
				} else if (command === 'type') {
					let type = values[i].trim();
					if (type !== 'cash' && type !== 'card')
						throw new MicError('Wrong type! Try with the command: type, followed by: the type of the expense');
					let segment = type === 'cash' ? 0 : 1;
					this.setState({ selected: segment });
					this.seg.children[0].children[0].children[segment].click();
				} else if (command === 'date') {
					let date = moment(values[i].trim());
					if (!date.isValid())
						throw new MicError('Wrong date! Try with the command: date, followed by: the date of the expense');
					date = date.format('YYYY-MM-DD').toString();
					this.setState({ date: date });
				} else if (command === 'category') {
					let category = values[i].trim();
					let category_selected = this.props.categories.find(el => el.name.toLowerCase() === category.toLowerCase());

					if (!category_selected)
						throw new MicError(
							'Wrong category! Try with the command: category, followed by: the category of the expense'
						);
					this.setState({ category: category_selected.category_id.toString() });
				} else if (command === 'description') {
					this.setState({ description: values[i].trim() });
				} else if (command === 'clear') {
					// function to clear the state
					// console.log('clear page');
					this.setState({
						id: '',
						amount: '',
						amount_formatted: '',
						segments: segments,
						selected: 0,
						date: moment().format('YYYY-MM-DD'),
						category: '',
						description: '',
						feedback: false,
					});
				}
				let audio = new Audio('/sounds/mic_sound.mp3');
				audio.play();
			});
		} catch (e) {
			// catch in order to let the user know that the command value was wrong
			// voice saying error
			if (e instanceof MicError) {
				let error_voice = new SpeechSynthesisUtterance('error: ' + e.message);
				speechSynthesis.speak(error_voice);
				this.setState({ micErrorSuggestion: e.message });
			}
			console.log('error: ' + e.message);
			this.setState({ micError: true });
		}
	};

	handleMicError = value => {
		this.setState({ micError: value });
	};

	Menu(list, selected) {
		return this.props.categories.map(category => {
			let color = '';
			if (!category.icon) {
				if (category.category_id.toString() === selected.toString()) color = '#62c0db';
				return (
					<div style={{ marginRight: '25px' }} text={category.name} key={category.category_id} selected={selected}>
						<div>
							<Avatar
								alt={category.name}
								style={{ backgroundColor: color, width: '40px', height: '40px', margin: '0 auto' }}>
								{category.name.charAt(0).toUpperCase()}
							</Avatar>
						</div>
						<p style={{ marginBottom: 0, textAlign: 'center', fontSize: '14px' }}>
							{category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
						</p>
					</div>
				);
			} else {
				/*return list.forEach(el => { 
					if (category.icon === el.name) {
						if (category.category_id.toString() === selected.toString()) {
							if (el.color) color = el.color
							else color = 'green'
						}
						return (
							<div style={{ marginRight: "25px" }} text={category.name} key={category.category_id} selected={selected}>
								<div>
									<Avatar alt={category.name} style={{ backgroundColor: color, width: '40px', height: '40px', margin: "0 auto" }}>
										<svg>{el.svg}</svg>
									</Avatar>
									<p style={{ marginBottom: 0, textAlign: 'center' }}>{category.name.toUpperCase()}</p>
								</div>
							</div>
						);
					}
				});*/

				for (let i = 0; i < list.length; i++) {
					if (category.icon === list[i].name) {
						if (category.category_id.toString() === selected.toString()) {
							if (list[i].color) color = list[i].color;
							else color = 'green';
						}
						return (
							<div style={{ marginRight: '25px' }} text={category.name} key={category.category_id} selected={selected}>
								<div>
									<Avatar
										alt={category.name}
										style={{ backgroundColor: color, width: '40px', height: '40px', margin: '0 auto' }}>
										<svg className='svg-icon'>{list[i].svg}</svg>
									</Avatar>
									<p style={{ marginBottom: 0, textAlign: 'center', fontSize: '14px' }}>
										{category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
									</p>
								</div>
							</div>
						);
					}
				}

				if (category.category_id.toString() === selected.toString()) color = category.icon;
				return (
					<div style={{ marginRight: '25px' }} text={category.name} key={category.category_id} selected={selected}>
						<div>
							<Avatar
								alt={category.name}
								style={{ backgroundColor: color, width: '40px', height: '40px', margin: '0 auto' }}>
								{category.name.charAt(0).toUpperCase()}
							</Avatar>
						</div>
						<p style={{ marginBottom: 0, textAlign: 'center', fontSize: '14px' }}>
							{category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase()}
						</p>
					</div>
				);
			}
		});
	}

	componentDidUpdate() {
		if (this.props.mode === 'add' && this.props.deleteFeedback) {
			this.onExpenseAdded();
			this.props.setDeleteFeedback();
		}
	}

	componentDidMount() {
		if (this.props.mode === 'edit') {
			let expense;
			this.props.expenses.forEach(element => {
				if (element.expense_id === this.props.location.state.expense_id) {
					expense = element;
				}
			});
			let key = '';

			if (expense.category_id) key = expense.category_id.toString();

			let amount = expense.price.toFixed(2).toString()//.replace('.', ',');

			/*if (amount.split('').length === 1) {
				this.setState({ amount: amount, amount_formatted: amount.replace(/(.)(?=(.{3})+$)/g, '$1.') });
			} else {
				this.setState({
					amount: amount,
					amount_formatted: amount.split(',')[0].replace(/(.)(?=(.{3})+$)/g, '$1.') + ',' + amount.split(',')[1],
				});
			}*/

			this.setState({
				id: expense.expense_id,
				selected: expense.cash_or_card,
				amount: amount.replace('.', ','),
				amount_formatted: amount,
				date: moment(expense.date, 'YYYYMMDD').format('YYYY-MM-DD'),
				category: key,
				description: expense.description,
			});
		}
		this.setState({
			loading: false,
		});
	}

	render() {
		if (this.state.loading)
			return (
				<Spinner animation='border' role='status'>
					<span className='sr-only'>Loading...</span>
				</Spinner>
			);
		return (
			<div className='page'>
				<Form onSubmit={this.AddExpense} ref={form => (this.form = form)}>
					<div className='page_section'>
						<h6 className='section_title'>Amount*</h6>

						<Form.Group>
							<Row style={{ paddingLeft: '15px' }}>
								<Col xs={6}>
									<InputGroup>
										<InputGroup.Prepend>
											<InputGroup.Text>€</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control
											value={this.state.amount_formatted}
											onChange={this.onChangeAmount}
											inputMode='decimal'
											maxLength='10'
											required
										/>
									</InputGroup>
								</Col>
								<Col xs={6} ref={seg => (this.seg = seg)}>
									<SegmentedControl
										variant='my_segment'
										segments={this.state.segments}
										selected={this.state.selected}
										onChangeSegment={this.handleChange}
										ref={seg => (this.seg = seg)}
									/>
								</Col>
							</Row>
						</Form.Group>
					</div>
					<div className='page_section'>
						<h6 className='section_title'>Date*</h6>
						<Form.Group>
							<Row style={{ paddingLeft: '15px' }}>
								<Col xs={6}>
									<Form.Control type='date' value={this.state.date} onChange={this.onChangeDate} required />
								</Col>
								<Col>
									<i
										className='far fa-calendar-alt fa-2x'
										style={{ float: 'left', paddingLeft: '8px', color: 'rgba(12, 70, 157, 1)', lineHeight: '1.2' }}></i>
								</Col>
							</Row>
						</Form.Group>
					</div>

					<div className='page_section'>
						<div className='container'>
							<Row className='section-title-div' style={{ flexDirection: 'row', marginBottom: '2px' }}>
								<Col style={{ padding: '0px', border: 'none' }} xs={4} className='section_title'>
									Category
								</Col>
								<Col xs={8} style={{ textAlign: 'right', fontWeight: 'normal', fontSize: '14px', paddingRight: '0' }}>
									<div
										style={{ position: 'relative', bottom: '-3px', color: 'rgba(74, 74, 74, 1.0)' }}
										onClick={this.handleOpenCategoryModal}>
										<i className='fas fa-plus mr-1' />
										Add a new category
									</div>
								</Col>
							</Row>
						</div>
						{!this.props.categories || this.props.categories.length === 0 ? (
							<div style={{ marginTop: '10px' }}>
								<p> There are no categories yet</p>
							</div>
						) : (
							<div>
								<p style={{ fontSize: '14px', textAlign: 'left' }}>Select a category or create a new one</p>
								<Col>
									<ScrollMenu
										data={this.Menu(list, this.state.category)}
										arrowLeft={<p style={{ fontSize: '225%', paddingBottom: '10px', marginRight: '15px' }}>{' < '}</p>}
										arrowRight={<p style={{ fontSize: '225%', paddingBottom: '10px', marginLeft: '15px' }}>{' > '}</p>}
										selected={this.state.category}
										onSelect={this.onChangeCategory}
										alignCenter={false}
										hideSingleArrow={true}
										hideArrows={true}
										scrollToSelected={true}
									/>
								</Col>
							</div>
						)}
					</div>

					<div className='page_section'>
						<h6 className='section_title'>Description</h6>
						<Col xs='10'>
							<Form.Control
								type='text'
								value={this.state.description}
								onChange={this.onChangeDescription}
								maxLength='80'
							/>
						</Col>
					</div>

					<div className='page_section' style={{ marginTop: '3rem' }}>
						<MicrophoneSection
							updateFieldByMic={this.updadeFieldByMic}
							micError={this.state.micError}
							micErrorSuggestion={this.state.micErrorSuggestion}
							handleMicError={this.handleMicError}
							reset={this.state.feedback}
						/>
					</div>

					<Button className='primary_button' style={{ marginTop: '15px', marginBottom: '15px' }} type='submit'>
						{this.props.mode === 'edit' ? 'Save' : 'Add'}
					</Button>
				</Form>

				<AddNewCategory
					addCategory={this.props.addCategory}
					open={this.state.openCategoryModal}
					handleOpen={this.handleOpenCategoryModal}
					handleClose={this.handleOpenCategoryModal}
					categoryToDisplay=''
					categories={this.props.categories}
				/>

				<SelectFeedbackRedirect
					route={'/expenses'}
					type={'danger'}
					show={this.props.deleteFeedback && this.props.mode === 'edit'}
					onClose={this.props.setDeleteFeedback}
					title={'Do you want to delete the expense?'}
					body={"Pressing 'Delete' you will lose this expense"}
					undo={'Cancel'}
					setFeedback={this.props.setDeleteFeedback}
					action={'Delete'}
					handleAction={this.onDeleteExpense}
				/>
			</div>
		);
	}
}

export default withRouter(AddExpense);
