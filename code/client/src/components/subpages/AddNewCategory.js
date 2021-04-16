import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import IconChooser from './IconChooser';

export default function AddNewCategory(props) {
	const [categoryName, setCategoryName] = useState('');
	const [iconName, setIconName] = useState('');

	const [formError, setFormError] = useState('');

	//Every time we open the modal all fields will be reset
	useEffect(() => {
		setCategoryName(props.categoryToDisplay ? props.categoryToDisplay.name : '');
		setIconName(props.categoryToDisplay ? props.categoryToDisplay.icon : '');
		setFormError('');
	}, [props.open, props.categoryToDisplay]);

	const ValidateForm = () => {
		//IsCatNameExist is TRUE if we have already a category with that name.
		//We don't want two category with the same name (notice we compare the names in uppercase)
		let categoryList = props.categories;
		if (props.categoryToDisplay !== '') {
			categoryList = categoryList.filter(
				element => element.name.toUpperCase().trim() !== props.categoryToDisplay.name.toUpperCase().trim()
			);
		}

		const IsCatNameExist = categoryList.some(
			element => element.name.toUpperCase().trim() === categoryName.toUpperCase().trim()
		);

		if (categoryName.trim() === '') {
			setFormError("This field can't be empty");
		} else if (IsCatNameExist) {
			setFormError('This category name already exist');
		} else if (categoryName.trim().length > 15) {
			setFormError('This name is too long');
		} else {
			const catNameCapitalized = categoryName.trim().charAt(0).toUpperCase() + categoryName.trim().slice(1);

			let new_icon = '';
			if (iconName === '') {
				const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
				setIconName(color);
				new_icon = color;
			} else {
				new_icon = iconName;
			}

			if (props.categoryToDisplay === '') {
				AddCategory(catNameCapitalized, new_icon);
			} else {
				UpdateCategory(props.categoryToDisplay.category_id, catNameCapitalized, new_icon);
			}

			props.handleClose();
		}
	};

	const UpdateCategory = (category_id, name, icon) => {
		props.editCategory(category_id, name, icon);
	};

	const AddCategory = (name, iconName) => {
		props.addCategory(name, iconName);
	};

	const handleChange = event => {
		if (categoryName.trim().length > 15) setFormError('This name is too long');
		setCategoryName(event.target.value);
	};

	const handleIcon = iconName => {
		setIconName(iconName);
	};

	return (
		<Dialog className='dialog' open={props.open} onClose={props.handleClose} aria-labelledby='form-dialog-title'>
			<DialogTitle className='dialog-title' id='form-dialog-title' style={{ color: 'rgb(12,70,157)' }}>
				{props.categoryToDisplay === '' ? 'Add a new category' : 'Update category'}
			</DialogTitle>

			<DialogContent style={{ fontSize: '14px' }}>
				<label htmlFor='IconChooser'>Choose an icon (optional)</label>
				<IconChooser id={'IconChooser'} handleIcon={handleIcon} iconName={iconName} />
				<div style={{ marginBottom: '20px' }}>
					<label htmlFor='CategoryName'>Category Name*</label>
					<TextField
						id='CategoryName'
						className={'form-control input-label'}
						variant='outlined'
						required={true}
						type='input'
						placeholder='Es. Supermarket'
						value={categoryName}
						onChange={handleChange}
						error={formError !== ''}
						helperText={formError}
					/>
				</div>
			</DialogContent>
			<span style={{ borderTop: 'solid 0.5px gray' }}></span>
			<DialogActions style={{ padding: '0px' }}>
				<button onClick={props.handleClose} color='primary' style={{ borderRight: 'solid 0.5px gray' }}>
					Cancel
				</button>
				<button onClick={ValidateForm} style={{ margin: '0px', color: 'rgb(12,70,157)' }}>
					{props.categoryToDisplay === '' ? 'Add' : 'Update'}
				</button>
			</DialogActions>
		</Dialog>
	);
}
