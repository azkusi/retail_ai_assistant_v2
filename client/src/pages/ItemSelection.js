/* eslint-disable no-loop-func */
import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useWindowSize from "../hooks/useWindow";
import Dropdown from 'react-bootstrap/Dropdown';
import '../App.css';


function ItemSelection(props) {  

  return (
    
    <div className='center'>
        <Dropdown >
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Select an item you're looking for
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="/preference-selection/mens_tops">Men's T-Shirts and Tops</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/mens_shoes">Men's Shoes</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/womens_tops">Women's Tops</Dropdown.Item>
                <Dropdown.Item href="/preference-selection/womens_shoes">Women's Shoes</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>

            {/* <Button
              onClick={ async ()=>{
                let i = 0;
                for(i; i < 500; i++){
                  await sendProducts(i)
                }
              }}
            >
              Products To firebase
            </Button> */}
    </div>  
          
        
  );
}

export default ItemSelection;
