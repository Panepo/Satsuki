import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    width: '100%',
    height: '60vh',
    background: 'linear-gradient(165deg, #F57C00 20%, #FFF59D 90%)'
  }
})

class Ribbon extends React.Component {
  render() {
    const { classes } = this.props
    return <div className={classes.root} />
  }
}

Ribbon.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(Ribbon))
