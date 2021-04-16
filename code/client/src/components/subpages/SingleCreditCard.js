import React from 'react';
import visa_logo from '../../images/visalogo1.png';

export default function SingleCreditCard(props) {
	const getName = name => {
		const limit = 16;
		if (name.length > limit) {
			name = name.substring(0, limit);
			name = name + '...';
		}
		return name;
	};

	const number4Digit = number => {
		number = number + '';

		if (number.length < 16) {
			const numbAst = 16 - number.length;
			number = number + '*'.repeat(numbAst);
		}
		const first = number.substring(0, 4);
		const second = number.substring(4, 8);
		const third = number.substring(8, 12);
		const fourth = number.substring(12, 16);

		return first + ' ' + second + ' ' + third + ' ' + fourth;
	};

	return (
		<div style={{ padding: '10px' }}>
			<div className='credit-card' style={{ backgroundImage: props.card.color }}>
				<div className='credit-card__logo'>
					<img alt={'visa logo'} className='logo' src={visa_logo} width='50' />
				</div>
				<div style={credit_card__number_style}>
					{props.card?.number ? number4Digit(props.card.number) : '**** **** **** ****'}
				</div>
				<div style={credit_card__info_style}>
					<div>
						<div style={credit_card__info_label_style}>OWNER'S NAME</div>
						<div>{props.card?.owner_name ? getName(props.card.owner_name) : '______________'}</div>
					</div>

					<div style={credit_card__info_expiry_style}>
						<div style={credit_card__info_label_style}>VALID UP TO</div>
						<div>{props.card?.expire_date ? props.card?.expire_date : 'YYYY-MM'}</div>
					</div>
				</div>
			</div>
			<div style={{ textAlign: 'center', marginTop: '10px' }}>
				{props.modeCardSection === 'edit' && (
					<>
						<i className='fas fa-pen-square fa-lg' style={{ textAlign: 'right' }}>
							<span> </span>Edit
						</i>
					</>
				)}
			</div>
		</div>
	);
}

export function EmptyAddCredit(props) {
	return (
		<div style={{ padding: '10px', height: '200px' }}>
			<div style={credit_card_style_meno1}>
				<div style={{ height: '17px' }}></div>

				<div style={{ height: '80px', textAlign: 'center', fontSize: '25px' }}>
					<p>Add a credit card</p>
					<button
						className='primary_button btn btn-primary'
						onClick={e => props.handleOpenCreditModal(e, undefined, props.index)}>
						Add a new card
					</button>
				</div>

				<div style={{ height: '30px' }}></div>
			</div>
			<div style={{ textAlign: 'center', marginTop: '10px' }}>
				{props.modeCardSection === 'edit' && (
					<>
						<i className='fas fa-edit fa-lg' style={{ textAlign: 'right', color: 'white' }}>
							Edit
						</i>
					</>
				)}
			</div>
		</div>
	);
}

const credit_card_style_meno1 = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',

	width: '300px',
	height: '180px',
	padding: '25px',
	borderRadius: '15px',

	//color: 'white',
	//backgroundImage: 'linear-gradient(25deg, #0f509e, #1399cd)',
	//backgroundColor: '#9dc5c3',
	//backgroundImage: 'linear-gradient(25deg, #c0c0c0, #c2c2c2)',
	boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
};

const credit_card__number_style = {
	display: 'flex',
	justifyContent: 'center',

	fontFamily: 'Helvetica',
	fontSize: '25px',
};

const credit_card__info_style = {
	display: 'flex',
	justifyContent: 'space-between',

	fontFamily: 'Helvetica',
	fontSize: '15px',
};

const credit_card__info_label_style = {
	fontSize: '10px',
};

const credit_card__info_expiry_style = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
};
