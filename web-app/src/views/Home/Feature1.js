import React from 'react';

function Feature1() {
    return (
        <section class="section" id="about">
            <div class="container">
                <div class="row">
                    <div class="col-lg-7 col-md-12 col-sm-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                        <img src="images/frameworks/secure.png" class="rounded img-fluid d-block mx-auto" alt="App" />
                    </div>
                    <div class="right-text col-lg-5 col-md-12 col-sm-12 mobile-top-fix">
                        <div class="left-heading">
                            <h5>Stay secure 24/7 with <strong>Intrusion Tracker!</strong></h5>
                        </div>
                        <div class="left-text">
                            <p style={{textAlign: "justify"}}>With our application, every company will be able to monitor room accesses in real time, manage employees permissions, alert unauthorized accesses and much more!</p>
                            <a href="#about2" class="main-button">Discover More</a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="hr"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Feature1;