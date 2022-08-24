<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
<style lang="scss">
html {
  --scrollbarBG: #cfd8dc;

  --thumbBG: #90a4ae;
}

::-webkit-scrollbar {
  width: 10px;

  height: 10px;
}

body,
html {
  scrollbar-width: thin;

  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
}

::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}

::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);

  border-radius: 6px;

  border: 3px solid var(--scrollbarBG);
}
</style>