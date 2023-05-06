import {React, useState} from "react";
import { Form, Button, Row, Col, Container, Modal, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import useWindowSize from "../hooks/useWindow";


function ImageSearch(props){
  const [file, set_file] = useState(null)
  const [search_results, set_search_results] = useState(null)
  const [spinner, set_spinner] = useState(false)
  const [user_request, set_user_request] = useState(null)
  const [preview, set_preview] = useState(false)
  const [preview_item, set_preview_item] = useState(null)


  const width = useWindowSize().width
  const height = useWindowSize().height

    function sendUserRequest(upload){
      props.showHomeCallback(false)
        set_spinner(true)
        const data = upload.u_request
        var url = "https://europe-west2-clip-embeddings.cloudfunctions.net/searchUsingImage-HomePage"
        // data_to_send = {"image": request.u_request, "collection": "mens_t_shirts"}
        var formData = new FormData();
        formData.append("image", data);
        // formData.append("collection", "mens_t_shirts");
        var data_to_send = formData
        console.log("Form Data values: ", JSON.stringify(formData.values()))

        var content_type = "multipart/form-data"
        const file_uploaded = new File([data], "test.jpg")
        set_user_request(URL.createObjectURL(file_uploaded))
        return new Promise(async (resolve, reject)=>{
            try{
              console.log(data_to_send, content_type)
              axios.post(url, data_to_send, {
                headers: {
                  'Content-Type': content_type
                }
              }).then((result)=>{
                console.log("search results: ", result)
                const product_results = result.data.results[0].hits
                console.log("search results are: ", JSON.stringify(product_results))
                resolve(product_results)
              }, (err)=>{
                console.log("second_error was:", err)
                resolve("SERVER_ERROR")
              })
            }
            catch(error){
              console.log("second_error was:", error)
              resolve("SERVER_ERROR")
            }
          }).then((search_result)=>{
            //search for similar products
            if(search_result !== "SERVER_ERROR"){
                
              set_search_results(search_result)
              // set_your_choice(product_select_data[selected_products[0]])
              set_spinner(false)
              return {
                "products": search_result,
                "status": "CHANGED"
              }
              
            } 
            else{
              set_search_results("NO RESULTS FOR THIS SEARCH")
              console.log("there was an issue with your search")
              //navigate('/')
              window.alert("There was an issue with your search")
            }    
        })          
    }




    return(
      <div>
        
          {search_results ? 
            <div>
              <Button 
                  style={{"margin": "5px", "position": "fixed", "top": "2%", "left": "2%"}} 
                  onClick={()=>{props.backCallback("Text")}}
              >
                  Back
              </Button>

              {search_results === "NO RESULTS FOR THIS SEARCH" ?
                <div>
                  <h1>Sorry, we couldn't find any results for your search</h1>
                </div>
                :
                <Container style={{"width": 0.8*width, "margin": "auto", "position": "fixed", "top": "10%"}}>
                  <Row xl={1}lg={1} md={1} sm={1} xs={1}>
                    <Col>
                    <h5>Your request:</h5>
                      <img alt={"user_request"} src={user_request} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                    </Col>
                  </Row>
                  <br/>

                  <h5>Results:</h5>
                  <Row xl={4}lg={4} md={3} sm={3} xs={2}>
                    {search_results.map((item, index)=>{
                      return( 
                        <Col key={index}>
                          <Link 
                              onClick={()=>{set_preview(true)
                                  set_preview_item(item.document)
                              }} 
                              
                              to="#"
                              // to={item.document.retailer_url}
                          >
                              <img alt={index} src={item.document.src} style={{"maxHeight": 0.3*height, "maxWidth": 0.8*width, "padding": "10px"}}/>
                              <label>{item.document.description}</label>
                          </Link>                    
                        </Col>
                      )
                    })}
                  </Row>

                  {preview && <Modal show onHide={()=>{set_preview(false)}}>
                      <Modal.Header closeButton/>
                      <Modal.Body>
                          <img alt={preview_item.name} src={preview_item.src} style={{"maxHeight": 0.5*height, "maxWidth": 0.5*width, "padding": "10px"}}/>
                          <label>{preview_item.description}</label>
                      </Modal.Body>
                      <Modal.Footer>
                          {/* <Button variant="secondary" onClick={handleClose}>
                              Add to Saved
                          </Button> */}
                          <Button variant="primary" onClick={()=>{set_preview(false)}}>
                              View on Retailer's Site
                              {/* View on {item.document.retailer_name} */}
                          </Button>
                      </Modal.Footer>
                  </Modal>}
                  
                </Container>
              }
            </div>
          :
            !spinner ? 
              (<div className="input-group mb-3">
                <Form.Label>Upload an image of the item you're looking for and we'll find the item or the most similar equivalent for you</Form.Label>
                <input type="file" className="form-control" id="inputGroupFile02" 
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      set_file(e.target.files[0]);
                    }
                  }}
                />
                <label 
                  onClick={(event)=>{
                    if(file){
                      sendUserRequest({"u_request": file, "type": "file"})
                      }
                    else{
                      alert("Please upload an image")
                    } 
                  }}
                  className="input-group-text"
                >
                  Upload
                </label>
                
                {/* <div style={{"padding": "10px"}}>
                    <Form onSubmit={(e)=>{e.preventDefault()}}>
                    <Form.Group>
                        <Form.Control onChange={(e)=>{
                            set_file(e.target.files[0])
                            console.log(e.target.files)
                            console.log(e.target.files[0])
                            }} type='file'
                        >
                        </Form.Control>
                        <Button style={{"position": "fixed", "right": "10px", "marginRight": "10px"}} onClick={()=>{
                            if(file){
                            sendUserRequest({"u_request": file, "type": "file"})
                            }else{
                            alert("Please upload an image")
                            } 
                            // window.alert("This search feature is still being built")
                            
                            }}>Find It
                        </Button>
                    </Form.Group>
                    </Form>
                    
                </div> */}
            </div>)
            :
            <div style={{textAlign: "center"}}>
              <Spinner animation="border"/>
              <h5 >Loading your results</h5>
            </div>
            
          }
      </div>
        
    )
}

export default ImageSearch