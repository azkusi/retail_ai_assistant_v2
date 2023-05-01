import React, {useRef, useState} from "react";
import Header from "../components/Header";
import { Card, Form, Alert, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

function ForgotPassword() {

    const emailRef = useRef()
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [passwordType, setPasswordType] = useState('password')

    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const [show, setShow] = useState(false)
    const [cancel_button_hovered, set_cancel_button_hovered] = useState(false)
    
    const [reset_password_button_hovered, set_reset_password_button_hovered] = useState(false);

    

    const navigate = useNavigate()


    async function handleSubmit(e) {
        console.log("handleSubmit")
        setLoading(true)
        e.preventDefault()
    
        try {
            setMessage("")
            setError("")
            
            
            auth.sendPasswordResetEmail(emailRef.current.value)
                .then(() => {
                  // Password updated successfully
                    setMessage("Password successfully reset, please check your email for further instructions.")
                    setTimeout(()=>{
                        navigate("/")
                    }, 2000)
                })
                .catch((error) => {
                  // An error occurred
                  setLoading(false)
                  console.log(error);
                });
              
            
            
        }
        catch(error) {
            setError("Failed to reset password")
            console.log("error: ", error)
        }
    }



    return (
        <div >

        <div>
          <Header/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            {message && <Alert variant="success">{message}</Alert>}
            {!message && <Card style={{ width: '400px' }}>
                <Card.Body style={{ padding: '40px' }}>
                <h2 style={{ marginBottom: '40px', textAlign: 'center' }}>Forgot Password</h2>
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" ref={emailRef} required style={{ marginBottom: '20px' }} />
                    </Form.Group>

                    <button
                        style={{
                            border: 'none',
                            backgroundColor: reset_password_button_hovered ? 'white' : '#1a3c6c',
                            color: reset_password_button_hovered ? '#1a3c6c' : 'white',
                            padding: '10px 20px',
                            borderRadius: '0',
                            cursor: 'pointer',
                            width: '100%',
                        }}
                        onMouseEnter={() => set_reset_password_button_hovered(true)}
                        onMouseLeave={() => set_reset_password_button_hovered(false)}
                        
                        onClick={handleSubmit}
                    >
                    Reset Password
                    </button>
                </Form>
                </Card.Body>
            </Card>}

            

        </div>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>

      </div>
    );
}
export default ForgotPassword;