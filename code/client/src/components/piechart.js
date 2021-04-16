import React, { useState, useEffect } from 'react';
import Slice from './slice';

export default function Piechart(props) {
	const [TotalExpense, setTotalExpense] = useState(0);

	var StartAngle = 0;

	const [General, setGeneral] = useState({
		//colorsLength: Colors.length,
		labels: true,
		hole: 50,
		radius: props?.radius ? props?.radius : 150,
		percent: true,
		strokeWidth: 3,
		stroke: '#fff',
	});

	useEffect(() => {
		//console.log('USE EFFECT piechart');

		let sum = props.data.reduce(function (carry, current) {
			// carry is the accumulator, current is the current value
			return carry + current.num;
		}, 0);
		setTotalExpense(sum);
	}, [props.data]);

	return (
		<div>
			<svg
				width={General.radius * 2}
				height={General.radius * 2}
				viewBox={'0 0 ' + General.radius * 2 + ' ' + General.radius * 2}
				xmlns='http://www.w3.org/2000/svg'
				version='1.1'>
				{props.data.map(function (slice, sliceIndex) {
					var nextAngle = StartAngle;
					var angle = (slice.num / TotalExpense) * 359.99;
					var percent = (slice.num / TotalExpense) * 100;

					StartAngle += angle;

					return (
						<Slice
							key={sliceIndex}
							value={slice.num}
							name={slice.name}
							percent={true}
							percentValue={props?.radius ? '' : percent.toFixed(1)}
							startAngle={nextAngle}
							angle={angle}
							radius={General.radius}
							hole={General.radius - General.hole}
							trueHole={General.hole}
							showLabel={General.labels}
							fill={slice.color} //Colors[sliceIndex % General.colorsLength]
							stroke={General.stroke}
							strokeWidth={General.strokeWidth}
							emptystate={props?.emptystate ?? false}
						/>
					);
				})}
			</svg>
		</div>
	);
}
