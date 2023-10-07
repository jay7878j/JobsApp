import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const websiteLogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'

class LoginRoute extends Component {
  state = {
    username: 'rahul',
    password: 'rahul@2021',
    isLoginFailed: false,
    errorMsg: '',
    showPassword: false,
  }

  //   On Successful Login
  onSuccessfulLogin = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 2})
    history.replace('/')
  }

  //   On Login Failure
  onFailureLogin = errorMsg => {
    this.setState({
      isLoginFailed: true,
      errorMsg,
    })
  }

  //   On Form Submit
  onFromSubmit = async event => {
    const {username, password} = this.state

    event.preventDefault()
    const loginApi = 'https://apis.ccbp.in/login'
    const loginDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(loginDetails),
    }
    const response = await fetch(loginApi, options)
    const data = await response.json()
    // console.log(data)

    if (response.ok) {
      this.onSuccessfulLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  //   Username Input Field
  usernameContainer = () => {
    const {username} = this.state
    // console.log(username)

    const onUsernameChange = event => {
      this.setState({username: event.target.value})
    }

    return (
      <div className="input-container">
        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          type="text"
          className="input-box"
          placeholder="Username"
          value={username}
          id="username"
          onChange={onUsernameChange}
          required
        />
      </div>
    )
  }

  //   Password Input Field
  passwordContainer = () => {
    const {password, showPassword} = this.state
    const inputType = showPassword ? 'text' : 'password'

    const onPasswordChange = event => {
      this.setState({password: event.target.value})
    }

    return (
      <div className="input-container">
        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          type={inputType}
          className="input-box"
          placeholder="Password"
          value={password}
          id="password"
          onChange={onPasswordChange}
          required
        />
      </div>
    )
  }

  //   Show Password Container
  showPasswordContainer = () => {
    const {showPassword} = this.state

    const onCheckboxClick = event => {
      this.setState({
        showPassword: event.target.checked,
      })
    }

    return (
      <div className="show-password-container">
        <input
          type="checkbox"
          id="checkbox"
          className="checkbox"
          onClick={onCheckboxClick}
          defaultChecked={showPassword}
        />
        <label htmlFor="checkbox" className="label">
          Show Password
        </label>
      </div>
    )
  }

  //   Login Route Rendering
  render() {
    const {isLoginFailed, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-app-container">
        <div className="login-card">
          <img className="website-logo" src={websiteLogo} alt="website logo" />
          <form className="form-container" onSubmit={this.onFromSubmit}>
            {this.usernameContainer()}
            {this.passwordContainer()}
            {this.showPasswordContainer()}
            <div className="login-btn-container">
              <button type="submit" className="login-btn">
                Login
              </button>
              {isLoginFailed && <p className="error">{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
