import React, { useState } from 'react';

//This library implements the horizontal scroll for the list of icons
import ScrollMenu from 'react-horizontal-scrolling-menu';

//This is the Avatar for the single icon
import { Avatar } from '@material-ui/core';

//This is the list of svg icons
import { VectorIcon as list } from '../../images/CategoryIcon';

export default function IconChooser(props) {
	//This state represents the name of the icon choose by the user
	const [Selected, setSelected] = useState(props.iconName ? props.iconName : '');

	const onSelect = key => {
		//If the user select an icon already selected means that wants to un-select
		if (key === Selected) key = '';

		setSelected(key);
		props.handleIcon(key);
	};

	const Menu = (list, selected) =>
		list.map((el, index) => {
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

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				height: '60px',
			}}>
			<ScrollMenu
				data={Menu(list, Selected)}
				arrowLeft={<div className={'arrow-prev'}>{'<'}</div>}
				arrowRight={<div className={'arrow-next'}>{'>'}</div>}
				selected={Selected}
				onSelect={onSelect}
				alignCenter={false}
				hideSingleArrow={true}
				hideArrows={true}
				itemsCount={list.length}
				scrollToSelected={false}
				wheel={false}
				//translate={-40 * index_selected}
				scrollToSelected={true}
			/>
		</div>
	);
}
