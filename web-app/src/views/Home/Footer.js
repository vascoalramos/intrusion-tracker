import React from 'react';

function Footer() {
    return (
        <footer>
            <div class="container">
                <div class="row">
                    <div class="col-lg-7 col-md-12 col-sm-12">
                        <p class="copyright"><strong>Copyright &copy; 2019</strong>  IES Intrusion Tracker</p>
                    
                    {/*. Design: <a rel="nofollow" href="https://templatemo.com">TemplateMo</a></p>*/}
                    </div>
                    <div class="col-lg-5 col-md-12 col-sm-12">
                        <ul class="social">
                            <li><a href="mailto:tiagocmendes@ua.pt"><i class="fa fa-envelope"></i></a></li>
                            <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                            <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;