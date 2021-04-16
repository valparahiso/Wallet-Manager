import { React, useRef, useState } from 'react';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';
import MainHelpSection from '../utils/HelpSection';


/*
	props:
	budget : total budget of the user
	spent : total spent by the user
	start_date : format YYYYMMDD -> date of the start of the plan
	end_date : format YYYYMMDD -> date of the end of the plan
	categoryBudget : if true the style if different 
*/


function BudgetFeedback(props) {
	let days_left = moment(props.end_date).diff(moment(), 'days') + 1;
	let days_gone = moment().diff(moment(props.start_date), 'days') + 1;
	let average_spent = parseFloat(props.spent) / days_gone;
	let projection_spent = parseFloat(props.spent) + average_spent * days_left;
	let sentence;
	let color;
	let emote;
	let border;
	let advice;
	let timeout;
	const [showHelp, setShowHelp] = useState(false);
	const [show, setShow] = useState(false);
	const target = useRef(null);


	const closeHelp = () => {
		setShowHelp(false);
		setShow(false);
	};

	const openClosePopup = () => {
		console.log(show);

		clearTimeout(timeout);
		if (!show) { 
			timeout = setTimeout(function () { setShow(false) }, 5000); 
		} setShow(!show); 
	}


	if (parseFloat(props.spent) > props.budget || props.color === "red") { 
		//Bad feedback
		border = '4px solid red';
		color = '#ff000040';
		advice = 'Not well! ';
		sentence = 'You spent more than the budget';
		emote = '    \u{1F630}';
	} else if (projection_spent > props.budget || props.color === "yellow") {
		//Not so good feedback
		border = '4px solid yellow';
		color = '#ffff0040';
		advice = "Be careful! "
		sentence = "Slow down or at the end of the plan period you will spend more than the budget";
		emote = '    \u{1F4AA}';

	} else {
		//Good feeback
		border = '4px solid green';
		color = '#00800040'; 
		advice = "Perfect! "
		sentence = "If you continue like this at the end of the plan period you would have savings";
		emote = '    \u{1F911}';
	}


	let styleDefault = {
		borderLeft: border,
		height: '50px',
		lineHeight: '50px',
		backgroundColor: color,
		borderRadius: '0px 15px 15px 0px',
		marginTop: '1rem',

	};

	let styleCategoryBudget = {
		borderLeft: border,
		height: '30px',
		width: '125px',
		lineHeight: '30px',
		backgroundColor: color,
		borderRadius: '0px 15px 15px 0px',
		marginTop: '1rem',
	};

	return (
		<div>
			<MainHelpSection show={showHelp} close={closeHelp} />
			<Row>
				<Col xs="9" style={(props.color) ? {padding:"0"} : { float: "left" }}> 
					<div style={props.categoryBudget ? styleCategoryBudget : styleDefault}>

						<p style={{
							display: 'inline-block', margin: ' 0 auto', paddingLeft: "10px", width: "90%", marginBottom: "10px",
							lineHeight: "15px", fontSize: "14px", fontWeight: "bold"
						}}> 
							{advice + emote}</p>

					</div>
				</Col>


				<Col xs={(props.color) ? "0" : "3"} style={(props.color) ?  { display : "none" } : { float: "left", padding: "0" }}>

					<Overlay target={target.current} show={show} placement="top">
						{(props) => (
							<Tooltip id="overlay-example" {...props}>
								<p style={{ marginTop: "15px" }}>
									{sentence}
								</p>
								<p onClick={setShowHelp} style={{ textDecoration: "underline" }}>
									Learn more...
								</p>
							</Tooltip>
						)}
					</Overlay>
					<Button ref={target} onClick={openClosePopup} style={(props.categoryBudget) ? {
						backgroundColor: 'transparent',
						float: 'right',
						border: 'none',
						boxShadow: 'none',
						outline: '2px dotted transparent',
						padding: '0px',
						marginTop: "22px"
					} : {
						backgroundColor: 'transparent',
						float: 'left',
						border: 'none',
						boxShadow: 'none',
						outline: '2px dotted transparent',
						padding: '0px',
						marginTop: "32px" 
					} }>
						<i
							style={{ color: 'rgba(74, 74, 74, 1.0)', outline: '2px dotted transparent', }}
							className='fas fa-question-circle'
						>
							<div style={{ float: "left", fontSize: "14px", marginTop: "0px", marginRight:"2px" }}>
								Why
						</div>
						</i>
					</Button>
				</Col>



			</Row>
		</div>
	);
}

export { BudgetFeedback };
