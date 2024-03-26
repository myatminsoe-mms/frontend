import api from '@/libs/axios'

const endpoints = {
  organizers: 'v1/organizers',
  option_data: 'v1/options'
}

const service = {
  getAll: async (params) => {
    try {
      const result = await api.get(endpoints.organizers, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  },
  getOne: async (params) => {
    try {
      const result = await api.get(`${endpoints.organizers}/${params.id}`)
      return result.data
    } catch {
      return null
    }
  },
  add: async (params) => {
    //try {
    const result = await api.post(endpoints.organizers, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return result.data
    //} catch {
    //  return null
    //}
  },
  update: async (params) => {
    /**
     * need to use multipart/form-data instead of application/json for files uploads
     * use POST method for update because file upload is included
     * PUT or PATCH method is not supported by multipart/form-data
     * Comment by: Aung Kyaw Minn
     */
    const result = await api.post(`${endpoints.organizers}/${params.id}`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return result.data
  },
  delete: async (params) => {
    try {
      const result = await api.delete(`${endpoints.organizers}/${params.id}`)
      return result.data
    } catch {
      return null
    }
  },
  getAllRole: async (params) => {
    try {
      const result = await api.get(`${endpoints.option_data}/role`, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  }
}

export { service }
