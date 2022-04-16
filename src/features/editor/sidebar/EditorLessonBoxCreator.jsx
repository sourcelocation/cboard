import { Grid, Center, createStyles, Space, Group, Stack, Button, Popover, TextInput, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { Check, Plus } from 'tabler-icons-react';
import { useEditorAddLessonMutation, useEditorAddStudentMutation, useEditorAddTeacherMutation, useGetEditorDataQuery } from '../../api/apiSlice';

export function EditorLessonBoxCreator({ projectId }) {
  const names = ["Mathematics", "Geography", "Biology", "Science", "Mathematics1", "Geography1", "Biology1", "Science1", "Mathematics2", "Geography2", "Biology2", "Science2",]
  const [selectedLessonName, setselectedLessonName] = useState(null)

  return (
    <Grid grow style={{ width: '100%' }}>
      <Grid.Col span={6}>
        <Stack spacing={0}>
          {names.map(name =>
            <LessonBox name={name} selected={selectedLessonName === name} select={() => setselectedLessonName(name)} />
          )}
          <Space h='xs' />
          <AddLessonTeacherButton isLesson projectId={projectId} />
        </Stack>
      </Grid.Col>
      <Grid.Col span={6}>
        <Stack spacing={0}>
          {names.map(name =>
            <LessonBox name={name} selected={selectedLessonName === name} select={() => setselectedLessonName(name)} />
          )}
          <Space h='xs' />
          <AddLessonTeacherButton projectId={projectId} />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}

const useLessonBoxStyles = createStyles((theme, { selected }) => ({
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
    // transition: '0.15s',
  },
  colorBox: {
    height: theme.spacing.md,
    width: theme.spacing.md,
    backgroundColor: theme.colors.main[6],
    borderRadius: theme.radius.sm
  },
  boxGroup: {
    padding: '0 4px'
  }
}))

function LessonBox({ name, selected, select }) {
  const { classes } = useLessonBoxStyles({ selected })

  return <button className={classes.button} onClick={select}>
    <Group spacing={8} className={classes.boxGroup}>
      {selected ? <Check size={16} /> : <div className={classes.colorBox} />}
      {name}
    </Group>
  </button>
}

function AddLessonTeacherButton({ isLesson, projectId }) { // Made for reusing the button two times
  const [values, setValues] = useState({ name: '', email: '' });
  const [opened, setOpened] = useState(false);
  const [addStudent, addStudentResult] = useEditorAddStudentMutation()
  const [addTeacher, addTeacherResult] = useEditorAddTeacherMutation()

  const { classes } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classes: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : []
    }),
  })
  // { lessonId: lesson.id, name: lesson.name, color: lesson.color, teacherIds: lesson.teacherIds, addLessonAction: 'true' }
  // Example lesson adding

  // { teacherId: teacher.id, name: teacher.name, taughtLessons: teacher.taughtLessons ? teacher.taughtLessons : [{id: data.lesson.id}], addTeacherAction: 'true' }
  // Add teacher
  // Similar...

  return <Popover
    opened={opened}
    onClose={() => setOpened(false)}
    position="bottom"
    placement="end"
    withCloseButton
    title={`New ${isLesson ? 'lesson' : 'teacher'}`}
    target={<Button fullWidth variant="light" compact onClick={() => setOpened(true)}>
      <Plus size={16} />
    </Button>}
    style={{ width: '100%' }}
  >
    <LessonAddForm
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
}

// { lessonId: lesson.id, name: lesson.name, color: lesson.color, teacherIds: lesson.teacherIds, addLessonAction: 'true' }
// Example lesson adding

// { teacherId: teacher.id, name: teacher.name, taughtLessons: teacher.taughtLessons ? teacher.taughtLessons : [{id: data.lesson.id}], addTeacherAction: 'true' }
// Add teacher
// Similar...

function LessonAddForm({ initialValues, onSubmit, onCancel }) {
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
        style={{ minWidth: 300 }}
        value={form.values.name}
        onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
        error={form.errors.name}
        variant="default"
      />

      <TextInput
        required
        label="Email"
        placeholder="Email"
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