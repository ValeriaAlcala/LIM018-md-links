// const mdLinks = (filePath) => new Promise ((resolve,reject) => {
//   //Si la ruta existe
//   if(routeExists(filePath)){
//     //convertir a absoluta
//     const absolute = routeAbsolute(filePath);
//     //Si es un directorio
//     if(fs.statSync(absolute).isDirectory()){
//       //recursividad
//       const linksContainer = recursion(absolute);
//       const arrayPromises = linksContainer.map((link) => mdLinks(link));
//       Promise.all(arrayPromises).then((resultado) => (resultado.flat()));
//     } else if (fs.statSync(absolute).isFile()) {
//     if(routeExtension(absolute) === '.md') {
//     }
//     const linksContainer1 = linksRoute(absolute);
//     const arrayPromises1 = getStatus(linksContainer1);

//     Promise.all(arrayPromises1).then((res) => {
//       resolve (res.flat())
//     })
//     }
//   } else {
//     reject('Ingrese una ruta válida');
//   }
// })






