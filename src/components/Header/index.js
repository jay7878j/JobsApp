import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const websiteLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

  //   On Logout Click
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  //   Small Devices Navbar Container
  const getSmNavbarContainer = () => (
    <div className="sm-navbar-container">
      <Link to="/">
        <img className="navbar-logo" src={websiteLogo} alt="website logo" />
      </Link>
      <ul className="nav-links-icon-container">
        <li className="nav-link-item">
          <Link to="/">
            <AiFillHome className="nav-link-icon" />
          </Link>
        </li>
        <li className="nav-link-item">
          <Link to="/jobs">
            <BsFillBriefcaseFill className="nav-link-icon" />
          </Link>
        </li>
        <li className="nav-link-item">
          <FiLogOut className="nav-link-icon" onClick={onLogout} />
        </li>
      </ul>
    </div>
  )

  //   Medium Device Navbar Container
  const getMdNavbarContainer = () => (
    <div className="md-navbar-container">
      <Link to="/">
        <img className="navbar-logo" src={websiteLogo} alt="website logo" />
      </Link>
      <ul className="nav-link-items-container">
        <li className="nav-link-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-link-item">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </div>
  )

  return (
    <nav className="navbar-main-container">
      {getSmNavbarContainer()}
      {getMdNavbarContainer()}
    </nav>
  )
}

export default withRouter(Header)
