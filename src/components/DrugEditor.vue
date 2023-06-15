<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, ref } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Calculation } from '../tiptap/Calculation'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]}>();
const editor = ref<Editor | null>(null);

const getFormula = (existingFormula = '') => {
  const formula = window.prompt('Formula', existingFormula)
  if (formula === null || formula === existingFormula) {
    return false
  }
  let chain = editor.value!.chain()
  // formula empty or pre-existing [calculations are an atom/unmutable] - delete 
  if (formula === '' || existingFormula) {
    chain = chain.removeCalculation()
  }
  if (formula !== '') {
    chain = chain.insertCalculation({formula})
  }
  return chain.run()
}

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
      StarterKit,
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

</script>

<template>
  <div class="tt-editor">
    <button @click="editor!.chain().focus().toggleBold().run()">
      <strong>
        B
      </strong>
    </button>
    <button @click="getFormula()" title="insert calculation (or press Control+Shift+{ keys in editor)">
      <i class="inline-calculation">
        f(x)
      </i>
    </button>

    <EditorContent :editor="editor" />
  </div> 
</template>

<style>
.tt-editor {
  border: 2px solid grey;
}

.inline-calculation {
  display:inline-block;
  background-color: bisque;
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