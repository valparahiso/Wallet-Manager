import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
	return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
		'& > div': {
			marginBottom: '50px',
		},
		'& > div > div': {
			width: '100vh',
		},
		'& > div > div > div > button': {
			outline: '2px dotted transparent',
		},
	},
}));

const AlertToast = ({ type, message, open, close }) => {
	const classes = useStyles();

	const closeFunc = () => {
		close(message, type);
	};

	return (
		<div className={classes.root}>
			<Snackbar open={open} autoHideDuration={2000} onClose={closeFunc}>
				{type === 'error' ? (
					<Alert onClose={() => close(message, 'error')} severity='error'>
						{message ?? 'Generic error, please retry'}
					</Alert>
				) : (
					<Alert onClose={() => close(message)} severity='success'>
						{message ?? 'Operation completed with success'}
					</Alert>
				)}
			</Snackbar>
		</div>
	);
};
export default AlertToast;
