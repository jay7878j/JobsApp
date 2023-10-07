import './index.css'

const notFoundImg =
  'https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png'

const NotFound = () => (
  <div className="main-app-container">
    <div className="not-found-container">
      <img className="not-found-img" src={notFoundImg} alt="not found" />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-info">
        We are sorry, the page you requested could not be found
      </p>
    </div>
  </div>
)

export default NotFound
