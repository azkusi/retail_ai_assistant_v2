import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import { auth, db } from "../config";




function Header() {
    const [user, set_user] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                set_user(user)
            } else {
                set_user(null)
            }
        })  
    }, [])

    return (
        <div
            style={{
                // display: 'flex', justifyContent: 'flex-end',
                // marginRight: '10px', marginTop: '10px' 
                position: 'absolute', top: '10px', right: '20px', display: 'flex', justifyContent: 'flex-end',
            }}
        >
            <div style={{ marginLeft: '10px' }}>
                <Link
                    style={{ textDecoration: 'none' }}
                    to="/"
                >
                    Home
                </Link>
            </div>
            
            {!user && 
            <div style={{ marginLeft: '10px' }}>
                <Link
                    style={{ textDecoration: 'none' }}
                    to="/signup"
                >
                    Sign Up
                </Link>
            </div>
            }

            {!user && 
            <div style={{ marginLeft: '10px' }}>
                <Link
                    style={{ textDecoration: 'none' }}
                    to="/login"
                >
                    Log In
                </Link>
            </div>
            }

            {user && 
            <div style={{ marginLeft: '10px' }}>
                <Link
                    style={{ textDecoration: 'none' }}
                    to="/account"
                >
                    Account
                </Link>
            </div>
            }

            {user && 
            <div style={{ marginLeft: '10px' }}>
                
                <Link
                    onClick={() => {
                        console.log("email: ", auth.currentUser.email)
                        db.collection("users").where("email", "==", auth.currentUser.email).get().then((querySnapshot) => {
                            console.log("found user")
                            querySnapshot.forEach((doc) => {
                                console.log("doc: ", doc.id)
                                const docID = doc.id
                                const already_seen = doc.data().already_seen

                                if(already_seen.length > 25 && already_seen.length <= 50){
                                    const new_already_seen = already_seen.slice(-1, -25)
                                    db.collection("users").doc(docID).update({
                                        "already_seen": new_already_seen
                                    }).then(() => {
                                        console.log("updated already_seen")
                                    })
                                }
                                else if(already_seen.length > 50 && already_seen.length <= 100){
                                    const new_already_seen = already_seen.slice(-1, -50)
                                    db.collection("users").doc(docID).update({
                                        "already_seen": new_already_seen
                                    }).then(() => {
                                        console.log("updated already_seen")
                                    })
                                }
                                else if(already_seen.length > 100){
                                    const new_already_seen = already_seen.slice(-1, -100)
                                    db.collection("users").doc(docID).update({
                                        "already_seen": new_already_seen
                                    }).then(() => {
                                        console.log("updated already_seen")
                                    })
                                }
                            })
                        }).then(()=>{
                            auth.signOut().then(() => {
                                console.log("signed out")
                            }).then(() => {
                                navigate(`/`)
                            })
                        })
                        
                    }}
                    style={{ textDecoration: 'none' }}
                    // to="/"
                >
                    Log Out
                </Link>
            </div>
            }

        </div>
    );
}

export default Header;