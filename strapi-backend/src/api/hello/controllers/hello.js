'use strict';

module.exports = {
  // Endpoint público
  async index(ctx) {
    try {
      ctx.body = {
        message: '¡Hola Mundo desde Strapi! 🚀',
        timestamp: new Date().toISOString(),
        data: {
          saludo: 'Bienvenido a tu API con Strapi',
          proyecto: 'jordiffs-distribuida',
          status: 'success',
          version: '1.0.0',
          endpoints: {
            public: '/api/hello',
            secure: '/api/hello/secure (requiere token)'
          }
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  // Endpoint protegido
  async secure(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('No estás autenticado');
      }

      ctx.body = {
        message: `¡Hola ${user.username}! Este es un mensaje seguro 🔐`,
        timestamp: new Date().toISOString(),
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        data: {
          saludo: 'Accediste a un endpoint protegido',
          status: 'authenticated'
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
};