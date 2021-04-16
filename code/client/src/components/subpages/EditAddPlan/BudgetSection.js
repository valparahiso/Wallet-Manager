// Essentials
import React from 'react';
import { Col, Form, InputGroup } from 'react-bootstrap';

// Components
import { TutorialLine } from '../../utils/Tutorial';

// CSS import
import '../../../App.css';

function BudgetSection(props) {
    // let budget = "€ " + (props.budget || "0");
    return (
        <div className={"page_section " + (props.exceeded ? 'danger' : '')}>
            <div className="section_title">Total Budget*</div>
            {props.tutorial && <TutorialLine title={'Now for this period choose a budget'}/>}
            <p style={{fontSize: '14px', textAlign: 'left', marginBottom: '5px'}}>According to the average of your past expense, we suggest you to set a total budget of at least <span style={{fontWeight: 'bold'}}>€ {props.suggestedBudget.toFixed(2)}</span> for this duration</p>
            <Col xs={6} style={{paddingTop: '8px'}}>
                <Form>
                    <Form.Group>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>€</InputGroup.Text>
                            </InputGroup.Prepend>
                        <Form.Control type="number" placeholder={"ex: 200"} value={props.budget || ""} inputMode="decimal" min="0.01" step="0.01"
                            onChange={(ev) => props.updateBudget(ev.target.value)} />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Col>
        </div>
    );
}

export default BudgetSection;