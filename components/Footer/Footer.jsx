import React from 'react'

const Footer = () => {
  return (
    <footer id="footer" className="footer-light-style clearfix navbar-dark bg-dark" >
    <div className="themesflat-container">
      <div className="row">
        <div className="col-lg-3 col-md-12 col-12">
          <div className="widget widget-logo">
            {/* <div className="logo-footer" id="logo-footer">
                                <Link to="/">
                                    <img className='logo-dark' id="logo_footer" src={logodark} alt="nft-gaming" />
                                    <img className='logo-light' id="logo_footer" src={logofooter} alt="nft-gaming" />
                                    
                                </Link>
                            </div> */}
            {/* <p className="sub-widget-logo">Lorem ipsum dolor sit amet,consectetur adipisicing elit. Quis non, fugit totam vel laboriosam vitae.</p> */}
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-12 text-center" style={{height:"80px",textAlign:"center"}}>
          
          <div className="text-center">
            <h5 className="title-widget mt-4" style={{color:"white"}}>
              2022 PhoenixDev,All Rights Reserved.
            </h5>
          </div>
        </div>
        {/* <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                        <div className="widget widget-menu style-1">
                            <h5 className="title-widget">My Account</h5>
                            <ul>
                                {
                                    accountList.map((item,index) =>(
                                        <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-7 col-7">
                        <div className="widget widget-menu style-2">
                            <h5 className="title-widget">Resources</h5>
                            <ul>
                                {
                                    resourcesList.map((item,index) =>(
                                        <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 col-sm-5 col-5">
                        <div className="widget widget-menu fl-st-3">
                            <h5 className="title-widget">Company</h5>
                            <ul>
                                {
                                    companyList.map((item,index) =>(
                                        <li key={index}><Link to={item.link}>{item.title}</Link></li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-7 col-12">
                        <div className="widget widget-subcribe">
                            <h5 className="title-widget">Subscribe Us</h5>
                            <div className="form-subcribe">
                                <form id="subscribe-form" action="#" method="GET" acceptCharset="utf-8" className="form-submit">
                                    <input name="email"  className="email" type="email" placeholder="info@yourgmail.com" required />
                                    <button id="submit" name="submit" type="submit"><i className="icon-fl-send"></i></button>
                                </form>
                            </div>
                            <div className="widget-social style-1 mg-t32">
                                <ul>
                                    {
                                        socialList.map((item,index) =>(
                                            <li key={index}><Link to={item.link}><i className={item.icon}></i></Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div> */}
      </div>
    </div>
  </footer>
  )
}

export default Footer