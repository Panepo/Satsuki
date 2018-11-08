import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { modelSelect } from '../actions'
import * as tf from '@tensorflow/tfjs'
import * as styleTrans from './StyleTrans'
import Webcam from 'react-webcam'
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
  },
  overlay: {
    zIndex: 10,
    marginTop: '-360px'
  }
})

class Content extends React.Component {
  state = {
    isLoading: true,
    isPlaying: false,
    isCaptured: false,
    imageFile: [],
    videoWidth: 640,
    videoHeight: 360,
    videoBuff: null,
    videoConstraints: {
      width: 1280,
      height: 720,
      facingMode: 'user'
    },
    processTime: 0
  }

  constructor(props) {
    super(props)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
    this.handleWebcam = this.handleWebcam.bind(this)
    this.handleCapture = this.handleCapture.bind(this)
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
  // HTML functions
  // ================================================================================

  setWebcamRef = webcam => {
    this.webcam = webcam
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
      imageFile: [],
      isCaptured: false
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
    await styleTrans.predict(this.model, 'inputCanvas', 'outputCanvas')
    const tend = performance.now()
    this.setState({
      processTime: Math.floor(tend - tstart).toString() + ' ms'
    })
  }

  handleSwitchStyle = () => {
    if (this.state.imageFile.length > 0 || this.state.isCaptured) {
      this.handlePredict()
    }
  }

  handleWebcam = async () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
        videoBuff: null
      })
    } else {
      await this.setState({ isPlaying: true, isCaptured: false, imageFile: [] })

      const canvas = document.getElementById('camOverlayCanvas')
      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = 'yellow'
      ctx.rect(192, 52, 256, 256)
      ctx.stroke()
    }
  }

  handleCapture = async () => {
    await this.setState({
      isPlaying: false,
      isCaptured: true,
      videoBuff: this.webcam.getScreenshot()
    })
    const image = document.getElementById('camInputImage')
    const canvas = document.getElementById('inputCanvas')
    const ctx = canvas.getContext('2d')

    image.onload = () => {
      canvas.width = 256
      canvas.height = 256
      ctx.drawImage(
        image,
        image.naturalWidth / 2 - 256,
        image.naturalHeight / 2 - 256,
        512,
        512,
        0,
        0,
        256,
        256
      )
    }
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
    const { classes } = this.props
    const renderClear = () => {
      if (this.state.imageFile.length > 0 || this.state.isCaptured) {
        return (
          <Button color="primary" onClick={this.handleClear}>
            Clear
          </Button>
        )
      }
    }

    const renderTransfer = () => {
      if (this.state.imageFile.length > 0 || this.state.isCaptured) {
        return (
          <Button color="primary" onClick={this.handlePredict}>
            Transfer
          </Button>
        )
      }
    }

    const renderWebcamPower = onoff => {
      if (onoff) {
        return (
          <Button color="secondary" onClick={this.handleWebcam}>
            Webcam Stop
          </Button>
        )
      } else {
        return (
          <Button color="primary" onClick={this.handleWebcam}>
            Webcam Start
          </Button>
        )
      }
    }

    const renderWebcamCapture = onoff => {
      if (onoff) {
        return (
          <Button color="primary" onClick={this.handleCapture}>
            Capture
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
        {renderWebcamPower(this.state.isPlaying)}
        {renderWebcamCapture(this.state.isPlaying)}
        {renderClear()}
        {renderTransfer()}
      </div>
    )
  }

  renderHidden = () => {
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
        <img
          className={this.props.classes.hidden}
          id="camInputImage"
          src={this.state.videoBuff}
          alt={''}
          width={this.state.videoConstraints.width}
          height={this.state.videoConstraints.height}
        />
      </div>
    )
  }

  renderOutput = () => {
    if (this.state.isPlaying) {
      return (
        <Grid container justify="center" alignItems="center">
          <Webcam
            audio={false}
            width={this.state.videoWidth}
            height={this.state.videoHeight}
            ref={this.setWebcamRef}
            screenshotWidth={this.state.videoConstraints.width}
            videoConstraints={this.state.videoConstraints}
          />
          <canvas
            className={this.props.classes.overlay}
            id="camOverlayCanvas"
            width={this.state.videoWidth}
            height={this.state.videoHeight}
          />
        </Grid>
      )
    } else {
      return (
        <div>
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
  }

  renderProceeTime = () => {
    const { classes } = this.props
    if (this.state.imageFile.length > 0 || this.state.isCaptured) {
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
                {this.renderHidden()}
                <Divider className={classes.border} />
                <MucGallery selected={modelSelected} propFunc={modelSelect} />
                <Divider className={classes.border} />
                {this.renderOutput()}
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
