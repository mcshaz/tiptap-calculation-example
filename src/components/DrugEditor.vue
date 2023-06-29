<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount, ref } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Palette from './Palette.vue'
import TTTStyle from '@tiptap/extension-text-style'
import TTBold from '@tiptap/extension-bold'
import TTParagraph from '@tiptap/extension-paragraph'
import TTDoc from '@tiptap/extension-document'
import TTText from '@tiptap/extension-text'
import TTIt from '@tiptap/extension-italic'
import TTHigh from '@tiptap/extension-highlight'
import TTHx from '@tiptap/extension-history'
import TTSub from '@tiptap/extension-subscript'
import TTSuper from '@tiptap/extension-superscript'
import TTLink from '@tiptap/extension-link'
import TTColor from '@tiptap/extension-color'

// import Bold from '@tiptap/extension-bold'
import { Calculation } from '../tiptap/Calculation'
import Formula from './Formula.vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]}>();
const editor = ref<Editor>();
const dialog = ref(false)
const activeFormulaDetails = ref({ formula: '', rounding: ''})
const activeColour = ref('rgb(183, 28, 28)')
const activeBackground = ref('rgb(255, 235, 59)')

const getFormula = (pmAttrs: Record<string, unknown>, elDataset: DOMStringMap) => {
  // bit of a hack - by not creating a new object, we won't trigger watchers
  activeFormulaDetails.value.formula = pmAttrs.formula as string || elDataset.formula || '',
  activeFormulaDetails.value.rounding = pmAttrs.rounding as string || elDataset.rounding || ''
  dialog.value = true
  return true
}

watch(activeFormulaDetails, (newFormula, oldFormula) => {
  // todo check if shallow clone of newFormula required
  let chain = editor.value!.chain()
  // formula empty or pre-existing [calculations are an atom/unmutable] - delete 
  if (oldFormula.formula !== '') {
    chain = chain.removeCalculation()
  }
  chain.insertCalculation(newFormula)
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
      TTTStyle,
      TTBold,
      TTIt,
      TTHigh.configure({ multicolor: true }),
      TTHx,
      TTSub,
      TTSuper,
      TTLink,
      TTColor,
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

const toggleHighlight = () => {
  editor.value!.chain().focus().toggleHighlight({ color: activeBackground.value }).run()
}

const setColour = () => {
  editor.value!.chain().focus().setColor(activeColour.value).run()
}

// .toggleBold()
</script>

<template>
  <div class="tt-editor">
    <div class="d-flex justify-space-between pb-0">
      <v-btn-toggle
        multiple
        divided
      >
        <v-btn @click="editor!.chain().focus().toggleItalic().run()" title="italic">
          <v-icon icon="mdi-format-italic" />
        </v-btn>
        <v-btn @click="editor!.chain().focus().toggleBold().run()" title="bold">
          <v-icon icon="mdi-format-bold" />
        </v-btn>
        <v-btn @click="editor!.chain().focus().toggleSuperscript().run()" title="superscript">
          <v-icon icon="mdi-format-superscript" />
        </v-btn>
        <v-btn @click="editor!.chain().focus().toggleSubscript().run()" title="subscript">
          <v-icon icon="mdi-format-subscript" />
        </v-btn>
        <Palette v-model="activeColour" @click="setColour"/>
        <Palette v-model="activeBackground" @click="toggleHighlight" isHighlight/>


        <v-btn @click="editor!.chain().focus().undo().run()" title="undo">
          <v-icon icon="mdi-undo" />
        </v-btn>
        <v-btn @click="editor!.chain().focus().redo().run()" title="redo">
          <v-icon icon="mdi-redo" />
        </v-btn>

        <v-btn @click="getFormula({}, {})" title="insert calculation (or press Control+Shift+{ keys in editor)">
          <v-icon icon="mdi-function-variant" />
        </v-btn>
      </v-btn-toggle>
    </div>
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