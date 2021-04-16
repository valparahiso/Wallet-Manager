// Essentials
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

class MicError{
    constructor(message){
        this.message = message;
    }
}

function MicrophoneSection(props) {
    const [recording, setRecording] = useState(false);
    let audio = new Audio('/sounds/mic_sound.mp3');

    const { transcript, resetTranscript, listening } = useSpeechRecognition();

    const handleRecording = () => {
        if(!recording) {
            audio.play();
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
            props.handleMicError(false);
            setRecording(true);
        } else {
            if(transcript.length !== 0)
                props.updateFieldByMic('all', transcript);
            SpeechRecognition.stopListening();
            setRecording(false);
        }
    }

    return(
        <Row style={{display: 'flex', alignItems: 'center', height: '85px'}}>
            <Col xs={10}>
                {(transcript && !props.micError) && 
                    <div className={"mic-text" + (props.micError ? " error" : "")}>
                        {!SpeechRecognition.browserSupportsSpeechRecognition() ? (
                            <p>Microphone non supported</p>
                        ) : (
                            <p>{transcript}</p>
                        )}
                    </div>}
                {(!transcript && !recording && !props.micError) && 
                    <div className={"mic-text" + (props.micError ? " error" : "")}>
                    {!SpeechRecognition.browserSupportsSpeechRecognition() ? (
                        <p>Microphone non supported</p>
                    ) : (
                        <p>
                            <span style={{fontWeight: 'bold'}}>
                                {"Tap "}
                            </span>
                            mic icon to
                            <span style={{fontWeight: 'bold'}}>
                                {" start "}
                            </span>
                            recording and fill expense fields. 
                            <br/>
                            <span style={{fontWeight: 'bold'}}>
                                {" Tap "}
                            </span>
                            again to 
                            <span style={{fontWeight: 'bold'}}>
                                {" stop "}
                            </span>
                            it
                        </p>
                    )}
                    </div>
                }
                {(!transcript && recording && !props.micError) && 
                    <div className={"mic-text" + (props.micError ? " error" : "")}>
                    {!SpeechRecognition.browserSupportsSpeechRecognition() ? (
                        <p>Microphone non supported</p>
                    ) : (
                        <p>
                            Ex:
                            <span style={{fontWeight: 'bold'}}>
                                {" amount "}
                            </span>
                            50 euros
                            <span style={{fontWeight: 'bold'}}>
                                {" category "}
                            </span>
                            food
                        </p>
                    )}
                    </div>
                }
                {(props.micError) && 
                    <div className={"mic-text" + (props.micError ? " error" : "")}>
                        {!SpeechRecognition.browserSupportsSpeechRecognition() ? (
                            <p>Microphone non supported</p>
                        ) : (
                            <p>{props.micErrorSuggestion}</p>
                        )}
                    </div>}
            </Col>
            {!SpeechRecognition.browserSupportsSpeechRecognition() ? (
                <Col xs={2}>
                    <i className="fas fa-microphone-slash fa-2x"></i>
                </Col>
            ) : (
                <Col xs={2} style={{paddingLeft: '1px'}}
                    onClick={() => handleRecording()}>
                    <i className={'fas fa-microphone fa-lg'} 
                        style={ listening ? 
                            { color: 'rgba(251, 100, 100, 1.0)', borderRadius: '60px', width: '50px', 
                                boxShadow: 'rgb(251, 100, 100, 1.0) 0px 0px 5px', padding: '15px 0px', background: 'rgba(0, 0, 0, 0.03)'} : 
                            { borderRadius: '60px', width: '50px', boxShadow: 'rgb(136 136 136) 0px 0px 5px',
                                padding: '15px 0px', background: 'rgba(0, 0, 0, 0.03)'}}/>
                </Col>
            )}
        </Row>
    )
}


export {MicrophoneSection, MicError};