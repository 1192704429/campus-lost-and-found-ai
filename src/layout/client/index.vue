<template>
  <div class="client-layout">
    <client-header />
    <main class="client-main">
      <router-view />
    </main>
    <client-footer />
  </div>
</template>

<script>
import ClientHeader from './components/ClientHeader'
import ClientFooter from './components/ClientFooter'

export default {
  name: 'ClientLayout',
  components: {
    ClientHeader,
    ClientFooter
  }
}
</script>

<style lang="scss" scoped>
@import "./client-theme.scss";

.client-layout {
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 8%, rgba(47, 125, 101, 0.07), transparent 24%),
    radial-gradient(circle at 92% 12%, rgba(29, 79, 145, 0.08), transparent 26%),
    $client-color-bg;
  display: flex;
  flex-direction: column;
}

.client-main {
  flex: 1;
}
</style>

<style lang="scss">
@import "./client-unified.scss";
</style>
