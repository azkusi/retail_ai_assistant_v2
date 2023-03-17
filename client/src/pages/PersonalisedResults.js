import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindow";

function PersonalisedResults(props){
    
    const navigate = useNavigate()
    const personalised_product_results = props.results
    const width = useWindowSize().width
    const height = useWindowSize().height



    return(
        <div>
            <br/>
            <h1>Personalised Results</h1>

            <div style={{"width": "100%", "margin": "auto"}}>
                {(  (personalised_product_results !== undefined) && (personalised_product_results !== null) ) ?
                    <div>
                        <div>
                            <h2>Your Chosen Style</h2>
                            <Row xl={4}lg={4} md={3} sm={3} xs={2}>                                
                                <Col key={"your_choice"}>
                                    <img alt={"your_choice"} src={props.your_choice.src} style={{"maxHeight": 0.3*height, "margin": "auto", "maxWidth": 0.8*width, "padding": "10px"}}/>
                                </Col>
                            </Row>                        
                        </div>
                        <br/>
                        <Container style={{"width": 0.8*width, "margin": "auto"}}>
                            <h2>Our Best Choices For You</h2>
                            <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                                {personalised_product_results.map((item, index)=>{
                                return(
                                    index === 0 ?
                                    null :
                                    <Col key={index}>
                                    <img alt={index} src={item.document.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                                    </Col>
                                )
                                })}
                            </Row>
                        </Container>
                    </div>
                    :
                    <h3>No products found yet matching this style...</h3>
                
                }
                
                

            </div>

        </div>
    )
}

export default PersonalisedResults