import React, { useState, useEffect } from 'react';

import { Button as ButtonMaterial } from '@material-ui/core';
import ScrollMenu from 'react-horizontal-scrolling-menu';

import creditCardImage from '../../../images/creditCardPng.png';

import CreditCardModal from './CreditCardModal';
import SingleCreditCard, { EmptyAddCredit } from '../../subpages/SingleCreditCard';

/** TODO: Complete description
 * @description
 * This is the Credit Card Section inside 'Profile' page.
 *
 * @state
 * This component has the following state:
 * 		- 'openCreditModal'
 *
 * @param {*} props
 * 		creditCards={creditCards}
		addCreditCard={props.addCreditCard}
		editCreditCard={props.editCreditCard}
		deleteCreditCard={props.deleteCreditCard}
		modeCardSection={modeCardSection}
		handleModeCardSection={handleModeCardSection}
 */
export default function CreditCardSection(props) {
	//This control the open/close of the modal 'Add/Edit a Credit Card'
	const [openCreditModal, setOpenCreditModal] = useState(false);
	//This is the information to display inside the expenseModal
	const [expenseModal, setExpenseModal] = useState('');

	const { creditCards } = props;

	//This open and close the modal 'Add/Edit a Credit Card'
	const handleOpenCreditModal = (e, element = '') => {
		setOpenCreditModal(openCreditModal => !openCreditModal);

		//if element exist we open the modal to modify a credit card, otherwise we open it to add a new one
		setExpenseModal({ ...element });
	};

	const saveModal = (e, card) => {
		if (card.id) props.editCreditCard(card.id, card.name, card.number, card.expiry, card.color);
		else props.addCreditCard(card.name, card.number, card.expiry, card.checkboxAll, card.color);

		setOpenCreditModal(openCreditModal => !openCreditModal);
	};

	return (
		<div className={'pt-4 pb-4'}>
			<div className='section-title-div'>
				<h3 className='section-title'>Your Credit Card</h3>

				{creditCards.length > 0 && (
					<ButtonMaterial className='button-material' onClick={props.handleModeCardSection}>
						{props.modeCardSection === 'edit' ? 'Done' : 'Edit'}
					</ButtonMaterial>
				)}
			</div>

			<p className='sub-title'>
				Link a credit card and these expenses will be added automatically. You don't need to add manually anymore!
			</p>

			{
				//If the user doesn't setup any credit card, we display a splash screen
				creditCards.length < 1 ? (
					<div className={'text-center'}>
						<img alt={'Icon of a credit card'} src={creditCardImage} width='50%' />
						<p style={{ fontSize: '14px' }}>You don't have any credit card inserted</p>
						<button
							style={{ fontSize: '14px' }}
							className='primary_button btn btn-primary'
							onClick={handleOpenCreditModal}>
							Add a credit card
						</button>
					</div>
				) : (
					//If the use have a credit card we display an horizontal list
					<HorizonalCreditList
						creditCards={creditCards}
						handleOpenCreditModal={handleOpenCreditModal}
						handleModeCardSection={props.handleModeCardSection}
						modeCardSection={props.modeCardSection}
					/>
				)
			}

			<CreditCardModal
				openCreditModal={openCreditModal}
				handleOpenCreditModal={handleOpenCreditModal}
				deleteCreditCard={props.deleteCreditCard}
				card={expenseModal}
				saveModal={saveModal}
				handleConfirmation={props.handleConfirmation}
			/>
		</div>
	);
}

export const SectionStyle = {
	sectionTitle: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	},
	title: {
		fontSize: '23pt',
		float: 'left',
		textAlign: 'justify',
	},
	editButton: {
		textAlign: 'right',
		padding: '0px',
		position: 'absolute',
		right: '0',
	},
	subTitle: {
		clear: 'both',
		textAlign: 'justify',
	},
};

/** TODO: Complete description
 * @description
 * This is the horizontal list components needed to display the credit card added by the user.
 *
 * @state
 * This component doesn't have state
 *
 * @param {*} props
 * 		- CreditCard={CreditCard}
 * 		- handleOpen={handleOpenCreditModal}
 */
function HorizonalCreditList(props) {
	//This array is made of react component. We need this to pass to ScrollMenu component.
	const [cardToDisplay, setCardToDisplay] = useState([]);

	useEffect(() => {
		setCardToDisplay([...props.creditCards, { credit_card_id: -1, owner_name: '', number: '', expire_date: '' }]);
	}, [props.creditCards]);

	const Menu = list =>
		list.map((element, index) => {
			if (element.credit_card_id === -1) {
				return (
					<EmptyAddCredit
						key={-1}
						index={list.length - 1}
						handleOpenCreditModal={props.handleOpenCreditModal}
						modeCardSection={props.modeCardSection}
					/>
				);
			} else {
				return (
					<SingleCreditCard
						index={element.credit_card_id}
						onClick={e => props.handleOpenCreditModal(e, element)}
						key={element.credit_card_id}
						card={element}
						modeCardSection={props.modeCardSection}
					/>
				);
			}
		});

	return (
		<div style={CardStyle}>
			<ScrollMenu
				data={Menu(cardToDisplay)}
				alignCenter={false}
				wheel={false} //Scroll with mouse wheel deactivated
				hideArrows={true}
				itemsCount={cardToDisplay.length}
				onUpdate={false}
			/>
		</div>
	);
}

const CardStyle = {
	//This -10px margin need to eliminate the page margin for the horizontal card
	marginLeft: '-10px',
	marginRight: '-10px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	height: '200px',
};
