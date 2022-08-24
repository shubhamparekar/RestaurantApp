<template>
  <div class="row absolute-right q-mt-xl q-mr-xl" >
    <div class="absolute-right q-pt-lg">
    <q-btn label="Sign Up" color="primary" flat />
    </div>
    <div class="q-mt-xl q-mr-md q-pt-lg">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled v-model="emailId" label="Email ID" />

      <q-input filled v-model="password" label="Password" />

      <div>
        <q-btn label="LogIn" type="submit" color="primary" />
        <q-btn label="Forgot Password?" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const emailId = ref(null);
    const password = ref(null);

    function onSubmit() {
      
    }

    return {
      $q,
      emailId,
      password,
      onSubmit,
    };
  },
};
</script>
