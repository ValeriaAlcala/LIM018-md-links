const routes = require('../index.js');
const fs= require('fs');
const routeTest = './README.md'
const absoluteRoute = '/Users/valeria/Desktop/LIM018-md-links/README.md'
const readFile= fs.readFileSync(absoluteRoute, 'utf-8')
const directorio = './carpeta'

describe('routeExists', () => {

  it('deberia ser una funcion', () => {
    expect(typeof routes.routeExists).toBe('function');
  });

  it('Verificar si la ruta existe', () =>{
    expect(routes.routeExists(routeTest)).toBe('La ruta existe');
  });

  it('Probar con una ruta falsa', () =>{
    expect(routes.routeExists('./READMEFALSO.md')).toBe('La ruta no existe');
  });

});

describe('routeAbsolute', () => {

  it('deberia ser una funcion', () => {
    expect(typeof routes.routeAbsolute).toBe('function');
  });

  it('Verificar si la ruta es relativa', () =>{
    expect(routes.routeAbsolute(routeTest)).toBe('La ruta es relativa');
  });

  it('Probar con una ruta absoluta', () =>{
    expect(routes.routeAbsolute(absoluteRoute)).toBe('La ruta es absoluta');
  });

});

describe('routeRelative', () => {

  it('deberia ser una funcion', () => {
    expect(typeof routes.routeRelative).toBe('function');
  });

  it('Transformar la ruta relativa a absoluta', () =>{
    expect(routes.routeRelative(routeTest)).toBe(absoluteRoute);
  });

  it('Devolver la ruta si es absoluta', () =>{
    expect(routes.routeRelative(absoluteRoute)).toBe(absoluteRoute);
  });

});

describe('routeExtension', () => {

  it('deberia ser una funcion', () => {
    expect(typeof routes.routeExtension).toBe('function');
  });

  it('Extraer la extension de la ruta', () =>{
    expect(routes.routeExtension(routeTest)).toBe('.md');
  });

});

describe('readRoute', () => {

  it('deberia ser una funcion', () => {
    expect(typeof routes.readRoute).toBe('function');
  });

  it('deberia devolver el contenido del archivo', () => {
    expect(routes.readRoute(absoluteRoute)).toBe(readFile);
  })

}); 

describe('linksRoute', () => {

  it('deberia ser una funcion', () => {
    expect(typeof routes.linksRoute).toBe('function');
  });

  // it('extraer solo la url', () =>{
  //   expect(routes.linksRoute(routeTest)).toBe(['https://github.com/ValeriaAlcala/LIM018-md-link']);
  // })
}); 

describe('recursion', () => {

  it('deberia devolver todos los archivos .md', () => {
    const arrayDirectory = 
    [
      'fileDoc\\fileDocII\\prueba3.md',
      'fileDoc\\fileDocII\\prueba4.md',
      'fileDoc\\prueba1.md',
      'fileDoc\\prueba2.md'
    ]

  const x = findFileInDirectory(directorio)

    expect(x).toEqual(arrayDirectory)
  })
})
