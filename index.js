const express = require('express')
const axios = require('axios');
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')

const app = express()

let _model

const convertUrl = async (img) => {
    try {
        const pic = await axios.get(img, {
            responseType: 'arraybuffer'
        });

        const image = await tf.node.decodeImage(pic.data, 3);
        const predictions = await _model.classify(image);
        image.dispose();
        return {
            worked: true,
            classifications: predictions,
            error: null
        };
    } catch (error) {
        return {
            worked: false,
            classifications: [],
            error: JSON.stringify(error)
        }
    }
}

app.get('/nsfw/:url', async (req, res) => {
    const predictions = await convertUrl(req.params.url);
    res.json(predictions);
});

const load_model = async () => {
    var path = `file://${__dirname}/models/quant_nsfw_mobilenet/`;
    console.log('Model path: ', path);
    _model = await nsfw.load(path);
}

// Keep the model in memory, make sure it's loaded only once
load_model().then(() => app.listen(8080))

// curl --request POST localhost:8080/nsfw --header 'Content-Type: multipart/form-data --data-binary 'image=@/full/path/to/picture.jpg'