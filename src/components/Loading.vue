<template>
  <div class="custom-loading">
    <div class="custom-loading-content"></div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.custom-loading {
  position: fixed;
  z-index: 999999;
  background: rgba(237, 241, 245, 0.6);
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  transition: opacity 0.2s;
  width: 100vw;
  height: 100vh;
}
.custom-loading-content {
  border: 0 solid transparent;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  position: absolute;
  top: calc(50vh - 75px);
  left: calc(50vw - 75px);
}

.custom-loading-content:before,
.custom-loading-content:after {
  content: '';
  border: 1em solid var(--primary-color);
  border-radius: 50%;
  width: inherit;
  height: inherit;
  position: absolute;
  animation: loader 2s linear infinite;
  opacity: 0;
}

.custom-loading-content:before {
  animation-delay: 0.5s;
}

@keyframes loader {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
