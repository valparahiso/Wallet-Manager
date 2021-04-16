import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DialogActions } from '@material-ui/core';

// This component is a persistent modal so it has to be rendered under conditions
// props:
// - route: path to redirect
// - timeInterval: millis to wait for redirect
// - type: kind of feedback which is added to classname prop (success, danger)
// - title: title of the modal
// - body: body of the modal
// - action: action executed after timer expired
// if not pass "title" and "body" it is a simple redirect function which shows nothing
function FeedbackRedirect(props) {
	let history = useHistory();

	useEffect(() => {
		const timer = setTimeout(() => {
			if (props.action) props.action();
			if (props.route) history.push(props.route);
		}, props.timeInterval);

		return () => clearTimeout(timer);
	}, [history, props, props.route, props.timeInterval, props.action]);

	if (props.title || props.body) {
		return (
			<Dialog className='page_footer' open={true} aria-labelledby='form-dialog-title'>
				{props.title && (
					<DialogTitle>
						<div>{props.title}</div>
					</DialogTitle>
				)}
				{props.body && (
					<DialogContent>
						<p>{props.body}</p>
					</DialogContent>
				)}
			</Dialog>
		);
	} else {
		return null;
	}
}

// Feedback modal for confirm delete
// props:
// - route: path to redirect
// - type: kind of feedback which is added to classname prop (danger)
// - show: variable to show or not the modal
// - onClose: function to run when the modal is closed
// - title: title of the modal
// - body: body of the modal
// - undo: text for the undo button
// - setFeedback: function when undo button is clicked
// - action: text for the confirm button
// - handleAction: function when confirm button is clicked
// if not pass "title" and "body" it is a simple redirect function which shows nothing

const SelectFeedbackRedirect = props => {
	const [redirect, setRedirect] = useState(false);

	if (redirect) {
		return <Redirect to={props.route} />;
	} else
		return (
			<Dialog className='feedback' open={props.show} onClose={() => props.onClose(false)}>
				{props.title && <DialogTitle className='feedback-title pb-0'>{props.title}</DialogTitle>}

				{props.body && <DialogContent className='feedback-description'>{props.body}</DialogContent>}

				<DialogActions style={{ justifyContent: 'center', borderTop: 'solid 0.5px gray', padding: '0px' }}>
					<div className='row' style={{ width: '100%' }}>
						<div className='col-6 p-0' style={{ borderRight: 'solid 0.5px gray' }}>
							<button style={{ outline: '2px dotted transparent' }} onClick={() => props.onClose(false)}>
								Cancel
							</button>
						</div>

						<div className='col-6 p-0'>
							<button
								style={
									props.type === 'danger'
										? { color: 'red', outline: '2px dotted transparent' }
										: { color: 'blue', outline: '2px dotted transparent' }
								}
								onClick={() => {
									props.handleAction();
									props.route && setRedirect(true);
									props.onClose(false);
								}}>
								{props.action || 'Confirm'}
							</button>
						</div>
					</div>
				</DialogActions>
			</Dialog>
		);
};

export { FeedbackRedirect, SelectFeedbackRedirect };
