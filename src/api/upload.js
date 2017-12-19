import SocketIOFile from 'socket.io-file'
import uuidv1 from 'uuid/v1'
import path from 'path'

import router from './router'

let uploadDir = 'uploads'

export default (socket) => {

  let uploader = new SocketIOFile(socket, {
    // uploadDir: {     // multiple directories
    //  music: 'data/music',
    //  document: 'data/document'
    // },
    uploadDir: uploadDir,              // simple directory
    // accepts: ['audio/mpeg', 'audio/mp3'],   // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
    // maxFileSize: 4194304,             // 4 MB. default is undefined(no limit)
    chunkSize: 10240,             // default is 10240(1KB)
    transmissionDelay: 0,           // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
    overwrite: true,               // overwrite file if exists, default is true.
    rename: (filename) => {
      console.log("filename",filename);
      let file = path.parse(filename);

      let name = uuidv1() + '-' + file.name + file.ext
      console.log("name",name);
      return name
    }
  });
  uploader.on('start', (fileInfo) => {
    console.log("fileInfo",fileInfo);
    console.log("fileInfo.dar",fileInfo.dar);
    console.log('Start uploading');
    console.log(fileInfo);
  });
  uploader.on('stream', (fileInfo) => {
    console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
  });
  uploader.on('complete', (fileInfo) => {
    console.log('Upload Complete.');
    console.log(fileInfo);
    let route = fileInfo.data.route.split(':')
    let controller = route[0]
    let method = route[1]
    let filepath = `${uploadDir}/${fileInfo.name}`

    router[controller][method]({filepath})
    // let response = await router[controller][method](data)
  });
  uploader.on('error', (err) => {
    console.log('Error!', err);
  });
  uploader.on('abort', (fileInfo) => {
    console.log('Aborted: ', fileInfo);
  });
}
