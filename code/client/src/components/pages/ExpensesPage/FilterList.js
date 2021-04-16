import { React, useEffect, useState } from 'react';

import ScrollMenu from 'react-horizontal-scrolling-menu';
import Chip from '@material-ui/core/Chip';
import '../../../App.css';
import { Avatar } from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PaymentIcon from '@material-ui/icons/Payment';
import DateRangeIcon from '@material-ui/icons/DateRange';
import MoneyIcon from '@material-ui/icons/Money';
import { VectorIcon } from '../../../images/CategoryIcon';

export default function FilterList(props) {
	const [data, setData] = useState([]);

	useEffect(() => {
		let dataArray = [];
		let id = 0;

		if (
			props.expensesPeriod?.period === 'all' &&
			props.customPeriod?.initialDate !== '' &&
			props.customPeriod?.finalDate !== ''
		) {
			let icon = (
				<Avatar style={{ width: '33px', height: '33px', color: 'black' }}>
					<DateRangeIcon />
				</Avatar>
			);
			let name = props.formatPeriod();
			dataArray.push({
				id: id++,
				type: 'Period',
				name: name,
				icon: icon,
				color: 'rgb(191, 191, 191)',
			});
		} else {
			dataArray = dataArray.filter(el => el.type !== 'Period');
		}

		if (props.filterList?.paymentMethod !== 'All') {
			let icon;
			if (props.filterList.paymentMethod === 'Cash') {
				icon = (
					<Avatar style={{ width: '33px', height: '33px', color: 'black' }}>
						<MoneyIcon />
					</Avatar>
				);
			} else {
				icon = (
					<Avatar style={{ width: '33px', height: '33px', color: 'black' }}>
						<PaymentIcon />
					</Avatar>
				);
			}
			dataArray.push({
				id: id++,
				type: 'PaymentMethod',
				name: props.filterList.paymentMethod,
				icon: icon,
				color: 'rgb(191, 191, 191)',
			});
		}

		if (props.filterList?.price) {
			let price;

			if (props.filterList.price?.min && props.filterList.price?.max) {
				price = `€ ${props.filterList?.price?.min} - ${props.filterList?.price?.max}`;
			} else if (props.filterList.price?.min) {
				price = `Up to € ${props.filterList.price?.min}`;
			} else if (props.filterList.price?.max) {
				price = `Less than € ${props.filterList.price?.max}`;
			}
			price &&
				dataArray.push({
					id: id++,
					type: 'Price',
					name: price,
					color: 'rgb(191, 191, 191)',
					icon: (
						<Avatar style={{ width: '33px', height: '33px', color: 'black' }}>
							<MonetizationOnIcon />
						</Avatar>
					),
				});
		}

		if (props?.filterList?.categories.length > 0) {
			props.filterList?.categories.forEach(el => {
				let color;
				let svg;
				//Search the icon and the color associated with that category name.
				const iconObj = VectorIcon.filter(element => element.name === el.icon);

				if (iconObj.length !== 0) {
					svg = iconObj[0].svg;
					color = iconObj[0].color;
				} else {
					//If we don't have an icon we want to display the first letter of category name
					svg = '';
					color = el.icon;
				}

				let icon;
				if (svg === '') icon = el.name.charAt(0);
				else icon = <svg className='svg-icon1'>{svg}</svg>;

				dataArray.push({
					id: id++,
					type: 'Category',
					name: el.name,
					svg: svg,
					color: color,
					icon: <Avatar style={{ width: '33px', height: '33px', color: 'black' }}>{icon}</Avatar>,
				});
			});
		}

		setData(dataArray);
	}, [props]);

	const Filters = list =>
		list.map(el => {
			return (
				<div key={el.id} className='p-2'>
					<Chip
						label={el.name}
						avatar={el.icon}
						className='chip'
						onDelete={() => props.deleteFilter(el)}
						style={{ backgroundColor: el.color, color: 'black' }}
					/>
				</div>
			);
		});

	return (
		<div className='page_section  ' style={{ height: '50px', marginBottom: 0, padding: 0 }}>
			<div className='d-flex'>
				<div className='container' style={{ paddingLeft: '0px', paddingRight: '0px' }}>
					<div className='row' style={{ paddingLeft: '0px', paddingRight: '0px' }}>
						<div className='col-12 filter' style={{ paddingLeft: '0px', paddingRight: '0px', width: '100%' }}>
							<ScrollMenu
								data={Filters(data)}
								alignCenter={false}
								hideSingleArrow={true}
								hideArrows={true}
								itemsCount={data.length}
								scrollToSelected={false}
								wheel={false}
								wrapperStyle={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
