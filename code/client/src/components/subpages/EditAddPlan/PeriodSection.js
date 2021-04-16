// Essentials
import React from 'react';
import { Col, Row, Form } from 'react-bootstrap';

// Components
import { TutorialLine } from '../../utils/Tutorial';

// CSS import
import '../../../App.css';
import RadioButton from '../../utils/RadioButton';

const moment = require('moment');

class PeriodSection extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showModal: false,
		};
	}

	componentDidMount() {

	}

	updatePlanDuration = (name, value, start_date, end_date) => {
		this.props.updatePlanDuration(name, value, start_date, end_date);
		if (name !== 'custom') this.closeCustomPlan();
	};

	openCustomPlan = () => {
		this.props.updatePlanDuration('custom', true);
		this.setState({ showModal: true });
	};

	closeCustomPlan = () => {
		this.setState({ showModal: false });
	};

	render() {
		return (
			<div className={'page_section ' + (this.props.wrongDate ? 'danger' : '')}>
				<div className='section_title'>Period for the plan*</div>
				{this.props.tutorial && <TutorialLine title={'First set a duration for your plan'} />}
				<p style={{ fontSize: '14px', textAlign: 'left', marginBottom: '0'}}>
						At the end of the selected period the plan will renew for the same duration
				</p>
				<Col style={{ paddingTop: '8px' }}>
					<Form style={{ textAlign: 'left' }}>
						<div className='container' style={{ marginBottom: '15px', marginTop: '10px' }}>
							<div className='row' style={{ justifyContent: 'center' }}>
								<div className='col-3' style={{ padding: 0 }}>
									<div className='radio-box'>
										<RadioButton
											value='Weekly'
											checked={this.props.period === 'weekly' ? true : false}
											onChange={ev => this.updatePlanDuration('weekly', ev.target.checked)}
										/>
									</div>{' '}
								</div>
								<div className='col-3 ' style={{ padding: 0 }}>
									<div className='radio-box'>
										<RadioButton
											value='Monthly'
											checked={this.props.period === 'monthly' ? true : false}
											onChange={ev => this.updatePlanDuration('monthly', ev.target.checked)}
										/>
									</div>
								</div>
								<div className='col-3 ' style={{ padding: 0 }}>
									<div className='radio-box'>
										<RadioButton
											value='Yearly'
											checked={this.props.period === 'yearly' ? true : false}
											onChange={ev => this.updatePlanDuration('yearly', ev.target.checked)}
										/>
									</div>
								</div>
								<div className='col-3 ' style={{ padding: 0 }}>
									<div className='radio-box'>
										<RadioButton
											value='Custom'
											checked={this.props.period === 'custom' ? true : false}
											onChange={this.openCustomPlan}
										/>
									</div>
								</div>
							</div>
						</div>

						{this.props.period === 'custom' && (
							<CustomPlan
								updatePlanDuration={this.updatePlanDuration}
								start_date={this.props.start_date}
								end_date={this.props.end_date}
							/>
						)}
					</Form>
					<p style={{ fontSize: '16px', paddingTop: '10px' }}>
						{this.props.start_date && this.props.tutorial && 'Your are creating a plan for '}
						{this.props.start_date && !this.props.tutorial && 'Your plan is for '}
						{this.props.start_date && this.props.period === "weekly" &&
						<>
							the  
							<span style={{fontWeight: 'bold'}}>
								{' current week'}
							</span>
						</> }
						{this.props.start_date && this.props.period === "monthly" &&
						<>
							the  
							<span style={{fontWeight: 'bold'}}>
								{' current month '}
							</span>
							<br/>
							<span style={{fontWeight: 'bold'}}>
								{" " + moment(this.props.start_date).format('MMMM').toString()}
							</span>
						</> }
						{this.props.start_date && this.props.period === "yearly" &&
						<>
							the  
							<span style={{fontWeight: 'bold'}}>
								{' current year'}
							</span>
							<br/>
							<span style={{fontWeight: 'bold'}}>
								{" " + moment(this.props.start_date).format('YYYY').toString()}
							</span>

						</> }
						{this.props.period === "custom" &&
						<>
							a 
							<span style={{fontWeight: 'bold'}}>
								{' custom period'}
							</span>
						</> }
						{this.props.start_date && this.props.end_date &&
						<>
							<br/>
							{' ('}
							<span style={{fontWeight: 'bold'}}>
								{moment(this.props.start_date).format('DD/MM/YYYY').toString() + "-" + 
								moment(this.props.end_date).format('DD/MM/YYYY').toString()}
							</span>
							{')'}
						</>
						}

					</p>
					
				</Col>
			</div>
		);
	}
}

class CustomPlan extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			start_date: '',
			end_date: '',
		};
	}

	updateField = (name, value) => {
		let start_date;
		let end_date;
		switch (name) {
			case 'start_date':
				start_date = moment(value).format('YYYY-MM-DD').toString();
				this.setState({ start_date: start_date });
				break;
			case 'end_date':
				end_date = moment(value).format('YYYY-MM-DD').toString();
				this.setState({ end_date: end_date });
				break;
			default:
				break;
		}
		this.props.updatePlanDuration('custom', true, start_date || this.state.start_date, end_date || this.state.end_date);
	};

	render() {
		return (
			<Row style={{ paddingBottom: '5px', marginBottom: '10px' }}>
				<Col xs={6}>
					<Form.Label style={{ marginBottom: '5px' }}>
						Start Date <i className='far fa-calendar-alt'></i>
					</Form.Label>
					<Form.Control
						type='date'
						name='start_date'
						value={this.state.start_date || this.props.start_date}
						onChange={ev => this.updateField(ev.target.name, ev.target.value)}
					/>
				</Col>
				<Col xs={6}>
					<Form.Label style={{ marginBottom: '5px' }}>
						End Date <i className='far fa-calendar-alt'></i>
					</Form.Label>
					<Form.Control
						type='date'
						name='end_date'
						value={this.state.end_date || this.props.end_date}
						onChange={ev => this.updateField(ev.target.name, ev.target.value)}
					/>
				</Col>
			</Row>
		);
	}
}

export default PeriodSection;
