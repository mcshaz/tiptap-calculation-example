<script lang="ts" setup>
import { computed } from 'vue';
// import type { HexColor } from './../helpers/invertColours' 
// import invert from './../helpers/invertColours' 
  const props = defineProps<{ 
    modelValue: string,
    dark?: boolean,
    isHighlight?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', color: string): void
    (e: 'click') : void
  }>()

  const icon = props.isHighlight ? 'mdi-format-color-highlight' : 'mdi-format-color-text'
  const style = computed(() => props.isHighlight ? { backgroundColor: props.modelValue } : { color: props.modelValue })

  function clickAndEmit(c: string) {
    emit('update:modelValue', c)
    emit('click')
  }
  /*
  const swatches = [ ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'], ]
  */

  /* const background = computed(() => ({backgroundColor: invert(props.modelValue)}))
  function setColor(color: string) {
    emit("update:modelValue", color)
  }
  */
</script>

<template>
  <v-menu
    offset-y
    :dark="dark"
  >
    <template #activator="{ props }">
      <div class="v-btn">
        <button
          :style="style"
          class="left-btn"
          @click="emit('click')"
        >
          <v-icon :icon="icon"/>
        </button>
        <button
          @click="props.onClick"
          class="right-btn"
        >
          <v-icon icon="mdi-chevron-down" />
        </button>
      </div>
    </template>
    <v-color-picker 
      hide-canvas 
      hide-inputs 
      hide-sliders 
      show-swatches 
      mode="hex" 
      :model-value="modelValue" 
      @update:model-value="clickAndEmit"
    />
  </v-menu>
</template>

<style>
button.left-btn {
  padding: 0 7px 0 7px
}
button.right-btn {
	padding: 0 3px 0 3px;
	border-left: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: unset;
}
</style>
