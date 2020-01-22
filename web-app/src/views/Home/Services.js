import React from 'react';

function Services() {
    return (
        <section class="section" id="services">
            <div class="container">
                <div class="row">
                    <div className="col-lg-4">
                        <div class="item service-item">
                            <div class="icon">
                                <i><img src="images/services/service-01.png" alt="" /></i>
                            </div>
                            <h5 class="service-title">Room accesses</h5>
                            <p>One of the main advantages of our application is the monitorization of room accesses <br />in real time.</p>  
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div class="item service-item">
                            <div class="icon">
                                <i><img src="images/services/service-02.png" alt="" /></i>
                            </div>
                            <h5 class="service-title">Employees permissions</h5>
                            <p>The administration and security teams can also manage every employee permissions, in order to restrict the access to some rooms.</p>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div class="item service-item">
                            <div class="icon">
                                <i><img src="images/services/service-03.png" alt="" /></i>
                            </div>
                            <h5 class="service-title">Unauthorized accesses</h5>
                            <p>When a suspicious or unauthorized access is detected by our application, an alert is sent to someone of the administration team.</p>
                            </div>
                        </div>
                </div>
            </div>
        </section>
    );
}

export default Services;