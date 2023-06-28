<script setup lang="ts">
import {computed, ref} from 'vue'
import DrugEditor from './components/DrugEditor.vue';

const doseDescription = ref('<p>The dose of parafabulosum for a <output data-formula="wt" class="inline-calculation"></output> Kg child is <output data-formula="wt>50?15:(wt*0.3)" data-rounding="p2" class="inline-calculation"></output> mg</p>')
const weight = ref(40)

const calculatedHTML = computed(() => {
  const template = document.createElement('template')
  template.innerHTML = doseDescription.value
  for (const o of template.content.querySelectorAll<HTMLOutputElement>('output[data-formula]')) {
    let formula = o.getAttribute('data-formula')
    if (formula === null) return ''
    formula = formula?.replaceAll('w', weight.value.toString())
    formula = formula.replace(/[^\d.()<>=?:+*/%-]/g, '')
    let result: Number;
    try {
      result = Number(Function(`"use strict";return (${formula});`)())
    }
    catch (e) {
      console.log(e)
      return ''
    }
    let rounding = o.getAttribute('data-rounding')
    let rounded: string;
    if (rounding) {
      const precision = Number(rounding.substring(1))
      switch (rounding[0]) {
        case 'f':
          rounded = result.toFixed(precision)
          break
        case 'p':
          rounded = result.toPrecision(precision)
          break
        default:
          throw new Error(`unknown rounding expression: '${rounding}'`)
      }
    } else {
      rounded = result.toString();
    }
    o.value = rounded
  }
  return template.innerHTML
})

</script>

<template>
  <h4>Early prototype formula editor</h4>
  <DrugEditor v-model="doseDescription" />
  <hr>
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
