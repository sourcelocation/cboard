import { Grid, Space, Stack, Button, Popover } from "@mantine/core";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { Plus } from 'tabler-icons-react';
import { useEditorAddLessonMutation, useEditorAddTeacherMutation, useGetEditorDataQuery } from '../../api/apiSlice';
import { LessonBox, LessonAddForm } from "./LessonsColumn";
import { TeacherBox, TeacherAddForm } from "./TeachersColumn";

export function EditorLessonBoxCreator({ projectId }) {
  const { lessons, teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      lessons: data ? Object.values(data.lessons.entities) : [],
      teachers: data ? Object.values(data.teachers.entities) : [],
    }),
  })
  // const names = ["Mathematics", "Geography", "Biology", "Science", "Mathematics1", "Geography1", "Biology1", "Science1", "Mathematics2", "Geography2", "Biology2", "Science2",]
  const [selectedLesson, setselectedLesson] = useState(null)
  const [selectedTeacher, setselectedTeacher] = useState(null)

  return (
    <Grid grow style={{ width: '100%' }}>
      <Grid.Col span={6}>
        <Stack spacing={0}>
          {lessons.map(lesson =>
            <LessonBox lesson={lesson} selected={selectedLesson === lesson.id} select={() => setselectedLesson(lesson.id)} />
          )}
          <Space h='xs' />
          <AddLessonTeacherButton isLesson projectId={projectId} />
        </Stack>
      </Grid.Col>
      <Grid.Col span={6}>
        <Stack spacing={0}>
          {teachers.map(teacher =>
            <TeacherBox teacher={teacher} selected={selectedTeacher === teacher.id} select={() => setselectedTeacher(teacher.id)} />
          )}
          <Space h='xs' />
          <AddLessonTeacherButton projectId={projectId} />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}


function AddLessonTeacherButton({ isLesson, projectId }) { // Made for reusing the button two times
  const [opened, setOpened] = useState(false);
  const [addLesson, addLessonResult] = useEditorAddLessonMutation()
  const [addTeacher, addTeacherResult] = useEditorAddTeacherMutation()

  const { classes } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classes: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : []
    }),
  })

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
    {isLesson ?
      <LessonAddForm
        onCancel={() => setOpened(false)}
        onSubmit={() => setOpened(false)}
      /> :
      <TeacherAddForm
        onCancel={() => setOpened(false)}
        onSubmit={() => setOpened(false)}
      />
    }
  </Popover>
}