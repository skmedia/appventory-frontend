import createApplicationApi from '~/api/applications'
import createAccountApi from '~/api/accounts'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  inject('applicationApi', createApplicationApi(ctx.$axios))
  inject('accountApi', createAccountApi(ctx.$axios))

  // You can reuse the repositoryWithAxios object:
  // inject("userRepository", repositoryWithAxios('/users'));
}
