import { Anchor, Avatar, Button, ColorInput, createStyles, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { nanoid } from "@reduxjs/toolkit"
import { useEditorAddTeacherMutation } from "features/api/apiSlice"
import { Check } from "tabler-icons-react"

const useTeacherBoxStyles = createStyles((theme, { selected }) => ({
  button: {
    border: 'transparent',
    backgroundColor: selected ? theme.colors.main[6] : 'transparent',
    color: selected ? 'white' : 'black',
    cursor: 'pointer',
    textAlign: 'start',
    '&:hover': {
      backgroundColor: selected ? theme.colors.main[6] : theme.colors.main[0],
    },
    padding: 3,
    borderRadius: theme.radius.sm,
  },
  boxGroup: {
    padding: '0 4px'
  }
}))

export function TeacherCreatorRow({ teacher, selected, select }) {
  const { name, id } = teacher
  const { classes } = useTeacherBoxStyles({ selected })

  return <button className={classes.button} onClick={select}>
    <Group spacing={8} className={classes.boxGroup}>
      {selected ? <Check size={16} /> : <Avatar radius="md" size="xs" />}
      {name}
    </Group>
  </button>
}


export function TeacherAddForm({ onSubmit, onCancel }) {
  const [addTeacher, addTeacherResult] = useEditorAddTeacherMutation()
  const form = useForm({
    initialValues: { name: '' }
  } )

  return (
    <form onSubmit={form.onSubmit((values) => {
      onSubmit()
      addTeacher({ teacherId: nanoid(), name: values.name })
    })} id="NewTeacherPopover">
      <TextInput
        required
        label="Name"
        placeholder="Name"
        style={{ minWidth: 300 }}
        variant="default"
        {...form.getInputProps("name")}
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