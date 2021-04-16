import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import PageList from '../../PageList';

//NavbarIcon
import PlusIcon from '@material-ui/icons/AddCircleOutline';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import PlanIcon from '@material-ui/icons/Assignment';
import HomepageIcon from '@material-ui/icons/Home';
import ExpensesIcon from '@material-ui/icons/PieChart';

//Navbar style
const styles = {
	root: {
		color: 'grey', //Icon color when you are not in the page
		'&$selected': {
			color: '#0c469de5', //Icon color when you are in that page
		},
		'&:focus': {
			outline: 'none',
		},
		padding: '8px 12px 8px',
		minWidth: '0px',
	},
	label: {
		fontFamily: 'Helvetica',
	},
	selected: {},
};

let tabs = PageList.filter(element => element.navbar);

const BottomBar = ({ classes: actionClasses, pageModeToNormal }) => {
	const location = useLocation();

	//This state represents the willingness to change the page
	const [changeLocation, setChangeLocation] = useState(false);
	//This state represents the active page in the navbar. We want to start on the homepage.
	const [page, setPage] = useState('/homepage');

	//Every time page changes, we set the changeLocation to false because we terminate the redirect
	useEffect(() => {
		setChangeLocation(false);
	}, [page]);

	//The page state must be align with the location URL.
	//We need this because in sub-pages the navbar is not visible but we want to update his state anyway
	useEffect(() => {
		setPage(location.pathname);
	}, [location.pathname]);

	if (changeLocation) {
		//The user click on a tab; so we need to redirect on the page associated with the tab
		return <Redirect to={page} />;
	} else if (tabs.some(element => element.route === location.pathname)) {
		//We want to display the navbar only if we are inside pages that are on the tabs
		return (
			<Paper className='fixed-bottom'>
				<BottomNavigation
					value={page}
					onChange={(event, tabPage) => {
						if (tabPage !== location.pathname) {
							//We want to redirect only if the page the user asks is not the same page he is at the moment
							//If the user clicks two times on the same tab we don't redirect
							setChangeLocation(true);
							setPage(tabPage);
							pageModeToNormal();
						}
					}}
					showLabels={true}>
					<BottomNavigationAction classes={actionClasses} label='Home' value='/homepage' icon={<HomepageIcon />} />
					<BottomNavigationAction classes={actionClasses} label='Expenses' value='/expenses' icon={<ExpensesIcon />} />
					<BottomNavigationAction classes={actionClasses} label={'Add' + '\u{00A0}' + 'Expense'} value='/add' icon={<PlusIcon style={{ marginTop: '-15px', width: '30px', height: '30px'}}/>}
						style={{padding: '6px 10px 0px'}} />
					<BottomNavigationAction classes={actionClasses} label='Plan' value='/plan' icon={<PlanIcon />} />
					<BottomNavigationAction classes={actionClasses} label='Profile' value='/profile' icon={<ProfileIcon />} />
				</BottomNavigation>
			</Paper>
		);
		//In the sub-pages we don't show the navbar
	} else return null;
};

export default withStyles(styles)(BottomBar);
