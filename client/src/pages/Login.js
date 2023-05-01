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

const Login = () => {
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

    const [login_button_hovered, set_login_button_hovered] = useState(false)
    const [cancel_button_hovered, set_cancel_button_hovered] = useState(false)

    const navigate = useNavigate()

    const [showSuccessfulSignUp, setShowSuccessfulSignUp] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((credentials)=>{
                db.collection("users").where("email", "==", emailRef.current.value).get()
                .then((querySnapshot)=>{
                    querySnapshot.forEach((doc)=>{
                        console.log("logging in")
                        const docID = doc.id
                        const categories = doc.data().categories
                        const already_seen = doc.data().already_seen
                        const retailers = doc.data().retailers
                        console.log("docID: ", docID)
                        navigate(`/`, {state: {user: docID, categories: categories, already_seen: already_seen, retailers: retailers}})
                    })
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
                    <h2 style={{ marginBottom: '40px', textAlign: 'center' }}>Log In</h2>
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
                                Incorrect email/password, please try again.
                            </Alert></Modal.Body>
                        
                        <Modal.Footer style={{borderTop: 'none' }}> 
                        <Button onClick={()=>{
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
                        </Button>
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
                                backgroundColor: login_button_hovered ? 'white' : '#1a3c6c',
                                color: login_button_hovered ? '#1a3c6c' : 'white',
                                padding: '10px 20px',
                                borderRadius: '0',
                                cursor: 'pointer',
                                width: '100%',
                            }}
                            onMouseEnter={() => set_login_button_hovered(true)}
                            onMouseLeave={() => set_login_button_hovered(false)}
                            
                            onClick={handleSubmit}
                        >
                        Log In
                        </button>
                        <Link to="/forgot-password">Forgot Password</Link>
                    </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default Login;
