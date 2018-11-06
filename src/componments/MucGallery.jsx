import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import imageData from '../images/index'

const styles = theme => ({
  root: {},
  gridList: {
    width: '100%',
    height: 165
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  selected: {
    backgroundColor: '#F57C00'
  }
})

class MucGallery extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = picId => {
    this.props.propFunc(picId)
  }

  renderGallery = () => {
    const { classes, selected } = this.props

    return imageData.reduce((output, data, i) => {
      if (selected === i + 1) {
        output.push(
          <GridListTile key={data.title} className={classes.selected}>
            <img src={data.img} alt={data.title} />
            <GridListTileBar
              title={data.title}
              subtitle={<span>{data.author}</span>}
              actionIcon={
                <IconButton
                  className={classes.icon}
                  onClick={() => this.handleClick(data.id)}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        )
        return output
      } else {
        output.push(
          <GridListTile key={data.title}>
            <img src={data.img} alt={data.title} />
            <GridListTileBar
              title={data.title}
              subtitle={<span>{data.author}</span>}
              actionIcon={
                <IconButton
                  className={classes.icon}
                  onClick={() => this.handleClick(data.id)}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </GridListTile>
        )
        return output
      }
    }, [])
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <GridList cellHeight={160} className={classes.gridList} cols={5}>
          {this.renderGallery()}
        </GridList>
      </div>
    )
  }
}

MucGallery.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.number.isRequired,
  propFunc: PropTypes.func
}

export default withRoot(withStyles(styles)(MucGallery))
