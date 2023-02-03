const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
const uri2path = require('file-uri-to-path')

module.exports = (job, settings, action, type) => {
    console.log('hello from my module: ' + action.module);

    return new Promise((resolve, reject) => {
        options.layers.forEach(asset => {

            const index = job.assets.findIndex(x => x.layerName == asset);
            const imageFile = job.assets[index].src
            const filepath = uri2path(imageFile)
            const fileExt = path.extname(filepath)
            const dir = path.dirname(filepath)

            if(fileExt === '.heic'){
                convertFile(filepath, dir)
            }
        })
        resolve(job)
    })
    
};

const convertFile  = async (file, outputDir) => {
    let filename = path.basename(file, '.hiec')
    const inputBuffer = await promisify(fs.readFile)(file);
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'PNG'        // output format
    });
  
    await promisify(fs.writeFile)(outputDir + filename + '.png', outputBuffer);
  };

