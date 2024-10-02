<template>
  <div class="ticker-container">
    <div class="ticker-content">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollingTicker',
  data() {
    return {
      message: '这是一个滚动公告！'
    };
  }
}
</script>

<style scoped>
.ticker-container {
  position: relative;
  height: 50px; /* 根据需要调整高度 */
  overflow: hidden;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}

.ticker-content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  animation: scroll-up 10s linear infinite;
}

@keyframes scroll-up {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-110%);
  }
}

p {
  margin: 0;
  padding: 0;
  white-space: nowrap;
}
</style>
