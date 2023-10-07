import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation2} from 'react-icons/im'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.jobDetailsData()
  }

  // Job Details Data
  jobDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jobDetailsApi = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobDetailsApi, options)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const formattedData = {
        jobData: {
          id: data.job_details.id,
          companyLogoUrl: data.job_details.company_logo_url,
          employmentType: data.job_details.employment_type,
          packagePerAnnum: data.job_details.package_per_annum,
          companyWebsiteUrl: data.job_details.company_website_url,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          rating: data.job_details.rating,
          skills: data.job_details.skills.map(each => ({
            imageUrl: each.image_url,
            name: each.name,
          })),
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(each => ({
          id: each.id,
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  //   Render Loading View
  renderLoadingView = () => (
    <div className="profile-render-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  // Jobs List Failure View
  renderFailureView = () => {
    const failureImg =
      'https://assets.ccbp.in/frontend/react-js/failure-img.png'

    const onRetryBtnClick = () => {
      this.jobDetailsData()
    }

    return (
      <div className="jobs-failure-container">
        <img
          className="jobs-data-failure-img"
          src={failureImg}
          alt="failure view"
        />
        <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
        <p className="failure-view-info">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          type="button"
          className="job-item-failure-retry-btn"
          onClick={onRetryBtnClick}
        >
          Retry
        </button>
      </div>
    )
  }

  similarJobsList = () => {
    const {jobDetails} = this.state
    const {similarJobs} = jobDetails

    return (
      <ul className="similar-jobs-list-container">
        {similarJobs.map(each => {
          const {
            id,
            companyLogoUrl,
            employmentType,
            jobDescription,
            location,
            rating,
            title,
          } = each

          return (
            <li key={id} className="similar-job-list-item">
              <Link to={`/jobs/${id}`}>
                <div className="job-position-container">
                  <img
                    className="company-logo"
                    src={companyLogoUrl}
                    alt="similar job company logo"
                  />
                  <div className="job-position">
                    <h1 className="job-tittle-heading">{title}</h1>
                    <p className="rating">
                      {<AiFillStar className="rating-icon" />}
                      {rating}
                    </p>
                  </div>
                </div>
                <h1 className="similar-job-description-heading">Description</h1>
                <p className="job-description">{jobDescription}</p>
                <div className="job-location-container">
                  <div className="location-and-employment-type">
                    <p className="job-location">
                      {<ImLocation2 className="location-icon" />}
                      {location}
                    </p>
                    <p className="job-location">
                      {<BsFillBriefcaseFill className="location-icon" />}
                      {employmentType}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  // Jobs List Success View
  renderSuccessView = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      companyWebsiteUrl,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobDetails.jobData

    return (
      <div className="job-item-details-container">
        <div className="job-list-item job-details-container">
          <div className="job-position-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="job-position">
              <h1 className="job-tittle-heading">{title}</h1>
              <p className="rating">
                {<AiFillStar className="rating-icon" />}
                {rating}
              </p>
            </div>
          </div>
          <div className="job-location-container">
            <div className="location-and-employment-type">
              <p className="job-location">
                {<ImLocation2 className="location-icon" />}
                {location}
              </p>
              <p className="job-location">
                {<BsFillBriefcaseFill className="location-icon" />}
                {employmentType}
              </p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line" />
          <div className="website-link-container">
            <h1 className="job-description-heading">Description</h1>
            <h1 className="job-description-heading">
              <a href={companyWebsiteUrl} className="visit" target="blank">
                Visit <FiExternalLink />
              </a>
            </h1>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-container">
            {skills.map(each => {
              const {name, imageUrl} = each
              return (
                <li className="skills-list-item" key={name}>
                  <img className="skills-img" src={imageUrl} alt={name} />
                  <p className="skill-name">{name}</p>
                </li>
              )
            })}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="company-life-info">{lifeAtCompany.description}</p>
            <img
              className="company-img"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        {this.similarJobsList()}
      </div>
    )
  }

  jobDetailsRenderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-jobs-container">
        <Header />
        {this.jobDetailsRenderViews()}
      </div>
    )
  }
}

export default JobItemDetails
