import { Button, Popover, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useEditorAddStudentMutation, useGetEditorDataQuery } from "../../api/apiSlice";

export function NewStudentButton(props) {
  const { projectId } = props
  const [values, setValues] = useState({ name: 'Bob Handsome', email: 'bob@handsome.inc' });
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const [addStudent, addStudentResult] = useEditorAddStudentMutation()

  const { classes } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classes: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : []
    }),
  })

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      placement="end"
      withCloseButton
      title="Edit user"
      transition="pop-top-right"
      target={
        <Button variant="light">
          New student
        </Button>
      }
    >
      <StudentAddForm
        initialValues={values}
        onCancel={() => setOpened(false)}
        onSubmit={(data) => {
          setValues(data);
          setOpened(false);
          let class1 = values.class1 || classes[0]
          if (class1 == "new_class_option") {
            class1 = values.className
          }
          addStudent({ studentId: nanoid(), name: values.name, className: class1, dayLessonCount: values.lessonCount })
        }}
      />
    </Popover>
  );
}

function StudentAddForm({ initialValues, onSubmit, onCancel }) {
  const isMobile = useMediaQuery('(max-width: 755px');

  const form = useForm({
    initialValues,
    validationRules: {
      name: (value) => value.trim().length > 2,
      email: (value) => value.trim().length > 2,
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)} id="NewStudentPopover">
      <TextInput
        required
        label="Name"
        placeholder="Name"
        style={{ minWidth: isMobile ? 220 : 300 }}
        value={form.values.name}
        onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
        error={form.errors.name}
        variant="default"
      />

      <TextInput
        required
        label="Email"
        placeholder="Email"
        style={{ minWidth: isMobile ? 220 : 300, marginTop: 15 }}
        value={form.values.email}
        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
        error={form.errors.email}
        variant="default"
      />

      <Group position="apart" style={{ marginTop: 15 }}>
        <Anchor component="button" color="gray" size="sm" onClick={onCancel}>
          Cancel
        </Anchor>
        <Button type="submit" size="sm">
          Save
        </Button>
      </Group>
    </form>
  );
}