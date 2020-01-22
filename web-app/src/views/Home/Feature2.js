import React from 'react';

function Feature2() {
    return (
        <section class="section" id="about2">
            <div class="container">
                <div class="row">
                    <div class="left-text col-lg-5 col-md-12 col-sm-12 mobile-bottom-fix">
                        <div class="left-heading">
                            <h5>Modern application built with <strong>great technologies!</strong></h5>
                        </div>
                        <p>Some of the technologies used in our application architecture are:</p>
                        <ul>
                            <li>
                                <img src="images/frameworks/react.png" alt="" />
                                <div class="text">
                                    <h6>React and React Native</h6>
                                    <p>We used <a href="https://reactjs.org/">React</a> and <a href="https://facebook.github.io/react-native/">React Native</a> for the front-end of our app.</p>
                                </div>
                            </li>
                            <li>
                                <img src="images/frameworks/spring.png" alt="" />
                                <div class="text">
                                    <h6>Springboot Framework</h6>
                                    <p>To develop our REST API, we used the famous <a href="https://spring.io/projects/spring-boot">Springboot Framework!</a></p>
                                </div>
                            </li>
                            <li>
                                <img src="images/frameworks/raspberry.png" alt="" />
                                <div class="text">
                                    <h6>Raspberry Pi and Python</h6>
                                    <p>To generate data we develop <a href="https://www.python.org/">Python</a> scripts in <a href="http://www.json.org/">JSON</a> format, sended by a <a href="https://www.raspberrypi.org/">Raspberry Pi</a> server.</p>
                                </div>
                            </li>
                            <li>
                                <img src="images/frameworks/rabbit.png" alt="" />
                                <div class="text">
                                    <h6>Rabbit MQ</h6>
                                    <p>To consume data from the Raspberry Pi to our application, we used the famous message broker <a href="https://www.rabbitmq.com/">RabbitMQ.</a></p>
                                </div>
                            </li>
                            <li>
                                <img src="images/frameworks/mysql.png" alt="" />
                                <div class="text">
                                    <h6>MySQL</h6>
                                    <p>For our long-term storage, we used the relation SGBD <a href="https://www.mysql.com/">MySQL.</a></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="right-image col-lg-7 col-md-12 col-sm-12 mobile-bottom-fix-big" data-scroll-reveal="enter right move 30px over 0.6s after 0.4s">
                        <img src="images/frameworks/arch-diagram.png" class="rounded img-fluid d-block mx-auto" alt="App" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Feature2;