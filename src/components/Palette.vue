<script lang="ts" setup>
import { computed } from 'vue';

// import { computed } from 'vue';
// import type { HexColor } from './../helpers/invertColours' 
// import invert from './../helpers/invertColours' 
  const props = defineProps<{ 
    modelValue: string,
    currentStyle?: string | null,
    dark?: boolean,
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', color: string): void
    (e: 'click'): void
  }>()

  const iconColour = computed(() => props.currentStyle || '#000')

  const updateAndClick = (colour: unknown) => {
    emit('update:modelValue', colour as string)
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
  <v-btn title="text colour" class="split-btn-l" @click="emit('click')">
    <div class="d-flex align-center flex-column justify-center">
      <slot></slot>
      <v-sheet
        tile
        height="4"
        width="26"
        :color="modelValue"
      ></v-sheet>
    </div>
  </v-btn>
  <v-menu
    offset-y
    :dark="dark"
  >
    <template #activator="{ props }">
        <v-btn
          v-bind="props"
          class="split-btn-r"
        >
          <v-icon icon="mdi-menu-down" :color="iconColour" />
        </v-btn>
    </template>
    <v-color-picker 
      hide-canvas 
      hide-inputs 
      hide-sliders 
      show-swatches 
      :model-value="modelValue" 
      @update:model-value="updateAndClick">
    </v-color-picker>
  </v-menu>
</template>

<style>
button.split-btn-l {
  padding: 0 3px 0 10px;
  min-width: 32px;
  border-inline-end-color: #f3f3f3 !important
}
button.split-btn-r {
	padding: 0 7px 0 3px;
  min-width: 12px;
}
</style>
