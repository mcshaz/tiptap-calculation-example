<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import TTBold from '@tiptap/extension-bold'
import TTParagraph from '@tiptap/extension-paragraph'
import TTDoc from '@tiptap/extension-document'
import TTText from '@tiptap/extension-text'

// import Bold from '@tiptap/extension-bold'
import { Calculation } from '../tiptap/Calculation'
import Formula from './Formula.vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]}>();
const editor = ref<Editor>();
const dialog = ref(false)
const activeFormulaDetails = ref({ formula: '', rounding: ''})

const getFormula = (pmAttrs: Record<string, unknown>, elDataset: DOMStringMap) => {
  // bit of a hack - by not creating a new object, we won't trigger watchers
  activeFormulaDetails.value.formula = pmAttrs.formula as string || elDataset.formula || '',
  activeFormulaDetails.value.rounding = pmAttrs.rounding as string || elDataset.rounding || ''
  dialog.value = true
  return true
}

watch(activeFormulaDetails, (newFormula, oldFormula) => {
  let chain = editor.value!.chain()
  // formula empty or pre-existing [calculations are an atom/unmutable] - delete 
  if (oldFormula.formula !== '') {
    chain = chain.removeCalculation()
  }
  chain.insertCalculation({...newFormula})
    .run()
  dialog.value = false
})

watch(() => props.modelValue, value => {
  if (editor.value) {
    // HTML
    const isSame = editor.value.getHTML() === value
    // JSON
    // const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(value)
    if (isSame) {
      return
    }
    editor.value.commands.setContent(value, false)
  }
}),

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      TTDoc,
      TTParagraph,
      TTText,
      TTBold,
      Calculation.configure({
        onClick: getFormula,
        HTMLAttributes: {
          'class': 'inline-calculation'
        }
      }),
    ],
    content: props.modelValue,
    // props.modelValue,
    onUpdate: ({ editor }) => {
      // HTML
      emit('update:modelValue', editor.getHTML())

      // JSON
      // emit('update:modelValue', editor.getJSON())
    },
  })
}),

onBeforeUnmount(() => {
  editor.value?.destroy()
})
// .toggleBold()
</script>

<template>
  <div class="tt-editor">
    <button @click="editor!.chain().focus().toggleBold().run()">
      <strong>
        B
      </strong>
    </button>
    <button @click="getFormula({}, {})" title="insert calculation (or press Control+Shift+{ keys in editor)">
      <i class="inline-calculation">
        f(x)
      </i>
    </button>

    <EditorContent :editor="editor" />

    <v-dialog
      v-model="dialog"
      width="500"
      persistent
    >
    <Formula v-model="activeFormulaDetails" @cancel="dialog=false" />
    </v-dialog>
  </div> 
</template>

<style>
.tt-editor {
  border: 2px solid grey;
}

.inline-calculation {
  display:inline-block;
  background-color: #f0f0f0;
  font-weight: bold;
	line-height: 1;
	white-space: nowrap;
}

.tt-editor .inline-calculation {
	font-family: "Nimbus Roman No9 L","Times New Roman",Times,serif;
	font-size: 118%;
	font-feature-settings: "lnum","tnum","kern" 0;
	font-variant-numeric: lining-nums tabular-nums;
	font-kerning: none;
  font-style: italic;
  cursor: pointer;
}
</style>