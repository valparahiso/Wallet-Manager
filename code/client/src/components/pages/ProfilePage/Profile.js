import { useState } from 'react';

//Library Component
import { Avatar } from '@material-ui/core';
import { Button } from 'react-bootstrap';

//User profile image
import UserAvatar from '../../../images/userAvatar.png';

//Component
import CreditCardSection from './CreditCardSection';
import CategorySection from './CategorySection';
import { SelectFeedbackRedirect } from '../../utils/Feedbacks';

/**
 * @description
 * This is the 'Profile' page. It is made by 3 components:
 *      - 'ProfileInfo': section with user profile information + logout button
 *      - 'Your Credit Card': section with the list of credit cards the user link to the account
 *      - 'Your Category': list of the expense category
 *
 * @state
 * This component has the following state:
 * 		- 'modeCardSection'
 *		- 'modeCategorySection'
 *		- 'configModal'
 *
 * @param {*} props
 * 	//For Credit Card
	creditCards={this.state.creditCards}
	addCreditCard={this.addCreditCard}
	editCreditCard={this.editCreditCard}
	deleteCreditCard={this.deleteCreditCard}
	//For Categories
	categories={this.state.categories}
	addCategory={this.addCategory}
	editCategory={this.editCategory}
	deleteCategory={this.deleteCategory}
 */
const Profile = props => {
	//This control the state (Edit or Normal) of the two section 'Category' and 'Card'
	const [modeCardSection, setModeCardSection] = useState('normal');
	const [modeCategorySection, setModeCategorySection] = useState('normal');

	//This is the state of the confirmation modal
	const [configModal, setConfigModal] = useState({
		open: false,
		type: '',
		title: '',
		body: '',
		action: '',
		handleAction: '',
	});

	//Destructuring props
	const { categories, creditCards } = props;

	//This change the mode (edit or normal) of Card section
	const handleModeCardSection = () => {
		setModeCardSection(modeCardSection => (modeCardSection === 'edit' ? 'normal' : 'edit'));
		//If the CategorySection is in EDIT mode report to normal
		if (modeCategorySection === 'edit') setModeCategorySection('normal');
	};

	//This change the mode (edit or normal) of Category section
	const handleModeCategorySection = () => {
		setModeCategorySection(modeCategorySection => (modeCategorySection === 'edit' ? 'normal' : 'edit'));
		//If the CardSection is in EDIT mode report to normal
		if (modeCardSection === 'edit') setModeCardSection('normal');
	};

	const handleConfirmation = (type, title, body, action, handleAction) => {
		//When open the modal I have the type
		setConfigModal(configModal => ({
			open: !configModal.open,
			type: type,
			title: title,
			body: body,
			action: action,
			handleAction: handleAction,
		}));
	};

	const onCloseConfirm = () => {
		setConfigModal({ ...configModal, open: false });
	};

	return (
		<div className='page'>
			<span
				onClick={() => {
					setModeCategorySection('normal');
					setModeCardSection('normal');
				}}>
				<ProfileInfo />
			</span>

			<span onClick={() => setModeCategorySection('normal')}>
				<CreditCardSection
					creditCards={creditCards}
					addCreditCard={props.addCreditCard}
					editCreditCard={props.editCreditCard}
					deleteCreditCard={props.deleteCreditCard}
					modeCardSection={modeCardSection}
					handleModeCardSection={handleModeCardSection}
					handleConfirmation={handleConfirmation}
				/>
			</span>

			<span onClick={() => setModeCardSection('normal')}>
				<CategorySection
					categories={categories}
					modePage={modeCategorySection}
					handleEdit={handleModeCategorySection}
					deleteCategory={props.deleteCategory}
					addCategory={props.addCategory}
					editCategory={props.editCategory}
					handleConfirmation={handleConfirmation}
				/>
			</span>

			<SelectFeedbackRedirect
				show={configModal.open}
				title={configModal.title}
				body={configModal.body}
				onClose={onCloseConfirm}
				type={configModal.type}
				action={configModal.action}
				handleAction={configModal.handleAction}
			/>
		</div>
	);
};

/**
 * Profile Information section. Display an Avatar and a Logout button.
 * It has no state and no property.
 */
function ProfileInfo() {
	return (
		<div className={'p-4 text-center'}>
			<div className={'p-4'}>
				<Avatar alt='User Avatar' style={AvatarStyle} src={UserAvatar} />
				<h3 style={{ fontSize: '15pt', fontWeight: 'bold' }}>John Doe</h3>
			</div>
			<Button className='danger_button'>Logout</Button>
		</div>
	);
}

//Style for the user Avatar
const AvatarStyle = {
	//Height and Width of the Avatar
	width: '80px',
	height: '80px',

	//This need to align horizontally
	display: 'block',
	marginLeft: 'auto',
	marginRight: 'auto',

	border: '1px solid',
	backgroundColor: 'orange', //Background color for avatar image
};

export default Profile;
