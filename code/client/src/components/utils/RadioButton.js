/**
 * This function represent a radio button.
 * @param {*} props:
 * 		- props.value: is the value of the checkbox (ex. 'A')
 * 		- props.checked
 */
export default function RadioButton(props) {

	return (
		<div
			className='inputGroup'
			style={{
				clear: 'both',
				textAlign: 'center',
			}}>
			<input
				id={props.value}
				name={props.value}
				value={props.value}
				checked={props.checked}
				onChange={props.onChange}
				type='radio'
				style={{
					marginTop: '34px',
					position: 'absolute',
					left: '40%',
				}}
			/>
			<label
				className='radio-label'
				htmlFor={props.value}
				style={{ fontSize: '14px', marginTop: '0.5rem', marginBottom: '0.1rem ' }}>
				{props.icon ? <i className={props.icon} /> : ''} {props.value}
			</label>
		</div>
	);
}
