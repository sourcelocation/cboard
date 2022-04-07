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

function StudentEditForm({ initialValues, onSubmit, onCancel }) {
  const isMobile = useMediaQuery('(max-width: 755px');

  const [updateStudent, updateStudentResult] = useEditorUpdateStudentMutation({
    fixedCacheKey: 'editor-edit-field-count',
  })
  const [deleteStudent, deleteStudentResult] = useEditorDeleteStudentMutation({
    fixedCacheKey: 'editor-edit-field-count',
  })

  //{classNames.map(c => <Option value={c}>{c}</Option>)}
  //deleteStudent({ studentId: studentId })
  const form = useForm({
    initialValues,
    validationRules: {
      name: (value) => value.trim().length > 2,
      email: (value) => value.trim().length > 2,
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
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

export function EditStudentButton() {
  const [values, setValues] = useState({ name: 'Bob Handsome', email: 'bob@handsome.inc' });
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

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
        <ActionIcon
          variant={'light'}
          onClick={() => setOpened((o) => !o)}
        >
          <Edit size={16} />
        </ActionIcon>
      }
    >
      <StudentEditForm
        initialValues={values}
        onCancel={() => setOpened(false)}
        onSubmit={(data) => {
          setValues(data);
          setOpened(false);
        }}
      />
    </Popover>
  );
}