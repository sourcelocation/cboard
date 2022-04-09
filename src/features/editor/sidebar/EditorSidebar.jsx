import { Link } from "react-router-dom";
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useGetEditorDataQuery } from "../../api/apiSlice";
import { LessonTeachers } from "./LessonTeachers";
import { Button, Divider, Group, Space, Stack, Container, ActionIcon } from "@mantine/core";
import { NewStudentButton } from "./NewStudentButton";
import { ExcelGenerateButton, ExcelModal } from './ExcelGenerateButton'
import { NewLessonButton } from "./NewLessonButton";
import { NewTeacherButton } from "./NewTeacherButton";
import { AlertTriangle, Send, Settings, Users } from "tabler-icons-react";

export const EditorSidebar = (props) => {
  const { projectId } = props
  const { classes, avaliableLessons, teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classes: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : [],
      avaliableLessons: data ? Object.values(data.lessons.entities) : [],
      teachers: data ? Object.values(data.teachers.entities) : [],
    }),
  })

  const [exportModalShown, setexportModalShown] = useState(false)

  // const classSelect = (
  //   <Form.Item name="class1" noStyle rules={[{ required: true, message: 'Select student\'s class' }]}>
  //     <Select>
  //       {classes.map(c => <Option value={c}>{c}</Option>)}
  //       <Option value={"new_class_option"}>New class</Option>
  //     </Select>
  //   </Form.Item>
  // );

  const showExportModal = () => {
    setexportModalShown(true)
  }

  return (
    <div style={{ height: 'calc(100vh - 54px)', width: '213px', overflowY: 'scroll', marginTop: '0pt' }} className="available-lessons-content">
      <Stack spacing="sm" style={{ margin: '10px' }}>
        <Stack>
          {avaliableLessons.map((lesson) => (
            <LessonTeachers lesson={lesson} key={lesson.id} teachers={teachers} />
          ))}
        </Stack>
        <Divider />
        <NewLessonButton {...props} />
        <NewTeacherButton {...props} />
        <NewStudentButton {...props} />
        <Group position="center">
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

