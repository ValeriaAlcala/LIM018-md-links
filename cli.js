// #!/usr/bin/env node 

const { mdLinks } = require('./index');

/* eslint-disable no-console */
const args = process.argv.slice(2);
const path = args[0];
const options = {
  validate: false,
  stats: false,
};
if (args.length === 0) {
  console.log('Escribe una ruta por ejemplo: mdLinks ./prueba.md');
}
if (args.length === 1 && args[0]) {
  mdLinks(path, options)
    .then((response) => {
      response.forEach((element) => {
        console.log(element.file, element.href, element.text);
      });
    }).catch((err) => console.log(err.message));
} else if ((args[0] && args[1] === '--validate' && args[2] === '--stats') || (args[0] && args[2] === '--validate' && args[1] === '--stats')) {
  options.validate = true;
  options.stats = true;
  mdLinks(path, options)
    .then((response) => {
      console.log('Total: ', response.total, '\nUnique: ', response.unique, '\nBroquen: ', response.broquen);
    }).catch((err) => console.log(err.message));
} else if (args[0] && args[1] === '--validate') {
  options.validate = true;
  mdLinks(path, options)
    .then((response) => {
      response.forEach((element) => {
        console.log(element.file, element.href, element.message, element.status, element.text);
      });
    }).catch((err) => console.log(err.message));
} else if (args[0] && args[1] === '--stats') {
  options.stats = true;
  mdLinks(path, options)
    .then((response) => {
      console.log('Total: ', response.total, '\nUnique: ', response.unique);
    }).catch((err) => console.log(err.message));
} else if (args[1] !== '--validate' || args[2] !== '--stats') {
  console.log('ingresa opciones validas, ejemplo: ');
  console.log('md-links ./prueba \nmd-links ./prueba --validate \nmd-links ./prueba --stats \nmd-links ./prueba --validate --stats');
}
