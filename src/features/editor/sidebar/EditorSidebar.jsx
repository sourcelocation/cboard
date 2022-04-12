import { Link } from "react-router-dom";
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useGetEditorDataQuery } from "../../api/apiSlice";
import { LessonTeachers } from "./LessonTeachers";
import { Button, Divider, Group, Space, Stack, Container, ActionIcon, createStyles } from "@mantine/core";
import { NewStudentButton } from "./NewStudentButton";
import { ExcelGenerateButton, ExcelModal } from './ExcelGenerateButton'
import { NewLessonButton } from "./NewLessonButton";
import { NewTeacherButton } from "./NewTeacherButton";
import { AlertTriangle, Send, Settings, Users } from "tabler-icons-react";

const useStyles = createStyles((theme, _params, getRef) => ({
  sidebar: {
    height: '100%',
    width: 300,
    overflowY: 'scroll',
    padding: theme.spacing.md,
    backgroundColor: '#F7F7F7'
  },
  sidebarSection: {
    padding: theme.spacing.sm,
    backgroundColor: '#FFF',
    borderRadius: theme.radius.md
  }
}))

export const EditorSidebar = (props) => {
  const { classes } = useStyles();
  const { projectId } = props
  const { classNames, avaliableLessons, teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classNames: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : [],
      avaliableLessons: data ? Object.values(data.lessons.entities) : [],
      teachers: data ? Object.values(data.teachers.entities) : [],
    }),
  })

  return (
    <div className={classes.sidebar}>
      <Stack spacing="sm">
        <Stack>
          {avaliableLessons.map((lesson) => (
            <LessonTeachers lesson={lesson} key={lesson.id} teachers={teachers} />
          ))}
        </Stack>
        <Divider />
        <Group position="center" className={classes.sidebarSection}>
          <NewLessonButton {...props} />
          <NewTeacherButton {...props} />
          <NewStudentButton {...props} />
        </Group>
        <Group position="center" className={classes.sidebarSection}>
          <ExcelGenerateButton {...props} />
          <ActionIcon variant="light" color="primary">
            <Settings size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="primary">
            <Users size={16} />
          </ActionIcon>
          <ActionIcon variant='filled' color="primary">
            <Send size={16} />
          </ActionIcon>
        </Group>
      </Stack>
    </div>
  )
}

