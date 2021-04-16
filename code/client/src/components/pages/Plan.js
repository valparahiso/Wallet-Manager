// Essentials
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, ProgressBar, Spinner } from 'react-bootstrap';

// Components
import { BudgetFeedback } from '../utils/BudgetFeedback';

// Modules
import moment from 'moment';
import Parser from 'html-react-parser';

//Images
import PlanEmpty from '../../images/plan_emptystate.jpg';
import calendarImage from '../../images/calendario.png';
import CategoriesBudgets from '../CategoriesBudgets';

class Plan extends React.Component {
	constructor() {
		super();
		this.state = {
			percentage: 0,
			budget_left: '',
			loading: true,
			period: ""
		};
	}

	componentDidMount() {
		if (this.props.totalBudget) {
			// console.log(this.props.totalBudget)
			let sentence = '';
			let period = '';
			if (this.props.totalBudget.spent < this.props.totalBudget.budget) {
				sentence = 'There are <span style=\"fontWeight: bold; display:inline-block\">€ ' + parseFloat(this.props.totalBudget.budget - this.props.totalBudget.spent).toFixed(2) + '</span> left to spend';
			} else if (this.props.totalBudget.spent === this.props.totalBudget.budget) {
				sentence = 'You spent your entire budget of <span style=\"fontWeight: bold; display:inline-block\">€ ' + parseFloat(this.props.totalBudget.budget).toFixed(2) + '</span>';
			} else {
				sentence = parseFloat(this.props.totalBudget.spent - this.props.totalBudget.budget).toFixed(2);
				sentence = 'You spent <span style=\"fontWeight: bold\; color: rgb(255, 59, 48)">€ ' + parseFloat(this.props.totalBudget.spent - this.props.totalBudget.budget).toFixed(2) + '</span> more than the total budget';
			}

			if(this.props.totalBudget.period.toUpperCase() === "MONTHLY"){
				const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				period = months[moment(this.props.totalBudget.start_date, 'YYYYMMDD').format("M")-1];
				
			} else if(this.props.totalBudget.period.toUpperCase() === "YEARLY"){
				
				period = "Year " + moment(this.props.totalBudget.start_date, 'YYYYMMDD').format("YYYY");

			} else if(this.props.totalBudget.period.toUpperCase() === "WEEKLY"){ 

				const prefixes = ["1st","2nd","3rd","4th","5th"]; 

				const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				let month = months[moment(this.props.totalBudget.start_date, 'YYYYMMDD').format("M")-1];
				period = prefixes[0 | moment(this.props.totalBudget.start_date, 'YYYYMMDD').date() / 7]  + " Week of " + month;

			} else {
				//CUSTOM
				period = "CUSTOM";
			}
			this.setState({
				percentage: (this.props.totalBudget.spent * 100) / this.props.totalBudget.budget,
				budget_left: sentence,
				period : period
			});
		}

		this.setState({ loading: false });
	}

	render() {
		if (this.state.loading)
			return (
				<Spinner animation='border' role='status'>
					<span className='sr-only'>Loading...</span>
				</Spinner>
			);

		if (this.props.totalBudget?.budget) {
			return (
				<div className='page'>
					<TotalBudget
						totalBudget={this.props.totalBudget}
						percentage={this.state.percentage}
						budget_left={this.state.budget_left}
						period={this.state.period}
					/>
					<CategoriesBudgets
						categoryBudgets={this.props.categoryBudgets}
						expenses={this.props.expenses}
						totalBudget={this.props.totalBudget}
					/>
				</div>
			);
		} else {
			return (
				<div className='page center-vertically' style={{ height: '100vh' }}>
					<div>
						<img alt={'Icon of an empty plan'} src={PlanEmpty} width='100%' />
						<p style={{ fontSize: '14px' }}>You don't have created your plan yet</p>
						<Link to='/plan/add'>
							<button style={{ fontSize: '17px' }} className='primary_button btn btn-primary'>
								Add a plan
							</button>
						</Link>
					</div>
				</div>
			);
		}
	}
}

function TotalBudget(props) {
	return (
		<div className='page_section'>
			<Row style={{ marginBottom: '20px' }}>
				<Col xs='4' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '30px' }}>
					<div style={{ position: 'relative' }}>
						<img src={calendarImage} alt='caendar' width='100%' />
						<div style={{ position: 'absolute', top: '50%', left: '0', fontSize: '13px', right: '0' }}>
							<p style={{ fontWeight: 'bold' }}>
								{props?.totalBudget?.period ? props?.totalBudget?.period.toUpperCase() : ''}
							</p>
						</div>
					</div>
				</Col>
				<Col xs='8' style={{ textAlign: 'center' }}>
					<div style={{ fontWeight: 'bold', marginTop: '9%' }}>
						<p style={{ margin: '0', lineHeight: '15px' }}>
							
							{(props.period === "CUSTOM") ? moment(props.totalBudget.start_date, 'YYYYMMDD').format('DD/MM/YYYY') +
								' - ' +
	moment(props.totalBudget.end_date, 'YYYYMMDD').format('DD/MM/YYYY') : props.period}
		
						</p> 
					</div>
					<div style={(props.period === "CUSTOM") ? {display : "none"} : { }}> 
						<p style={{ margin: '0', fontSize: '14px' }}>
							{moment(props.totalBudget.start_date, 'YYYYMMDD').format('DD/MM/YYYY') +
								' - ' +
	moment(props.totalBudget.end_date, 'YYYYMMDD').format('DD/MM/YYYY')} 
						</p>
					</div>
					<div>
						<p style={{ margin: '0', fontSize: '14px' }}>
							<span style={{ fontWeight: 'bold'}}>
							 {moment(props.totalBudget.end_date).diff(moment(), 'days') + 1 + ' days'}
							</span>
							{' left from today'}
						</p>
					</div>
				</Col>
			</Row>


			<Container>
				<Row style={{ paddingTop: '8px' }}>
					<Col xs='9'>
						<div>
							<ProgressBar
								now={props.percentage}
								label={`${parseInt(props.percentage)}%`}
								style={{ height: '33pt' }}
								srOnly={props.percentage < 5 ? true : false}>
								{props.percentage < 1 ? <h5 style={{ margin: 'auto' }}> 0% </h5> : ''}
							</ProgressBar>
						</div>
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
			</Container>
			<Row style={{ paddingLeft: '15px' }}>
				{props.percentage < 100 && (
					<div
						style={{
							marginTop: '-10px',
							textAlign: 'left',
							marginLeft: (props.percentage / 100) * 50 + '%',
							paddingTop: '4px',
							color: 'rgba(12, 73, 170, 0.913)',
							fontSize: '14px',
							fontWeight: 'bold',
						}}>
						{'€ ' + parseFloat(props.totalBudget.spent).toFixed(2)}
					</div>
				)}
			</Row>
			<Row style={{ paddingTop: '15px' }}>
				<Col xs='1'></Col>
				<Col xs='10'>

					<p>{Parser(props.budget_left)}</p>

				</Col>
				<Col xs='1'></Col>
			</Row>
			<Col>
				<BudgetFeedback
					start_date={props.totalBudget.start_date}
					end_date={props.totalBudget.end_date}
					spent={props.totalBudget.spent}
					budget={props.totalBudget.budget}
				/>
			</Col>
		</div>
	);
}

export default Plan;
