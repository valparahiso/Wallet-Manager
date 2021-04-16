import React, { useEffect, useState } from 'react';

const Slice = props => {
	const [path, setPath] = useState('');
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	const [labelVisible, setLabelVisible] = useState(false);

	let timeout = 0;

	const draw = s => {
		var path1 = [],
			a,
			b,
			c,
			step = 0;

		step = props.angle / (37.5 / 2);

		if (s + step > props.angle) {
			s = props.angle;
		}

		// Get angle points
		a = getAnglePoint(props.startAngle, props.startAngle + s, props.radius, props.radius, props.radius);

		b = getAnglePoint(props.startAngle, props.startAngle + s, props.radius - props.hole, props.radius, props.radius);

		path1.push('M' + a.x1 + ',' + a.y1);
		path1.push('A' + props.radius + ',' + props.radius + ' 0 ' + (s > 180 ? 1 : 0) + ',1 ' + a.x2 + ',' + a.y2);
		path1.push('L' + b.x2 + ',' + b.y2);
		path1.push(
			'A' +
				(props.radius - props.hole) +
				',' +
				(props.radius - props.hole) +
				' 0 ' +
				(s > 180 ? 1 : 0) +
				',0 ' +
				b.x1 +
				',' +
				b.y1
		);

		// Close
		path1.push('Z');

		setPath(path1.join(' '));

		if (s < props.angle) {
			setLabelVisible(false);
			setX(0);
			setY(0);

			timeout = setTimeout(() => {
				draw(s + step);
			}, 16);
		} else if (props.showLabel) {
			c = getAnglePoint(
				props.startAngle,
				props.startAngle + props.angle / 2,
				props.radius / 2 + props.trueHole / 2,
				props.radius,
				props.radius
			);

			c.x2 && setX(c.x2 - 5);
			c.y2 && setY(c.y2 + 5);

			setLabelVisible(true);
		}
	};

	useEffect(() => {
		setPath('');
		draw(0);
		return () => {
			clearTimeout(timeout);
		};
	}, [props.angle, timeout]);

	return (
		<g overflow='hidden'>
			<path d={path} fill={props.fill} stroke={props.stroke} strokeWidth={props.strokeWidth ? props.strokeWidth : 3} />

			{labelVisible && props.showLabel && props.percentValue > 7 && !props.emptystate && (
				<>
					<text
						x={x}
						y={y}
						fill='#000'
						textAnchor='middle'>
						{props.percent ? props.percentValue + ' %' : props.value}
					</text>
					<text
						x={x}
						y={y - 20}
						fill='#000'
						textAnchor='middle'>
						{props.name === ''
							? 'Other'
							: props.name.length > 10
							? props.name.substring(0, 9).concat('...')
							: props.name}
					</text>
				</>
			)}
		</g>
	);
};

function getAnglePoint(startAngle, endAngle, radius, x, y) {
	var x1, y1, x2, y2;

	x1 = x + radius * Math.cos((Math.PI * startAngle) / 180);
	y1 = y + radius * Math.sin((Math.PI * startAngle) / 180);

	x2 = x + radius * Math.cos((Math.PI * endAngle) / 180);
	y2 = y + radius * Math.sin((Math.PI * endAngle) / 180);

	if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
		x1 = 0;
		y1 = 0;
		x2 = 0;
		y2 = 0;
	}

	return { x1, y1, x2, y2 };
}

export default Slice;
