import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";
import firebase from "firebase/compat";
import { auth } from "../config";


function Account() {

    const [delete_account_button_hovered, set_delete_account_button_hovered] = useState(false)
    const [cancel_button_hovered, set_cancel_button_hovered] = useState(false)


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleSubmit = () => {
        const user = auth.currentUser;
        auth.getUserByEmail(user.email)
        .then((user) => {
            // User found, delete user account
            auth.deleteUser(user.uid)
            .then(() => {
                console.log("User account deleted successfully");
            })
            .catch((error) => {
                console.error("Error deleting user account:", error);
            });
        })
  .catch((error) => {
    console.error("Error fetching user:", error);
  });

    }

    return (
        <div>
            <h1>Account Page</h1>

            <button
                style={{
                    border: 'none',
                    backgroundColor: delete_account_button_hovered ? 'white' : '#1a3c6c',
                    color: delete_account_button_hovered ? '#1a3c6c' : 'white',
                    padding: '10px 20px',
                    borderRadius: '0',
                    cursor: 'pointer',
                    width: '100%',
                }}
                onMouseEnter={() => set_delete_account_button_hovered(true)}
                onMouseLeave={() => set_delete_account_button_hovered(false)}
                
                onClick={handleSubmit}
            >
            Delete Account
            </button>

            <Modal>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete your account?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Delete Account
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>
    );
}
export default Account;