import { useEffect, useState } from 'react';
import moment from 'moment';
import ShowPieChart from './ShowPieChart';
import { SelectFeedbackRedirect } from '../../utils/Feedbacks';
import { Button as ButtonMaterial } from '@material-ui/core';
import ExpenseList from './ExpenseList';
import EditFilter from './EditFilter';
import FilterList from './FilterList';

const YourExpenses = props => {
	//state that control the view (moth, all, week, year)
	const [expensesPeriod, setExpensesPeriod] = useState({ period: 'all', datePeriod: moment() });

	//State to open feedback when I want to delete an expense. I pass to it action and open=true/false
	const [alertMessage, setalertMessage] = useState({ handleAction: '', open: false });

	// It control date from and to for custom period
	const [customPeriod, setCustomPeriod] = useState({ initialDate: '', finalDate: '' });

	const [dialogOpen, setdialogOpen] = useState({ open: false, date: false });

	const [filterList, setFilterList] = useState({
		categories: {},
		price: { min: '', max: '' },
		paymentMethod: 'All',
	});

	const [expensesToDisplay, setExpensesToDisplay] = useState([]);

	const [segmentedControl, setSegmentedControl] = useState(0);

	useEffect(() => {
		let filterExpenses = props.expenses;

		// display expenses for Expenses Period
		if (expensesPeriod.period !== 'all') {
			filterExpenses = filterExpenses.filter(
				el =>
					moment(el.date).isSameOrAfter(expensesPeriod.datePeriod.clone().startOf(expensesPeriod.period)) &&
					moment(el.date).isSameOrBefore(expensesPeriod.datePeriod.clone().endOf(expensesPeriod.period))
			);
		} else if (customPeriod.initialDate !== '' && customPeriod.finalDate !== '') {
			filterExpenses = filterExpenses.filter(
				el =>
					moment(el.date).isSameOrAfter(customPeriod.initialDate) &&
					moment(el.date).isSameOrBefore(customPeriod.finalDate)
			);
		} else if (customPeriod.initialDate !== '') {
			filterExpenses = filterExpenses.filter(el => moment(el.date).isSameOrAfter(customPeriod.initialDate));
		} else if (customPeriod.finalDate !== '') {
			filterExpenses = filterExpenses.filter(el => moment(el.date).isSameOrBefore(customPeriod.finalDate));
		}

		// filter by categories
		if (filterList?.categories.length > 0)
			filterExpenses = filterExpenses.filter(el => filterList.categories.some(cat => cat.name === el.category_name));

		// filter by paymentMethod -> cash = 0 ; card = 1
		if (filterList.paymentMethod === 'Cash') filterExpenses = filterExpenses.filter(el => el.cash_or_card === 0);
		else if (filterList.paymentMethod === 'Card') filterExpenses = filterExpenses.filter(el => el.cash_or_card === 1);

		// filter by price
		if (filterList.price?.min !== '') filterExpenses = filterExpenses.filter(el => el.price > filterList.price.min);
		if (filterList.price?.max !== '') filterExpenses = filterExpenses.filter(el => el.price < filterList.price.max);

		setExpensesToDisplay(filterExpenses);

		filterExpenses.length > 0 ? props.handleExpensesEdit(false) : props.handleExpensesEdit(true);
	}, [props.expenses, filterList, expensesPeriod, customPeriod]);

	// function that change the view type
	const handleChange = index => {
		switch (index) {
			case 0:
				setExpensesPeriod({ ...expensesPeriod, period: 'all' });
				setCustomPeriod({ initialDate: '', finalDate: '' });
				setSegmentedControl(0);

				break;
			case 1:
				setExpensesPeriod({ ...expensesPeriod, period: 'week' });
				setCustomPeriod({
					initialDate: expensesPeriod.datePeriod.startOf('week').format('YYYY-MM-DD'),
					finalDate: expensesPeriod.datePeriod.endOf('week').format('YYYY-MM-DD'),
				});
				setSegmentedControl(1);

				break;
			case 2:
				setExpensesPeriod({ ...expensesPeriod, period: 'month' });
				setCustomPeriod({
					initialDate: expensesPeriod.datePeriod.startOf('month').format('YYYY-MM-DD'),
					finalDate: expensesPeriod.datePeriod.endOf('month').format('YYYY-MM-DD'),
				});
				setSegmentedControl(2);

				break;
			case 3:
				setExpensesPeriod({ ...expensesPeriod, period: 'year' });
				setCustomPeriod({
					initialDate: expensesPeriod.datePeriod.startOf('year').format('YYYY-MM-DD'),
					finalDate: expensesPeriod.datePeriod.endOf('year').format('YYYY-MM-DD'),
				});
				setSegmentedControl(3);

				break;

			default:
				break;
		}
	};

	const changePreviousPeriod = () => {
		let changePeriod;
		switch (expensesPeriod.period) {
			case 'week':
				changePeriod = expensesPeriod.datePeriod.clone().subtract(1, 'W');
				setCustomPeriod({
					initialDate: changePeriod.startOf('week').format('YYYY-MM-DD'),
					finalDate: changePeriod.endOf('week').format('YYYY-MM-DD'),
				});
				break;
			case 'month':
				changePeriod = expensesPeriod.datePeriod.clone().subtract(1, 'M');
				setCustomPeriod({
					initialDate: changePeriod.startOf('month').format('YYYY-MM-DD'),
					finalDate: changePeriod.endOf('month').format('YYYY-MM-DD'),
				});
				break;
			case 'year':
				changePeriod = expensesPeriod.datePeriod.clone().subtract(1, 'Y');
				setCustomPeriod({
					initialDate: changePeriod.startOf('year').format('YYYY-MM-DD'),
					finalDate: changePeriod.endOf('year').format('YYYY-MM-DD'),
				});
				break;
			default:
				changePeriod = expensesPeriod.period;
		}
		setExpensesPeriod({ ...expensesPeriod, datePeriod: changePeriod });
	};

	const changeNextPeriod = () => {
		let changePeriod;
		switch (expensesPeriod.period) {
			case 'week':
				changePeriod = expensesPeriod.datePeriod.clone().add(1, 'W');
				setCustomPeriod({
					initialDate: changePeriod.startOf('week').format('YYYY-MM-DD'),
					finalDate: changePeriod.endOf('week').format('YYYY-MM-DD'),
				});
				break;
			case 'month':
				changePeriod = expensesPeriod.datePeriod.clone().add(1, 'M');
				setCustomPeriod({
					initialDate: changePeriod.startOf('month').format('YYYY-MM-DD'),
					finalDate: changePeriod.endOf('month').format('YYYY-MM-DD'),
				});
				break;
			case 'year':
				changePeriod = expensesPeriod.datePeriod.clone().add(1, 'Y');
				setCustomPeriod({
					initialDate: changePeriod.startOf('year').format('YYYY-MM-DD'),
					finalDate: changePeriod.endOf('year').format('YYYY-MM-DD'),
				});
				break;
			default:
				changePeriod = expensesPeriod.period;
		}
		setExpensesPeriod({ ...expensesPeriod, datePeriod: changePeriod });
	};

	const formatPeriod = () => {
		let thisPeriod;

		switch (expensesPeriod.period) {
			case 'week':
				thisPeriod =
					expensesPeriod.datePeriod.startOf('week').format('DD/MM/YY') +
					' - ' +
					expensesPeriod.datePeriod.endOf('week').format('DD/MM/YY');

				break;
			case 'month':
				thisPeriod = expensesPeriod.datePeriod.clone().format('MMMM, YYYY');

				break;
			case 'year':
				thisPeriod = expensesPeriod.datePeriod.format('YYYY');

				break;
			case 'all':
				thisPeriod = formatCustomPeriod();
				break;
			default:
				break;
		}
		return thisPeriod;
	};

	const formatCustomPeriod = () => {
		let thisPeriod = 'All';

		if ((customPeriod.initialDate !== '') & (customPeriod.finalDate !== '')) {
			thisPeriod = `${moment(customPeriod.initialDate, 'YYYY-MM-DD').format('DD/MM/YY')} - ${moment(
				customPeriod.finalDate,
				'YYYY-MM-DD'
			).format('DD/MM/YY')}`;
		} else if (customPeriod.initialDate !== '') {
			thisPeriod = `Before ${moment(customPeriod.initialDate, 'YYYY-MM-DD').format('DD/MM/YY')}`;
		} else if (customPeriod.finalDate !== '') {
			thisPeriod = `After ${moment(customPeriod.finalDate, 'YYYY-MM-DD').format('DD/MM/YY')}`;
		} else {
			thisPeriod = 'All';
		}
		return thisPeriod;
	};

	const handleAlert = (handleAction = '') => {
		setalertMessage(alertMessage => ({ handleAction: handleAction, open: !alertMessage.open }));
	};

	const handleCustomPeriod = (e, initialDate = '', finalDate = '') => {
		if (initialDate !== customPeriod.initialDate || finalDate !== customPeriod.finalDate) {
			handleChange(0);
			setCustomPeriod({ initialDate: initialDate, finalDate: finalDate });
		}
	};

	const handleClickOpen = value => {
		if (value) setdialogOpen({ open: true, date: true });
		else setdialogOpen({ open: true, date: false });
	};

	const handleClose = () => {
		setdialogOpen({ open: false, date: false });
	};

	const updateFilter = (categories, price, paymentMethod) => {
		setFilterList({ categories: categories, price: price, paymentMethod: paymentMethod });
	};

	const deleteFilter = filter => {
		if (filter.type === 'Price')
			setFilterList({
				categories: filterList.categories,
				price: { min: '', max: '' },
				paymentMethod: filterList.paymentMethod,
			});
		if (filter.type === 'PaymentMethod')
			setFilterList({ categories: filterList.categories, price: filterList.price, paymentMethod: 'All' });
		if (filter.type === 'Category') {
			let array = filterList.categories.filter(el => el.name !== filter.name);

			setFilterList({ categories: array, price: filterList.price, paymentMethod: filterList.paymentMethod });
		}

		if (filter.type === 'Period') {
			handleChange(0);
			handleCustomPeriod();
		}
	};

	return (
		<div className='page yourexpenses'>
			<div className='r-segmented-control'>
				<ul>
					<li onClick={() => handleChange(0)} className={segmentedControl === 0 ? 'my_segment selected' : 'my_segment'}>
						Main view
					</li>
					<li onClick={() => handleChange(1)} className={segmentedControl === 1 ? 'my_segment selected' : 'my_segment'}>
						Week view
					</li>
					<li onClick={() => handleChange(2)} className={segmentedControl === 2 ? 'my_segment selected' : 'my_segment'}>
						Month view
					</li>
					<li onClick={() => handleChange(3)} className={segmentedControl === 3 ? 'my_segment selected' : 'my_segment'}>
						Year view
					</li>
				</ul>
			</div>

			{expensesPeriod.period !== 'all' ? (
				<>
					<div
						className='row'
						style={{ justifyContent: 'center', height: '60px', display: 'flex', flexDirection: 'column' }}>
						<div className='col-3' style={{ padding: 0, textAlign: 'right' }}>
							<ButtonMaterial
								onClick={changePreviousPeriod}
								style={{ fontSize: '150%', outline: '0', padding: '0' }}>{`<`}</ButtonMaterial>
						</div>
						<div className='col-6 center-vertically' style={{ padding: 0 }}>
							<h6 style={{ margin: '0', textAlign: 'center' }}>{formatPeriod()}</h6>
						</div>
						<div className='col-3' style={{ padding: 0, textAlign: 'left' }}>
							<ButtonMaterial
								onClick={changeNextPeriod}
								style={{ fontSize: '150%', outline: '0', padding: '0' }}>{`>`}</ButtonMaterial>
						</div>
					</div>

					<ButtonMaterial
						onClick={() => handleClickOpen()}
						className={
							filterList?.categories.length > 0 ||
							filterList?.paymentMethod !== 'All' ||
							filterList?.price?.min !== '' ||
							filterList?.price?.max !== ''
								? 'button-material'
								: 'button-material1'
						}
						style={{
							color: 'rgba(12, 70, 157, 0.898)',
							outline: '2px dotted transparent',
							paddingRight: '20px',
							paddingBottom: '0',
						}}>
						<i className='fas fa-sliders-h'></i>&nbsp; Filter
					</ButtonMaterial>
				</>
			) : (
				<div
					style={{
						height: '60px',
						paddingTop: '15px',
						float:
							filterList?.categories.length > 0 ||
							filterList?.paymentMethod !== 'All' ||
							filterList?.price?.min !== '' ||
							filterList?.price?.max !== '' ||
							(expensesPeriod.period === 'all' && customPeriod.initialDate !== '' && customPeriod.finalDate !== '')
								? 'right'
								: 'none',
					}}>
					<div className='page_section section-title-div' style={{ border: 0, paddingTop: '10px' }}>
						<ButtonMaterial
							onClick={() => handleClickOpen(true)}
							className='button-material'
							style={{
								color: 'rgba(12, 70, 157, 0.898)',
								outline: '2px dotted transparent',
								padding: '10px 0px',
							}}>
							<i className='fas fa-sliders-h'></i>&nbsp; Filter
						</ButtonMaterial>
					</div>
				</div>
			)}

			{(filterList?.categories.length > 0 ||
				filterList?.paymentMethod !== 'All' ||
				filterList?.price?.min !== '' ||
				filterList?.price?.max !== '' ||
				(expensesPeriod.period === 'all' && customPeriod.initialDate !== '' && customPeriod.finalDate !== '')) && (
				<>
					<div className='p-2 ' style={{ textAlign: 'left' }}>
						<span>Filtered By:</span>
					</div>
					<FilterList
						filterList={filterList}
						deleteFilter={deleteFilter}
						formatPeriod={formatPeriod}
						expensesPeriod={expensesPeriod}
						customPeriod={customPeriod}
					/>
				</>
			)}

			<ShowPieChart expensesPeriod={expensesPeriod} expenses={expensesToDisplay} datePicker={customPeriod} />

			<ExpenseList
				pageMode={props.pageMode}
				handleClickOpen={handleClickOpen}
				expenses={expensesToDisplay}
				deleteExpense={props.deleteExpense}
				filterList={filterList}
				deleteFilter={deleteFilter}
				handleAlert={handleAlert}
				pageModetoNormal={props.pageModetoNormal}
			/>
			<EditFilter
				dialogOpen={dialogOpen.open}
				date={dialogOpen.date}
				handleClose={handleClose}
				categories={props.categories}
				filterList={filterList}
				updateFilter={updateFilter}
				handleCustomPeriod={handleCustomPeriod}
				customPeriod={customPeriod}
			/>

			<SelectFeedbackRedirect
				show={alertMessage.open}
				title={'Delete this expense?'}
				body={'Are you sure to delete this expense? This action will be permanently.'}
				onClose={handleAlert}
				type={'danger'}
				action={'Delete'}
				handleAction={alertMessage.handleAction}
			/>
		</div>
	);
};

export default YourExpenses;
