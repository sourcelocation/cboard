import { Link } from "react-router-dom";
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useGetEditorDataQuery } from "../../api/apiSlice";
import { LessonTeachers } from "./LessonTeachers";
import { Button, Divider, Space } from "@mantine/core";
import { NewStudentButton } from "./NewStudentButton";
import { ExcelModal } from './ExcelGenerateButton'
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
    <div style={{ height: 'calc(100vh - 54pt)', width: '160pt', overflowY: 'scroll', marginTop: '0pt' }} className="available-lessons-content">
      <div>
        {/* {avaliableLessons && <Search allowClear placeholder="Поиск" />} */}
        {avaliableLessons.map((lesson) => (
          <LessonTeachers lesson={lesson} key={lesson.id} teachers={teachers} />
        ))}

      </div>
      <Link to={`/editor/${projectId}/configure`} >
        <Button block style={{ marginTop: '10pt', marginBottom: '-2pt' }} type='default'>
          Settings
        </Button>
      </Link>
      <Divider />
      {/* <Space h={} */}
      <Link to={`/editor/${projectId}/newLesson`} >
        <Button block style={{ marginBottom: '8pt' }} type='dashed'>
          Add lesson
        </Button>
      </Link>
      <Link to={`/editor/${projectId}/newTeacher`} >
        <Button block style={{ marginBottom: '8pt' }} type='dashed'>
          Add teacher
        </Button>
      </Link>
      <NewStudentButton {...props} />
      <Button type='primary' block style={{ marginBottom: '8pt' }} onClick={showExportModal}>
        Export to Excel
      </Button>


      <ExcelModal {...props} set={setexportModalShown} shown={exportModalShown} projectId={projectId} />
    </div>
  )
}

