import React, { useState, useRef } from 'react';
import { Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindow';
// import { useAuth } from "../contexts-admin-site/AuthContext"
import { Link, useNavigate } from "react-router-dom"

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


// import "firebase/compat/firestore";
import { db } from '../config';
import {auth} from '../config';

const SignUp = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const siteNameRef = useRef()
    const serviceTitleRef = useRef()
    // const { signup } = useAuth()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [passwordType, setPasswordType] = useState('password')
    const {width, height} = useWindowSize();

    const [signup_button_hovered, set_signup_button_hovered] = useState(false)
    const [cancel_button_hovered, set_cancel_button_hovered] = useState(false)

    const navigate = useNavigate()

    const [showSuccessfulSignUp, setShowSuccessfulSignUp] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((credentials)=>{
                console.log("credentials: ", credentials)
                db.collection("users").add({
                    "email": emailRef.current.value,
                    "already_seen": [],
                    "categories": [],
                    "retailers": [],
                    "date_joined": firebase.firestore.FieldValue.serverTimestamp()
                }).then((docRef)=>{
                    const docID = docRef.id
                    console.log("docID: ", docID)
                    navigate('/', {state: {docID: docID}})
                })
            }, (error)=>{
                console.log("error during sign up: ", error)
                setError(error.message);
                setShow(true)
            })
            // User is signed up
        } catch (error) {
            console.log("error:", error)
            setError(error.message);
            setShow(true)
        }
    };

    return (
        <div>
            <div style={{marginTop: "20px"}}>
                <h1>TailorAI</h1>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                
                <Card style={{ width: '400px' }}>
                    <Card.Body style={{ padding: '40px' }}>
                    <h2 style={{ marginBottom: '40px', textAlign: 'center' }}>Sign Up</h2>
                    {error && 
                    <Modal 
                        show={show}
                        onHide={()=>{
                            setShow(false)
                            setError(null)
                        }}
                        centered={true}
                        size="lg"
                    >
                        <Modal.Header closeButton style={{ color: '#721c24', borderBottom: 'none' }}>Hold up...</Modal.Header>
                        <Modal.Body style={{ borderBottom: 'none' }}>
                            <Alert variant="danger">
                                {/* {error} */}
                                Please ensure your password is at least 6 characters long and matches the confirmation password.
                            </Alert></Modal.Body>
                        
                        <Modal.Footer style={{borderTop: 'none' }}> 
                        <button onClick={()=>{
                            setShow(false)
                            setError(null)
                            }}
                            style={{
                                border: 'none',
                                backgroundColor: cancel_button_hovered ? 'white' : '#1a3c6c',
                                color: cancel_button_hovered ? '#1a3c6c' : 'white',
                                padding: '10px 20px',
                                borderRadius: '0',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                            onMouseEnter={() => set_cancel_button_hovered(true)}
                            onMouseLeave={() => set_cancel_button_hovered(false)}
                        >
                            Close
                        </button>
                        </Modal.Footer>
                    </Modal>
                    }
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" ref={emailRef} required style={{ marginBottom: '20px' }} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={passwordType} placeholder="Password" ref={passwordRef} required style={{ marginBottom: '20px' }} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPasswordConfirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type={passwordType} placeholder="Confirm Password" ref={passwordConfirmRef} required style={{ marginBottom: '20px' }} />
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check style={{ marginBottom: '20px' }} type="checkbox" label="Show Password" onClick={()=>{
                                if(passwordType === 'password'){
                                    setPasswordType('text')
                                }else{
                                    setPasswordType('password')
                                }
                            }} />
                        </Form.Group>

                        <button
                            style={{
                                border: 'none',
                                backgroundColor: signup_button_hovered ? 'white' : '#1a3c6c',
                                color: signup_button_hovered ? '#1a3c6c' : 'white',
                                padding: '10px 20px',
                                borderRadius: '0',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                            onMouseEnter={() => set_signup_button_hovered(true)}
                            onMouseLeave={() => set_signup_button_hovered(false)}
                            
                            onClick={handleSubmit}
                        >
                        Sign Up
                        </button>
                    </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;
