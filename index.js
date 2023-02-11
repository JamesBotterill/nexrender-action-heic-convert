const fs = require('fs');
const convert = require('heic-convert')
const uri2path = require('file-uri-to-path')
const { promisify } = require('util');
const path = require('path')

module.exports = (job, settings, {layer, dir}, type) => {
    const promises = layer.map(asset => {
        // get the file path, file name and extension
        const index = job.assets.findIndex(x => x.layerName == asset);
        const imageFile = job.assets[index].src
        const filepath = uri2path(imageFile)
        const fileExt = path.extname(filepath)
        const filename = path.basename(filepath, fileExt)

        // get the directory of the file
        const outputDir = dir || path.dirname(filepath)

        // create a new file path for the PNG file
        const newFile = outputDir + filename + '.png'

        // if the file is not a HEIC file, return the asset
        if (fileExt.toLowerCase() != '.heic') {
            return Promise.resolve(asset)
        }
        // convert the HEIC file to PNG
        return new Promise(async (resolve, reject) => {
            convert({
                buffer: await promisify(fs.readFile)(filepath), // the HEIC file buffer
                format: 'PNG'                       // output format
            }).then (outputBuffer => {
                // write the PNG file
                fs.writeFile(newFile, outputBuffer)

                // set the new file path to the asset
                asset.src = newFile

                resolve(asset)
            }).catch(err => {
                reject(err)
            })
        })
    })

    return new Promise((resolve, reject) => {
        Promise.all(promises).then(assets => {
            // set the new assets to the job
            job.assets = assets
            resolve(job)
        }).catch(err => {
            reject(err)
        })
    })
};