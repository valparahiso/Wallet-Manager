import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Avatar, Button as ButtonMaterial } from '@material-ui/core';

//This is a vector with svg icons for categories
import { VectorIcon } from '../../../images/CategoryIcon';

import CatEmpty from './catempty.png';
import AddNewCategory from '../../subpages/AddNewCategory';

export default function CategorySection(props) {
	//This control the open/close of the modal 'Add a new Category'
	const [openCategoryModal, setOpenCategoryModal] = useState(false);

	//Information about the category to edit inside the modal. If '' we want to add a new category.
	const [categoryToDisplay, setCategoryToDisplay] = useState('');

	//This open and close the modal 'Add/Update a Category'
	const handleOpenCategoryModal = (e, catObj) => {
		//If we find a category object we want to open the modal to modify a category
		if (catObj) setCategoryToDisplay(catObj);
		else setCategoryToDisplay('');

		setOpenCategoryModal(openCategoryModal => !openCategoryModal);
	};

	const handleCloseCategoryModal = () => {
		setOpenCategoryModal(openCategoryModal => !openCategoryModal);
	};

	return (
		<div style={{ marginTop: '40px', textAlign: 'justify' }}>
			<div className='section-title-div'>
				<h3 className='section-title'>Your Category</h3>

				{props.categories.length > 0 && (
					<ButtonMaterial className='button-material' onClick={props.handleEdit}>
						{props.modePage === 'edit' ? 'Done' : 'Edit'}
					</ButtonMaterial>
				)}
			</div>
			<p className='sub-title'>This list shows all the categories you created to categorize your expenses.</p>

			{props.categories.length <= 0 ? (
				<div className={'text-center'}>
					<img alt={'Icon of a folder'} src={CatEmpty} width='75%' />
					<p style={{ fontSize: '14px' }}>You don't have any category inserted</p>
					<button
						style={{ fontSize: '14px' }}
						className='primary_button btn btn-primary'
						onClick={() => {
							handleOpenCategoryModal();
							props.handleEdit();
						}}>
						Add a new category
					</button>
				</div>
			) : (
				<ListGroup variant='flush' style={{ minHeight: '350px' }}>
					{props.categories.map(element => (
						<ListItem
							key={element.category_id}
							category={element}
							modePage={props.modePage}
							deleteCategory={props.deleteCategory}
							handleOpenCategoryModal={handleOpenCategoryModal}
							handleConfirmation={props.handleConfirmation}
							toast
						/>
					))}
					<AddCategory key={0} handleOpen={handleOpenCategoryModal} />
				</ListGroup>
			)}

			<AddNewCategory
				categories={props.categories}
				addCategory={props.addCategory}
				editCategory={props.editCategory}
				open={openCategoryModal}
				handleOpen={handleOpenCategoryModal}
				handleClose={handleCloseCategoryModal}
				categoryToDisplay={categoryToDisplay}
			/>
		</div>
	);
}

/**
 * This component is the single list item
 *
 * @state
 *			icon {svg, name, color}: this state represents the information for display the category icon
 * @props
 * 			props.category {icon, name, category_id}
 * 			props.modePage
 * 			props.deleteCategory
 * 			props.handleOpenCategoryModal
 */
function ListItem(props) {
	const [icon, setIcon] = useState({ svg: '', name: '', color: '' });

	useEffect(() => {
		//Search the icon and the color associated with that category name.
		const iconObj = VectorIcon.filter(element => element.name === props.category.icon);

		if (iconObj.length !== 0) {
			setIcon({ svg: iconObj[0].svg, name: iconObj[0].name, color: iconObj[0].color });
		} else {
			//If we don't have an icon we want to display the first letter of category name
			setIcon({ svg: '', name: props.category.name.charAt(0), color: props.category.icon });
		}
	}, [props.category.icon, props.category.name]);

	const deleteCategory = id => {
		props.handleConfirmation(
			'danger',
			'Delete this category?',
			'Are you sure to delete this category? All expenses associated with this category will no longer have a category.',
			'Delete',
			() => props.deleteCategory(id)
		);
	};

	return (
		<ListGroup.Item id={props.category.category_id} className={'table-row'}>
			<div className='d-flex w-100'>
				<div className='container'>
					<div className='row' style={{ paddingLeft: '15px' }}>
						<div className='col-1 center-vertically' style={{ padding: 0 }}>
							{props.modePage === 'edit' && (
								<i
									onClick={() => deleteCategory(props.category.category_id)}
									className='fas fa-minus-circle fa-lg'
									style={{ color: 'rgb(255, 59, 48)' }}></i>
							)}
						</div>
						<div className='col-2 center-vertically'>
							<Avatar style={{ backgroundColor: icon.color, width: '35px', height: '35px' }}>
								{icon.svg === '' ? props.category.name.charAt(0) : <svg className='svg-icon'>{icon.svg}</svg>}
							</Avatar>
						</div>
						<div className='col-6 center-vertically'>
							<h5 className='reset-style' style={{ textAlign: 'left', fontSize: '16px'}}>
								{props.category.name}
							</h5>
						</div>
						<div className='col-3 center-vertically'>
							{props.modePage === 'edit' && (
								<i
									className='fas fa-pen-square fa-lg'
									onClick={e => props.handleOpenCategoryModal(e, props.category)}
									style={{ textAlign: 'right' }}></i>
							)}
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
}

function AddCategory(props) {
	return (
		<ListGroup.Item
			onClick={props.handleOpen}
			style={{ height: '44pt', padding: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
			<div className='d-flex w-100'>
				<div className='container'>
					<div className='row'>
						<div className='col-1' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}></div>
						<div className='col-10' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<p style={{ textAlign: 'left' }}>
								<i className='fas fa-plus fa-lg' style={{ paddingRight: '15px', paddingLeft: '15px' }}></i>
								Add a new category
							</p>
						</div>
					</div>
				</div>
			</div>
		</ListGroup.Item>
	);
}
