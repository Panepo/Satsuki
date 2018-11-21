import React from 'react'
import PropTypes from 'prop-types'
import * as tf from '@tensorflow/tfjs'
import * as styleTrans from '../deeplearn/StyleTrans'
import Webcam from 'react-webcam'
import MucProgress from '../componments/MucProgress'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import withRoot from '../withRoot'

const styles = theme => ({
  border: {
    marginTop: '10px',
    marginBottom: '10px'
  },
  overlay: {
    zIndex: 10,
    marginTop: '-360px'
  },
  hidden: {
    display: 'none'
  },
  output: {
    marginTop: '10px',
    marginRight: '10px',
    marginLeft: '10px'
  }
})

class StyleTransCam extends React.Component {
  state = {
    isLoading: true,
    isPlaying: false,
    isPredicting: false,
    videoWidth: 640,
    videoHeight: 360,
    videoBuff: null,
    videoConstraints: {
      width: 1280,
      height: 720,
      facingMode: 'user'
    },
    processTime: 0,
    predictTick: 500
  }

  constructor(props) {
    super(props)
    this.handleWebcam = this.handleWebcam.bind(this)
    this.handlePredict = this.handlePredict.bind(this)
  }

  // ================================================================================
  // React lifecycle functions
  // ================================================================================

  componentDidMount = async () => {
    this.model1 = await tf.loadModel(styleTrans.modelPathCam1)
    this.model2 = await tf.loadModel(styleTrans.modelPathCam2)
    await this.model1.predict(tf.zeros([1, 256, 256, 3]))
    await this.model2.predict(tf.zeros([1, 256, 256, 3]))
    this.setState({
      isLoading: false
    })
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
  handleWebcam = async () => {
    if (this.state.isPlaying) {
      this.setState({
        isPlaying: false,
        isPredicting: false,
        videoBuff: null
      })
    } else {
      await this.setState({ isPlaying: true, isPredicting: false })

      const canvas = document.getElementById('camOverlayCanvas')
      const ctx = canvas.getContext('2d')
      ctx.strokeStyle = 'yellow'

      const rectLength = 256
      const rectStartX = (this.state.videoWidth - rectLength) / 2
      const rectStartY = (this.state.videoHeight - rectLength) / 2
      ctx.rect(rectStartX, rectStartY, rectLength, rectLength)
      ctx.stroke()
    }
  }

  handlePredict = async () => {
    if (this.state.isPredicting) {
      clearInterval(this.interval)
      this.setState({ isPredicting: false })
    } else {
      this.interval = setInterval(
        () => this.handleModelPredictTick(),
        this.state.predictTick
      )
      this.setState({ isPredicting: true })
    }
  }

  handleCapture = async () => {
    await this.setState({ videoBuff: this.webcam.getScreenshot() })

    const image = document.getElementById('camVideoCapture')
    const canvas = document.getElementById('camInputCanvas')
    const ctx = canvas.getContext('2d')

    image.onload = () => {
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

  handleModelPredictTick = async () => {
    const tstart = performance.now()
    this.handleCapture()
    await styleTrans.predictCam(
      this.model1,
      'camInputCanvas',
      'camOutputCanvas1'
    )
    await styleTrans.predictCam(
      this.model2,
      'camInputCanvas',
      'camOutputCanvas2'
    )
    const tend = performance.now()
    this.setState({
      processTime: Math.floor(tend - tstart)
    })
  }

  // ================================================================================
  // React render functions
  // ================================================================================

  renderButton = () => {
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

    const renderTransfer = (onoff1, onoff2) => {
      if (onoff1) {
        if (onoff2) {
          return (
            <Button color="secondary" onClick={this.handlePredict}>
              Transfer Stop
            </Button>
          )
        } else {
          return (
            <Button color="primary" onClick={this.handlePredict}>
              Transfer Start
            </Button>
          )
        }
      }
    }

    return (
      <div>
        {renderWebcamPower(this.state.isPlaying)}
        {renderTransfer(this.state.isPlaying, this.state.isPredicting)}
      </div>
    )
  }

  renderWebCam = () => {
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
    }
  }

  renderOutput = () => {
    const { classes } = this.props
    return (
      <Grid container justify="center" alignItems="center">
        <img
          className={classes.hidden}
          id="camVideoCapture"
          src={this.state.videoBuff}
          alt={''}
          width={this.state.videoConstraints.width}
          height={this.state.videoConstraints.height}
        />
        <canvas
          id="camInputCanvas"
          className={classes.output}
          width={256}
          height={256}
        />
        <canvas
          id="camOutputCanvas1"
          className={classes.output}
          width={256}
          height={256}
        />
        <canvas
          id="camOutputCanvas2"
          className={classes.output}
          width={256}
          height={256}
        />
      </Grid>
    )
  }

  render() {
    const { classes } = this.props

    if (this.state.isLoading) {
      return (
        <React.Fragment>
          <MucProgress modelText={'Loading...'} />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          {this.renderButton()}
          <Divider className={classes.border} />
          {this.renderWebCam()}
          {this.renderOutput()}
        </React.Fragment>
      )
    }
  }
}

StyleTransCam.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(StyleTransCam))
