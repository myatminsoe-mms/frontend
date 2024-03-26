import { defineStore } from 'pinia'
import { service } from './service'

export const useStore = defineStore({
  id: 'useEventStore',
  state: () => ({
    listResponse: null,
    oneResponse: null,
    updateResponse: null,
    addResponse: null,
    deleteResponse: null,
    allRoleResponse: null,
    allTagResponse: null,
    allCategoryResponse: null,
    allOrganizerResponse: null,
    allTypeResponse: null,
    uploadFileResponse: null,
    deleteS3ImageResponse: null,
  }),

  getters: {
    getAllResponse(state) {
      return state.listResponse
    },
    getOneResponse(state) {
      return state.oneResponse
    },
    getAddResponse(state) {
      return state.addResponse
    },
    getUpdateResponse(state) {
      return state.updateResponse
    },
    getDeleteResponse(state) {
      return state.deleteResponse
    },
    getAllRoleResponse(state) {
      return state.allRoleResponse
    },
    getAllTagResponse(state) {
      return state.allTagResponse
    },
    getAllTypeResponse(state) {
      return state.allTypeResponse
    },
    getAllCategoryResponse(state) {
      return state.allCategoryResponse
    },
    getAllOrganizerResponse(state) {
      return state.allOrganizerResponse
    },
    getUploadFileResponse(state) {
      return state.uploadFileResponse
    },
    getDeleteS3ImageResponse(state) {
      return state.deleteS3ImageResponse
    },
  },

  actions: {
    async fetchAll(params) {
      const response = await service.getAll(params)
      this.listResponse = response
    },
    async fetchOne(params) {
      const response = await service.getOne(params)
      this.oneResponse = response
    },
    async update(params) {
      const response = await service.update(params)
      this.updateResponse = response
    },
    async uploadFile(params) {
      const response = await service.uploadFile(params)
      this.uploadFileResponse = response
    },
    async deleteS3Image(params) {
      const response = await service.deleteS3Image(params)
      this.deleteS3ImageResponse = response
    },
    async add(params) {
      const response = await service.add(params)
      this.addResponse = response
    },
    async deactivate(params) {
      const response = await service.deactivate(params)
      this.deleteResponse = response
    },
    async fetchAllRole(params) {
      if (this.allRoleResponse == null) {
        const response = await service.getAllRole(params)
        this.allRoleResponse = response
      }
    },
    async fetchAllTag(params) {
      if (this.allTagResponse == null) {
        const response = await service.getAllTag(params)
        this.allTagResponse = response
      }
    },
    async fetchAllType(params) {
      if (this.allTypeResponse == null) {
        const response = await service.getAllType(params)
        this.allTypeResponse = response
      }
    },
    async fetchAllCategory(params) {
      if (this.allCategoryResponse == null) {
        const response = await service.getAllCategory(params)
        this.allCategoryResponse = response
      }
    },
    async fetchAllOrganizer(params) {
      if (this.allOrganizerResponse == null) {
        const response = await service.getAllOrganizer(params)
        this.allOrganizerResponse = response
      }
    }
  }
})
