# Projects

## Featured Project

### Aero Lane Simulator

Try the interactive demo below. Use the controls to steer the airplane while a water ship moves in the background.

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const lane = ref(0)
const speed = ref(1.6)
const shipOffset = ref(0)

let frame = 0
let rafId = null

const planeX = computed(() => {
  return 50 + lane.value * 28
})

const planeY = computed(() => {
  return 38 - Math.abs(lane.value) * 6
})

function animate() {
  frame += speed.value
  shipOffset.value = (shipOffset.value + speed.value * 0.6) % 100
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<div style="border:1px solid var(--vp-c-divider);border-radius:12px;overflow:hidden;background:linear-gradient(#8fd3ff 0%,#bde9ff 55%,#6bc3ff 56%,#2f90d0 100%);padding:16px;">
  <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
    <label style="display:flex;align-items:center;gap:8px;">
      Lane
      <input v-model.number="lane" type="range" min="-2" max="2" step="1" />
    </label>
    <label style="display:flex;align-items:center;gap:8px;">
      Speed
      <input v-model.number="speed" type="range" min="0.8" max="3" step="0.1" />
    </label>
  </div>

  <div style="position:relative;height:280px;border-radius:10px;background:linear-gradient(to bottom,#78c8ff 0%,#a4e0ff 52%,#4fa8de 53%,#2f86c0 100%);overflow:hidden;">
    <div style="position:absolute;left:0;right:0;top:54%;height:2px;background:rgba(255,255,255,.35);"></div>

    <div
      :style="{
        position: 'absolute',
        left: `${planeX}%`,
        top: `${planeY}%`,
        transform: `translate(-50%, -50%) rotate(${lane * 6}deg)`,
        fontSize: '46px',
        transition: 'left .2s ease, top .2s ease'
      }"
    >
      ✈️
    </div>

    <div
      :style="{
        position: 'absolute',
        left: `${100 - shipOffset}%`,
        top: '66%',
        transform: 'translate(-50%, -50%)',
        fontSize: '44px'
      }"
    >
      🚢
    </div>

    <div
      :style="{
        position: 'absolute',
        left: `${(100 - shipOffset + 8) % 100}%`,
        top: '72%',
        transform: 'translate(-50%, -50%)',
        color: 'rgba(255,255,255,.65)',
        letterSpacing: '2px'
      }"
    >
      ~~~~~
    </div>
  </div>
</div>

---

## GitHub Projects

Below are my open-source projects from GitHub:

<GithubProjects />
