import React from 'react'
import {connect} from 'react-redux'
import loading from '../loading.gif'

const Loader = ({isLoading}) => (
  <span className='loader'>
    {isLoading ? <img src={loading} alt='loading content' /> : null}
  </span>
)

export default connect(
  ({isLoading}) => ({isLoading})
)(Loader)
