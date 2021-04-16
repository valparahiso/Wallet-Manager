import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

//This library implements the horizontal scroll for the list of icons
import ScrollMenu from 'react-horizontal-scrolling-menu';

//This is the Avatar for the single icon
import { Avatar } from '@material-ui/core';

//This is the list of svg icons
import { VectorIcon } from '../../images/CategoryIcon';

export default function CategoryChooser(props) {
	//This state represents the name of the category choose by the user
	const [Selected, setSelected] = useState(props.selected ? props.selected : '');

	const onSelect = key => {
		//If the user select an category already selected means that wants to un-select
		if (parseInt(key) === Selected) key = '';

		setSelected(parseInt(key));
		props.onSelect(parseInt(key));
	};

	const categories = props.categories;
	const icons = VectorIcon;

	const Menu = (categories, icons, selected) => 
		categories.map(el => {
			let categoryIcon = icons.find( icon => {
											return icon.name === el.icon;
										});
			let colorIcon;
			if(selected === el.category_id) {
				if(categoryIcon) 
					colorIcon = categoryIcon.color;
				else
					colorIcon = el.icon;

			}

			return (
				<div text={el.name} key={el.category_id} selected={selected} style={{ margin: '5px'}}>
					<Col>
					{categoryIcon ? (
						<Avatar alt={categoryIcon.name} style={{ outline: 0, backgroundColor: colorIcon, width: '40px', height: '40px', margin: '0 auto' }}>
							<svg className='svg-icon'>{categoryIcon.svg}</svg>
						</Avatar>
					) : (
						<Avatar alt={el.name} style={{ outline: 0, backgroundColor: colorIcon, width: '40px', height: '40px', margin: '0 auto' }}>
							<div style={{borderRadius: '15px'}}>{el.name.substr(0,1).toUpperCase()}</div>
						</Avatar>
					)}
					</Col>
					<p style={{ marginBottom: 0, textAlign: 'center' }}>{el.name.charAt(0).toUpperCase() + el.name.slice(1)}</p>
					
				</div>
			);
		})
/*
		list.map(el => {
			const { name, svg, color } = el;

			let colorIcon = '';
			if (selected === name) {
				colorIcon = color;
			}

			return (
				<div text={name} key={name} selected={selected} style={{ margin: '5px', marginTop: '50px' }}>
					<Avatar alt={name} style={{ outline: 0, backgroundColor: colorIcon, width: '40px', height: '40px' }}>
						<svg className='svg-icon'>{svg}</svg>
					</Avatar>
				</div>
			);
		});
*/
	
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				height: '60px',
			}}>
			<ScrollMenu
				data={Menu(categories, icons, Selected)}
				arrowLeft={<div className={'arrow-prev'}>{'<'}</div>}
				arrowRight={<div className={'arrow-next'}>{'>'}</div>}
				selected={Selected}
				onSelect={onSelect}
				alignCenter={false}
				hideSingleArrow={true}
				hideArrows={true}
				itemsCount={categories.length}
				scrollToSelected={false}
				wheel={false}
			/>
		</div>
	);
}
