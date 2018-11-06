import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { modelSelect } from '../actions'
import * as tf from '@tensorflow/tfjs'
import * as styleTrans from './StyleTrans'
import MucProgress from '../componments/MucProgress'
import MucText from '../componments/MucText'
import MucGallery from '../componments/MucGallery'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  root: {
    marginTop: '-55vh',
    marginBottom: '60px',
    flex: 1
  },
  grid: {
    flexGrow: 1,
    width: '100%'
  },
  paper: {
    borderRadius: '2px',
    paddingTop: '80px',
    paddingBottom: '80px',
    paddingLeft: '56px',
    paddingRight: '56px'
  },
  border: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  hidden: {
    display: 'none'
  },
  canvas: {
    marginLeft: '10px',
    marginRight: '10px'
  }
})

class Content extends React.Component {
  state = {
    isLoading: true,
    imageFile: [],
    processTime: '0'
  }

  constructor(props) {
    super(props)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
  }

  // ================================================================================
  // React lifecycle functions
  // ================================================================================

  componentDidMount = async () => {
    this.model = await tf.loadModel(styleTrans.modelPath1)
    // await this.model.predict(tf.zeros([null, 256, 256, 3])).dispose()
    this.setState({ isLoading: false })
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.modelSelected !== this.props.modelSelected) {
      switch (this.props.modelSelected) {
        case 1:
          this.model = await tf.loadModel(styleTrans.modelPath1)
          this.handleSwitchStyle()
          break
        case 2:
          this.model = await tf.loadModel(styleTrans.modelPath2)
          this.handleSwitchStyle()
          break
        case 3:
          this.model = await tf.loadModel(styleTrans.modelPath3)
          this.handleSwitchStyle()
          break
        case 4:
          this.model = await tf.loadModel(styleTrans.modelPath4)
          this.handleSwitchStyle()
          break
        case 5:
          this.model = await tf.loadModel(styleTrans.modelPath5)
          this.handleSwitchStyle()
          break
        default:
          break
      }
    }
  }

  // ================================================================================
  // React event handler functions
  // ================================================================================

  handleUpload = event => {
    const data = []
    const tstart = performance.now()

    for (let i = 0; i < event.target.files.length; i += 1) {
      let dataTemp
      if (event.target.files[i] != null) {
        dataTemp = URL.createObjectURL(event.target.files[i])
        data.push(dataTemp)
      }
    }

    const tend = performance.now()
    if (data.length > 0) {
      this.setState({
        imageFile: data,
        processTime: Math.floor(tend - tstart).toString() + ' ms',
        isSensing: false
      })
      const image = document.getElementById('inputImage')
      const canvas = document.getElementById('inputCanvas')
      const ctx = canvas.getContext('2d')

      image.onload = () => {
        canvas.width = 256
        canvas.height = 256
        ctx.drawImage(
          image,
          0,
          0,
          image.naturalWidth,
          image.naturalHeight,
          0,
          0,
          256,
          256
        )
      }
    } else {
      this.setState({
        imageFile: []
      })
    }
  }

  handleClear = () => {
    this.setState({
      imageFile: []
    })
    const canvasi = document.getElementById('inputCanvas')
    const ctxi = canvasi.getContext('2d')
    ctxi.clearRect(0, 0, 256, 256)

    const canvaso = document.getElementById('outputCanvas')
    const ctxo = canvaso.getContext('2d')
    ctxo.clearRect(0, 0, 256, 256)
  }

  handlePredict = async () => {
    const tstart = performance.now()
    styleTrans.predict(this.model, 'inputCanvas', 'outputCanvas')
    const tend = performance.now()
    this.setState({
      processTime: Math.floor(tend - tstart).toString() + ' ms'
    })
  }

  handleSwitchStyle = () => {
    if (this.state.imageFile.length > 0) {
      this.handlePredict()
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const { classes } = this.props
    const renderClear = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <Button color="primary" onClick={this.handleClear}>
            Clear
          </Button>
        )
      }
    }

    const renderTransfer = () => {
      if (this.state.imageFile.length > 0) {
        return (
          <Button color="primary" onClick={this.handlePredict}>
            Transfer
          </Button>
        )
      }
    }

    return (
      <div>
        <Button color="primary" component="label">
          Select Image
          <input
            className={classes.hidden}
            type="file"
            accept="image/*"
            onChange={this.handleUpload}
            required
          />
        </Button>
        {renderClear()}
        {renderTransfer()}
      </div>
    )
  }

  renderImage = () => {
    return (
      <div>
        <img
          className={this.props.classes.hidden}
          id="inputImage"
          src={this.state.imageFile[0]}
          width="100%"
          height="100%"
          alt={this.state.text}
        />
        <Grid container justify="center" alignItems="center">
          <canvas className={this.props.classes.canvas} id="inputCanvas" />
          <canvas
            className={this.props.classes.canvas}
            id="outputCanvas"
            width={256}
            height={256}
          />
        </Grid>
      </div>
    )
  }

  renderProceeTime = () => {
    const { classes } = this.props
    if (this.state.imageFile.length > 0) {
      return (
        <div>
          <Divider className={classes.border} />
          <MucText
            modelId="text-input-time"
            modelLabel="Process Time"
            modelValue={this.state.processTime}
          />
        </div>
      )
    }
  }

  render() {
    const { classes, modelSelect, modelSelected } = this.props
    if (this.state.isLoading) {
      return (
        <main className={classes.root}>
          <Grid
            container
            className={classes.grid}
            justify="center"
            spacing={16}>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <MucProgress modelText={'Loading...'} />
              </Paper>
            </Grid>
          </Grid>
        </main>
      )
    } else {
      return (
        <main className={classes.root}>
          <Grid
            container
            className={classes.grid}
            justify="center"
            spacing={16}>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                {this.renderButton()}
                <Divider className={classes.border} />
                <MucGallery selected={modelSelected} propFunc={modelSelect} />
                <Divider className={classes.border} />
                {this.renderImage()}
                {this.renderProceeTime()}
              </Paper>
            </Grid>
          </Grid>
        </main>
      )
    }
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  modelSelect: PropTypes.func.isRequired,
  modelSelected: PropTypes.number.isRequired
}

const mapStateToProps = state => {
  return {
    modelSelected: state.reducerModel.modelSelected
  }
}

const mapDispatchToProps = dispatch => {
  return {
    modelSelect: bindActionCreators(modelSelect, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(Content)))
