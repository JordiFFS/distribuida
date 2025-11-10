module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/hello',
      handler: 'api::hello.hello.index',
      config: {
        auth: false, // Público - no requiere autenticación
      },
    },
    {
      method: 'GET',
      path: '/hello/secure',
      handler: 'api::hello.hello.secure',
      config: {
        // auth: true por defecto - requiere token
      },
    },
  ],
};