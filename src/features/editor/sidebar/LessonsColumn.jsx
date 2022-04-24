import { Anchor, Button, ColorInput, createStyles, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { nanoid } from "@reduxjs/toolkit"
import { useEditorAddLessonMutation } from "features/api/apiSlice"
import { Check } from "tabler-icons-react"
import { colors } from "../lessons/colors"

const useLessonBoxStyles = createStyles((theme, { selected, lessonColor }) => ({
  button: {
    border: 'transparent',
    backgroundColor: selected ? lessonColor /* theme.colors.main[6] */ : 'transparent',
    color: selected ? 'white' : 'black',
    cursor: 'pointer',
    textAlign: 'start',
    '&:hover': {
      backgroundColor: selected ? lessonColor/*theme.colors.main[6]*/ : theme.colors.main[0],
    },
    padding: 3,
    borderRadius: theme.radius.sm,
    // transition: '0.15s',
  },
  colorBox: {
    height: theme.spacing.md,
    width: theme.spacing.md,
    backgroundColor: lessonColor,
    borderRadius: theme.radius.sm
  },
  boxGroup: {
    padding: '0 4px'
  }
}))

export function LessonCreatorRow({ lesson, selected, select }) {
  const { name, id, color } = lesson
  const { classes } = useLessonBoxStyles({ selected, lessonColor: color })

  return <button className={classes.button} onClick={select}>
    <Group spacing={8} className={classes.boxGroup}>
      {selected ? <Check size={16} /> : <div className={classes.colorBox} />}
      {name}
    </Group>
  </button>
}


export function LessonAddForm({ onSubmit, onCancel }) {
  const [addLesson, addLessonResult] = useEditorAddLessonMutation()
  const form = useForm({
    initialValues: { name: '', color: '' }
  } )
  return (
    <form onSubmit={form.onSubmit((values) => {
      onSubmit()
      addLesson({ lessonId: nanoid(), name: values.name, color: values.color })
    })} id="NewStudentPopover">
      <TextInput
        required
        label="Name"
        placeholder="Name"
        style={{ minWidth: 300 }}
        variant="default"
        {...form.getInputProps("name")}
      />
      <ColorInput
        required
        placeholder="Click to select"
        label="Color"
        format="hex"
        swatches={Object.values(colors).map(l => l[0])}
        withinPortal={false}
        {...form.getInputProps("color")}
      />

      <Group position="apart" style={{ marginTop: 15 }}>
        <Anchor component="button" color="gray" size="sm" onClick={onCancel}>
          Cancel
        </Anchor>
        <Button type="submit" size="sm">
          Add
        </Button>
      </Group>
    </form>
  );
}
