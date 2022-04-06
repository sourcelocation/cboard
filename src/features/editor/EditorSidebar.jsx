import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { selectDays } from "./schedule/scheduleInfoSlice";
import { CopyableLessonBox } from "./lessons/box/CopyableLessonBox";
import { useEditorAddStudentMutation, useGetEditorDataQuery } from "../api/apiSlice";
import { authHeader } from './../../services/auth-header'


const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

export const EditorSidebar = (props) => {
  const { projectId } = props
  const { classes, avaliableLessons, teachers } = useGetEditorDataQuery(projectId, {
    selectFromResult: ({ data }) => ({
      classes: data ? Array.from(new Set(Object.values(data.students.entities).map(s => s.className))) : [],
      avaliableLessons: data ? Object.values(data.lessons.entities) : [],
      teachers: data ? Object.values(data.teachers.entities) : [],
    }),
  })
  const [addStudent, addStudentResult] = useEditorAddStudentMutation()

  const [studentmodalShown, setstudentmodalShown] = useState(false)
  const [exportModalShown, setexportModalShown] = useState(false)
  const days = useSelector(state => selectDays(state))

  const classSelect = (
    <Form.Item name="class1" noStyle rules={[{ required: true, message: 'Select student\'s class' }]}>
      <Select>
        {classes.map(c => <Option value={c}>{c}</Option>)}
        <Option value={"new_class_option"}>New class</Option>
      </Select>
    </Form.Item>
  );
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    form.resetFields()
    console.log(values);
    let class1 = values.class1 || classes[0]
    if (class1 == "new_class_option") {
      class1 = values.className
    }
    setstudentmodalShown(false)
    addStudent({ studentId: nanoid(), name: values.name, className: class1, dayLessonCount: values.lessonCount })
  }
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
      <Divider style={{ marginBottom: '16pt' }} />
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
      <Button block style={{ marginBottom: '8pt' }} type='dashed' onClick={() => { setstudentmodalShown(true) }}>
        Add student
      </Button>
      <Button type='primary' block style={{ marginBottom: '8pt' }} onClick={showExportModal}>
        Export to Excel
      </Button>


      <Modal
        title="New student"
        visible={studentmodalShown}
        onCancel={() => { setstudentmodalShown(false) }}
        footer={[
          <Button onClick={() => { setstudentmodalShown(false) }}>
            Cancel
          </Button>,
          <Button form="newStudentForm" key="submit" htmlType="submit" type='primary'>
            Add
          </Button>
        ]}
      >
        <Form
          form={form}
          id="newStudentForm"
          layout='vertical'
          requiredMark={false}
          onFinish={onSubmit}
          initialValues={{ class1: [...classes, "new_class_option"][0] }}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Enter student\'s name' }]} >
            <Input autoComplete="off" addonAfter={classSelect} placeholder="Name" />
          </Form.Item>

          <Form.Item label="Lessons per day" name="lessonCount" extra="This number can be modified for each day in future" rules={[{ required: true, message: 'Please enter the number of lessons per day' }]} >
            <InputNumber min={1} max={50} placeholder="1" />
          </Form.Item>

          <Form.Item
            shouldUpdate={(prevValues, currentValues) => prevValues.class1 !== currentValues.class1}
            noStyle
          >
            {({ getFieldValue }) =>
              getFieldValue('class1') === 'new_class_option' ? (
                <Form.Item name="className" label="Grade" rules={[{ required: true, message: 'Enter grade name' }]}>
                  <Input autoComplete="off" placeholder="Ex. 9th Grade" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
      <ExcelModal {...props} set={setexportModalShown} shown={exportModalShown} projectId={projectId} />
    </div>
  )
}

const ExcelModal = ({ set, shown, projectId, orgId }) => {
  const [generatedUrl, setgeneratedUrl] = useState(false)
  async function generate() {
    const url = `http://127.0.0.1:8080/project/${projectId}/generateExcel`
    const token = localStorage.getItem('user-token')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    setgeneratedUrl(response.JSON().url)
  }

  useEffect(() => {
    setgeneratedUrl(false)
    if (shown) {
      console.log('====================================');
      console.log("generate");
      console.log('====================================');
      generate()
    }
  }, [shown])

  return (
    <Modal title="Загрузка Excel таблицы" visible={shown} onCancel={() => { set(false) }} footer={[
      <Button key="back" onCancel={() => { set(false) }}>
        OK
      </Button>
    ]}>
      {generatedUrl && (
        <Button key="back" onClick={() => {
          openInNewTab(generatedUrl)
        }}>
          Скачать
        </Button>
      )}
    </Modal>
  )
}

const LessonTeachers = ({ teachers, lesson }) => {
  const filteredTeachers = teachers.filter(t => t.taughtLessons.map(l => l.id).includes(lesson.id))

  return (
    filteredTeachers.map(teacher => <div style={{ marginTop: '10pt' }}>
      <CopyableLessonBox lesson={lesson} teacher={teacher} />
    </div>
    )
  )
}