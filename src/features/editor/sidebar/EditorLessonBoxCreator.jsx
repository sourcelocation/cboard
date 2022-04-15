import { Grid, Center, createStyles, Space, Group, Stack, Button } from "@mantine/core";
import { useState } from "react";
import { Check } from 'tabler-icons-react';
import { useEditorAddLessonMutation, useEditorAddTeacherMutation, useGetEditorDataQuery } from '../../api/apiSlice';

export function EditorLessonBoxCreator() {
  const names = ["Mathematics", "Geography", "Biology", "Science", "Mathematics1", "Geography1", "Biology1", "Science1", "Mathematics2", "Geography2", "Biology2", "Science2",]
  const [selectedLessonName, setselectedLessonName] = useState(null)
  const [addLesson, addLessonResult] = useEditorAddLessonMutation()
  // { lessonId: lesson.id, name: lesson.name, color: lesson.color, teacherIds: lesson.teacherIds, addLessonAction: 'true' }
  // Example lesson adding

  // { teacherId: teacher.id, name: teacher.name, taughtLessons: teacher.taughtLessons ? teacher.taughtLessons : [{id: data.lesson.id}], addTeacherAction: 'true' }
  // Add teacher
  // Similar...

  return (
    <Grid grow style={{ width: '100%' }}>
      <Grid.Col span={6}>
        <Stack spacing={0}>
          {names.map(name =>
            <LessonBox name={name} selected={selectedLessonName === name} select={() => setselectedLessonName(name)} />
          )}
          <Space h='xs' />
          <Button fullWidth variant="light" compact onClick={() => {

          }}>
            +
          </Button>
        </Stack>
      </Grid.Col>
      <Grid.Col span={6}>
        <Stack spacing={0}>
          {names.map(name =>
            <LessonBox name={name} selected={selectedLessonName === name} select={() => setselectedLessonName(name)} />
          )}
          <Space h='xs' />
          <Button fullWidth variant="light" compact onClick={() => {

          }}>
            +
          </Button>
        </Stack>
      </Grid.Col>
    </Grid>
  )
}

const useStyles = createStyles((theme, { selected }) => ({
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
  const { classes } = useStyles({ selected })

  return <button className={classes.button} onClick={select}>
    <Group spacing={8} className={classes.boxGroup}>
      {selected ? <Check size={16} /> : <div className={classes.colorBox} />}
      {name}
    </Group>
  </button>
}