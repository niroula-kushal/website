<template>
  <div class="sim-card">
    <div class="sim-controls">
      <label>
        Lane
        <input v-model.number="lane" type="range" min="-2" max="2" step="1" />
      </label>
      <label>
        Speed
        <input v-model.number="speed" type="range" min="0.8" max="3" step="0.1" />
      </label>
    </div>

    <div class="sim-scene">
      <div class="horizon"></div>

      <div class="plane" :style="planeStyle">✈️</div>

      <div class="ship" :style="shipStyle">🚢</div>
      <div class="wake" :style="wakeStyle">~~~~~</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const lane = ref(0)
const speed = ref(1.6)
const shipOffset = ref(0)

let rafId: number | null = null

const planeStyle = computed(() => ({
  left: `${50 + lane.value * 28}%`,
  top: `${38 - Math.abs(lane.value) * 6}%`,
  transform: `translate(-50%, -50%) rotate(${lane.value * 6}deg)`,
}))

const shipStyle = computed(() => ({
  left: `${100 - shipOffset.value}%`,
}))

const wakeStyle = computed(() => ({
  left: `${(100 - shipOffset.value + 8) % 100}%`,
}))

const animate = () => {
  shipOffset.value = (shipOffset.value + speed.value * 0.6) % 100
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.sim-card { border:1px solid var(--vp-c-divider); border-radius:12px; overflow:hidden; background:linear-gradient(#8fd3ff 0%,#bde9ff 55%,#6bc3ff 56%,#2f90d0 100%); padding:16px; }
.sim-controls { display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:10px; }
.sim-controls label { display:flex; align-items:center; gap:8px; }
.sim-scene { position:relative; height:280px; border-radius:10px; background:linear-gradient(to bottom,#78c8ff 0%,#a4e0ff 52%,#4fa8de 53%,#2f86c0 100%); overflow:hidden; }
.horizon { position:absolute; left:0; right:0; top:54%; height:2px; background:rgba(255,255,255,.35); }
.plane { position:absolute; font-size:46px; transition:left .2s ease, top .2s ease; }
.ship { position:absolute; top:66%; transform:translate(-50%, -50%); font-size:44px; }
.wake { position:absolute; top:72%; transform:translate(-50%, -50%); color:rgba(255,255,255,.65); letter-spacing:2px; }
</style>
