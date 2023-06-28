<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { roundingMethods, precisionArguments } from './../helpers/rounding'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { ExpandVarLetters, encodeText } from './../tiptap/Variables'
import TTParagraph from '@tiptap/extension-paragraph'
import TTDoc from '@tiptap/extension-document'
import TTText from '@tiptap/extension-text'

type FormulaRounding =  { formula: string, rounding: string }
  const props = defineProps<{ modelValue: FormulaRounding }>()
  const emit = defineEmits<{
    (e:'update:modelValue', value: FormulaRounding): void
    (e:'cancel'): void
  }>()

  const roundingKey = ref(props.modelValue.rounding
    ? props.modelValue.rounding[0]
    : '')
  const roundingPrecision = ref<number | ''>(props.modelValue.rounding 
    ? Number(props.modelValue.rounding.substring(1)) 
    : '')
  const isValid = ref<null | boolean>(null)
  const editor = ref<Editor>();

  const roundingOptions = Object.entries(roundingMethods).map(([value, rm]) => ({
    value,
    title: rm.description,
  })).sort((a, b) => a.title < b.title ? -1 : 1)

  const roundingHint = computed(() => roundingMethods[roundingKey.value].explanation)
  const requiresPrecision = computed(() => roundingMethods[roundingKey.value].requiresPrecision)
  const integerPrecisionMax = 5
  const isIntegerPrecision = computed(() => requiresPrecision.value === precisionArguments.integer)

/*
  const formulaRules = [
    (f: string) => f !== '' || 'A formula is required',
    (f: string) => !/\p{L}/u.test(f.replaceAll('weight', '').replaceAll('BSA', '')) || 'the only characters allowed are the specific words weight and BSA'
  ]
  */
  const roundingPrecisionRules = computed(() => [
    (p: number | '') => !requiresPrecision.value
      || p !== ''
      || 'A number is required for the selected rounding method',
    (p: number | '') => !requiresPrecision.value
      || (p !== '' && p > 0)
      || 'Value must be greater than 0',
    (p: number | '') => !isIntegerPrecision.value
      || Number.isInteger(p) 
      || 'Value must be a whole number',
    (p: number | '') => !isIntegerPrecision.value
      || (p !== '' &&  p <= integerPrecisionMax)
      || `Value must be ${integerPrecisionMax} or less`
  ])
  console.log(encodeText(props.modelValue.formula))
  onMounted(() => {
    editor.value = new Editor({
      extensions: [
        TTDoc,
        TTParagraph,
        TTText,
        ExpandVarLetters,
      ],
      content: {
        type: 'doc',
        content: [ encodeText(props.modelValue.formula) ],
      },
    })
  })
  
  onBeforeUnmount(() => {
    editor.value?.destroy()
  })

  const submit = () => {
    if (isValid.value) {
      let rounding = roundingKey.value
      if (requiresPrecision.value) {
        rounding += roundingPrecision.value
      }
      debugger
      emit('update:modelValue', {
          formula: editor.value!.getText(), 
          rounding
      })
    }
  }
</script>
<template>
  <v-form 
    v-model="isValid"
    @submit.prevent="submit"
  >
    <v-card
      class="mx-auto"
      elevation="1"
    >
      <v-card-title class="py-5 font-weight-black">Edit Formula</v-card-title>
      <v-card-text>
        <EditorContent :editor="editor" />
        <!--
        <v-text-field
          v-model="editableFormula"
          :rules="formulaRules"
          label="Calculation"
          ref="el"
        ></v-text-field> -->

        <v-select label="Rounding method" 
          v-model="roundingKey" 
          :items="roundingOptions"
          :hint="roundingHint"
          :persistent-hint="true"
          density="compact"
        />
        
        <v-text-field
          v-model.number="roundingPrecision"
          :rules="roundingPrecisionRules"
          label="Rounding precision"
          :min="isIntegerPrecision ? 1 : 0"
          :max="isIntegerPrecision ? integerPrecisionMax : undefined"
          :step="isIntegerPrecision ? 1 : 0"
          type="number"
          :disabled="!requiresPrecision"
          density="compact"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          type="submit"
        >
          Update
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="emit('cancel')"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style>
.variable {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  white-space: break-spaces;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  display: inline-block;
  box-sizing: border-box;
  color: rgb(31, 35, 40)
}
</style>