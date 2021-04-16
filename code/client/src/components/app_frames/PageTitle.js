import { Paper } from '@material-ui/core';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageList from '../../PageList';

function PageTitle(props) {
	let location = useLocation();

	let currentPage = PageList.filter(element => element.route === location.pathname)[0];

	const chooseAction = () => {
		if (currentPage.pageAction.action === 'handleEdit') {
			props.changePageMode();
		}
		if (currentPage.pageAction.action === 'handleDelete') {
			props.setDeleteFeedback(true);
		}
	};

	if (currentPage) {
		let titleClass;
		if (!currentPage.backRoute) {
			if (!currentPage.pageAction) {
				titleClass = 'col-12 page_title';
			} else {
				titleClass = 'col-9 page_title';
			}
		} else {
			titleClass = 'col-6 subpage_title';
		}

		return (
			<Paper className='topbar' square style={{ paddingLeft: '0', paddingRight: '0' }}>
				<div className='container'>
					<div className={!currentPage.backRoute ? 'row page_topbar' : 'row subpage_topbar'}>
						{currentPage.backRoute && (
							<div className='col-3 topbar_back' style={{ textAlign: 'left', fontSize: '13pt' }}>
								<Link to={currentPage.backRoute} style={{ color: 'rgba(74, 74, 74, 1)' }}>
									<i className='fas fa-chevron-left'> </i>
									<span /> Back
								</Link>
							</div>
						)}
						<div className={titleClass}>{currentPage.pageTitle}</div>
						{currentPage && currentPage.route === '/plan' && !props.totalBudget?.budget ? (
							''
						) : (
							<>
								{currentPage.pageAction && !props.noExpenses && (
									<PageAction currentPage={currentPage} chooseAction={chooseAction} pageMode={props.pageMode} />
								)}
							</>
						)}
					</div>
				</div>
			</Paper>
		);
	} else {
		return null;
	}
}

function PageAction(props) {
	const currentPage = props.currentPage;
	if (currentPage.pageAction && currentPage.pageAction.label) {
		if (currentPage.pageAction.type === 'danger' || currentPage.pageAction.type === 'normal') {
			return (
				<div className='col-3 topbar_action' style={{ textAlign: 'right', fontSize: '13pt', height: '25px' }}>
					<p
						style={
							currentPage.pageAction.type === 'danger'
								? { color: 'rgb(251, 100, 100)' }
								: { color: 'rgba(74, 74, 74, 1)' }
						}
						onClick={props.chooseAction}>
						{props.pageMode === 'edit' ? 'Done' : currentPage.pageAction.label}
					</p>
				</div>
			);
		} else {
			return (
				<div className='col-3 topbar_action' style={{ textAlign: 'right', fontSize: '13pt', height: '25px' }}>
					<Link to={currentPage.pageAction.action} style={{ color: 'rgba(74, 74, 74, 1)' }}>
						{currentPage.pageAction.label}
					</Link>
				</div>
			);
		}
	} else {
		// Bad trick to fill the right side on the topbar
		return (
			<div className='col-3 topbar_action' style={{ textAlign: 'right', fontSize: '13pt', height: '25px' }}>
				<p style={{ opacity: '0' }}>''</p>
			</div>
		);
	}
}

export default PageTitle;
