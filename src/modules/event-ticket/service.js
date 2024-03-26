import api from '@/libs/axios'

const endpoints = {
  events: 'v1/events',
  option_data: 'v1/core/options',
  file_upload: 'v1/core/file-upload'
}

const service = {
  getAll: async (params) => {
    try {
      const result = await api.get(endpoints.events, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  },
  getOne: async (params) => {
    try {
      const result = await api.get(`${endpoints.events}/${params.id}`)
      return result.data
    } catch {
      return null
    }
  },
  add: async (params) => {
    // try {
      const result = await api.post(endpoints.events, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return result.data
    // } catch {
    //   return null
    // }
  },
  uploadFile: async (params) => {
    try {
      const formData = new FormData();
        formData.append('images[]', params);

        const result = await api.post(endpoints.file_upload, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return result.data;
    } catch {
      return null
    }
  },
  update: async (params) => {
    // try {
      /**
       * need to use multipart/form-data instead of application/json for files uploads
       * use POST method for update because file upload is included
       * PUT or PATCH method is not supported by multipart/form-data
       * Comment by: Aung Kyaw Minn
       */
      const result = await api.post(`${endpoints.events}/${params.id}`, params)
      return result.data
    // } catch {
    //   return null
    // }
  },
  deactivate: async (params) => {
    try {
      const result = await api.post(`${endpoints.events}/${params.id}`)
      return result.data
    } catch {
      return null
    }
  },
  deleteS3Image: async (params) => {
    try {
      const result = await api.delete(`${endpoints.file_upload}/${params.id}`)
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
  },
  getAllCategory: async (params) => {
    try {
      const result = await api.get(`${endpoints.option_data}/category`, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  },
  getAllType: async (params) => {
    try {
      const result = await api.get(`${endpoints.option_data}/type`, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  },
  getAllTag: async (params) => {
    try {
      const result = await api.get(`${endpoints.option_data}/tag`, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  },
  getAllOrganizer: async (params) => {
    try {
      const result = await api.get(`${endpoints.option_data}/organizer`, {
        params: params
      })
      return result.data
    } catch {
      return null
    }
  },
}

export { service }
