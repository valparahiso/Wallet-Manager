import React, { useState } from 'react';
import { Toast, Col } from 'react-bootstrap';

function TutorialLine(props) {
    const [show, setShow] = useState(true);

    const toggleShow = () => setShow(!show);
    
    return (
        <Toast show={show} onClose={toggleShow}>
            <Toast.Header>
                <Col xs={11}>
                    {props.title || ''}
                </Col>
            </Toast.Header>
            {props.body && (
                <Toast.Body>{props.body}</Toast.Body>
            )}
        </Toast>
    );
}

export {TutorialLine};