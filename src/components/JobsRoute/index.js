import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {ImLocation2} from 'react-icons/im'

import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsRoute extends Component {
  state = {
    searchInput: '',
    jobsList: [],
    userProfileData: {},
    profileApiStatus: apiStatusConstants.initial,
    jobsDataApiStatus: apiStatusConstants.initial,
    salaryRange: '',
    employmentTypeList: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsListData()
  }

  //   Jobs List Data
  getJobsListData = async () => {
    const {searchInput, salaryRange, employmentTypeList} = this.state
    const employmentTypes = employmentTypeList.join()
    // console.log(employmentTypes)

    const jwtToken = Cookies.get('jwt_token')

    this.setState({jobsDataApiStatus: apiStatusConstants.inProgress})

    const jobsApi = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobsApi, options)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const jobsList = data.jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      //   console.log(jobsList)

      this.setState({
        jobsDataApiStatus: apiStatusConstants.success,
        jobsList,
      })
    } else {
      this.setState({jobsDataApiStatus: apiStatusConstants.failure})
    }
  }

  //   User Profile Data
  getProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')

    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const profileApi = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileApi, options)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      //   console.log(formattedData)

      this.setState({
        profileApiStatus: apiStatusConstants.success,
        userProfileData: formattedData,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  //   Search Container
  searchContainer = () => {
    const {searchInput} = this.state

    const onSearchInputChange = event => {
      this.setState({searchInput: event.target.value})
    }

    const onSearchBtnClick = () => {
      this.getJobsListData()
    }

    const onEnterClick = event => {
      if (event.key === 'Enter') {
        this.getJobsListData()
      }
    }

    return (
      <>
        <input
          type="search"
          className="jobs-search-box"
          placeholder="Search"
          value={searchInput}
          onChange={onSearchInputChange}
          onKeyDown={onEnterClick}
        />
        <button
          type="button"
          className="search-btn"
          data-testid="searchButton"
          onClick={onSearchBtnClick}
        >
          <BsSearch className="search-icon" />
        </button>
      </>
    )
  }

  // Jobs List Section
  JobsListRenderViews = () => {
    const {jobsDataApiStatus} = this.state

    const emptyJobsListView = () => {
      const noJobsImg =
        'https://assets.ccbp.in/frontend/react-js/no-jobs-img.png'

      return (
        <div className="empty-jobs-list-container">
          <img className="no-jobs-img" src={noJobsImg} alt="no jobs" />
          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-description">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }

    // Jobs List Loading View
    const jobsDataLoadingView = () => (
      <div className="profile-render-container" data-testid="loader">
        <Loader type="ThreeDots" color="red" height="50" width="50" />
      </div>
    )

    // Jobs List Success View
    const jobsDataSuccessView = () => {
      const {jobsList} = this.state
      const isListEmpty = jobsList.length === 0
      if (isListEmpty) {
        return emptyJobsListView()
      }
      return (
        <ul className="jobs-list-container">
          {jobsList.map(each => {
            const {
              id,
              companyLogoUrl,
              employmentType,
              jobDescription,
              location,
              packagePerAnnum,
              rating,
              title,
            } = each

            return (
              <li className="job-list-item" key={id}>
                <Link to={`/jobs/${id}`}>
                  <div className="job-position-container">
                    <img
                      className="company-logo"
                      src={companyLogoUrl}
                      alt="company logo"
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
                  <h1 className="job-description-heading">Description</h1>
                  <p className="job-description">{jobDescription}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      )
    }

    // Jobs List Failure View
    const jobsDataFailureView = () => {
      const failureImg =
        'https://assets.ccbp.in/frontend/react-js/failure-img.png'

      const onRetryClick = () => {
        this.getJobsListData()
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
            className="profile-retry-btn"
            onClick={onRetryClick}
          >
            Retry
          </button>
        </div>
      )
    }

    // Jobs Data Api Stats Checks
    switch (jobsDataApiStatus) {
      case apiStatusConstants.inProgress:
        return jobsDataLoadingView()

      case apiStatusConstants.success:
        return jobsDataSuccessView()

      case apiStatusConstants.failure:
        return jobsDataFailureView()

      default:
        return null
    }
  }

  // Type Of Employment List
  employmentTypeContainer = () => {
    const {employmentTypeList} = this.state

    const onEmploymentValue = (employmentId, event) => {
      if (event) {
        const isTypeIn = employmentTypeList.indexOf(employmentId)
        if (isTypeIn === -1) {
          //   employmentTypeList.push(employmentId)
          this.setState(
            prev => ({
              employmentTypeList: [...prev.employmentTypeList, employmentId],
            }),
            this.getJobsListData,
          )
        }
      } else {
        const isTypeIn = employmentTypeList.indexOf(employmentId)
        if (isTypeIn !== -1) {
          const filteredList = employmentTypeList.filter(
            each => each !== employmentId,
          )
          this.setState(
            {employmentTypeList: filteredList},
            this.getJobsListData,
          )
        }
      }
    }

    return (
      <ul className="employment-list-container">
        <h1 className="heading">Type of Employment</h1>
        {employmentTypesList.map(each => {
          const {label, employmentTypeId} = each

          const onEmploymentCheck = event => {
            onEmploymentValue(employmentTypeId, event.target.checked)
          }

          return (
            <li key={employmentTypeId} className="employment-list-item">
              <input
                type="checkbox"
                className="checkbox"
                id={employmentTypeId}
                value={employmentTypeId}
                onClick={onEmploymentCheck}
              />
              <label htmlFor={employmentTypeId} className="label">
                {label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  // Salary Range List
  salaryRangeContainer = () => (
    <div className="salary-range-container">
      <h1 className="heading">Salary Range</h1>
      <ul>
        {salaryRangesList.map(each => {
          const {salaryRangeId, label} = each

          const onRadioBtnClick = () => {
            this.setState({salaryRange: salaryRangeId}, this.getJobsListData)
          }

          return (
            <li key={salaryRangeId} className="salary-range-list-item">
              <input
                type="radio"
                className="radio-btn"
                name="salary-range"
                onClick={onRadioBtnClick}
                value={salaryRangeId}
                id={salaryRangeId}
              />
              <label htmlFor={salaryRangeId} className="label">
                {label}
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  //   Render Loading View
  loadingView = () => (
    <div className="profile-render-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  //   Profile Success View
  profileSuccessView = () => {
    const {userProfileData} = this.state
    const {name, profileImageUrl, shortBio} = userProfileData

    return (
      <div className="user-profile-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  //   Profile Failure View
  profileFailureView = () => {
    const onProfileRetryClick = () => {
      this.getProfileData()
    }

    return (
      <div className="profile-render-container">
        <button
          type="button"
          className="profile-retry-btn"
          onClick={onProfileRetryClick}
        >
          Retry
        </button>
      </div>
    )
  }

  //   Profile Render Views
  getProfileRenderView = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.loadingView()

      case apiStatusConstants.success:
        return this.profileSuccessView()

      case apiStatusConstants.failure:
        return this.profileFailureView()

      default:
        return null
    }
  }

  onClearFilter = () => {
    this.setState(
      {salaryRange: '', employmentTypeList: []},
      this.getJobsListData,
    )
  }

  //   Jobs Route Render
  render() {
    return (
      <div className="main-jobs-container">
        <Header />
        <div className="job-app-container">
          <div className="profile-section">
            <div className="sm-search-container">{this.searchContainer()}</div>
            {this.getProfileRenderView()}
            <hr className="hr-line" />
            {this.employmentTypeContainer()}
            <hr className="hr-line" />
            {this.salaryRangeContainer()}
          </div>
          <div className="jobs-section">
            <div className="md-search-container">{this.searchContainer()}</div>
            {this.JobsListRenderViews()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobsRoute
