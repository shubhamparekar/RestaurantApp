<template>
  <h2 class="text-center q-ma-md">The BreakFast Club</h2>
  <div class="col">
    <div class="row justify-center">
      <div class="col-4">
        <q-form class="q-ma-md">
          <q-input
            outlined
            label="Order Number"
            name="orderNumber"
            v-model="orderNumber"
            class="q-pb-sm"
            disable
          >
            <template v-slot:prepend>
              <q-icon name="grid_3x3" color="orange-5" />
            </template>
          </q-input>
          <q-input
            outlined
            ref="nameRef"
            label="Customer Name"
            name="customerName"
            class="q-pb-lg"
            v-model="customerName"
            :rules="[
              (val) => (val && val.length > 0) || 'Please enter Customer Name',
            ]"
            lazy-rules
          />
          <div class="row justify-end">
            <q-btn
              color="orange-5"
              label="Submit"
              icon-right="fastfood"
              @click="onSubmit"
            />
            <q-btn color="orange-5" icon="refresh" @click="onResetForm()" />
          </div>
        </q-form>
      </div>
      <div class="col-4">
        <q-form class="q-ma-md">
          <q-input
            outlined
            label="Grand Total"
            name="grandTotal"
            v-model="grandTotal"
            class="q-pb-sm"
            disable
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="green-6" />
            </template>
          </q-input>
          <q-select
            outlined
            ref="paymentRef"
            label="Payment Mode"
            name="paymentMethod"
            class="q-pb-lg"
            :options="payment"
            :rules="[(val) => val != '' || 'Please seleted a payment method']"
            lazy-rules
            v-model="paymentMethod"
          />
          <div class="row justify-start">
            <q-btn
              color="blue-grey-14"
              icon="format_list_bulleted"
              label="Order"
              @click="getAllOrders()"
            />

            <q-btn
              label="Clear Cart"
              icon-right="remove_shopping_cart"
              color="orange-5"
              v-if="!_.isEmpty(selectedFoodItems)"
              @click="toggleClearCart = true"
            />
          </div>
        </q-form>
      </div>
    </div>
    <div class="row justify-center q-pt-lg">
      <div class="q-px-xl">
        <div class="col q-pb-md" style="width: 300px">
          <div>
            <q-input
              label="Search food items"
              name="search"
              v-model="searchElement"
              class="q-pb-sm"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="row">
            <q-toggle
              v-model="vegFilter"
              checked-icon="check"
              unchecked-icon="clear"
              false-value=""
              true-value="Veg"
              label="Non-Veg"
              color="orange-5"
            />

            <q-toggle
              v-model="nonVegFilter"
              checked-icon="check"
              unchecked-icon="clear"
              false-value=""
              true-value="Non-Veg"
              label="Veg"
              color="orange-5"
            />
          </div>
        </div>
        <q-list style="width: 250px">
          <div
            v-for="category in foodCategory"
            :key="category.foodCategoryName"
          >
            <q-item
              clickable
              active-class="active-category-menu"
              :active="selected === category.foodCategoryName"
              @click="selectFoodCategory(category.foodCategoryName)"
            >
              <q-item-section avatar>
                <q-icon :name="icon(category.foodCategoryName)" />
              </q-item-section>
              <q-item-section>{{ category.foodCategoryName }}</q-item-section>
              <q-item-section avatar>
                <q-icon name="arrow_forward_ios" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </div>
      <div class="q-px-xl">
        <q-list style="width: 350px; height: 360px; overflow-y: auto">
          <div
            v-for="food in filteredFoodItems"
            :key="food._id"
            ref="scrollRef"
          >
            <q-item clickable>
              <q-item-section>
                <q-item-label>{{ food.foodItemName }}</q-item-label>
                <q-item-label caption>${{ food.price }}</q-item-label>
              </q-item-section>
              <q-item-section side @click="addFoodItem(food)">
                <q-icon name="add_shopping_cart" color="green" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </div>
      <div class="q-px-xl">
        <q-list style="width: 350px">
          <q-item-label
            class="text-center q-pb-md"
            style="font-weight: bold; font-size: 200%"
            >Food Cart</q-item-label
          >
          <div style="width: 360px; height: 265px; overflow-y: auto">
            <div v-for="food in selectedFoodItems" :key="food.foodItemID">
              <q-item clickable>
                <q-item-section top>
                  <q-item-label
                    >{{ food.foodItemName }} -
                    <span style="opacity: 0.7"
                      >${{
                        Math.floor(food.price * food.quantity * 100) / 100
                      }}</span
                    ></q-item-label
                  >
                  <div class="text-grey-8 q-gutter-xs q-pt-sm">
                    <q-btn
                      icon="exposure_plus_1"
                      color="orange-5"
                      size="sm"
                      @click="updateQuantity(food.foodItemID, 1)"
                    />
                    <q-btn disable size="sm">{{ food.quantity }}</q-btn>
                    <q-btn
                      icon="exposure_neg_1"
                      color="orange-5"
                      size="sm"
                      @click="updateQuantity(food.foodItemID, -1)"
                    />
                  </div>
                </q-item-section>
                <q-item-section side @click="deleteFoodItem(food._id)">
                  <q-icon name="delete" size="1.5em" color="red" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-list>
      </div>
    </div>
    <q-dialog v-model="toggleEmptyCart">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row">
          <q-icon name="warning" color="red" size="5em" class="q-pr-sm" />
          <div class="text-h2">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center" style="font-size: large">
          <div class="test-h4">The cart cannot be Empty</div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-lg">
          <q-btn flat icon="done" size="2em" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toggleClearCart" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row">
          <q-icon name="warning" color="red" size="5em" class="q-pr-sm" />
        </q-card-section>

        <q-card-section class="q-pt-none text-center" style="font-size: large">
          <div class="test-h4">Are you sure you want to clear the cart?</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat icon="clear" size="2em" color="green" v-close-popup />
          <q-btn
            flat
            icon="done"
            size="2em"
            color="red"
            @click="resetCart()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="toggleOrder">
      <q-card style="width: 1200px; max-width: 100vw">
        <div class="col">
          <h3 class="q-my-md text-center">Orders</h3>
          <div class="q-pa-md">
            <q-table
              class="my-sticky-header-table"
              :rows="orders"
              :columns="ordersColumn"
              row-key="orderNumber"
              flat
              bordered
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    style="font-weight: bold; font-size: 150%"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td
                    key="orderNumber"
                    :props="props"
                    style="font-weight: 500; font-size: 120%"
                  >
                    {{ props.row.orderNumber }}
                  </q-td>
                  <q-td
                    key="customerName"
                    :props="props"
                    style="font-weight: 500; font-size: 120%"
                  >
                    {{ props.row.customerName }}
                  </q-td>
                  <q-td
                    key="paymentMethod"
                    :props="props"
                    style="font-weight: 500; font-size: 120%"
                  >
                    {{ props.row.paymentMethod }}
                  </q-td>
                  <q-td
                    key="grandTotal"
                    :props="props"
                    style="font-weight: 500; font-size: 120%"
                  >
                    {{ props.row.grandTotal }}
                  </q-td>
                  <q-td key="orderId">
                    <div class="row justify-center">
                      <q-icon
                        name="edit"
                        color="primary"
                        size="2em"
                        class="q-pr-sm"
                        style="cursor: pointer"
                      />
                      <q-icon
                        name="delete"
                        color="red"
                        size="2em"
                        class="q-pl-sm"
                        style="cursor: pointer"
                      />
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <q-card-actions align="right" class="q-px-lg">
            <q-btn flat icon="done" size="2em" color="primary" v-close-popup />
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import _ from "lodash";
import { useApplicationStore } from "../../stores/application/index";
export default {
  setup() {
    const useStore = useApplicationStore();
    const payment = ref(["Cash", "Card", "UPI"]);
    const orderNumber = ref(generateOrderNumber());
    const paymentMethod = ref("");
    const customerName = ref("");
    const paymentRef = ref("");
    const nameRef = ref("");
    const toggleEmptyCart = ref(false);
    const toggleClearCart = ref(false);
    const toggleOrder = ref(false);
    const searchElement = ref("");
    const selectedFoodItems = ref([]);
    const scrollRef = ref(null);
    const vegFilter = ref("");
    const nonVegFilter = ref("");
    const selected = ref(null);
    const foodItems = ref([]);
    const orders = ref([]);

    function generateOrderNumber() {
      return Math.floor(Math.random() * 9000000000).toString();
    }

    const filteredFoodItems = computed(() => {
      return foodItems.value.filter((food) => {
        if (
          (vegFilter.value === "" && nonVegFilter.value === "") ||
          (vegFilter.value !== "" && nonVegFilter.value !== "")
        ) {
          return (
            food.foodItemName
              .toLowerCase()
              .match(searchElement.value.toLowerCase()) &&
            selectedFoodItems.value.every(
              (item) => item.foodItemID !== food._id
            )
          );
        } else {
          return (
            food.foodItemName
              .toLowerCase()
              .match(searchElement.value.toLowerCase()) &&
            selectedFoodItems.value.every(
              (item) => item.foodItemID !== food._id
            ) &&
            food.foodCategory !== vegFilter.value &&
            food.foodCategory !== nonVegFilter.value
          );
        }
      });
    });

    const grandTotal = computed(() => {
      var total = 0;
      for (let i in selectedFoodItems.value) {
        var object = selectedFoodItems.value[i];
        total += object.quantity * object.price;
      }
      return Math.floor(total * 100) / 100;
    });

    function addFoodItem(data) {
      selectedFoodItems.value.push({
        foodItemID: data._id,
        orderNumber: orderNumber,
        foodItemName: data.foodItemName,
        price: data.price,
        quantity: 1,
        paymentMethod: paymentMethod,
        totalPrice: 0,
      });
    }

    function onSubmit() {
      const name = nameRef.value.validate();
      const payment = paymentRef.value.validate();
      const total = _.isEmpty(selectedFoodItems.value);
      if (!total) {
        if (name && payment) {
          const foodOrder = {
            orderNumber: orderNumber.value,
            customerName: customerName.value,
            paymentMethod: paymentMethod.value,
            grandTotal: grandTotal.value,
            orderedFoodItems: selectedFoodItems.value,
          };
          const foodItems = selectedFoodItems.value;
          useStore.submitOrder({ foodOrder, foodItems });
          onResetForm();
          resetCart();
          generateOrderNumber();
        }
      } else {
        toggleEmptyCart.value = true;
      }
    }

    function onResetForm() {
      paymentMethod.value = "";
      customerName.value = "";
      searchElement.value = "";
      vegFilter.value = "";
      nonVegFilter.value = "";
      selected.value = foodCategory.value[0].foodCategoryName;
      nameRef.value.resetValidation();
      paymentRef.value.resetValidation();
      console.log(scrollRef.value);
      //scrollRef.value.scrollIntoView();
    }
    function resetCart() {
      selectedFoodItems.value = [];
    }

    function updateQuantity(key, value) {
      var object = selectedFoodItems.value.find(
        (item) => item.foodItemID === key
      );
      if (value === 1) {
        object.quantity += value;
      } else if (value === -1) {
        if (object.quantity > 1) {
          object.quantity += value;
        } else {
        }
      }
      object.totalPrice = object.price * object.quantity;
      Math.floor(object.totalPrice * 100) / 100;
    }

    const foodCategory = ref([]);
    useStore.getFoodCategory().then((response) => {
      foodCategory.value = response;
      selected.value = foodCategory.value[0].foodCategoryName;
      getFoodItems(selected.value);
    });

    function icon(name) {
      return foodCategory.value.find((item) => item.foodCategoryName === name)
        .icon;
    }

    function deleteFoodItem(key) {
      if (selectedFoodItems.value.length !== 1) {
        const index = selectedFoodItems.value.findIndex(
          (ele) => ele.foodItemID === key
        );
        selectedFoodItems.value.splice(index, 1);
      } else {
        toggleClearCart.value = true;
      }
    }

    function getFoodItems(key) {
      useStore.getFoodItems(key).then((response) => {
        foodItems.value = response;
      });
    }

    function selectFoodCategory(key) {
      selected.value = key;
      getFoodItems(key);
    }

    function getAllOrders() {
      useStore.getAllOrders().then((response) => {
        orders.value = response;
        toggleOrder.value = true;
      });
    }

    const ordersColumn = ref([
      {
        name: "orderNumber",
        field: "orderNumber",
        label: "Order Number",
        align: "center",
      },
      {
        name: "customerName",
        field: "customerName",
        align: "center",
        label: "Customer Name",
      },
      {
        name: "paymentMethod",
        field: "paymentMethod",
        label: "Payment Method",
        align: "center",
      },
      {
        name: "grandTotal",
        field: "grandTotal",
        label: "Grand Total",
        align: "center",
      },
      {
        name: "actions",
        label: "Actions",
        align: "center",
      },
    ]);

    return {
      useStore,
      payment,
      generateOrderNumber,
      orderNumber,
      foodItems,
      searchElement,
      filteredFoodItems,
      selectedFoodItems,
      addFoodItem,
      deleteFoodItem,
      updateQuantity,
      grandTotal,
      onSubmit,
      paymentMethod,
      customerName,
      paymentRef,
      nameRef,
      toggleEmptyCart,
      toggleClearCart,
      toggleOrder,
      onResetForm,
      resetCart,
      _,
      foodCategory,
      selected,
      icon,
      vegFilter,
      nonVegFilter,
      getFoodItems,
      selectFoodCategory,
      orders,
      getAllOrders,
      ordersColumn,
      scrollRef,
    };
  },
};
</script>

<style lang="scss">
.hvr-clss:hover {
  background: #e8e8e8;
}
.icon {
  display: none;
}
.q-icon:hover .icon {
  display: block;
}
</style>
<style lang="sass">
.active-category-menu
  color: white
  background: #ffa726

.my-sticky-header-table
  /* height or max-height is important */
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #ffa726

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
