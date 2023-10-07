import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="main-container">
    <Header />
    <div className="home-content-container">
      <h1 className="website-main-heading">Find The Job That Fits Your Life</h1>
      <p className="website-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button" className="find-jobs-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
