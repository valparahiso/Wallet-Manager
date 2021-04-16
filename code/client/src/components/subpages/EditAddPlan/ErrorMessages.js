const wrongDate = (
    <p style={{
        color: 'rgb(251, 100, 100)', fontSize: '14px', fontWeight: 'bold',
        marginBottom: '5px', marginTop: '10px', marginLeft: '15px', marginRight: '15px'
        }}>
        You selected the end date before the start date
        <br />
        Change on of the two dates in order to save
    </p>);

function LowBudget(props) {
    return(
    <p style={{
            color: 'rgb(251, 100, 100)', fontSize: '14px', fontWeight: 'bold',
            marginBottom: '5px', marginTop: '10px', marginLeft: '15px', marginRight: '15px'
        }}>
        Total budget too low: you exceeded on € {props.budgetExceeded}
        <br />
        Increase the total budget or edit/delete some category budget in order to save the plan
    </p>);
}

export { wrongDate, LowBudget };