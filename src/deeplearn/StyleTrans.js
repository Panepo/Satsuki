import * as tf from '@tensorflow/tfjs'

export const modelPath1 = './style1/model.json'
export const modelPath2 = './style2/model.json'
export const modelPath3 = './style3/model.json'
export const modelPath4 = './style4/model.json'
export const modelPath5 = './style5/model.json'

export const predict = (model, inputId, outputId) => {
  const canvas = document.getElementById(inputId)
  const canvaso = document.getElementById(outputId)

  tf.toPixels(
    tf.tidy(() => {
      const tensorInp = tf.fromPixels(canvas).toFloat()
      const tensorNor = tensorInp.sub(tf.scalar(127.5)).div(tf.scalar(127.5))
      const tensorBat = tensorNor.expandDims(0)
      const tensorPre = model.predict(tensorBat)
      const tensorDnor = tensorPre.mul(tf.scalar(127.5)).add(tf.scalar(127.5))
      return tensorDnor.toInt().squeeze()
    }),
    canvaso
  )
}
