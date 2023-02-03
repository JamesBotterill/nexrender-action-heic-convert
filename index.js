const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
const uri2path = require('file-uri-to-path')

module.exports = (job, settings, options, type) => {
    //console.log('hello from my module: ' + action.module);
    console.log("convert module started")
    return new Promise((resolve, reject) => {
        options.layers.forEach(asset => {

            const index = job.assets.findIndex(x => x.layerName == asset);
            const imageFile = job.assets[index].src
            console.log(imageFile)
            const filepath = uri2path(imageFile)
            console.log(filepath)
            const fileExt = path.extname(filepath)
            const dir = options.dir || path.dirname(filepath)
            const filename = path.basename(filepath, fileExt)
            const newFile = dir + filename + '.png' 

            if(fileExt === '.HEIC'|| '.heic'){
                async ()=>{
                    await convertFile(filepath, filename, fileExt,  dir)
                    job.assets[index].src = newFile
                    settings.logger.log(`changed ${job.assets[index].layerName} value to ${newFile}`)};
                }
        })
        resolve()
    })
    
};

const convertFile  = async (file, name, ext ,outputDir) => {
    const inputBuffer = await promisify(fs.readFile)(file, ext);
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'PNG'        // output format
    });
  
    await promisify(fs.writeFile)(outputDir + name + '.png', outputBuffer);
  };