// const fs = require('fs');
// const axios = require('axios');
// const path = require('node:path');
// const { link } = require('fs/promises');

// // const directory = '../LIM018-md-links';

// // CONSULTANDO SI EXISTE LA RUTA
// const routeExists = (route) => {
//   const exists = fs.existsSync(route)
//   return (exists === true) ? 'La ruta existe' : 'La ruta no existe';
// }

// // CONSULTANDO SI LA RUTA ES ABSOLUTA
// const routeAbsolute = (route) => {
//   const checkIfItIsAbsolute = path.isAbsolute(route);
//   return (checkIfItIsAbsolute === false) ? 'La ruta es relativa' : 'La ruta es absoluta';
//   // if (path.isAbsolute(route)) {
//   //   return route;
//   // }
//   // return path.resolve(route);
// }

// //CONVERTIR RUTA RELATIVA A ABSOLUTA
// const routeRelative = (route) => {
//   return (path.resolve(route));
// }

// //CONSULTANDO LA EXTENSION DEL ARCHIVO
// const routeExtension = (route) => {
//   return path.extname(route);
// }

// //LEYENDO EL DOC
// const readRoute = (route) => {
//   return fs.readFileSync(route, 'utf-8');
// }

// //SACANDO LOS LINKS DEL DOC
// const linksRoute = (route) => {
//   const readFile = readRoute(route)
//   const storeLinks= [];
//   const arrayObj = [];
//   const regExp = /\[(.+)\]\((https?:\/\/.+)\)/gi;
//   const result = readFile.match(regExp);

//   for (let i = 0; i < result.length; i++){
//     const lastArray = result[i].lastIndexOf(']')+2;
//     const onlyLinks= result[i].substring( lastArray,result[i].lastIndexOf(')')-1 );
//     storeLinks.push(onlyLinks);  
//   }

//   for (let i = 0; i < storeLinks.length; i++){
//     const objetcLinks={
//       href: storeLinks[i].toString(),
//       text: result[i].substring( result[i].indexOf('[')+1,result[i].indexOf(']') ),
//       file: route
//     }
//     arrayObj.push(objetcLinks);
//   }
//   return arrayObj;
//   }

// // AÑADIENDO AXIOS A LOS LINKS
// const getStatus = (contentArray) => {
//   const objArray = linksRoute(contentArray);
//   return Promise.all(
//   objArray.map((objectl) => {
//     return axios.get(objectl.href)
//     .then((result) => {
//       return{
//         ...objectl,
//          Status: result.status,
//          Ok: result.statusText
//       }
//     })
//     .catch((error) => {

//         return{
//           ...objectl,
//           Status: error.response.status,
//           Message: 'fail',
//         }
//       });
//     })
//   );
// }

// //LINKS VALIDOS
// const stats = (router) => {
//   const linksObj = getStatus(router)
//   const links2 = linksObj.map((item) => item.href);
//   const unique = new Set(links2).size
//     return{
//       Total:links2.length,
//       Unique: unique,
//     }
// }

// const recursion = (routeDirectory) =>{
//   const directoryFiles= []

//   const readDirectory = fs. readdirSync(routeDirectory);

//   readDirectory.forEach((fileDir)=>{
//     const enteringTheDirectory = path.join (routeDirectory,fileDir);

//     if(fs.statSync(enteringTheDirectory).isDirectory()){
//       recursion(enteringTheDirectory).forEach((fileDir)=>{
//         directoryFiles.push (fileDir);
//       });
//     }
//     else if (routeExtension(enteringTheDirectory)=== '.md'){
//       directoryFiles.push(enteringTheDirectory)
//     }
//   })
//   return directoryFiles
// }

// // const rutaUno = './README.md';
// const rutaDos = './carpeta';


// // routeExists(rutaUno);
// // routeAbsolute(rutaUno);
// // routeRelative(rutaUno);
// // routeExtension(rutaUno);
// // readRoute(rutaUno);
// // linksRoute(rutaDos);
// // getStatus(rutaDos).then((result)=>console.log(result));
//  //consele.log(mdLinks(rutaDos))
//  //console.log(recursion(rutaDos))

// module.exports = {
//   routeExists,
//   routeAbsolute,
//   routeRelative,
//   routeExtension,
//   readRoute,
//   linksRoute,
//   stats,
//   recursion,
//   mdLinks
// }












const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');

// Funcion para verificar si existe una ruta
const existsPath = (route) => fs.existsSync(route);

// Funcion para verificar la extension de un archivo
const extNameFile = (route) => path.extname(route);

// Convirtiendo a ruta absoluta
const pathAbsolute = (route) => (path.isAbsolute(route) ? route : path.resolve(route));

// Funcion para leer un archivo markdown y obtener los links
const readFileMd = (file) => {
  const readFile = fs.readFileSync(file, 'utf-8');
  const exp = /\[(.*?)\]\(.*?\)/gm;
  let dataFile = readFile.match(exp);
  if (dataFile !== null) {
    dataFile = dataFile.map((link) => {
      const finalText = link.indexOf(']');
      return {
        href: link.slice(finalText + 2, link.length - 1),
        text: link.slice(1, finalText),
        file,
      };
    });
    return dataFile.filter((data) => data.href.startsWith('http') || data.href.startsWith('www'));
  }
  return 'No se encontro links';
};

// Funcion para hacer las peticiones http de los links que se hubieran encontrado
const validateLinks = (urls) => {
  const arrayLinks = urls;
  return arrayLinks.map((url) => axios.get(url.href)
    .then((response) => ({ ...url, status: response.status, message: response.statusText }))
    .catch((error) => (error.response ? { ...url, status: error.response.status, message: 'fail' }
      : { ...url, status: error.errno, message: 'fail' })));
};

// Funcion para verificar si es un file
const statFile = (route) => fs.statSync(route).isFile();

// Funcion recursiva para obtener los files de directorios
const dirOrFile = (route) => {
  // Preguntando si es un file
  if (statFile(route)) {
    return [route];
  }
  const filenames = fs.readdirSync(route); // Obteniendo los files de un directorio
  return filenames.map((file) => dirOrFile(path.join(route, file))).flat();
};

// Obteniendo todos los links encontrados
const getLinks = (route) => {
  let files = dirOrFile(route);
  files = files.filter((file) => extNameFile(file) === '.md');
  const links = files.map((file) => readFileMd(file)).filter((file) => typeof file !== 'string').flat();
  return links;
};

// Calculando estadisticas
const calculateStats = (arrayLinks) => {
  const stats = {};
  const arrUnique = [];
  stats.total = arrayLinks.length;
  arrayLinks.forEach((element) => {
    if (arrUnique.indexOf(element.href) === -1) {
      arrUnique.push(element.href);
    }
  });
  stats.unique = arrUnique.length;
  return stats;
};

const mdLinks = (route, options) => {
  const promise = new Promise((resolve, reject) => {
    if (!existsPath(route)) {
      reject(new Error('no existe la ruta'));
    }
    const routeAbs = pathAbsolute(route);
    const links = getLinks(routeAbs);
    if (options.validate && options.stats) {
      const validateLinksFile = validateLinks(links);
      Promise.all(validateLinksFile)
        .then((response) => {
          const stats = calculateStats(response);
          stats.broquen = response.filter((element) => element.message === 'fail').length;
          resolve(stats);
        });
      return;
    }
    if (options.validate) {
      const validateLinksFile = validateLinks(links);
      Promise.all(validateLinksFile)
        .then((response) => {
          resolve(response);
        });
      return;
    }
    if (options.stats) {
      const stats = calculateStats(links);
      resolve(stats);
      return;
    }
    resolve(links);
  });
  return promise;
};

module.exports = {
  existsPath,
  extNameFile,
  pathAbsolute,
  readFileMd,
  validateLinks,
  statFile,
  dirOrFile,
  getLinks,
  calculateStats,
  mdLinks,
};