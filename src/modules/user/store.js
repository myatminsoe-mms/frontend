import { defineStore } from 'pinia'
import { service } from './service'

export const useStore = defineStore({
  id: 'useUserStore',
  state: () => ({
    listResponse: null,
    oneResponse: null,
    updateResponse: null,
    addResponse: null,
    deleteResponse: null,
    allRoleResponse: null
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
    }
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
    async add(params) {
      const response = await service.add(params)
      this.addResponse = response
    },
    async delete(params) {
      const response = await service.delete(params)
      this.deleteResponse = response
    },
    async fetchAllRole(params) {
      if (this.allRoleResponse == null) {
        const response = await service.getAllRole(params)
        this.allRoleResponse = response
      }
    }
  }
})
