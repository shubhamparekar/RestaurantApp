import axios from "axios"
import { useApplicationStore } from "./index"

export const actions = {

    async getFoodItems(key) {
        const store = useApplicationStore()
        return await axios
            .get(`${store.$state.url}/foodItems?foodCategoryName=${key}`)
            .then((response) => {
                return response.data.foodItems
            })
            .catch(error => console.log(error))
    },

    async submitOrder(data) {
        const store = useApplicationStore()
        return await axios
            .post(`${store.$state.url}/orders`, data)
            .then((response) => {
                return response
            })
            .catch(error => console.log(error))
    },

    async getFoodCategory() {
        const store = useApplicationStore()
        return await axios
            .get(`${store.$state.url}/foodCategories`)
            .then((response) => {
              console.log(response)
                return response.data.foodCategories
            })
            .catch(error => console.log(error))
    },

    async getAllOrders() {
        const store = useApplicationStore()
        return await axios
            .get(`${store.$state.url}/orders`)
            .then((response) => {
                return response.data.orders
            })
            .catch(error => console.log(error))
    }
}
