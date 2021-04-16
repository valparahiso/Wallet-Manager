import { Avatar, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { VectorIcon } from '../images/CategoryIcon';

/**
 * This function represent a category chip.
 * @param {*} props:
 * 		- props.name: name of the category to visualize
 * 		- props.icon: name of the icon; from that I extract all the information of the icon
 */
function CategoryChip(props) {
	const [icon, setIcon] = useState({ svg: '', name: '', color: '' });

	useEffect(() => {
		//Search the icon and the color associated with that category name.
		const iconObj = VectorIcon.filter(element => element.name === props.icon);

		if (iconObj.length !== 0) {
			setIcon({ svg: iconObj[0].svg, name: iconObj[0].name, color: iconObj[0].color });
		} else {
			//If we don't have an icon we want to display the first letter of category name
			setIcon({ svg: '', name: props.name.charAt(0), color: props.icon });
		}
	}, [props.icon, props.name]);

	const useStyles = makeStyles({
		root: {
			margin: '10px',
			outline: '0',
			'& svg': {
				color: `black !important`,
			},
		},
	});

	const classes = useStyles();

	return (
		<div
			style={{
				justifyContent: 'left',
				color: 'black',
				display: 'flex',
				borderRadius: '10px',
				width: '110px',
				backgroundColor: icon.color,
			}}>
			<Avatar style={{ backgroundColor: icon.color, width: '22px', height: '22px' }}>
				{icon.svg === '' ? (
					<span style={{ fontSize: '14px', color: 'black' }}>{props.name.toUpperCase().charAt(0)}</span>
				) : (
					<svg className={classes.root} style={{ margin: '5px' }}>
						{icon.svg}
					</svg>
				)}
			</Avatar>
			<p
				style={{
					fontSize: '13px',
					paddingRight: '5px',
					paddingTop: '2px',
					margin: 0,
					width: '88px',
					textAlign: 'center',
				}}>
				{props.name.length > 10 ? props.name.substring(0, 9).concat('...') : props.name}
			</p>
		</div>
	);
}

export default CategoryChip;
