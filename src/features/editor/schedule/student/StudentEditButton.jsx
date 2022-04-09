import { useState } from 'react';
import {
  Popover,
  Button,
  Group,
  TextInput,
  Avatar,
  Anchor,
  Text,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';
import { useForm, useMediaQuery } from '@mantine/hooks';
import { Edit } from 'tabler-icons-react';
import { useEditorDeleteStudentMutation, useEditorUpdateStudentMutation } from 'features/api/apiSlice';

function StudentEditForm({ initialValues, onSubmit, onCancel }) {
  const [updateStudent, updateStudentResult] = useEditorUpdateStudentMutation({
    fixedCacheKey: 'editor-edit-student',
  })
  const [deleteStudent, deleteStudentResult] = useEditorDeleteStudentMutation({
    fixedCacheKey: 'editor-delete-student',
  })

  const form = useForm({
    initialValues,
    validationRules: {
      name: (value) => value.trim().length > 2,
      email: (value) => value.trim().length > 2,
    },
  });

  return (
    <form onSubmit={form.onSubmit((v) => {
      onSubmit(v)

    })}>
      <TextInput
        required
        label="Name"
        placeholder="Name"
        style={{ minWidth: 300 }}
        value={form.values.name}
        onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
        error={form.errors.name}
        variant="default"
      />

      <TextInput
        required
        label="Class"
        placeholder="Class, grade, etc."
        style={{ minWidth: 300, marginTop: 15 }}
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

export function EditStudentButton({ student }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      placement='start'
      withCloseButton
      title="Edit user"
      transition="pop-top-left"
      target={
        <ActionIcon
          variant={'light'}
          onClick={() => setOpened((o) => !o)}
        >
          <Edit size={16} />
        </ActionIcon>
      }
    >
      <StudentEditForm
        initialValues={student}
        onCancel={() => setOpened(false)}
        onSubmit={(data) => {
          setOpened(false);
        }}
      />
    </Popover>
  );
}