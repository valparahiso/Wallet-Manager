// Essentials
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import {Col, Row} from 'react-bootstrap';


// Components
import { BudgetFeedback } from '../utils/BudgetFeedback';

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

function MainHelpSection(props) {
	const classes = useStyles();

	return (
		<Dialog fullScreen open={props.show} onClose={props.close} TransitionComponent={Transition}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={props.close}
						aria-label='close'
						style={{ outline: '2px dotted transparent' }}>
						<CloseIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						Help
					</Typography>
				</Toolbar>
			</AppBar>
			<DialogContent style={{ marginTop: '60px' }}>
				<h2>FAQ</h2>
				<br />
				<br />
				
				<h6 style={{ fontWeight: 'bold' }}>How can I understand if i'm respecting my plan?</h6>
				<p style={{ textAlign: 'justify', marginBottom:"0px" }}> 
					In the Homepage and in the Plan page you can find a feedback to understand easily if you're respecting your plan.
					There are three possible feedbacks:
				</p>

				<Row>
					<Col xs="3">
					</Col>
					<Col xs="7">
						<BudgetFeedback color="red"/>
					</Col>
					<Col xs="2">
					</Col>
				</Row>
				<br/> 
				<p style={{ textAlign: 'justify', marginBottom:"0px"}}>You already spent more than the budget setted in the plan.</p>

				<Row>
					<Col xs="3">
					</Col>
					<Col xs="7">
						<BudgetFeedback color="yellow"/>
					</Col>
					<Col xs="2">
					</Col>
				</Row>
				<br/> 
				<p style={{ textAlign: 'justify', marginBottom:"0px"}}>You are still on the budget setted in the plan, but based on your daily average expenses you will spend more</p>

				<Row>
					<Col xs="3">
					</Col>
					<Col xs="7">
						<BudgetFeedback color="green"/>
					</Col>
					<Col xs="2">
					</Col>
				</Row>
				<br/> 
				<p style={{ textAlign: 'justify' }}>You are on the budget setted in the plan and based on your daily average expenses you will respect it</p>


				<h6 style={{ fontWeight: 'bold' }}>How do I add an expense?</h6>
				<p style={{ textAlign: 'justify' }}>
					Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
				</p>
				<br />
				<h6 style={{ fontWeight: 'bold' }}>How do I set up a budget for a category?</h6>
				<p style={{ textAlign: 'justify' }}>
					Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
				</p>
				<br />
				<h6 style={{ fontWeight: 'bold' }}>How do I create a plan?</h6>
				<p style={{ textAlign: 'justify' }}>
					Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
				</p>
				<br />
				<h6 style={{ fontWeight: 'bold' }}>How do I link a credit card?</h6>
				<p style={{ textAlign: 'justify' }}>
					Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
					galley of type and scrambled it to make a type specimen book. It has survived not only five centuries
				</p>
			</DialogContent>
		</Dialog>
	);
}

export default MainHelpSection;
