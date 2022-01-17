export default $axios => ({

  path: '/api/v1/accounts',

  async index(params) {
    return $axios.$get(`${this.path}`, { params: params })
  },

  async single(id) {
    return $axios.$get(`${this.path}/${id}`)
      .then(i => {
        return {
          ...i,
          tags: i.tags.map(t => ({
            ...t.tag,
          }))
        }
      })
  },

  async create(payload) {
    return $axios.$post(`${this.path}`, payload)
  },

  async update(id, payload) {
    return $axios.$post(`${this.path}/${id}`, payload)
  },

  async delete(id) {
    return $axios.$delete(`${this.path}/${id}`)
  }
})

