<script setup lang="ts">
import {computed, ref} from 'vue'
import DrugEditor from './components/DrugEditor.vue';

const doseDescription = ref('<p>The dose of parafabulosum for a <output data-formula="[weightKg]" class="inline-calculation"></output> Kg child is <output data-formula="([weightKg]>50?15:([weightKg]*0.3)).toPrecision(2)" class="inline-calculation"></output> mg</p>')
const weight = ref(40)

const calculatedHTML = computed(() => {
  const template = document.createElement('template')
  template.innerHTML = doseDescription.value
  for (const o of template.content.querySelectorAll<HTMLOutputElement>('output[data-formula]')) {
    let formula = o.getAttribute('data-formula')
    if (formula === null) return ''
    formula = formula?.replaceAll('[weightKg]', weight.value.toString())
    try {
      const v = Function(`"use strict";return (${formula});`)();
      o.value = v as string
    }
    catch (e) {
      console.log(e)
      return ''
    }
  }
  return template.innerHTML
})

</script>

<template>
  <h4>Early prototype formula editor</h4>
  <DrugEditor v-model="doseDescription" />
  <hr>
  <aside>Final code will NOT allow raw user input to execute as javascript - this is a proof of concept which would have serious security risks in production in its current state</aside>
  <label>
    Weight
      <input type="number" v-model.number="weight">
    Kg
  </label>
  <div v-html="calculatedHTML"></div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
