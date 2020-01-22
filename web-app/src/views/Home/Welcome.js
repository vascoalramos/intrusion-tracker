import React from 'react';

function Welcome() {
    return (
        <div className="welcome-area" id="welcome">
            <div className="header-text">
                <div className="container">
                    <div className="row">
                        <div className="left-text col-lg-6 col-md-4 col-sm-12 col-xs-12" data-scroll-reveal="enter left move 30px over 0.6s after 0.4s">
                            <h1> Secure your company with <strong>Intrusion Tracker</strong></h1>
                            <p>Real time room access, management of permissions, intrusion alerts and <strong>much more!</strong></p>
                            <a href="#about" class="main-button-slider">Find Out More</a>
                        </div>
                        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter right move 30px over 0.6s after 0.4s">
                            <img src="images/white-intrusion-tracker-logo.png" class="rounded img-fluid d-block mx-auto" alt="First Vector Graphic" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome;